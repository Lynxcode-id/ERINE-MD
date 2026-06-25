import axios from 'axios'
import { Button, Carousel } from '../lib/nixcode.js'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        return m.reply(`┌˚₊ ๑│ ᴛ ʜ ʀ ᴇ ᴀ ᴅ s  ᴅ ʟ │๑˚₊ ⚙️\n┇ \n│ ❌ *Format Salah!*\n│ Masukkan URL Threads.\n│ \n│ 💡 *Contoh:*\n│ ${usedPrefix + command} https://www.threads.com/@kholidiyah/post/DZyWB96EztH\n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-MD`)
    }

    await m.react('⏳')

    try {
        const apiKey = "x34J0"
        const apiUrl = `https://api.theresav.biz.id/download/threads?url=${encodeURIComponent(text)}&apikey=${apiKey}`
        
        const { data } = await axios.get(apiUrl)
        if (!data.status || !data.result) throw new Error("Data tidak ditemukan atau API bermasalah.")

        let res = data.result
        let username = res.user?.username || "unknown"
        let captionText = res.text || "Tidak ada teks"

        let carousel = new Carousel(conn)
            .setBody(`🧵 *THREADS DOWNLOADER*\n👤 @${username}\n\n💬 ${captionText}`)
            .setFooter('© ERINE-MD | INF PROJECT')

        // Jika ada video
        if (res.videos && res.videos.length > 0) {
            let vid = res.videos[0][0]
            carousel.addCard(
                await new Button(conn)
                    .setTitle('🎥 Video Threads')
                    .setBody(`Durasi: Tidak diketahui`)
                    .setFooter(`Oleh: @${username}`)
                    .setImage(vid.thumb)
                    .addUrl('⬇️ Download Video', vid.url, true, { icon: 'PROMOTION' })
                    .addCopy('📋 Copy Link', vid.url, { icon: 'DOCUMENT' })
                    .toCard()
            )
        }

        // Jika ada image
        if (res.images && res.images.length > 0) {
            let img = res.images[0][0]
            carousel.addCard(
                await new Button(conn)
                    .setTitle('🖼️ Gambar Threads')
                    .setBody(`Resolusi: ${img.width}x${img.height}`)
                    .setFooter(`Oleh: @${username}`)
                    .setImage(img.url)
                    .addUrl('⬇️ Download Image', img.url, true, { icon: 'PROMOTION' })
                    .addCopy('📋 Copy Link', img.url, { icon: 'DOCUMENT' })
                    .toCard()
            )
        }

        await carousel.send(m.chat, { quoted: m })
        await m.react('✅')

    } catch (e) {
        console.error('[THREADS ERROR]', e)
        await m.react('❌')
        m.reply(`┌˚₊ ๑│ ᴛ ʜ ʀ ᴇ ᴀ ᴅ s  ᴅ ʟ │๑˚₊ ❌\n┇ \n│ *Gagal Mendownload!*\n│ 📡 *Respon:* ${e.message}\n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-MD`)
    }
}

handler.help = ['threads <url>']
handler.tags = ['downloader']
handler.command = /^(threads|threadsdl)$/i
handler.limit = true

export default handler