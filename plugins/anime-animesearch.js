/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx Decode
 * 📞 WhatsApp  : +62 882-5804-1396
 * 📢 Channel   : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * ⚠️ Note      : Keep credit to respect the creator!
 * ─────────────────────────
 * 📝 Plugin: Anime Search
 */

import axios from 'axios'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        return m.reply(`❌ Masukkan judul anime!\n\n*Contoh:* ${usedPrefix + command} Naruto`)
    }

    await m.react('⏳')

    try {
        let { data: res } = await axios.get(`https://api.jagoanproject.biz.id/api/anime/animesearch?q=${encodeURIComponent(text)}`, {
            headers: {
                "Authorization": "Bearer jg_9cTY7aSGLdqZErDysaLfO6Wn"
            }
        })

        if (!res.status || !res.results || res.results.length === 0) {
            throw new Error('Anime tidak ditemukan.')
        }

        let caption = `⚡ ＡＮＩＭＥ  ＳＥＡＲＣＨ ⚡\n\n`
        let limit = res.results.slice(0, 5) // Ambil 5 teratas biar ga spam

        for (let i = 0; i < limit.length; i++) {
            let anime = limit[i]
            caption += `╭─── [ *${anime.title}* ]
│ 
│  🎌 *English:* ${anime.title_english || '-'}
│  📺 *Type:* ${anime.type || '-'} (${anime.episodes || '?'} Eps)
│  ⭐ *Score:* ${anime.score || '-'}
│  📅 *Rilis:* ${anime.season || '-'} ${anime.year || '-'}
│  📌 *Status:* ${anime.status || '-'}
│  🔗 *Link:* ${anime.url || '-'}
│
╰──────────────────────────💠\n\n`
        }

        caption += `> _Ketik ${usedPrefix}animeinfo <judul> untuk detail lengkap._`

        await conn.sendMessage(m.chat, {
            image: { url: limit[0].image }, // Nampilin cover dari hasil pertama
            caption: caption.trim()
        }, { quoted: m })

        await m.react('✅')

    } catch (e) {
        console.error('[ANIME SEARCH ERROR]', e)
        await m.react('❌')
        m.reply(`⚠️ *System Error:*\n_${e?.response?.data?.message || e.message || e}_`)
    }
}

handler.help = ['animesearch <judul>']
handler.tags = ['anime']
handler.command = /^(animesearch|searchanime)$/i
handler.limit = true

export default handler