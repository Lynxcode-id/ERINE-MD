/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx Decode (INF Project)
 * 📞 WhatsApp  : +62 882-5804-1396
 * 📢 Channel   : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * ⚠️ Note      : Keep credit to respect the creator!
 * ─────────────────────────
 * 📝 Plugin: Cek Akal
 * 📦 Module/Package : None
 */

let handler = async (m, { conn, usedPrefix, command }) => {
    let akal = Math.floor(Math.random() * 101)
    let status = akal >= 80 ? 'Jenius 🧠' : 
                 akal >= 50 ? 'Berakal ✅' : 
                 akal >= 20 ? 'Sedang-sedang saja ⚖️' : 
                 'Gak ada akal 🤡'

    let caption = `┌˚₊ ๑│ ᴄ ᴇ ᴋ  ᴀ ᴋ ᴀ ʟ │๑˚₊ 💭\n` +
                  `┇ \n` +
                  `│ 👤 *User:* @${m.sender.split('@')[0]}\n` +
                  `│ 📊 *Level Akal:* ${akal}%\n` +
                  `│ 📝 *Status:* ${status}\n` +
                  `┇ \n` +
                  `└˚₊ ๑ ────────────── ๑˚₊\n` +
                  `> © ERINE-AI`

    await conn.sendMessage(m.chat, { 
        text: caption, 
        mentions: [m.sender] 
    }, { quoted: m })
}

handler.help = ['cekakal']
handler.tags = ['fun']
handler.command = /^cekakal$/i

export default handler