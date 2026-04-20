import axios from 'axios'
import FormData from 'form-data'
import fs from 'fs'
import { join } from 'path'

let handler = async (m, { conn, usedPrefix, command }) => {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''

    if (!/image\/(jpe?g|png)/.test(mime)) {
        return m.reply(`📸 *• [ INFO ]* Kirim/reply gambar dengan caption *${usedPrefix + command}*`)
    }

    await conn.sendMessage(m.chat, { react: { text: '🔥', key: m.key } })

    // 📁 setup folder tmp
    let tempDir = join(process.cwd(), './tmp')
    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true })
    }

    let ext = mime.split('/')[1]
    let mediaPath = join(tempDir, `${Date.now()}.${ext}`)

    try {
        // 📥 download media (lebih aman)
        let buffer = await q.download?.() || await conn.downloadMediaMessage(q)

        if (!buffer) throw 'Gagal download media'

        await fs.promises.writeFile(mediaPath, buffer)

        // ☁️ upload ke catbox
        let form = new FormData()
        form.append('reqtype', 'fileupload')
        form.append('fileToUpload', fs.createReadStream(mediaPath))

        let upload = await axios.post('https://catbox.moe/user/api.php', form, {
            headers: form.getHeaders()
        })

        let fileUrl = upload.data
        if (!fileUrl || typeof fileUrl !== 'string') {
            throw 'Upload gagal'
        }

        // ⚡ upscale API
        let apiUrl = `https://api.nexray.web.id/tools/upscale?url=${encodeURIComponent(fileUrl)}&resolusi=16`

        let res = await axios.get(apiUrl, {
            responseType: 'arraybuffer',
            timeout: 60000
        })

        if (!res.data || res.data.length < 1000) {
            throw 'API upscale gagal / kosong'
        }

        // 📤 kirim hasil
        await conn.sendMessage(m.chat, {
            image: Buffer.from(res.data),
            caption: `✅ *UHD BERHASIL!*\nResolusi ditingkatkan 16x 🔥`
        }, { quoted: m })

    } catch (err) {
        console.error('ERROR UHD:', err)
        m.reply('❌ Terjadi kesalahan saat proses UHD!')
    } finally {
        // 🧹 auto hapus file (selalu jalan walau error)
        if (fs.existsSync(mediaPath)) {
            fs.unlinkSync(mediaPath)
        }
    }
}

handler.help = ['uhd']
handler.tags = ['tools']
handler.command = /^uhd$/i
handler.limit = true

export default handler