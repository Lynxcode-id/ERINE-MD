/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx Decode
 * ─────────────────────────
 * 📝 Plugin: Drakor Search
 */

import axios from 'axios'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return m.reply(`❌ Masukkan judul Drakor!\n\n*Contoh:* ${usedPrefix + command} true beauty`)

    await m.react('⏳')

    try {
        let { data: res } = await axios.get(`https://api.cuki.biz.id/api/movie/drakor-search`, {
            params: {
                apikey: 'cuki-x',
                query: text
            }
        })

        if (!res.status || !res.data.results || res.data.results.length === 0) {
            throw new Error('Drakor tidak ditemukan.')
        }

        let items = res.data.results.slice(0, 5)
        let caption = `⚡ ＤＲＡＫＯＲ ＳＥＡＲＣＨ ⚡\n\n`

        for (let i = 0; i < items.length; i++) {
            let item = items[i]
            caption += `» Title : ${item.title}
» Link  : ${item.url}\n\n`
        }

        await conn.sendMessage(m.chat, {
            image: { url: items[0].thumbnail },
            caption: caption.trim()
        }, { quoted: m })

        await m.react('✅')

    } catch (e) {
        console.error('[DRAKOR SEARCH ERROR]', e)
        await m.react('❌')
        m.reply(`⚠️ *System Error:*\n_${e?.response?.data?.message || e.message || e}_`)
    }
}

handler.help = ['drakorsearch <judul>']
handler.tags = ['search']
handler.command = /^(drakorsearch|searchdrakor|drakor)$/i
handler.limit = true

export default handler