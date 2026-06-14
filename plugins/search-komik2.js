/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx Decode
 * ─────────────────────────
 * 📝 Plugin: Komik Search
 */

import axios from 'axios'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return m.reply(`❌ Masukkan judul komik!\n\n*Contoh:* ${usedPrefix + command} manhua`)

    await m.react('⏳')

    try {
        let { data: res } = await axios.get(`https://api.azbry.com/api/fun/komiksearch?q=${encodeURIComponent(text)}`)

        if (!res.status || !res.results || res.results.length === 0) {
            throw new Error('Komik tidak ditemukan.')
        }

        let items = res.results.slice(0, 5)
        let caption = `⚡ ＫＯＭＩＫ ＳＥＡＲＣＨ ⚡\n\n`

        for (let i = 0; i < items.length; i++) {
            let item = items[i]
            caption += `» Title  : ${item.title}
» Year   : ${item.year || '-'}
» Status : ${item.status || '-'}
» Tags   : ${item.tags ? item.tags.join(', ') : '-'}\n\n`
        }

        await conn.sendMessage(m.chat, {
            image: { url: items[0].cover },
            caption: caption.trim()
        }, { quoted: m })

        await m.react('✅')

    } catch (e) {
        console.error('[KOMIK SEARCH ERROR]', e)
        await m.react('❌')
        m.reply(`⚠️ *System Error:*\n_${e?.response?.data?.message || e.message || e}_`)
    }
}

handler.help = ['komiksearch2 <judul>']
handler.tags = ['search']
handler.command = /^(komiksearch2|searchkomik2|komik2)$/i
handler.limit = true

export default handler