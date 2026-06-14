import uploadImage from '../lib/uploadImage.js'

let handler = async (m, { conn, usedPrefix, command }) => {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''
    
    if (!/image\/(jpe?g|png)/.test(mime)) return m.reply(`Kirim atau reply foto dengan caption *${usedPrefix + command}*`)

    m.reply('⏳ *Sedang diproses...*')

    try {
        let media = await q.download()
        let url = await uploadImage(media)
        let apiEndpoint = `https://api.siputzx.my.id/api/canvas/greyscale?image=${encodeURIComponent(url)}`
        
        await conn.sendFile(m.chat, apiEndpoint, 'greyscale.png', '乂 *T O   H I T A M   P U T I H*', m)
    } catch (e) {
        console.error(e)
        m.reply('❌ Terjadi kesalahan saat mengunggah atau memproses gambar.')
    }
}

handler.help = ['tohitamputih']
handler.tags = ['canvas']
handler.command = /^(tohitamputih)$/i
handler.limit = true

export default handler