import fs from 'fs'
import path from 'path'

const DB_FILE = path.join(process.cwd(), 'rpgdatabase.json')

// === SISTEM DATABASE ===
function clone(x) {
  return JSON.parse(JSON.stringify(x))
}

function rand(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function formatNum(n) {
  return new Intl.NumberFormat('id-ID').format(Math.floor(Number(n) || 0))
}

function now() {
  return Date.now()
}

function msToClock(ms) {
  const s = Math.floor(Math.max(0, ms) / 1000)
  const d = Math.floor(s / 86400)
  const h = Math.floor((s % 86400) / 3600)
  const m = Math.floor((s % 3600) / 60)
  return [d && `${d}h`, h && `${h}j`, m && `${m}m`].filter(Boolean).join(' ') || '0m'
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function loadDb() {
  try {
    if (!fs.existsSync(DB_FILE)) return null
    const raw = fs.readFileSync(DB_FILE, 'utf8')
    return JSON.parse(raw || '{}')
  } catch {
    return null
  }
}

function saveDb(db) {
  if (db) fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2))
}

// Injeksi data Isekai ke profil player
function ensureIsekaiData(db, jid) {
  if (!db.users[jid]) return false
  const u = db.users[jid]
  
  u.isekai = u.isekai || {
    isReincarnated: false,
    jobClass: 'Villager',
    mana: 0,
    companions: [], // Array of companion IDs
    raidTickets: 3,
    lastRefill: 0,
    demonKills: 0
  }
  
  return u
}

async function showList(conn, m, title, rows, footer = '') {
  const txt = [
    `╔═══【 🌌 ${title} 】═══`,
    ...rows.map(r => `╠ ✧ ${r}`),
    `╚══════════════════════`,
    footer ? `[✨] ${footer}` : ''
  ].filter(Boolean).join('\n')
  await conn.sendMessage(m.chat, { text: txt }, { quoted: m })
}

function replyText(conn, m, text) {
  return conn.sendMessage(m.chat, { text }, { quoted: m })
}

// Katalog Isekai Classes
const ISEKAI_CLASSES = {
  'saber': { name: 'Saber (Knight)', buff: 'ATK +30%, DEF +20%' },
  'caster': { name: 'Caster (Mage)', buff: 'Magic DMG, Efektif vs Armor' },
  'archer': { name: 'Archer (Ranger)', buff: 'LUCK +50, Akurasi Tinggi' },
  'assassin': { name: 'Assassin (Rogue)', buff: 'ATK +50%, HP -20%' },
  'healer': { name: 'Cleric (Healer)', buff: 'Auto-Regen HP tiap turn' }
}

// Gacha Companions (Hero Summoning)
const COMPANIONS = [
  { id: 'c1', name: 'Aqua (Goddess of Debt)', rarity: 'R', power: 50 },
  { id: 'c2', name: 'Megumin (Explosion Loli)', rarity: 'SR', power: 150 },
  { id: 'c3', name: 'Rem (Demon Maid)', rarity: 'SR', power: 200 },
  { id: 'c4', name: 'Emilia (Half-Elf)', rarity: 'SSR', power: 400 },
  { id: 'c5', name: 'Saber (King of Knights)', rarity: 'SSR', power: 500 },
  { id: 'c6', name: 'Gilgamesh (King of Heroes)', rarity: 'UR', power: 1000 },
  { id: 'c7', name: 'Rimuru (Demon Slime)', rarity: 'UR', power: 1200 }
]

function getCompanionGacha() {
  const roll = rand(1, 1000)
  if (roll <= 20) return COMPANIONS.filter(c => c.rarity === 'UR') // 2%
  if (roll <= 120) return COMPANIONS.filter(c => c.rarity === 'SSR') // 10%
  if (roll <= 420) return COMPANIONS.filter(c => c.rarity === 'SR') // 30%
  return COMPANIONS.filter(c => c.rarity === 'R') // 58%
}

