/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx Decode
 * 📞 WhatsApp  : +62 882-5804-1396
 * 📢 Channel   : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * ⚠️ Note      : Keep credit to respect the creator!
 * ─────────────────────────
 * 📝 Plugin: Random Anime Story WA
 */

import axios from 'axios'

let handler = async (m, { conn, usedPrefix, command }) => {
    await m.react('⏳')

    try {
        let { data: res } = await axios.get(`https://api.jagoanproject.biz.id/api/anime/animestorywa`, {
            headers: {
                "Authorization": "Bearer jg_9cTY7aSGLdqZErDysaLfO6Wn"
            }
        })

        if (!res.status || !res.url) {
            throw new Error('Gagal mengambil video dari server.')
        }

        let caption = `⚡ ＳＴＯＲＹ  ＡＮＩＭＥ ⚡\n\n> Random Anime WhatsApp Story by INF Project.`

        await conn.sendMessage(m.chat, {
            video: { url: res.url },
            caption: caption,
            mimetype: 'video/mp4'
        }, { quoted: m })

        await m.react('✅')

    } catch (e) {
        console.error('[ANIME STORY ERROR]', e)
        await m.react('❌')
        m.reply(`⚠️ *System Error:*\n_${e?.response?.data?.message || e.message || e}_`)
    }
}

handler.help = ['storyanime']
handler.tags = ['anime']
handler.command = /^(storyanime|animestorywa|swanime)$/i
handler.limit = true

export default handler