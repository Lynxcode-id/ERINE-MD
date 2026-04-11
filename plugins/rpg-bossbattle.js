// © INF PROJECT - Erine-MD
// Developed by INF PROJECT

import pkg from '@wishkeysocket/baileys'
const { generateWAMessageFromContent, proto } = pkg

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)]
}

let handler = async (m, { conn, usedPrefix, command }) => {
  try {
    // Inisialisasi monster jika belum ada
    global.db.data.monsters = global.db.data.monsters || ['Wither', 'Ender Dragon', 'Warden', 'Giant']

    let user = global.db.data.users[m.sender]
    if (!user) user = global.db.data.users[m.sender] = {}

    // Default stats (Anti-Crash)
    user.health = user.health ?? 100
    user.maxHealth = user.maxHealth ?? 100
    user.exp = user.exp ?? 0
    user.money = user.money ?? 0

    if (user.health <= 0) {
      return conn.reply(m.chat, `😓 *Health Kosong!* \nNyawa lu abis, Bang. Pake *${usedPrefix}heal* dulu sebelum lawan Boss!`, m)
    }

    await m.react('⏳')

    const boss = pickRandom(global.db.data.monsters)
    let bossHealth = 150
    let bossAttack = 20
    let round = 1
    
    let battleLog = `乂  *B O S S  B A T T L E*\n\n`
    battleLog += `👤 *Player:* @${m.sender.split('@')[0]}\n`
    battleLog += `👹 *Boss:* ${boss}\n`
    battleLog += `───\n\n`

    await m.react('⚔️')

    // Logic Pertarungan
    while (user.health > 0 && bossHealth > 0 && round <= 15) {
      let userAttack = Math.floor(Math.random() * 30) + 15
      bossHealth -= userAttack

      let damageToUser = Math.floor(Math.random() * bossAttack) + 5
      user.health -= damageToUser

      battleLog += `*Round ${round}* ──\n`
      battleLog += `💥 Hit: -${userAttack} HP Boss\n`
      battleLog += `🩹 Luka: -${damageToUser} HP Anda\n\n`

      if (bossHealth <= 0) {
        let expReward = Math.floor(Math.random() * 200) + 100
        let moneyReward = Math.floor(Math.random() * 100) + 50
        user.exp += expReward
        user.money += moneyReward

        battleLog += `🏆 *VICTORY!*\n`
        battleLog += `🌟 +${expReward} Exp\n`
        battleLog += `💰 +${moneyReward} Money\n`
        await m.react('🏆')
        break
      }

      if (user.health <= 0) {
        user.health = 0
        battleLog += `💀 *DEFEAT!*\nLoe tewas dihajar ${boss}. Pake heal dulu sana...`
        await m.react('💀')
        break
      }

      round++
    }

    if (round > 15 && bossHealth > 0 && user.health > 0) {
      battleLog += `⚠️ *DRAW!* \nPertarungan terlalu alot, Boss kabur masuk portal...`
      await m.react('🏃')
    }

    battleLog += `\n\n❤️ *Sisa HP:* ${user.health}/${user.maxHealth}`

    conn.reply(m.chat, battleLog, m, { mentions: [m.sender] })

  } catch (e) {
    console.error(e)
    await m.react('❌')
    conn.reply(m.chat, '❌ *Error:* Boss-nya nge-glitch, gagal bertarung.', m)
  }
}

handler.help = ['bossbattle']
handler.tags = ['rpg']
handler.command = /^(bossbattle|boss)$/i
handler.group = true

export default handler
