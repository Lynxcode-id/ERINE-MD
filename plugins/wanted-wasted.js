import fetch from 'node-fetch'

let handler = async (m, { conn, usedPrefix, command }) => {
    // Dynamic import fallback biar anti-error
    let upload;
    try {
        const mod = await import('../lib/uploadImage.js');
        upload = mod.default || mod;
    } catch (e) {
        const mod = await import('../lib/uploadFile.js');
        upload = mod.default || mod;
    }

    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''
    if (!/image\/(jpe?g|png)/.test(mime)) return m.reply(`Reply atau kirim gambar dengan command *${usedPrefix + command}* bre!`)

    m.reply('⏳ Loading lek...')

    try {
        let media = await q.download()
        let imageUrl = await upload(media)

        if (!imageUrl) throw 'Gagal upload gambar ke server.'

        let apiUrl = `https://api.skylow.web.id/api/editor/${command}?url=${encodeURIComponent(imageUrl)}`

        // Pake sendFile biar otomatis ngebaca URL as buffer
        await conn.sendFile(m.chat, apiUrl, `${command}.jpg`, `Nih cuy hasil *${command}* nya! 🔥`, m)

    } catch (e) {
        console.error(e)
        m.reply(`Error: ${e.message || e}`)
    }
}

handler.help = ['wanted', 'wasted']
handler.tags = ['editor']
handler.command = /^(wanted|wasted)$/i
handler.limit = true
handler.register = true

export default handler;