// © INF PROJECT - Erine-MD
// Developed by INF PROJECT

import axios from 'axios'
import FormData from 'form-data'
import { fileTypeFromBuffer } from 'file-type'

let handler = async (m, { conn, usedPrefix, command, text }) => {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''

    if (!mime.startsWith('image/')) {
        return m.reply(`Kirim atau balas gambar dengan perintah *${usedPrefix + command} <token>* cuy!\n\n*Catatan:* Lu butuh Token Turnstile dari browser buat pake fitur ini.`)
    }

    // Token turnstile bisa lu masukin lewat text command, atau ganti default string di bawah
    let turnstileToken = text.trim() 
    if (!turnstileToken) {
        return m.reply(`Token Turnstile-nya mana cuy? 😭\nKetik: *${usedPrefix + command} <token>*`)
    }

    m.reply('Tunggu bentar cuy, gambarnya lagi di-HD-in pake l setelan hdr. ⏳')

    try {
        let media = await q.download()
        let { ext } = await fileTypeFromBuffer(media)

        let form = new FormData()
        form.append('file', media, `image.${ext}`)
        form.append('style', 'art') // Bisa lu ganti 'photo' kalo buat foto asli
        form.append('noise', 1)
        form.append('scale', 2)
        form.append('format', 0) // 0 untuk PNG
        form.append('turnstile', turnstileToken) // Token CF ditaruh sini

        let response = await axios.post('https://www.waifu2x.net/api', form, {
            headers: {
                ...form.getHeaders(),
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            responseType: 'arraybuffer'
        })

        let contentType = response.headers['content-type']
        if (!contentType || !contentType.startsWith('image/')) {
            // Kalau HTML Turnstile muncul, berarti token expired/salah
            let errorText = Buffer.from(response.data).toString('utf8')
            throw new Error(`Server nolak/minta token baru: ${errorText.substring(0, 150)}...`)
        }

        // Kirim hasil waifu2x nya
        await conn.sendMessage(m.chat, { 
            image: response.data, 
            caption: 'Nih cuy hasil dari HDR 🔥\n© INF PROJECT | Erine-MD' 
        }, { quoted: m })

    } catch (e) {
        let errMessage = e?.response?.data ? Buffer.from(e.response.data).toString('utf8') : e.message
        console.error('❌ HDR Error:', errMessage)
        m.reply(`Yahh gagal cuy. Pastiin Token Turnstile lu valid yak!\n\n*Log:* ${errMessage.substring(0, 100)}`)
    }
}

handler.help = ['hdr']
handler.tags = ['tools']
handler.command = /^(hdr)$/i
handler.limit = true

export default handler
