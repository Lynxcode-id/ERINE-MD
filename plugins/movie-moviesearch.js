/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx Decode
 * ─────────────────────────
 * 📝 Plugin: Movie Search
 */

import axios from 'axios'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return m.reply(`❌ Masukkan judul film!\n\n*Contoh:* ${usedPrefix + command} ceo`)

    await m.react('⏳')

    try {
        let { data: res } = await axios.get(`https://api.lexcode.biz.id/api/search/movie?q=${encodeURIComponent(text)}`)

        if (!res.success || !res.results || res.results.length === 0) {
            throw new Error('Film tidak ditemukan.')
        }

        let items = res.results.slice(0, 5)
        let caption = `⚡ ＭＯＶＩＥ ＳＥＡＲＣＨ ⚡\n\n`

        for (let i = 0; i < items.length; i++) {
            let item = items[i]
            caption += `» Title  : ${item.title} (${item.year})
» Type   : ${item.type}
» Genre  : ${item.genre}
» Rating : ⭐ ${item.rating}
» Time   : ${item.runtime}
» Plot   : _${item.plot}_\n\n`
        }

        await conn.sendMessage(m.chat, {
            image: { url: items[0].poster },
            caption: caption.trim()
        }, { quoted: m })

        await m.react('✅')

    } catch (e) {
        console.error('[MOVIE SEARCH ERROR]', e)
        await m.react('❌')
        m.reply(`⚠️ *System Error:*\n_${e?.response?.data?.message || e.message || e}_`)
    }
}

handler.help = ['moviesearch <judul>']
handler.tags = ['movie']
handler.command = /^(moviesearch|searchmovie|movie)$/i
handler.limit = true

export default handler