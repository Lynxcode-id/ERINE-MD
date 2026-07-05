/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Integrator : Lynx Decode
 * 📞 Contact    : +62 882-5804-1396
 * 📢 Channel    : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * ⚠️ Note       : Keep credit to respect the creator!
 * ─────────────────────────
 * 📝 Plugin     : NanoBanana To Hitam (Black & White Filter)
 * 🎨 UI         : ERINE-AI Custom Style
 */

import fetch from 'node-fetch'
import { FormData, Blob } from 'formdata-node'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    const header = (title, emoji) => `┌˚₊ ๑│ ${title} │๑˚₊ ${emoji}\n┇ \n`
    const footer = () => `\n┇ \n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`

    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''
    let url = text

    if (!mime && !text) {
        return m.reply(header('FILTER HITAM', '🖤') + `│ ❌ *Kirim/Reply gambar atau masukkan link gambar!*\n│ *Contoh:* ${usedPrefix + command} https://api.nexray.eu.cc/5KbJna.jpeg` + footer())
    }

    await m.react('⏳')

    try {
        if (mime) {
            let media = await q.download()
            
            let formData = new FormData()
            let blob = new Blob([media], { type: mime })
            formData.append('file', blob, 'upload_file')

            let uploadRes = await fetch('https://api.shinzu.web.id/api/upload/litterbox', {
                method: 'POST',
                body: formData
            })
            let uploadJson = await uploadRes.json()

            if (!uploadJson.status || !uploadJson.result) {
                throw new Error('Gagal mengunggah gambar ke server uploader.')
            }
            
            url = uploadJson.result.url
        }

        let apiUrl = `https://api.cuki.biz.id/api/nanobanana/tohitam?apikey=cuki-x&url=${encodeURIComponent(url.trim())}`

        let teks = header('FILTER HITAM', '🖤')
        teks += `│ ✅ *Filter hitam putih berhasil diterapkan!*\n`
        teks += `│ 🔗 *Source URL:* ${url.trim()}`
        teks += footer()

        await conn.sendMessage(m.chat, {
            image: { url: apiUrl },
            caption: teks
        }, { quoted: m })

        await m.react('✨')

    } catch (e) {
        console.error(e)
        await m.react('❌')
        m.reply(header('MAKER ERROR', '❌') + `│ ❌ *Terjadi kesalahan:*\n│ ${e.message}` + footer())
    }
}

handler.help = ['tohitam <url/reply>', 'hitamkan <url/reply>']
handler.tags = ['maker']
handler.command = /^tohitam3|hitamkan2$/i
handler.limit = true

export default handler