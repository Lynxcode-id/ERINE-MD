/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Author     : Lynx Decode
 * 📞 Contact    : +62 882-5804-1396
 * 📢 Channel    : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * ⚠️ Note       : Keep credit to respect the creator!
 * ─────────────────────────
 * 📝 Plugin: Gemini 3.1 Pro (Chatday API)
 */

import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        return m.reply(`┌˚₊ ๑│ ɢ ᴇ ᴍ ɪ ɴ ɪ  ᴘ ʀ ᴏ │๑˚₊ ⚠️\n┇ \n│ ❌ *Teks kosong!*\n│ \n│ 📌 *Cara pakai:*\n│ ${usedPrefix + command} halo cuy\n┇ \n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`)
    }

    await m.react('⏳')

    try {
        const apiUrl = `https://api.theresav.biz.id/ai/chatday?text=${encodeURIComponent(text)}&model=google%2Fgemini-3.1-pro-preview&apikey=x34J0`
        
        const response = await fetch(apiUrl)
        const json = await response.json()

        if (!json.status || !json.result) {
            throw new Error('Gagal mendapatkan respon dari API.')
        }

        await conn.sendMessage(m.chat, { text: json.result }, { quoted: m })
        await m.react('✅')

    } catch (error) {
        console.error('[GEMINIPRO ERROR]', error)
        await m.react('❌')
        
        let errMsg = error.message || String(error)
        if (errMsg.length > 500) errMsg = errMsg.substring(0, 500) + '... (cek console)'

        m.reply(`┌˚₊ ๑│ s ʏ s ᴛ ᴇ ᴍ  ᴇ ʀ ʀ ᴏ ʀ │๑˚₊ ❌\n┇ Terjadi kesalahan sistem.\n┇ *Detail:* ${errMsg}\n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`)
    }
}

handler.help = ['geminipro <teks>']
handler.tags = ['ai']
handler.command = /^(geminipro|chatday)$/i
handler.limit = true

export default handler