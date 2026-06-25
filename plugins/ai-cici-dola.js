/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Author     : Lynx Decode
 * 📞 Contact    : +62 882-5804-1396
 * 📢 Channel    : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * ⚠️ Note       : Keep credit to respect the creator!
 * ─────────────────────────
 * 📝 Plugin: Cici AI (Erine-AI)
 */

import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    const headerUI = "┌˚₊ ๑│ ᴇ ʀ ɪ ɴ ᴇ - ᴀ ɪ  ᴄ ɪ ᴄ ɪ │๑˚₊"
    const hrUI = "└˚₊ ๑ ────────────── ๑˚₊"
    const footerUI = "> © ERINE-AI | CICI AI"

    if (!text) return m.reply(`${headerUI} ❌\n┇ \n│ Halo kak! Ada yang bisa Cici bantu?\n│ *Contoh:* ${usedPrefix + command} halo cici\n┇ \n${hrUI}\n${footerUI}`)

    try {
        await m.react('⏳')
        let res = await fetch(`https://api.ikyyxd.my.id/ai/cici?prompt=${encodeURIComponent(text)}`)
        let json = await res.json()

        if (!json.status || !json.result || !json.result.reply) throw new Error('Cici sedang tidur atau API error.')

        let replyText = `${headerUI} 🤖\n┇ \n│ ${json.result.reply}\n┇ \n${hrUI}\n${footerUI}`

        await conn.sendMessage(m.chat, { text: replyText }, { quoted: m })
        await m.react('✅')
    } catch (e) {
        await m.react('❌')
        m.reply(`${headerUI} ❌\n┇ \n│ Maaf kak, terjadi kesalahan saat menghubungi Cici.\n│ ${e.message}\n┇ \n${hrUI}\n${footerUI}`)
    }
}

handler.help = ['cici <pertanyaan>']
handler.tags = ['ai']
handler.command = /^(cici|dola)$/i

export default handler