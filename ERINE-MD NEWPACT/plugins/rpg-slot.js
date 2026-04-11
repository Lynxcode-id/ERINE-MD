// © INF PROJECT - Erine-MD
// Developed by INF PROJECT

import pkg from '@wishkeysocket/baileys'
const { generateWAMessageFromContent, proto } = pkg

let handler = async (m, { conn, text, command, args, usedPrefix }) => { 
    conn.slots = conn.slots ? conn.slots : {}
    
    if (m.chat in conn.slots) return m.reply('🎰 *Sabar!* Masih ada yang lagi main slot di sini. Tunggu bentar!')
    
    let user = global.db.data.users[m.sender]
    let bet = parseInt(args[0])
    
    if (isNaN(bet) || bet < 100) return m.reply(`🎰 *SLOT MACHINE*\n\nMinimal taruhan adalah *100* money.\nContoh: *${usedPrefix + command} 500*`)
    if (user.money < bet) return m.reply(`⚠️ Money kamu nggak cukup buat taruhan *${bet}*!`)

    conn.slots[m.chat] = true

    try {
        await m.react('🎰')
        user.money -= bet

        const emojis = ['🦁', '🐼', '🐷', '🐮', '🦊']
        let a = [pickRandom(emojis), pickRandom(emojis), pickRandom(emojis)]
        let b = [pickRandom(emojis), pickRandom(emojis), pickRandom(emojis)]
        let c = [pickRandom(emojis), pickRandom(emojis), pickRandom(emojis)]
        
        let win = false
        let jackpot = false
        let nominal = 0
        let status = ''

        if (b[0] === b[1] && b[1] === b[2]) {
            win = true
            jackpot = true
            nominal = bet * 5
            status = 'JACKPOT BESAR! 🥳'
        } else if (b[0] === b[1] || b[1] === b[2] || b[0] === b[2]) {
            win = true
            nominal = Math.floor(bet * 1.5)
            status = 'MENANG! 🤓'
        } else {
            status = 'KALAH 🤡'
        }

        if (win) user.money += nominal

        let slotResult = `
乂  *S L O T  M A C H I N E*

     ${a[0]} | ${a[1]} | ${a[2]}
  >  ${b[0]} | ${b[1]} | ${b[2]}  <
     ${c[0]} | ${c[1]} | ${c[2]}

*${status}*
${win ? `💰 +${nominal.toLocaleString()} Money` : `💸 -${bet.toLocaleString()} Money`}

_Saldo Sekarang: ${(user.money).toLocaleString()}_
`.trim()

        await conn.reply(m.chat, slotResult, m)
        if (win) await m.react('💰')
        else await m.react('💀')

    } catch (e) {
        console.error(e)
        m.reply('❌ Terjadi kesalahan pada sistem slot.')
    } finally {
        delete conn.slots[m.chat]
    }
}

handler.help = ['slot <jumlah>']
handler.tags = ['rpg']
handler.command = /^(slot|jac?kpot)$/i

export default handler

function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)]
}
