import fetch from 'node-fetch'

let handler = async (m, { conn, usedPrefix, command }) => {
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
    if (!/image\/(jpe?g|png)/.test(mime)) return m.reply(`Reply atau kirim gambar dengan command ${usedPrefix + command}`)

    m.reply('⏳ Loading...')

    try {
        let media = await q.download()
        let imageUrl = await upload(media)

        if (!imageUrl) throw 'Gagal upload gambar ke server.'

        let apiUrl = `https://api-faa.my.id/faa/hdv4?image=${encodeURIComponent(imageUrl)}`

        let response = await fetch(apiUrl)
        if (!response.ok) throw 'Gagal menghubungi API'
        let json = await response.json()

        if (!json.status || !json.result || !json.result.image_upscaled) throw 'Gagal memproses gambar di API'

        await conn.sendFile(m.chat, json.result.image_upscaled, 'hdv4.jpg', 'Done 🔥', m)

    } catch (e) {
        console.error(e)
        m.reply(`Error: ${e.message || e}`)
    }
}

handler.help = ['aihdv4']
handler.tags = ['tools']
handler.command = /^(aihdv4)$/i
handler.limit = true
handler.register = true

export default handler;