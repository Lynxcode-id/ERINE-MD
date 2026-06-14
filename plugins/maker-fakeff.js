let handler = async (m, { conn, text, usedPrefix, command }) => {
    let name = text || m.name || conn.getName(m.sender)
    
    // Validasi kalau nama lebih dari 15 karakter (limit FF)
    if (name.length > 15) return m.reply("❌ Nama maksimal 15 karakter cuy!")
    
    // Tampilkan reaksi loading
    await m.react('⏳')

    try {
        // Link API lu
        let url = `https://api.azbry.com/api/maker/fakeff?name=${encodeURIComponent(name)}`
        
        // Kirim pakai sendFile yang sudah di-wrapper di simple.js
        // Ini otomatis bakal nanganin buffer dari URL API
        await conn.sendFile(m.chat, url, 'fakeff.jpg', `*FF Maker:* ${name}`, m)
        
        await m.react('✅')
    } catch (e) {
        console.error(e)
        m.reply(`❌ Gagal generate gambar cuy: ${e.message}`)
        await m.react('❌')
    }
}

handler.help = ['fakeff <nama>']
handler.tags = ['maker']
handler.command = /^fakeff$/i
handler.limit = 5 

export default handler