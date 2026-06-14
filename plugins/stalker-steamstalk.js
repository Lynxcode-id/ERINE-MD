/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx Decode
 * 📢 Channel   : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * ─────────────────────────
 * 📝 Plugin: Steam Stalker
 */

import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        return m.reply(`Masukkan username Steam yang mau di-stalk!\n\n*Contoh:*\n${usedPrefix + command} gabelogannewell`)
    }

    await m.react('⏳')

    try {
        const apiUrl = `https://api.pixxxry.eu.cc/stalk/steam?username=${encodeURIComponent(text)}`
        const response = await fetch(apiUrl)
        
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`)
        
        const data = await response.json()
        
        if (!data.status || !data.result) throw new Error('Username tidak ditemukan atau API bermasalah')

        const res = data.result
        
        let caption = `┌˚₊ ๑│ s ᴛ ᴇ ᴀ ᴍ  s ᴛ ᴀ ʟ ᴋ ᴇ ʀ │๑˚₊ 🎮\n`
        caption += `┇ 👤 *Username:* ${res.username || '-'}\n`
        caption += `┇ 📛 *Real Name:* ${res.realname || '-'}\n`
        caption += `┇ 🆔 *SteamID64:* ${res.steamid64 || '-'}\n`
        caption += `┇ 🟢 *Status:* ${res.state_message || res.online_state || '-'}\n`
        caption += `┇ 🔒 *Privacy:* ${res.privacy_state || '-'}\n`
        if (res.location) caption += `┇ 📍 *Location:* ${res.location}\n`
        if (res.member_since) caption += `┇ 📅 *Member Since:* ${res.member_since}\n`
        caption += `├˚₊ ๑ ────────────── ๑˚₊\n`
        caption += `┇ 🛡️ *Account Status:*\n`
        caption += `┇ • VAC Banned: ${res.status?.vac_banned ? 'Yes ❌' : 'No ✅'}\n`
        caption += `┇ • Trade Ban: ${res.status?.trade_ban || '-'}\n`
        caption += `┇ • Limited Account: ${res.status?.limited_account ? 'Yes ⚠️' : 'No ✅'}\n`
        caption += `└˚₊ ๑ ────────────── ๑˚₊\n\n`
        
        if (res.summary) caption += `📝 *Summary:*\n${res.summary}\n\n`
        caption += `🔗 *URL:* ${res.url || '-'}\n\n`
        caption += `> © ERINE-MD`

        await conn.sendMessage(m.chat, {
            image: { url: res.avatar || 'https://i.ibb.co/4YBNyvP/images-76.jpg' },
            caption: caption.trim()
        }, { quoted: m })

        await m.react('✅')
    } catch (error) {
        console.error('[STEAM STALK ERROR]', error)
        await m.react('❌')
        m.reply(`❌ Gagal mencari data Steam.\n> *Detail:* ${error.message || error}`)
    }
}

handler.help = ['steamstalk <username>']
handler.tags = ['stalker']
handler.command = /^(steamstalk|stalksteam)$/i
handler.limit = true

export default handler