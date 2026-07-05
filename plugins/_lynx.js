export async function before(m, { conn }) {
    if (!global.db.data.settings) global.db.data.settings = { ownerWelcome: true }
    if (!global.db.data.settings.ownerWelcome) return false
    
    if (!m.isGroup || m.fromMe) return false

    const ownerNumber = '6288258041396@s.whatsapp.net'
    if (m.sender !== ownerNumber) return false

    let user = global.db.data.users[m.sender] || {}
    let now = +new Date()

    if (user.ownerWelcome && now - user.ownerWelcome < 3600000) return false

    user.ownerWelcome = now
    global.db.data.users[m.sender] = user

    let caption = `┌˚₊ ๑│ ᴏ ᴡ ɴ ᴇ ʀ  ᴀ ʀ ʀ ɪ ᴠ ᴇ ᴅ │๑˚₊ 👑\n` +
                  `┇ \n` +
                  `│ Halo Ownerku, @${ownerNumber.split('@')[0]}! 👋\n` +
                  `│ Sistem Erine-AI selalu siap melayani.\n` +
                  `┇ \n` +
                  `└˚₊ ๑ ────────────── ๑˚₊\n` +
                  `> © ERINE-AI`

    await conn.sendMessage(m.chat, {
        text: caption,
        mentions: [ownerNumber]
    }, { quoted: m })

    return true
}