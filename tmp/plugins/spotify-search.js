/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx Decode
 * ─────────────────────────
 * 📝 Plugin: Spotify Search Engine
 */

import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        return m.reply(`⚠️ *Mana judul lagu yang mau lu cari kanjut 😑*\n\nContoh: *${usedPrefix + command} multo*`)
    }

    await m.react('⚡')

    try {
        let apiUrl = `https://www.sankavollerei.com/search/spotify?apikey=planaai&q=${encodeURIComponent(text)}`
        let res = await fetch(apiUrl)
        let json = await res.json()

        if (!json.status || !json.result || json.result.length === 0) {
            throw new Error('Lagu kagak ditemuin di database Spotify.')
        }

        let caption = `🎧 *SPOTIFY SEARCH*\n\n`
        let results = json.result.slice(0, 5) 
        
        for (let [i, v] of results.entries()) {
            caption += `💠 *${i + 1}. ${v.title}*\n`
            caption += `   👤 *Artis:* ${v.artist}\n`
            caption += `   💿 *Album:* ${v.album}\n`
            caption += `   ⏱️ *Durasi:* ${v.duration}\n`
            caption += `   🔗 *Link:* ${v.track_url}\n\n`
        }

        caption += `> ©inf project-s x erine project`
        await conn.sendMessage(m.chat, {
            image: { url: results[0].thumbnail },
            caption: caption
        }, { quoted: m })

        await m.react('✅')
    } catch (e) {
        console.error(e)
        await m.react('❌')
        m.reply(`❌ *System Error njir:*\n_${e.message || e}_`)
    }
}

handler.help = ['spotifysearch <judul>']
handler.tags = ['search']
handler.command = /^(spotifysearch|spsearch)$/i
handler.limit = true

export default handler