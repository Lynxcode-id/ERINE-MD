/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx Decode
 * 📞 WhatsApp  : +62 882-5804-1396
 * 📢 Channel   : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * ⚠️ Note      : Keep credit to respect the creator!
 * ─────────────────────────
 * 📝 Plugin: Twitter/X Downloader (Jagoan Project API)
 */

import axios from 'axios'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    let url = text?.trim()

    if (!url) {
        return m.reply(`❌ Masukkan link Twitter/X!\n\n*Contoh:* ${usedPrefix + command} https://x.com/AR_LanaJKT48/status/2062214845190263156`)
    }

    if (!/x\.com|twitter\.com/i.test(url)) {
        return m.reply('❌ URL tidak valid. Gunakan link X atau Twitter.')
    }

    await m.react('⏳')

    try {
        let { data: res } = await axios.get(`https://api.jagoanproject.biz.id/api/downloader/twitter?url=${encodeURIComponent(url)}`, {
            headers: {
                "Authorization": "Bearer jg_9cTY7aSGLdqZErDysaLfO6Wn"
            }
        })

        if (!res.status || !res.data) {
            throw new Error(res.message || 'Gagal mengambil data dari server.')
        }

        let data = res.data
        let medias = data.media

        if (!medias || medias.length === 0) {
            throw new Error('Media tidak ditemukan pada tweet tersebut.')
        }

        let caption = `⚡ ＴＷＩＴＴＥＲ - ＤＬ ⚡

» Author : ${data.author?.name || '-'} (@${data.author?.username || '-'})
» Likes  : ${data.stats?.likes || 0}
» RT     : ${data.stats?.retweets || 0}

> ${data.title || '-'}
`.trim()

        for (let i = 0; i < medias.length; i++) {
            let media = medias[i]
            let isVideo = media.type === 'video' || media.type === 'gif'
            
            await conn.sendMessage(m.chat, { 
                [isVideo ? 'video' : 'image']: { url: media.url }, 
                caption: i === 0 ? caption : '' 
            }, { quoted: m })
        }

        await m.react('✅')

    } catch (e) {
        console.error('[TWITTER DL ERROR]', e)
        await m.react('❌')
        m.reply(`⚠️ *System Error:*\n_${e?.response?.data?.message || e.message || e}_`)
    }
}

handler.help = ['twitter3 <url>', 'x3 <url>']
handler.tags = ['downloader']
handler.command = /^(x3|twitter3|tweet3)$/i
handler.limit = true

export default handler