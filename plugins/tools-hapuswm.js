/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx Decode
 * ─────────────────────────
 */

import axios from 'axios'
import FormData from 'form-data'

async function uploadImage(buffer) {
    let form = new FormData()
    form.append('files[]', buffer, { filename: 'image.jpg', contentType: 'image/jpeg' })
    let { data } = await axios.post('https://pomf.lain.la/upload.php', form, {
        headers: form.getHeaders()
    })
    return data.files[0].url
}

let handler = async (m, { conn, usedPrefix, command }) => {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''

    if (!mime.includes('image')) {
        return m.reply(
            `⚠️ *Mana gambarnya njir?*\n\n` +
            `Kirim atau reply gambar yang mau dihapus watermark-nya pake caption *${usedPrefix + command}*`
        )
    }

    await m.react('⏳')

    try {
        let imgBuffer = await q.download()
        if (!imgBuffer) throw new Error('Gagal ngedownload gambar dari chat.')
        let imageUrl = await uploadImage(imgBuffer)
        let apiUrl = `https://api.ikyyxd.my.id/edit/unwatermark?image=${encodeURIComponent(imageUrl)}`
        let res = await axios.get(apiUrl)
        if (!res.data || !res.data.status || !res.data.result || !res.data.result.output_url) {
            throw new Error('API ikyyxd nolak njir, mungkin servernya lagi ngambek atau limit.')
        }

        let finalImage = res.data.result.output_url
        let caption = `✨ *UNWATERMARK SUCCESS*\n\n` +
            `Nih gambar lu udah bersih dari watermark.\n\n` +
            `> © INF PROJECT`
            
        await conn.sendMessage(m.chat, {
            image: { url: finalImage },
            caption: caption
        }, { quoted: m })

        await m.react('✅')
    } catch (e) {
        console.error(e)
        await m.react('❌')
        m.reply(`❌ *Error njir:* ${e.message}`)
    }
}

handler.help = ['unwm', 'hapuswm']
handler.tags = ['tools']
handler.command = /^(hapuswm|unwm|nowm|removewm)$/i
handler.limit = true

export default handler