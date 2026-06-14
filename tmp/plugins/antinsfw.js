// © INF PROJECT - Erine-MD
// Developed by INF PROJECT

let handler = async (m, { conn, args, usedPrefix, command }) => {
    // 🔥 FIX JADIBOT: Panggil DB dinamis
    const DB = conn.db || global.db
    
    // Pastiin chat udah kedaftar di DB
    if (!DB.data.chats[m.chat]) DB.data.chats[m.chat] = {}
    let chat = DB.data.chats[m.chat]

    if (args[0] === 'on') {
        if (chat.antiNsfw) return m.reply('Sistem Anti-NSFW udah aktif daritadi cuy di grup ini. 🛡️')
        chat.antiNsfw = true
        m.reply('✅ *Anti-NSFW Berhasil Diaktifkan!*\n\nSetiap gambar/stiker yang berbau 18+ akan dihapus otomatis dan pelakunya akan diberi peringatan (Max 5x sebelum kick).')
    } else if (args[0] === 'off') {
        if (!chat.antiNsfw) return m.reply('Sistem Anti-NSFW emang udah mati cuy di grup ini. 🗿')
        chat.antiNsfw = false
        m.reply('❌ *Anti-NSFW Dinonaktifkan!*\n\nBot tidak akan lagi mendeteksi gambar/stiker 18+ di grup ini.')
    } else {
        m.reply(`*Format salah!*\n\nGunakan perintah:\n*${usedPrefix + command} on* (Untuk Menyalakan)\n*${usedPrefix + command} off* (Untuk Mematikan)\n\n_Status saat ini: ${chat.antiNsfw ? '🟢 Aktif' : '🔴 Mati'}_`)
    }
}

handler.help = ['antinsfw on/off']
handler.tags = ['admin', 'group']
handler.command = /^(antinsfw)$/i
handler.admin = true 
handler.group = true 

export default handler
