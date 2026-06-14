/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx Decode
 * ─────────────────────────
 * 📝 Plugin: Dramabox Downloader
 */

import axios from 'axios'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return m.reply(`❌ Masukkan link Dramabox!\n\n*Contoh:* ${usedPrefix + command} https://www.dramabox.com/in/video/42000012104_Rahasia-Sang-Sekretaris-Sulih-Suara/700775200_Episode-1`)

    await m.react('⏳')

    try {
        let { data: res } = await axios.get(`https://api.azbry.com/api/download/dramabox?url=${encodeURIComponent(text)}`)

        if (!res.status || !res.result || !res.result.episodes) {
            throw new Error('Gagal mengambil data dari URL tersebut.')
        }

        let book = res.result.book
        let episodes = res.result.episodes
        
        let availableEps = episodes.filter(e => e.mp4 !== null)

        if (availableEps.length === 0) {
            throw new Error('Episode ini terkunci (Premium) atau video tidak tersedia.')
        }

        let targetEp = availableEps[0]

        let caption = `⚡ ＤＲＡＭＡＢＯＸ - ＤＬ ⚡

» Title : ${book.bookName}
» Eps   : ${targetEp.name} (${targetEp.indexStr})
» Tags  : ${book.tags.join(', ')}

> _${book.introduction.substring(0, 150)}..._
`.trim()

        await conn.sendMessage(m.chat, {
            video: { url: targetEp.mp4 },
            caption: caption,
            mimetype: 'video/mp4'
        }, { quoted: m })

        await m.react('✅')

    } catch (e) {
        console.error('[DRAMABOX DL ERROR]', e)
        await m.react('❌')
        m.reply(`⚠️ *System Error:*\n_${e?.response?.data?.message || e.message || e}_`)
    }
}

handler.help = ['dramaboxdl <link>']
handler.tags = ['downloader']
handler.command = /^(dramaboxdl|dldramabox)$/i
handler.limit = true

export default handler