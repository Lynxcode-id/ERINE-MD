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

        let apiUrl = `https://api-faa.my.id/faa/hdv3?image=${encodeURIComponent(imageUrl)}`

        await conn.sendFile(m.chat, apiUrl, 'hd.jpg', 'Done 🔥', m)

    } catch (e) {
        console.error(e)
        m.reply(`Error memproses gambar. Kemungkinan API sedang gangguan.`)
    }
}

handler.help = ['hdv3']
handler.tags = ['maker']
handler.command = /^(hdv3)$/i
handler.limit = false 
handler.register = false

export default handler;