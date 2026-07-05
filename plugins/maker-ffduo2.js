/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Author     : Lynx Decode
 * 📞 Contact    : +62 882-5804-1396
 * 📢 Channel    : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * ⚠️ Note       : Keep credit to respect the creator!
 * ─────────────────────────
 * 📝 Plugin     : Fake FF Duo Maker
 */

import fetch from 'node-fetch'

let handler = async (m, { conn, usedPrefix, command, text }) => {
    if (!text || !text.includes('|')) {
        return m.reply(`┌˚₊ ๑│ FAKE FF DUO │๑˚₊ ❌\n┇ \n│ ❌ *Format salah!*\n│ *Contoh:* ${usedPrefix + command} lynx | manx\n┇ \n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`)
    }

    let [user1, user2] = text.split('|').map(v => v.trim())
    
    if (!user1 || !user2) {
        return m.reply(`┌˚₊ ๑│ FAKE FF DUO │๑˚₊ ❌\n┇ \n│ ❌ *Pastikan kedua nama diisi!*\n│ *Contoh:* ${usedPrefix + command} lynx | manx\n┇ \n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`)
    }

    await m.react('⏳')

    try {
        let apiUrl = `https://apis.snowping.eu.cc/api/maker/fakeffDuo?username1=${encodeURIComponent(user1)}&username2=${encodeURIComponent(user2)}`
        let res = await fetch(apiUrl)
        let json = await res.json()

        if (json.status !== 200 || !json.result?.url) throw new Error('Respon API Bermasalah.')

        let txt = `┌˚₊ ๑│ FAKE FF DUO │๑˚₊ 🎮\n┇ \n│ ✅ *Berhasil dibuat!*\n│ 👤 *P1:* ${user1}\n│ 👤 *P2:* ${user2}\n┇ \n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`

        await conn.sendFile(m.chat, json.result.url, 'ffduo.jpg', txt, m)
        await m.react('✨')
    } catch (e) {
        console.error(e)
        await m.react('❌')
        m.reply(`┌˚₊ ๑│ FAKE FF DUO │๑˚₊ ❌\n┇ \n│ ❌ *Gagal memproses gambar:* ${e.message || 'API Error'}\n┇ \n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`)
    }
}

handler.help = ['ffduo2 <nama1> | <nama2>']
handler.tags = ['maker']
handler.command = /^(ffduo2)$/i
handler.limit = true

export default handler