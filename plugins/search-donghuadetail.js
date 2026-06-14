/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx Decode
 * ─────────────────────────
 * 📝 Plugin: Donghua Detail
 */

import axios from 'axios'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return m.reply(`❌ Masukkan link Donghua!\n\n*Contoh:* ${usedPrefix + command} https://donghuafilm.com/anime/soul-land-movie-sword-of-dust/`)

    await m.react('⏳')

    try {
        let { data: res } = await axios.get(`https://api.cuki.biz.id/api/movie/donghua-detail`, {
            params: {
                apikey: 'cuki-x',
                url: text
            }
        })

        if (!res.success || !res.data || !res.data.details) {
            throw new Error('Detail Donghua tidak ditemukan.')
        }

        let details = res.data.details
        
        let caption = `⚡ ＤＯＮＧＨＵＡ ＤＥＴＡＩＬ ⚡

» Title  : ${details.title}
» Studio : ${details.metadata?.studio?.replace('Studio: ', '') || '-'}
» Status : ${details.metadata?.status?.replace('Network: ', '') || '-'}
» Type   : ${details.metadata?.type?.replace('Type: ', '') || '-'}
» Eps    : ${res.data.summary.totalEpisodes}
» Score  : ⭐ ${details.additionalInfo.rating}

> _${details.description.substring(0, 200)}..._
`.trim()

        await conn.sendMessage(m.chat, {
            image: { url: details.coverImage || details.thumbnail },
            caption: caption
        }, { quoted: m })

        await m.react('✅')

    } catch (e) {
        console.error('[DONGHUA DETAIL ERROR]', e)
        await m.react('❌')
        m.reply(`⚠️ *System Error:*\n_${e?.response?.data?.message || e.message || e}_`)
    }
}

handler.help = ['donghuadetail <link>']
handler.tags = ['search']
handler.command = /^(donghuadetail|detaildonghua)$/i
handler.limit = true

export default handler