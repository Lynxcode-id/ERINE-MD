export async function before(m, { conn }) {
    if (!m.isGroup)
        return false // Return false kalau bukan grup, biar lanjut ke proses lain
        
    // 🔥 FIX 1: Deteksi otomatis pakai DB bot utama atau DB Jadibot
    // Pake conn dari parameter, jangan this
    const DB = conn.db || global.db
    
    // 🔥 FIX 2: Kasih fallback objek kosong {} biar kebal dari error undefined
    let chats = DB?.data?.chats[m.chat] || {}
    
    // Kalau nggak ada settingan expired di chat ini, yaudah lewatin aja
    if (!chats.expired)
        return false 
        
    // Kalau waktu sekarang udah ngelewatin batas expired
    if (+new Date() > chats.expired) {
        await conn.reply(m.chat, 'Waktu sewa sudah habis, Bot akan keluar dari grup ini. Bye! 🖐', m)
        await conn.groupLeave(m.chat)
        chats.expired = null
    }

    return true // Return true kalau proses hook berjalan
}