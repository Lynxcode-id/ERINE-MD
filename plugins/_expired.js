export async function before(m, { conn }) {
    if (!m.isGroup)
        return false
        
    const DB = conn.db || global.db
    let chats = DB?.data?.chats[m.chat] || {}
    if (!chats.expired)
        return false 
        
    if (+new Date() > chats.expired) {
        await conn.reply(m.chat, 'Waktu sewa sudah habis, Bot akan keluar dari grup ini. Bye! 🖐', m)
        await conn.groupLeave(m.chat)
        chats.expired = null
    }

    return true
}