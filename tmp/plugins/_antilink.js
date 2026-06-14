const linkRegex = /chat.whatsapp.com\/(?:invite\/)?([0-9A-Za-z]{20,24})/i

export async function before(m, {conn, isAdmin, isBotAdmin }) {
    if (m.isBaileys && m.fromMe)
        return !0
    if (!m.isGroup) return !1
    
    // 🔥 FIX 1: Deteksi otomatis DB Bot Utama atau DB Jadibot
    const DB = this.db || global.db
    
    // 🔥 FIX 2: Kasih fallback {} biar kebal dari error undefined 'antiLink'
    let chat = DB.data.chats[m.chat] || {}
    let bot = DB.data.settings[this.user.jid] || {}
    
    const isGroupLink = linkRegex.exec(m.text)

    if (chat.antiLink && isGroupLink && !isAdmin) {
        if (isBotAdmin) {
            const linkThisGroup = `https://chat.whatsapp.com/${await this.groupInviteCode(m.chat)}`
            if (m.text.includes(linkThisGroup)) return !0
        }
        await conn.reply(m.chat, `*≡ Tautan terdeteksi*
            
Kami tidak mengizinkan link dari grup lain 
Maaf  ${isBotAdmin ? '' : '\n\nSaya bukan admin jadi saya tidak bisa menghapus pesan'}`, null, { mentions: [m.sender] } )
        if (isBotAdmin && chat.antiLink) {
        	await conn.sendMessage(m.chat, { delete: m.key })
        } else if (!chat.antiLink) return //m.reply('')
    }
    return !0
}
