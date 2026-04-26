let handler = async (m, { conn, text, usedPrefix, command }) => {
    let upload;
    try {
        const mod = await import('../lib/uploadImage.js');
        upload = mod.default || mod;
    } catch (e) {
        const mod = await import('../lib/uploadFile.js');
        upload = mod.default || mod;
    }

    let [name, members, desc, author, date] = text.split('|')
    
    if (!name || !members || !desc || !author || !date) {
        return m.reply(`*Format salah!*\n\n*Contoh:*\n${usedPrefix + command} Inf project's | 1.980 | Hello world | Lynxdecode_jir | 07-5-22`)
    }

    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''
    if (!/image\/(jpe?g|png)/.test(mime)) return m.reply(`Reply atau kirim gambar dengan command ${usedPrefix + command}`)

    m.reply('⏳ Loading...')

    try {
        let media = await q.download()
        let imageUrl = await upload(media)
        
        name = name.trim()
        members = members.trim()
        desc = desc.trim()
        author = author.trim()
        date = date.trim()

        let apiUrl = `https://api.zenzxz.my.id/maker/fakegroupv2?url=${encodeURIComponent(imageUrl)}&name=${encodeURIComponent(name)}&members=${encodeURIComponent(members)}&desc=${encodeURIComponent(desc)}&author=${encodeURIComponent(author)}&date=${encodeURIComponent(date)}`

        await conn.sendFile(m.chat, apiUrl, 'fakegroup.jpg', 'Done 🔥', m)

    } catch (e) {
        console.error(e)
        m.reply('Error memproses gambar.')
    }
}

handler.help = ['fakegroup', 'fg'].map(v => v + ' <name | members | desc | author | date>')
handler.tags = ['maker']
handler.command = /^(fakegroup|fg)$/i
handler.limit = false 
handler.register = false

export default handler;