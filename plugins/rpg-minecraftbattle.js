// © INF PROJECT - Erine-MD
// Developed by INF PROJECT

import pkg from '@wishkeysocket/baileys'
// Walaupun MessageType sudah mulai deprecated di versi baru, gue tetep include sesuai struktur lu
const { MessageType } = pkg 

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)]
}

let handler = async (m, { conn }) => {
  try {
    // Inisialisasi database global (pastiin global.db.data sudah ada di main file lu)
    global.db.data = global.db.data || {}
    global.db.data.users = global.db.data.users || {}
    
    // Inisialisasi data monsters & items jika belum ada
    if (!global.db.data.monsters) {
        global.db.data.monsters = [
            'Zombi', 'Creeper', 'Skeleton', 'Enderman',
            'Spider', 'Ghast', 'Blaze', 'Witch'
        ]
    }
    
    if (!global.db.data.items) {
        global.db.data.items = [
            'Kayu', 'Batu', 'Besi', 'Emas',
            'Diamond', 'Netherite', 'Emerald', 'Redstone'
        ]
    }

    let user = global.db.data.users[m.sender]
    if (!user) global.db.data.users[m.sender] = {}
    user = global.db.data.users[m.sender] // Re-assign biar dapet object-nya

    // Inisialisasi properti user RPG
    user.health = user.health ?? 100
    user.maxHealth = user.maxHealth ?? 100
    user.exp = user.exp ?? 0
    user.money = user.money ?? 0
    if (!Array.isArray(user.items)) user.items = []

    if (user.health <= 0) {
        return conn.reply(m.chat, '😓 *Health Kosong!* \nAnda tidak memiliki nyawa. Pulihkan dulu dengan item atau tunggu regen sebelum bertarung.', m)
    }

    const selectedMonster = pickRandom(global.db.data.monsters)
    let monsterHealth = 50
    let monsterAttack = 10
    let round = 1
    let battleLog = `🗡️ *MINECRAFT BATTLE*\n\n`
    battleLog += `👤 *Pemain:* @${m.sender.split('@')[0]}\n`
    battleLog += `👻 *Musuh:* ${selectedMonster}\n`
    battleLog += `───\n`

    await m.react('⚔️')

    // Pertarungan
    while (user.health > 0 && monsterHealth > 0 && round <= 10) {
      let userAttack = Math.floor(Math.random() * 20) + 5
      monsterHealth -= userAttack

      let damageToUser = Math.floor(Math.random() * monsterAttack) + 2
      user.health -= damageToUser

      battleLog += `*Round ${round}* ──\n`
      battleLog += `💥 Hit: -${userAttack} HP Musuh\n`
      battleLog += `🩹 Luka: -${damageToUser} HP Anda\n\n`

      if (monsterHealth <= 0) {
        let expReward = Math.floor(Math.random() * 100) + 50
        let moneyReward = Math.floor(Math.random() * 50) + 10
        user.exp += expReward
        user.money += moneyReward
        battleLog += `🎉 *VICTORY!*\n💰 +${moneyReward} Money\n🌟 +${expReward} Exp\n`
        break
      }

      if (user.health <= 0) {
        user.health = 0 // Biar nggak minus
        battleLog += `😵 *DEFEAT!*\nKamu tewas di tangan ${selectedMonster}. Pulihkan kesehatanmu dulu.\n`
        break
      }

      round++
    }

    if (round > 10 && monsterHealth > 0 && user.health > 0) {
      battleLog += `⚠️ *DRAW!* \nPertarungan terlalu lama dan musuh melarikan diri...\n`
    }

    battleLog += `\n❤️ *Sisa HP:* ${user.health}/${user.maxHealth}`

    conn.reply(m.chat, battleLog, m, { mentions: [m.sender] })

  } catch (e) {
    console.error(e)
    conn.reply(m.chat, '❌ *Error:* Sistem battle lagi nge-bug, kayaknya Creeper-nya meledak di server.', m)
  }
}

handler.help = ['minecraftbattle']
handler.tags = ['rpg']
handler.command = /^minecraftbattle$/i
handler.group = true

export default handler
