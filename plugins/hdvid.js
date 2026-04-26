import fetch from 'node-fetch'
import axios from 'axios'
import FormData from 'form-data'

let handler = async (m, { conn, usedPrefix, command, args, text }) => {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''
    if (!/video/.test(mime)) return m.reply(`Reply atau kirim video dengan command *${usedPrefix + command} <resolusi>* bre!\n\n*Pilihan Resolusi:*\n- hd\n- full-hd\n- 2k\n- 4k`)

    let inputRes = text ? text.toLowerCase().trim().replace(/\s+/g, '-') : ''
    let resChoice = ['hd', 'full-hd', '2k', '4k']
    let resolusi = resChoice.includes(inputRes) ? inputRes : 'full-hd'

    m.reply(`⏳ Proses upload video ke Uguu & upscaling ke *${resolusi.toUpperCase()}*...\n\nSabar ya lek, ini agak lama. Jangan spam command dulu.`)

    try {
        let mediaBuffer = await q.download()

        let form = new FormData()
        form.append('files[]', mediaBuffer, { filename: 'video.mp4', contentType: 'video/mp4' })
        
        let resUguu = await axios.post('https://uguu.se/upload.php', form, {
            headers: { ...form.getHeaders() }
        })
        
        let videoUrl = resUguu.data.files[0].url
        if (!videoUrl) throw 'Gagal upload ke Uguu, lek.'

        let apiUrl = `https://api.skylow.web.id/api/tools/hdvideo?url=${encodeURIComponent(videoUrl)}&resolusi=${resolusi}`

        let response = await fetch(apiUrl, { timeout: 180000 })
        
        let resText = await response.text()
        let json;
        try {
            json = JSON.parse(resText)
        } catch (e) {
            console.error('API Error Log:', resText)
            throw 'API Skylow lagi gangguan / nolak video ini (Merespon HTML, bukan JSON). Coba video lain atau resolusi lebih kecil.'
        }

        if (!json.status || !json.result) throw 'Gagal memproses video di API Skylow.'

        // PERBAIKAN: Maksa bot ngenalin link .php dari Skylow sebagai Video MP4
        await conn.sendMessage(m.chat, { 
            video: { url: json.result }, 
            caption: `*HD VIDEO DONE* 🔥\n\n*Resolusi:* ${resolusi.toUpperCase()}\n*Runtime:* ${json.runtime || '-'}`,
            mimetype: 'video/mp4', // Paksa jadi video
            fileName: 'hdvideo.mp4' // Paksa nama file
        }, { quoted: m })

    } catch (e) {
        console.error(e)
        if (e.type === 'request-timeout' || String(e).includes('timeout') || e.code === 'ECONNABORTED') {
            m.reply('Waduh lek, server API-nya kelamaan respon (Timeout). Coba turunin resolusinya dulu bre.')
        } else {
            m.reply(`Error cuy: ${e.message || e}`)
        }
    }
}

handler.help = ['hdvid <resolusi>', 'hdvideo <resolusi>']
handler.tags = ['tools']
handler.command = /^(hdvid|hdvideo)$/i
handler.limit = true
handler.register = true

export default handler;