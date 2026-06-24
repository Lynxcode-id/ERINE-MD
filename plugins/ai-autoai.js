/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Author     : Lynx Decode
 * 📞 Contact    : +62 882-5804-1396
 * 📢 Channel    : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * ⚠️ Note       : Keep credit to respect the creator!
 * ─────────────────────────
 * 📝 Plugin: Auto AI (Erine-AI)
 */

import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    const headerUI = "┌˚₊ ๑│ ᴇ ʀ ɪ ɴ ᴇ - ᴀ ɪ  ᴀ ᴜ ᴛ ᴏ  ᴀ ɪ │๑˚₊"
    const hrUI = "└˚₊ ๑ ────────────── ๑˚₊"
    const footerUI = "> © ERINE-AI | AUTO AI"

    let chat = global.db.data.chats[m.chat]
    if (!chat) chat = global.db.data.chats[m.chat] = {}

    if (text === 'on') {
        chat.autoai2 = true
        m.reply(`${headerUI} ✅\n┇ \n│ Fitur Auto AI berhasil *DIAKTIFKAN* di obrolan ini.\n┇ \n${hrUI}\n${footerUI}`)
    } else if (text === 'off') {
        chat.autoai2 = false
        m.reply(`${headerUI} ❌\n┇ \n│ Fitur Auto AI berhasil *DIMATIKAN* di obrolan ini.\n┇ \n${hrUI}\n${footerUI}`)
    } else {
        m.reply(`${headerUI} ⚠️\n┇ \n│ Format salah!\n│ *Gunakan:* ${usedPrefix + command} on/off\n│ *Contoh:* ${usedPrefix + command} on\n┇ \n${hrUI}\n${footerUI}`)
    }
}

handler.before = async function (m, { conn }) {
    let chat = global.db.data.chats[m.chat]
    if (!chat || !chat.autoai2) return
    if (m.isBaileys || m.fromMe || m.isCommand || !m.text) return

    const headerUI = "┌˚₊ ๑│ ᴇ ʀ ɪ ɴ ᴇ - ᴀ ɪ  ᴀ ᴜ ᴛ ᴏ  ᴀ ɪ │๑˚₊"
    const hrUI = "└˚₊ ๑ ────────────── ๑˚₊"
    const footerUI = "> © ERINE-AI | AUTO AI"

    try {
        let promptInject = `${m.text}\n\n[System Note: Jawablah dengan bahasa Indonesia yang natural, santai, dan asik.]`
        let res = await fetch(`https://api.theresav.biz.id/ai/unlimited?text=${encodeURIComponent(promptInject)}&apikey=x34J0`)
        let json = await res.json()

        if (!json.status || !json.result) return

        let replyText = `${headerUI} 🤖\n┇ \n│ ${json.result}\n┇ \n${hrUI}\n${footerUI}`
        await conn.sendMessage(m.chat, { text: replyText }, { quoted: m })
    } catch (e) {
        console.error('[AUTO AI ERROR]', e)
    }
}

handler.help = ['autoai <on/off>']
handler.tags = ['ai']
handler.command = /^(autoai)$/i

export default handler