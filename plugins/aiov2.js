import fetch from 'node-fetch'

let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) return m.reply(`*Contoh Penggunaan:*\n${usedPrefix + command} https://www.tikwm.com/video/...`)

    m.reply('⏳ *Processing...*')

    try {
        let url = args[0]
        let apikey = '3aXI6' 
        let apiEndpoint = `https://api.theresav.biz.id/download/aio-v2?url=${encodeURIComponent(url)}&mode=hybrid&quality=128k&audio_quality=128k&apikey=${apikey}`

        let response = await fetch(apiEndpoint)
        let json = await response.json()

        if (!json.status) return m.reply('❌ Gagal mengambil data.')

        let { title, resolution, filesize_fmt, download_url, note } = json.result

        let caption = `乂 *A I O - V 2   D O W N L O A D E R*\n\n`
        caption += `◦ *Judul:* ${title === '-' ? 'Tidak diketahui' : title}\n`
        caption += `◦ *Resolusi:* ${resolution}\n`
        caption += `◦ *Size:* ${filesize_fmt}\n`
        caption += `◦ *Note:* ${note}\n\n`
        caption += `_Jemima Bot_`

        await conn.sendFile(m.chat, download_url, 'video.mp4', caption, m)

    } catch (e) {
        console.error(e)
        m.reply('❌ Terjadi kesalahan sistem.')
    }
}

handler.help = ['aiov2 <url>']
handler.tags = ['downloader']
handler.command = /^(aiov2)$/i
handler.limit = true

export default handler