/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx Decode
 * ─────────────────────────
 * 📝 Plugin : YouTube Downloader MP4 Only (Erine-MD)
 * 🔄 Update : Menggunakan API XRizal (Fix Codec Video Normal)
 */

import axios from 'axios'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return m.reply(`❌ Masukkan link YouTube yang valid cuy!\n\nContoh:\n*${usedPrefix}${command} https://youtu.be/ox4tmEV6-QU*`)
    if (!text.match(/(youtube\.com|youtu\.be)/gi)) return m.reply('❌ Itu bukan link YouTube cuy!')

    await m.react('⏳')

    try {
        let apiUrl = `https://api.xrizal.my.id/api/downloader/ytmp4?url=${encodeURIComponent(text)}`
        let response = await axios.get(apiUrl, { headers: { 'Accept': 'application/json' } })
        let resData = response.data

        if (!resData.status || !resData.result) {
            throw new Error('Gagal mengambil data dari API XRizal.')
        }

        let data = resData.result
        // Mengambil video dari array video_normal (karena berisi video + audio yang kompatibel)
        let videoUrl = data.video_normal && data.video_normal.length > 0 ? data.video_normal[0].url : null

        if (!videoUrl) throw new Error('Link unduhan video normal tidak ditemukan.')

        let capVideo = `📹 *Y O U T U B E  V I D E O*\n\n`
        capVideo += `🎬 *Judul:* ${data.title || '-'}\n`
        capVideo += `⏳ *Durasi:* ${data.duration || '-'}\n\n`
        capVideo += `» ᴇʀɪɴᴇ-ᴍᴅ ᴍᴀɴᴀɢᴇᴍᴇɴᴛ «`

        await conn.sendMessage(m.chat, {
            video: { url: videoUrl },
            mimetype: 'video/mp4',
            caption: capVideo,
            fileName: `${data.title || 'video'}.mp4`
        }, { quoted: m })
        
        await m.react('🔥')

    } catch (e) {
        console.error(e)
        await m.react('❌')
        m.reply(`❌ *Error:* Gagal memproses unduhan YouTube.\n\`\`\`${e.message}\`\`\``)
    }
}

handler.help = ['ytmp4 <link>', 'ytv <link>']
handler.tags = ['downloader']
handler.command = /^(ytv|ytmp4)$/i
handler.limit = true

export default handler