import fetch from 'node-fetch'

let handler = async (m, { conn, command }) => {
    try {
        let who
        // 🔥 FIX 1: Tambahin m.quoted? biar ga crash kalau user lupa reply
        if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : (m.quoted ? m.quoted.sender : m.sender)
        else who = m.quoted ? m.quoted.sender : m.sender
        
        let pp = await conn.profilePictureUrl(who, 'image').catch((_) => "https://telegra.ph/file/24fa902ead26340f3df2c.png")
        
        // 🔥 FIX 2: Ganti .buffer() jadi arrayBuffer() biar ga ada warning di panel
        let thumb = Buffer.from(await (await fetch(pp)).arrayBuffer())
        
        conn.sendFile(m.chat, pp, "nih bang.png", 'Selesai....', m, { jpegThumbnail: thumb })
    } catch {
        let sender = m.sender
        let pp = await conn.profilePictureUrl(sender, 'image').catch((_) => "https://telegra.ph/file/24fa902ead26340f3df2c.png")
        
        // 🔥 FIX 3: Sama kayak di atas, benerin buffernya
        let thumb = Buffer.from(await (await fetch(pp)).arrayBuffer())
        
        conn.sendFile(m.chat, pp, 'ppsad.png', "Selesai....", m, { jpegThumbnail: thumb })
    }
}
handler.help = ['getpp <@tag/reply>']
handler.tags = ['group']
handler.command = /^(getpp)$/i

export default handler
