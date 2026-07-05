let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!global.db.data.settings) global.db.data.settings = { ownerWelcome: true }
    
    let isEnable = /true|enable|on|aktif/i.test(text)
    
    if (!text) {
        return m.reply(`*Status saat ini:* ${global.db.data.settings.ownerWelcome ? '✅ Aktif' : '❌ Mati'}\n\n*Format:*\n${usedPrefix + command} on / off`)
    }
    
    global.db.data.settings.ownerWelcome = isEnable
    m.reply(`Fitur Owner Welcome berhasil ${isEnable ? 'diaktifkan' : 'dimatikan'}!`)
}

handler.help = ['ownerwelcome <on/off>']
handler.tags = ['owner']
handler.command = /^(ownerwelcome)$/i
handler.owner = true

export default handler