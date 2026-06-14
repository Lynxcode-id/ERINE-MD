/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx
 * ─────────────────────────
 * 📝 Plugin: AI Illustrious (API Xzlynn)
 */

import fetch from 'node-fetch'
import uploadFile from '../lib/uploadFile.js'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''
    let inputPrompt = text || ''

    await m.react('⏳')

    try {
        // Kalau user reply gambar, upload dan jadikan URL sebagai prompt
        if (mime.startsWith('image/')) {
            let media = await q.download()
            let imgUrl = await uploadFile(media)
            inputPrompt = inputPrompt ? `${inputPrompt} ${imgUrl}` : imgUrl
        }

        let apikey = 'free-lynxdecode-5b2b0b97'
        let apiUrl = `https://api.myxzlyn.my.id/api/ai/wainsfwillustrious?apikey=${apikey}&prompt=${encodeURIComponent(inputPrompt)}`
        
        let res = await fetch(apiUrl)
        let json = await res.json()

        if (!json.status || !json.result || !json.result.url) {
            throw new Error('API error, limit habis, atau server down cuy.')
        }

        await conn.sendMessage(m.chat, {
            image: { url: json.result.url },
            caption: `> © INF PROJECT`
        }, { quoted: m })

        await m.react('✅')
    } catch (e) {
        console.error(e)
        await m.react('❌')
        m.reply(`❌ *[ERROR]* Gagal memproses AI:\n_${e.message}_`)
    }
}

handler.help = ['illustrious <teks/reply image>']
handler.tags = ['maker']
handler.command = /^(illustrious|wainsfw|toanime|ai-ill)$/i
handler.limit = true

export default handler