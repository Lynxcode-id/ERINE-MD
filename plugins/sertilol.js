let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        return m.reply(`*Format salah!*\n\n*Contoh:*\n${usedPrefix + command} Lynx`)
    }

    m.reply('⏳ Loading...')

    try {
        let apiKey = '3aXI6'
        let apiUrl = `https://api.theresav.biz.id/maker/sertifikatlol?text=${encodeURIComponent(text)}&apikey=${apiKey}`

        await conn.sendFile(m.chat, apiUrl, 'sertifikat.jpg', 'Done 🔥', m)

    } catch (e) {
        console.error(e)
        m.reply('Error memproses gambar.')
    }
}

handler.help = ['sertifikatlol', 'sertilol'].map(v => v + ' <text>')
handler.tags = ['maker']
handler.command = /^(sertifikatlol|sertilol)$/i
handler.limit = false 
handler.register = false

export default handler;