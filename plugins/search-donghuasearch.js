/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx Decode
 * ─────────────────────────
 * 📝 Plugin: Donghua Search
 */

import axios from 'axios'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return m.reply(`❌ Masukkan judul Donghua!\n\n*Contoh:* ${usedPrefix + command} soul land`)

    await m.react('⏳')

    try {
        let { data: res } = await axios.get(`https://api.cuki.biz.id/api/movie/donghua-search`, {
            params: {
                apikey: 'cuki-x',
                query: text,
                page: 1
            }
        })

        if (!res.success || !res.data.results || res.data.results.length === 0) {
            throw new Error('Donghua tidak ditemukan.')
        }

        let items = res.data.results.slice(0, 5)
        let caption = `⚡ ＤＯＮＧＨＵＡ ＳＥＡＲＣＨ ⚡\n\n`

        for (let i = 0; i < items.length; i++) {
            let item = items[i]
            // Fix duplicate title string issues from API
            let cleanTitle = item.title.replace(/(.+?)\1+/g, '$1') 
            
            caption += `» Title  : ${cleanTitle}
» Type   : ${item.type}
» Status : ${item.status}
» Sub    : ${item.subDub}
» Link   : ${item.url}\n\n`
        }

        caption += `> _Gunakan ${usedPrefix}donghuadetail <link> untuk info lengkap._`

        await conn.sendMessage(m.chat, {
            image: { url: items[0].image || items[0].thumbnail },
            caption: caption.trim()
        }, { quoted: m })

        await m.react('✅')

    } catch (e) {
        console.error('[DONGHUA SEARCH ERROR]', e)
        await m.react('❌')
        m.reply(`⚠️ *System Error:*\n_${e?.response?.data?.message || e.message || e}_`)
    }
}

handler.help = ['donghuasearch <judul>']
handler.tags = ['search']
handler.command = /^(donghuasearch|searchdonghua)$/i
handler.limit = true

export default handler