/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx Decode
 * 📞 WhatsApp  : +62 882-5804-1396
 * 📢 Channel   : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * ⚠️ Note      : Keep credit to respect the creator!
 * ─────────────────────────
 * 📝 Plugin: Anime Info Details
 */

import axios from 'axios'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        return m.reply(`❌ Masukkan judul anime!\n\n*Contoh:* ${usedPrefix + command} Naruto`)
    }

    await m.react('⏳')

    try {
        let { data: res } = await axios.get(`https://api.jagoanproject.biz.id/api/anime/animeinfo?q=${encodeURIComponent(text)}`, {
            headers: {
                "Authorization": "Bearer jg_9cTY7aSGLdqZErDysaLfO6Wn"
            }
        })

        if (!res.status || !res.data) {
            throw new Error('Detail anime tidak ditemukan.')
        }

        let data = res.data

        let caption = `╭─── [ *A N I M E - I N F O* ] ───💠
│ 
│  📛 *Title:* ${data.title || '-'}
│  📺 *Type:* ${data.type || '-'}
│  🎭 *Genres:* ${data.genres || '-'}
│  ⭐ *Score:* ${data.score || '-'}
│  👥 *Members:* ${data.members || '-'}
│  ❤️ *Favorites:* ${data.favorites || '-'}
│  📌 *Status:* ${data.status || '-'}
│
┣─────────[ *S Y N O P S I S* ]─────────💠
│
│ ${data.synopsis ? data.synopsis.substring(0, 800) + '...' : 'Tidak ada sinopsis.'}
│
╰──────────────────────────💠`.trim()

        await conn.sendMessage(m.chat, {
            image: { url: data.image },
            caption: caption
        }, { quoted: m })

        await m.react('✅')

    } catch (e) {
        console.error('[ANIME INFO ERROR]', e)
        await m.react('❌')
        m.reply(`⚠️ *System Error:*\n_${e?.response?.data?.message || e.message || e}_`)
    }
}

handler.help = ['animeinfo <judul>']
handler.tags = ['anime']
handler.command = /^(animeinfo|infoanime)$/i
handler.limit = true

export default handler