// Demon Lord Generals (Easter Egg Project Names)
const DEMON_LORDS = [
  { id: 'takina', name: 'Slime Lord Takina', hp: 80000, atk: 2500, def: 800, rewardMana: 500 },
  { id: 'erine', name: 'Archmage Erine', hp: 150000, atk: 5000, def: 1200, rewardMana: 1200 },
  { id: 'hydro', name: 'Water Dragon Hydro-Trisha', hp: 350000, atk: 8000, def: 3500, rewardMana: 3000 },
  { id: 'jemima', name: 'Maou (Demon King) Jemima', hp: 1000000, atk: 15000, def: 8000, rewardMana: 10000 }
]

const handler = async (m, { conn, usedPrefix, command, text }) => {
  const db = loadDb()
  if (!db) return replyText(conn, m, '[ ⚠️ ] Database offline. Buat profil RPG utama dulu.')
  
  const u = ensureIsekaiData(db, m.sender)
  if (!u) return replyText(conn, m, '[ ⚠️ ] Profil tidak ditemukan. Ketik .profile dulu di RPG utama.')

  const args = String(text || '').trim().split(/\s+/).filter(Boolean)
  const sub = String(command || '').toLowerCase()

  // Refill Raid Tickets (Max 3, nambah tiap 2 jam)
  const lastRefill = u.isekai.lastRefill || now()
  const hrsPassed = Math.floor((now() - lastRefill) / (1000 * 60 * 60 * 2))
  if (hrsPassed > 0 && u.isekai.raidTickets < 3) {
    u.isekai.raidTickets = Math.min(3, u.isekai.raidTickets + hrsPassed)
    u.isekai.lastRefill = now()
    saveDb(db)
  }

  const menu = [
    `*▣ ANOTHER WORLD (ISEKAI) ▣*`,
    `Masuki dimensi fantasi dan kalahkan Raja Iblis!`,
    ``,
    `${usedPrefix}isekai portal`,
    `${usedPrefix}isekai class <nama_class>`,
    `${usedPrefix}grimoire`,
    `${usedPrefix}summon`,
    `${usedPrefix}maouraid`
  ]

  switch (sub) {
    case 'isekai': {
      const action = (args[0] || '').toLowerCase()

      if (!action || action === 'help') {
        await showList(conn, m, 'DIMENSIONAL RIFT', menu, 'Tinggalkan dunia nyata!')
        break
      }

      if (action === 'portal' || action === 'info') {
        if (!u.isekai.isReincarnated) {
           u.isekai.isReincarnated = true
           saveDb(db)
           return replyText(conn, m, `✨ *REINCARNATION SUCCESS!* ✨\nSebuah truk virtual menabrakmu... Kamu terbangun di padang rumput hijau.\nSelamat datang di dunia Isekai! Ketik ${usedPrefix}isekai class untuk memilih jalan ninjamu.`)
        }

        // Kalkulasi Power Party
        let partyPower = 0
        const partyNames = []
        for (const cid of u.isekai.companions) {
            const comp = COMPANIONS.find(c => c.id === cid)
            if (comp) {
               partyPower += comp.power
               partyNames.push(comp.name)
            }
        }

        await showList(conn, m, `ADVENTURER CARD: @${m.sender.split('@')[0]}`, [
          `⚔️ Job Class: ${u.isekai.jobClass}`,
          `🔮 Mana: ${formatNum(u.isekai.mana)}`,
          `🎫 Raid Tickets: ${u.isekai.raidTickets} / 3`,
          `💀 Maou Subjugated: ${u.isekai.demonKills}`,
          ``,
          `*=== PARTY MEMBERS ===*`,
          `👥 Companions: ${partyNames.length > 0 ? partyNames.join(', ') : 'Solo Player (Kesepian)'}`,
          `🌟 Party Bonus Power: +${formatNum(partyPower)}`
        ])
      } 
      
      else if (action === 'class') {
        const clsName = (args[1] || '').toLowerCase()
        if (!ISEKAI_CLASSES[clsName]) {
           const rows = Object.entries(ISEKAI_CLASSES).map(([k, v]) => `[ ${k} ] ${v.name} — ${v.buff}`)
           return showList(conn, m, 'JOB CLASS SELECTION', rows, `Pilih: ${usedPrefix}isekai class <nama>`)
        }

        u.isekai.jobClass = ISEKAI_CLASSES[clsName].name
        saveDb(db)
        await replyText(conn, m, `🔮 *CLASS CHANGED*\nKamu sekarang adalah seorang [ ${u.isekai.jobClass} ]!\nSkill set dan buff telah menyesuaikan dengan job barumu.`)
      }
      break
    }

    case 'grimoire':
    case 'explore_isekai': {
      if (!u.isekai.isReincarnated) return replyText(conn, m, `[ ⚠️ ] Kamu masih di dunia nyata. Masuk ke portal dulu: ${usedPrefix}isekai portal`)
      if (!canUseCooldown(u, 'grimoire')) return replyText(conn, m, `[ ⚠️ ] Mana kamu habis terkuras. Istirahat selama: ${msToClock(cdLeft(u, 'grimoire'))}`)
      if (u.energy < 15) return replyText(conn, m, '[ ⚠️ ] Energy manajer dari dunia nyata kurang untuk menjelajah.')
      
      u.energy -= 15
      const manaGained = rand(50, 150) + (u.luck * 2)
      
      u.isekai.mana += manaGained
      
      let bonusTxt = ''
      if (Math.random() < 0.15) {
         const goldGain = rand(10000, 30000)
         u.gold += goldGain
         bonusTxt = `\n💰 Kamu menemukan harta karun dunia fantasi! Mengonversinya menjadi +${formatNum(goldGain)} Gold.`
      }

      cooldown(u, 'grimoire', 20 * 60 * 1000) // 20 menit
      saveDb(db)
      
      await replyText(conn, m, `📖 *GRIMOIRE EXPLORATION*\nKamu membantai segerombolan Goblin di hutan!\n\n🔮 +${manaGained} Mana Points diperoleh.${bonusTxt}`)
      break
    }

    case 'summon':
    case 'gacha_hero': {
      if (!u.isekai.isReincarnated) return replyText(conn, m, `[ ⚠️ ] Kamu masih di dunia nyata. Masuk ke portal dulu: ${usedPrefix}isekai portal`)
      
      const costMana = 500
      if (u.isekai.mana < costMana) return replyText(conn, m, `[ ⚠️ ] Mana tidak cukup untuk memanggil pahlawan dari dimensi lain. Butuh 🔮 ${costMana} Mana.`)
      
      u.isekai.mana -= costMana
      
      const resultPool = getCompanionGacha()
      const summoned = pick(resultPool)
      
      // Cek duplikat
      if (u.isekai.companions.includes(summoned.id)) {
         // Convert duplikat jadi stat point
         u.atk += 10
         u.maxHp += 50
         u.hp = u.maxHp
         saveDb(db)
         return replyText(conn, m, `✨ *SUMMONING CIRCLE BERCAHAYA...* ✨\n\nSistem memanggil: [ ${summoned.name} ] (${summoned.rarity})\n\n[ ⚠️ ] Kamu sudah memiliki companion ini! Jiwanya diserap ke tubuhmu:\n⚔️ ATK +10\n❤️ Max HP +50`)
      }

      u.isekai.companions.push(summoned.id)
      saveDb(db)
      
      let rareTxt = summoned.rarity === 'UR' || summoned.rarity === 'SSR' ? '🌈 *LEGENDARY LIGHT SHINES!* 🌈\n' : '✨ *SUMMONING SUCCESS!* ✨\n'
      await replyText(conn, m, `${rareTxt}Kamu berhasil memanggil pahlawan dari dunia lain:\n\n👤 Nama: ${summoned.name}\n⭐ Rarity: ${summoned.rarity}\n⚔️ Party Power: +${summoned.power}`)
      break
    }

    case 'maouraid':
    case 'maou': {
      if (!u.isekai.isReincarnated) return replyText(conn, m, `[ ⚠️ ] Kamu masih di dunia nyata.`)
      
      const action = (args[0] || '').toLowerCase()
      if (!action || action === 'list') {
        const rows = DEMON_LORDS.map((d, i) => `[ ${i+1} ] 😈 ${d.name}\n    ↳ HP: ${formatNum(d.hp)} | ATK: ${formatNum(d.atk)}\n    ↳ Drop: 🔮 ${formatNum(d.rewardMana)} Mana`)
        return showList(conn, m, 'DEMON LORD CASTLE', rows, `Raid: ${usedPrefix}maouraid <nomor>`)
      }

      const bossIndex = Math.floor(Number(args[0])) - 1
      const boss = DEMON_LORDS[bossIndex]
      
      if (!boss) return replyText(conn, m, '[ ⚠️ ] Jendral Iblis tidak ditemukan. Cek .maouraid list')
      if (u.isekai.raidTickets < 1) return replyText(conn, m, '[ ⚠️ ] Tiket Raid habis! (Refill 1 tiket tiap 2 jam)')
      if (u.hp <= 100) return replyText(conn, m, '[ ⚠️ ] HP kamu terlalu rendah untuk melawan Jendral Iblis. Heal dulu di dunia nyata.')

      u.isekai.raidTickets -= 1
      
      // Kalkulasi Kekuatan Player + Party + Buff Class
      let partyPower = 0
      for (const cid of u.isekai.companions) {
          const comp = COMPANIONS.find(c => c.id === cid)
          if (comp) partyPower += comp.power
      }

      let pAtk = u.atk + (u.enchant?.weapon ? u.enchant.weapon * 5 : 0) + (u.ascension?.weapon ? u.ascension.weapon * 200 : 0) + partyPower
      let pDef = u.def + (u.enchant?.armor ? u.enchant.armor * 5 : 0) + (u.ascension?.armor ? u.ascension.armor * 200 : 0) + Math.floor(partyPower / 2)
      
      // Apply Isekai Class Buff
      if (u.isekai.jobClass.includes('Saber')) { pAtk = Math.floor(pAtk * 1.3); pDef = Math.floor(pDef * 1.2); }
      if (u.isekai.jobClass.includes('Assassin')) { pAtk = Math.floor(pAtk * 1.5); }
      
      let php = u.hp
      let bhp = boss.hp
      let turn = 0
      
      while (php > 0 && bhp > 0 && turn < 150) {
         bhp -= Math.max(1, pAtk - Math.floor(boss.def / 2) + rand(0, 100))
         if (bhp <= 0) break
         
         let damageTaken = Math.max(1, boss.atk - Math.floor(pDef / 2) + rand(0, 100))
         // Healer Buff
         if (u.isekai.jobClass.includes('Cleric')) damageTaken = Math.max(1, damageTaken - 100) 
         
         php -= damageTaken
         turn++
      }

      u.hp = Math.max(1, php) // Sisa HP simpan

      let txt = `🏰 *MAOU SUBJUGATION* 🏰\nParty-mu mendobrak gerbang kastil dan berhadapan dengan [ ${boss.name} ]!\n\n*Benturan sihir menghancurkan ruangan...*\n`

      if (php > 0) {
         // MENANG
         u.isekai.mana += boss.rewardMana
         u.isekai.demonKills += 1
         
         // Reward massive gold di dunia nyata
         const goldReward = boss.rewardMana * 50
         u.gold += goldReward
         
         txt += `\n🎉 *DEMON LORD FALLS!* 🎉\nSabetan terakhirmu mengakhiri teror [ ${boss.name} ]!\n\n🔮 Reward: +${formatNum(boss.rewardMana)} Mana\n💰 Bounty: +${formatNum(goldReward)} Gold (Dikirim ke dunia nyata)\n❤️ Sisa HP: ${formatNum(u.hp)}`
      } else {
         // KALAH
         txt += `\n💀 *PARTY WIPED OUT!* 💀\nKekuatan [ ${boss.name} ] terlalu besar. Party-mu rata dengan tanah.\n\nSihir kebangkitan mengembalikanmu ke kota, namun kamu sekarat (HP: 1).`
      }

      saveDb(db)
      await conn.sendMessage(m.chat, { text: txt, mentions: [m.sender] }, { quoted: m })
      break
    }

    default:
      break
  }
}

handler.help = ['isekai', 'grimoire', 'summon', 'maouraid']
handler.tags = ['rpg']
handler.command = /^(isekai|grimoire|explore_isekai|summon|gacha_hero|maouraid|maou)$/i
handler.limit = false
handler.register = false

export default handler
