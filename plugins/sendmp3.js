import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    // Kalau linknya kosong
    if (!text) return m.reply(`Linknya mana cuy?\nContoh: ${usedPrefix + command} https://vm.tiktok.com/xxxx/`)

    m.reply('Sabar cuy, audio lagi ditarik... 🎵')

    try {
        // Hit API lagi buat ngambil link MP3-nya
        let apiUrl = `https://api.siputzx.my.id/api/d/tiktok/v2?url=${encodeURIComponent(text)}`
        let res = await fetch(apiUrl)
        let json = await res.json()

        if (!json.status) throw 'Gagal ngambil data dari API'

        // Eksekusi kirim audio (MP3)
        await conn.sendMessage(m.chat, {
            audio: { url: json.data.music_link }, 
            mimetype: 'audio/mpeg', // Biar jadi MP3 (bisa diputar di background)
            ptt: false // Set ke true kalau mau audionya bentuk Voice Note (VN)
        }, { quoted: m })
        
    } catch (e) {
        console.error(e)
        m.reply('Waduh, gagal ngirim audio cuy. Mungkin linknya udah expired.')
    }
}

// Register commandnya biar kebaca di base Erine MD
handler.help = ['sendmp3 <url>']
handler.tags = ['downloader']
handler.command = /^(sendmp3)$/i

export default handler