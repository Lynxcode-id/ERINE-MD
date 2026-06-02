/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx
 * ─────────────────────────
 * 📝 Plugin: Game Suit (Gunting, Batu, Kertas)
 */

let handler = async (m, { conn, text, usedPrefix, command }) => {
    let wrongFormat = `⚠️ *Format Salah Cuk!*\n\nPilih salah satu:\n*${usedPrefix + command} gunting*\n*${usedPrefix + command} batu*\n*${usedPrefix + command} kertas*`
    
    if (!text) return m.reply(wrongFormat)
    
    let pilihanUser = text.toLowerCase().trim()
    let pilihanValid = ['gunting', 'batu', 'kertas']
    
    if (!pilihanValid.includes(pilihanUser)) return m.reply(wrongFormat)
    
    let pilihanBot = pilihanValid[Math.floor(Math.random() * pilihanValid.length)]
    
    let hasil = ''
    if (pilihanUser === pilihanBot) {
        hasil = 'S E R I 🗿'
    } else if (
        (pilihanUser === 'batu' && pilihanBot === 'gunting') ||
        (pilihanUser === 'gunting' && pilihanBot === 'kertas') ||
        (pilihanUser === 'kertas' && pilihanBot === 'batu')
    ) {
        hasil = 'M E N A N G 🎉'
    } else {
        hasil = 'K A L A H 💀'
    }

    let emojiBot = pilihanBot === 'batu' ? '✊' : pilihanBot === 'gunting' ? '✌️' : '🖐️'
    let emojiUser = pilihanUser === 'batu' ? '✊' : pilihanUser === 'gunting' ? '✌️' : '🖐️'

    let caption = `🎮 *S U I T   G A M E* 🎮\n\n`
    caption += `👤 *Lu:* ${pilihanUser.toUpperCase()} ${emojiUser}\n`
    caption += `🤖 *Bot:* ${pilihanBot.toUpperCase()} ${emojiBot}\n\n`
    caption += `*Hasil:* ${hasil}\n\n`
    caption += `> © INF PROJECT`

    await m.react(emojiUser)
    await conn.sendMessage(m.chat, { text: caption }, { quoted: m })
}

handler.help = ['suit <gunting/batu/kertas>']
handler.tags = ['game']
handler.command = /^(suit|suwit)$/i
handler.limit = true

export default handler