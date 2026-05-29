/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx Decode
 * ─────────────────────────
 */

import spotmate from '../scrape/spotmate.js'
import axios from 'axios'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text || !/spotify.com/i.test(text)) {
        return m.reply(`⚠️ *Mana linknya njir?*\n\nContoh: *${usedPrefix + command} https://open.spotify.com/track/...*`)
    }

    await m.react('⏳')

    try {
        let res = await spotmate(text.trim())
        if (!res || !res.download_url) throw new Error('Gagal ngambil data lagu.')

        let { data: audioBuffer } = await axios.get(res.download_url, {
            responseType: 'arraybuffer',
            headers: {
                'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36',
                'referer': 'https://spotmate.online/',
                'accept': '*/*'
            }
        })

        let caption = `🎧 *SPOTIFY DOWNLOADER*\n\n` +
            `🎵 *Title:* ${res.title}\n` +
            `👤 *Artist:* ${res.artist}\n\n` +
            `> © INF PROJECT`

        await m.reply(caption)
        await conn.sendMessage(m.chat, {
            audio: audioBuffer,
            mimetype: 'audio/mpeg'
        }, { quoted: m })
        
        await m.react('✅')
    } catch (e) {
        console.error(e)
        await m.react('❌')
        m.reply(`❌ *Error njir:* ${e.message}`)
    }
}

handler.help = ['spotify <link>']
handler.tags = ['downloader']
handler.command = /^(spotify|spotdl)$/i
handler.limit = true

export default handler