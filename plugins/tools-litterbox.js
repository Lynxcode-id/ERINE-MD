/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Author     : Lynx Decode
 * 📞 Contact    : +62 882-5804-1396
 * 📢 Channel    : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * ⚠️ Note       : Keep credit to respect the creator!
 * ─────────────────────────
 * 📝 Plugin: Litterbox Uploader / Tourl (Erine-AI)
 */

import fetch from 'node-fetch'
import { FormData, Blob } from 'formdata-node'

let handler = async (m, { conn, usedPrefix, command }) => {
    const headerUI = "┌˚₊ ๑│ ᴇ ʀ ɪ ɴ ᴇ - ᴀ ɪ  ᴛ ᴏ ᴜ ʀ ʟ │๑˚₊"
    const hrUI = "└˚₊ ๑ ────────────── ๑˚₊"
    const footerUI = "> © ERINE-AI | LITTERBOX UPLOADER"

    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''
    
    if (!mime) return m.reply(`${headerUI} ❌\n┇ \n│ Balas media (foto/video/audio) yang ingin dijadikan URL kak!\n┇ \n${hrUI}\n${footerUI}`)

    try {
        await m.react('⏳')
        let media = await q.download()
        
        let formData = new FormData()
        let blob = new Blob([media], { type: mime })
        formData.append('file', blob, 'upload_file')

        let res = await fetch('https://api.shinzu.web.id/api/upload/litterbox', {
            method: 'POST',
            body: formData
        })
        let json = await res.json()

        if (!json.status || !json.result) throw new Error('Gagal mengunggah media ke server.')

        let captionText = `${headerUI} 🔗\n┇ \n` +
                          `│ ✅ *Berhasil mengunggah file!*\n` +
                          `│ \n` +
                          `│ 🔗 *Link:* ${json.result.url}\n` +
                          `│ ⏳ *Masa Aktif:* 3 Hari (Litterbox)\n` +
                          `┇ \n${hrUI}\n${footerUI}`

        await m.reply(captionText)
        await m.react('✅')
    } catch (e) {
        await m.react('❌')
        m.reply(`${headerUI} ❌\n┇ \n│ Maaf kak, terjadi kesalahan saat memproses media.\n│ ${e.message}\n┇ \n${hrUI}\n${footerUI}`)
    }
}

handler.help = ['litterbox']
handler.tags = ['tools', 'uploader']
handler.command = /^litterbox$/i

export default handler