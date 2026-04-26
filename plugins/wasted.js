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

        let apiKey = '3aXI6'
        let apiUrl = `https://api.theresav.biz.id/maker/wasted?image_url=${encodeURIComponent(imageUrl)}&apikey=${apiKey}`

        let response = await fetch(apiUrl)
        if (!response.ok) throw 'Gagal menghubungi API'
        let json = await response.json()

        if (!json.status) throw 'Gagal memproses gambar'

        await conn.sendFile(m.chat, json.result.url, 'wasted.webp', 'Done 🔥', m)

    } catch (e) {
        console.error(e)
        m.reply(`Error: ${e.message || e}`)
    }
}

handler.help = ['wasted']
handler.tags = ['maker']
handler.command = /^(wasted)$/i
handler.limit = false 
handler.register = false

export default handler;