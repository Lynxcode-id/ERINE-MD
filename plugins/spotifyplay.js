import fetch from 'node-fetch'

let handler = async (m, { conn, text }) => {
    if (!text) return m.reply('Masukkan judul lagu yang ingin dicari!\nContoh: .spplay cup of joe multo')

    try {
        console.log('[SPPLAY] Memulai request lagu:', text)
        await m.react('🌟')

        const apiKey = 'MfRVy' 
        const url = `https://api.theresav.biz.id/download/spotify-play?q=${encodeURIComponent(text)}&bitrate=128k&apikey=${apiKey}`
        
        let res = await fetch(url)
        let json = await res.json()

        console.log('[SPPLAY] Respon API:', json.status) // Ngecek API tembus atau nggak

        if (!json.status || !json.result) {
            await m.react('❌')
            return m.reply('Lagu tidak ditemukan atau API sedang bermasalah.')
        }

        let { title, artists, album, duration, cover, play_url } = json.result

        let caption = `*S P O T I F Y   P L A Y*\n\n`
        caption += `🎵 *Judul:* ${title}\n`
        caption += `🎤 *Artis:* ${artists}\n`
        caption += `💿 *Album:* ${album}\n`
        caption += `⏱️ *Durasi:* ${duration}\n\n`
        caption += `_Mohon tunggu, audio sedang dikirim..._`

        console.log('[SPPLAY] Mengirim cover gambar...')
        // Menggunakan conn.sendFile untuk cover (seperti di plugin brat)
        await conn.sendFile(m.chat, cover, 'cover.jpg', caption, m)

        console.log('[SPPLAY] Mengirim file audio...')
        // Menggunakan conn.sendMessage asli bawaan Baileys untuk audio
        await conn.sendMessage(m.chat, { 
            audio: { url: play_url }, 
            mimetype: 'audio/mpeg', 
            ptt: false 
        }, { quoted: m })

        await m.react('✅')
        console.log('[SPPLAY] Berhasil dikirim!')

    } catch (e) {
        await m.react('❌')
        m.reply('Terjadi kesalahan! Cek console/terminal bot.')
        console.error('[SPPLAY ERROR]:', e)
    }
}

handler.help = ['spotifyplay <judul>', 'spplay <judul>']
handler.tags = ['downloader']
handler.command = /^(spotifyplay|spplay)$/i
handler.limit = true
handler.register = true
handler.group = false

export default handler
