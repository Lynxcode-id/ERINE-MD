import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        return m.reply(`*Format salah!*\n\n*Contoh:*\n${usedPrefix + command} lagi sibuk ngoding bot`)
    }

    m.reply('⏳ Loading...')

    try {
        let apiKey = '3aXI6'
        let apiUrl = `https://api.theresav.biz.id/maker/bratanime?text=${encodeURIComponent(text)}&apikey=${apiKey}`

        let res = await fetch(apiUrl)
        if (!res.ok) throw new Error('Gagal menghubungi API')
        let media = Buffer.from(await res.arrayBuffer())
        
        let exif = { packName: 'Anime Brat', packPublish: 'Lynxdecode' }
        
        await conn.sendSticker(m.chat, media, m, exif)

    } catch (e) {
        console.error(e)
        m.reply('Error memproses stiker.')
    }
}

handler.help = ['animebratv2'].map(v => v + ' <text>')
handler.tags = ['maker']
handler.command = /^(animebratv2)$/i
handler.limit = false 
handler.register = false

export default handler;