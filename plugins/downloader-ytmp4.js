import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return m.reply(`❌ Masukkan link YouTube yang valid cuy!\n\nContoh:\n*${usedPrefix}${command} https://youtu.be/ox4tmEV6-QU*`)

    if (!text.match(/(youtube\.com|youtu\.be)/gi)) return m.reply('❌ Itu bukan link YouTube cuy!')

    await m.react('⚡')

    try {
        let apiUrl = `https://api.lexcode.biz.id/api/dwn/ytdl?url=${encodeURIComponent(text)}`
        let headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
            'Accept': 'application/json',
            'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
            'Referer': 'https://api.lexcode.biz.id/'
        }

        let res = await fetch(apiUrl, { method: 'GET', headers: headers })
        if (!res.ok) throw new Error(`HTTP Error! Status: ${res.status}`)
        
        let json = await res.json()

        if (!json.success || !json.result) {
            await m.react('😤')
            return m.reply('❌ Gagal mengambil data download dari API LexCode!')
        }

        let data = json.result
        let title = data.title || 'YouTube Downloader'
        let downloadUrl = data.download_url
        let duration = data.duration || '00:00'

        if (!downloadUrl) return m.reply('❌ Link unduhan kosong dari API!')
        if (/^(yt(a|mp3)|youtubeaudio)$/i.test(command)) {
            let capAudio = `🎧 *Y O U T U B E  A U D I O*\n\n`
            capAudio += `🎵 *Judul:* ${title}\n`
            capAudio += `⏳ *Durasi:* ${duration}\n\n`
            capAudio += `_Audio sedang dikirim, tunggu bentar..._`
            
            await m.reply(capAudio)
            await conn.sendFile(m.chat, downloadUrl, `${title}.mp3`, '', m, false, { 
                mimetype: 'audio/mpeg',
                asDocument: false 
            })
            await m.react('🔥')
            return
        }

        let capVideo = `📹 *Y O U T U B E  V I D E O*\n\n`
        capVideo += `🎬 *Judul:* ${title}\n`
        capVideo += `🎞️ *Kualitas:* ${data.quality || '720'}p\n`
        capVideo += `⏳ *Durasi:* ${duration}\n\n`
        capVideo += `» ᴇʀɪɴᴇ-ᴍᴅ ᴍᴀɴᴀɢᴇᴍᴇɴᴛ «`

        await conn.sendFile(m.chat, downloadUrl, `${title}.mp4`, capVideo, m, false, {
            mimetype: 'video/mp4'
        })
        
        await m.react('🔥')

    } catch (e) {
        console.error(e)
        await m.react('😤')
        m.reply(`❌ *Error:* Gagal memproses unduhan YouTube.\n\`\`\`${e.message}\`\`\``)
    }
}

handler.help = ['ytmp4 <link>']
handler.tags = ['downloader']
handler.command = /^(ytv|ytmp4)$/i
handler.limit = true

export default handler