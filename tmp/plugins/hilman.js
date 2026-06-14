// © INF PROJECT - Jemima-MD
// Fitur Auto Welcome Owner

export async function before(m, { conn }) {
    // Kalau pesannya bukan di grup atau dari bot sendiri, lewatin
    if (!m.isGroup) return false
    if (m.fromMe) return false

    // Nomor owner lu
    const ownerNumber = '6288258041396@s.whatsapp.net'
    
    // Kalau yang ngirim pesan bukan owner, lewatin aja
    if (m.sender !== ownerNumber) return false

    let user = global.db.data.users[m.sender] || {}
    let now = +new Date()

    // Cek cooldown 1 jam (3600000 ms) biar bot lu nggak spam sapaan owner terus
    if (user.ownerWelcome && now - user.ownerWelcome < 3600000) return false

    // Update waktu terakhir disapa
    user.ownerWelcome = now
    global.db.data.users[m.sender] = user

    // Kirim pesan sapaan
    await conn.sendMessage(m.chat, {
        text: `Hai ownerku. Erine di sini.\n@${ownerNumber.split('@')[0]}`,
        mentions: [ownerNumber]
    }, { quoted: m })

    // Wajib ada return true kalau hook berhasil jalan
    return true
}