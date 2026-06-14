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

// Injeksi data Divinity ke profil player
function ensureGodData(db, jid) {
  if (!db.users[jid]) return false
  const u = db.users[jid]
  
  u.divinity = u.divinity || {
    isGod: false,
    godName: 'Unnamed Deity',
    domain: 'None', // Element: Fire, Shadow, Cyber, etc.
    faith: 0,
    believers: 0,
    temples: {}, // Biome: Level
    lastFaithClaim: 0,
    miraclesUnlocked: []
  }
  
  return u
}

async function showList(conn, m, title, rows, footer = '') {
  const txt = [
    `╔═══『 🔱 ${title} 』═══`,
    ...rows.map(r => `╠ ✧ ${r}`),
    `╚══════════════════════`,
    footer ? `[⚡] ${footer}` : ''
  ].filter(Boolean).join('\n')
  await conn.sendMessage(m.chat, { text: txt }, { quoted: m })
}

function replyText(conn, m, text) {
  return conn.sendMessage(m.chat, { text }, { quoted: m })
}

// Daftar Domain Dewa
const GOD_DOMAINS = {
  'cyber': { name: 'Deity of Binary', buff: 'Bonus Hacking & Passive Gold' },
  'war': { name: 'God of Carnage', buff: 'Massive ATK Boost' },
  'void': { name: 'Eldritch Sovereign', buff: 'Bonus Abyss Floor & Dark Matter' },
  'wealth': { name: 'Golden Emperor', buff: 'Casino & Market Luck Boost' },
  'nature': { name: 'World Tree Guardian', buff: 'Farm & Pet Yield Boost' }
}

// Mukjizat (Miracles)
const MIRACLES = {
  'bless': { name: 'Divine Blessing', cost: 500, desc: 'Heal Full & Reset All Cooldowns player lain/diri sendiri.' },
  'wrath': { name: 'Heavenly Wrath', cost: 1000, desc: 'Kurangi HP Target jadi 1 & Curi 10% Gold mereka.' },
  'abundance': { name: 'Rain of Manna', cost: 2000, desc: 'Beri 50.000 Gold ke SELURUH orang di grup.' }
}

const handler = async (m, { conn, usedPrefix, command, text }) => {
  const db = loadDb()
  if (!db) return replyText(conn, m, '[ ⚠️ ] Database offline.')
  
  const u = ensureGodData(db, m.sender)
  if (!u) return replyText(conn, m, '[ ⚠️ ] Profil tidak ditemukan. Ketik .profile dulu.')

  const args = String(text || '').trim().split(/\s+/).filter(Boolean)
  const sub = String(command || '').toLowerCase()

  const menu = [
    `*▣ DIVINE DIVINITY SYSTEM ▣*`,
    `Tinggalkan kemanusiaan, jadilah penguasa iman!`,
    ``,
    `${usedPrefix}god info`,
    `${usedPrefix}god ascend <domain_id>`,
    `${usedPrefix}god rename <nama_dewa>`,
    `${usedPrefix}temple build <biome>`,
    `${usedPrefix}faith claim`,
    `${usedPrefix}miracle <id> <@user/all>`,
    `${usedPrefix}divinewar @user`
  ]

  switch (sub) {
    case 'god':
    case 'divine': {
      const action = (args[0] || '').toLowerCase()

      if (!action || action === 'help') {
        await showList(conn, m, 'HEAVENLY GATE', menu, 'Faith is Power.')
        break
      }

      if (action === 'info') {
        if (!u.divinity.isGod) return replyText(conn, m, `[ ⚠️ ] Kamu masih makhluk fana. Lakukan .god ascend untuk naik kasta.`)

        const domain = GOD_DOMAINS[u.divinity.domain]
        const totalTemples = Object.keys(u.divinity.temples).length

        await showList(conn, m, `DEITY: ${u.divinity.godName}`, [
          `🌌 Domain: ${domain.name}`,
          `🙏 Faith Points: ${formatNum(u.divinity.faith)}`,
          `👥 Believers: ${formatNum(u.divinity.believers)} NPCs`,
          `🏛️ Total Kuil: ${totalTemples}`,
          ``,
          `*=== DIVINE BUFF ===*`,
          `✨ ${domain.buff}`
        ])
      } 
      
      else if (action === 'ascend') {
        if (u.divinity.isGod) return replyText(conn, m, '[ ⚠️ ] Kamu sudah menjadi Dewa.')
        
        const domainId = (args[1] || '').toLowerCase()
        if (!GOD_DOMAINS[domainId]) {
           const rows = Object.entries(GOD_DOMAINS).map(([id, d]) => `[ ${id} ] ${d.name}\n    ↳ Buff: ${d.buff}`)
           return showList(conn, m, 'SELECT YOUR DOMAIN', rows, `Ketik: ${usedPrefix}god ascend <id>`)
        }

        // Syarat Berat: Harus lv 70+ dan punya 50 Cyber Core
        if (u.level < 70 || (u.items['cybercore'] || 0) < 50) {
           return replyText(conn, m, `[ ⚠️ ] Syarat Ascension tidak terpenuhi!\nButuh: Level 70 & 💠 50 Cyber Core.`)
        }

        u.items['cybercore'] -= 50
        u.divinity.isGod = true
        u.divinity.domain = domainId
        u.divinity.believers = 100 // Pengikut awal
        u.title = `Deity of ${domainId}`
        
        saveDb(db)
        await replyText(conn, m, `🌟 *DIVINE ASCENSION SUCCESS* 🌟\nKesadaranmu menyatu dengan alam semesta...\nSelamat tinggal dunia fana, selamat datang [ ${u.divinity.godName} ]!\nKetik .god info untuk melihat kekuatan barumu.`)
      }

      else if (action === 'rename') {
        if (!u.divinity.isGod) return replyText(conn, m, '[ ⚠️ ] Ascend dulu bos.')
        const newName = args.slice(1).join(' ')
        if (!newName) return replyText(conn, m, `[ ⚠️ ] Format: ${usedPrefix}god rename <nama_baru>`)
        
        u.divinity.godName = newName.slice(0, 20)
        saveDb(db)
        await replyText(conn, m, `✅ Nama Dewa diperbarui menjadi: *${u.divinity.godName}*`)
      }
      break
    }

    case 'temple':
    case 'kuil': {
      if (!u.divinity.isGod) return replyText(conn, m, '[ ⚠️ ] Hanya Dewa yang bisa membangun kuil.')
      const action = (args[0] || '').toLowerCase()

      if (action === 'build' || action === 'bangun') {
        const biome = (args[1] || '').toLowerCase()
        const biomes = ['forest', 'river', 'cave', 'desert', 'snow', 'swamp', 'ruins', 'volcano', 'sky', 'void', 'cyber']
        
        if (!biomes.includes(biome)) return replyText(conn, m, `[ ⚠️ ] Pilih biome yang valid: ${biomes.join(', ')}`)
        if (u.divinity.temples[biome]) return replyText(conn, m, `[ ⚠️ ] Kamu sudah punya kuil di ${biome}.`)

        const costGold = 2000000
        const costStardust = 5000
        
        if (u.gold < costGold || (u.space && u.space.stardust < costStardust)) {
           return replyText(conn, m, `[ ⚠️ ] Modal membangun Kuil kurang!\nButuh: 💰 2 Juta Gold & ✨ 5,000 Stardust (Luar Angkasa).`)
        }

        u.gold -= costGold
        if (u.space) u.space.stardust -= costStardust
        u.divinity.temples[biome] = 1
        
        saveDb(db)
        await replyText(conn, m, `🏛️ *TEMPLE CONSTRUCTED*\nSebuah Kuil megah telah dibangun di ${biome.toUpperCase()}.\nPenduduk lokal mulai berdatangan untuk menyembahmu!`)
      }
      break
    }

    case 'faith': {
      if (!u.divinity.isGod) return replyText(conn, m, '[ ⚠️ ] Makhluk fana tidak punya Faith.')
      
      const last = u.divinity.lastFaithClaim || 0
      const diffHrs = (now() - last) / (1000 * 60 * 60)
      
      if (diffHrs < 1) return replyText(conn, m, `[ ⚠️ ] Doa umat belum terkumpul. Tunggu: ${Math.floor(60 - (diffHrs * 60))} menit.`)
      
      // Faith Generator: (Kuil * Believers * Jam)
      const templeCount = Object.keys(u.divinity.temples).length
      if (templeCount === 0) return replyText(conn, m, '[ ⚠️ ] Kamu tidak punya kuil. Tidak ada tempat bagi umat untuk berdoa!')

      const capHrs = Math.min(diffHrs, 24)
      const faithGain = Math.floor(templeCount * u.divinity.believers * 0.5 * capHrs)
      const newBelievers = rand(10, 50) * templeCount
      
      u.divinity.faith += faithGain
      u.divinity.believers += newBelievers
      u.divinity.lastFaithClaim = now()
      
      saveDb(db)
      await replyText(conn, m, `🙏 *DIVINE HARVEST* 🙏\nUmatmu telah mempersembahkan doa:\n\n✨ +${formatNum(faithGain)} Faith Points\n👥 +${formatNum(newBelievers)} Believers Baru (Total: ${formatNum(u.divinity.believers)})`)
      break
    }

    case 'miracle':
    case 'mukjizat': {
      if (!u.divinity.isGod) return replyText(conn, m, '[ ⚠️ ] Kamu butuh status Dewa untuk melakukan Mukjizat.')
      
      const miracleId = (args[0] || '').toLowerCase()
      const miracle = MIRACLES[miracleId]
      
      if (!miracle) {
         const rows = Object.entries(MIRACLES).map(([id, m]) => `[ ${id} ] ${m.name}\n    ↳ Biaya: ✨ ${formatNum(m.cost)} Faith\n    ↳ Efek: ${m.desc}`)
         return showList(conn, m, 'DIVINE MIRACLES', rows, `Ketik: ${usedPrefix}miracle <id> <@user/all>`)
      }

      if (u.divinity.faith < miracle.cost) return replyText(conn, m, `[ ⚠️ ] Faith Points tidak cukup untuk melakukan mukjizat ini.`)

      u.divinity.faith -= miracle.cost

      if (miracleId === 'bless') {
        const target = m.mentionedJid?.[0] || m.sender
        const targetUser = db.users[target]
        if (!targetUser) return replyText(conn, m, '[ ⚠️ ] User tidak valid.')
        
        targetUser.hp = targetUser.maxHp || 100
        targetUser.energy = 100
        targetUser.cooldowns = {} // Reset all cooldowns!
        
        saveDb(db)
        await replyText(conn, m, `✨ *MIRACLE: DIVINE BLESSING*\nDewa [ ${u.divinity.godName} ] memberkati @${target.split('@')[0]}!\nSemua luka sembuh dan semua kelelahan (cooldown) hilang!`, { mentions: [target] })
      } 
      
      else if (miracleId === 'wrath') {
        const target = m.mentionedJid?.[0]
        if (!target) return replyText(conn, m, '[ ⚠️ ] Tag siapa yang mau dikutuk dewa?')
        if (target === m.sender) return replyText(conn, m, '[ ⚠️ ] Masa ngutuk diri sendiri?')
        
        const targetUser = db.users[target]
        const steal = Math.floor((targetUser.gold || 0) * 0.1)
        
        targetUser.hp = 1
        targetUser.gold -= steal
        u.gold += steal
        
        saveDb(db)
        await replyText(conn, m, `⚡ *MIRACLE: HEAVENLY WRATH*\nLangit terbelah! Petir menghujam @${target.split('@')[0]}!\nTarget sekarat dan kehilangan 10% Gold (💰 ${formatNum(steal)}) yang dipersembahkan kepadamu!`, { mentions: [target] })
      }

      else if (miracleId === 'abundance') {
        const totalPeople = Object.keys(db.users).length
        const totalGold = 50000 * totalPeople
        
        // Simulasi kasih gold ke semua orang yang pernah main
        for (let jid in db.users) {
           db.users[jid].gold += 50000
        }
        
        saveDb(db)
        await replyText(conn, m, `🌧️ *MIRACLE: RAIN OF MANNA*\nDewa [ ${u.divinity.godName} ] sedang bermurah hati!\nHujan emas turun ke seluruh penjuru grup! Semua orang mendapatkan +50,000 Gold!`)
      }
      break
    }

    case 'divinewar':
    case 'ragnarok': {
      if (!u.divinity.isGod) return replyText(conn, m, '[ ⚠️ ] Hanya Dewa yang bisa bertarung di Ragnarok.')
      const target = m.mentionedJid?.[0]
      if (!target) return replyText(conn, m, `[ ⚠️ ] Tag Dewa lawanmu!`)
      
      const enemy = db.users[target]
      if (!enemy || !enemy.divinity || !enemy.divinity.isGod) return replyText(conn, m, `[ ⚠️ ] Target bukan merupakan seorang Dewa.`)

      if (u.energy < 50) return replyText(conn, m, `[ ⚠️ ] Energi mentalmu kurang untuk perang suci.`)
      u.energy -= 50

      // Battle Power Dewa: Faith + Believers + Stat Pilot
      const myPower = u.divinity.faith + (u.divinity.believers * 10) + (u.atk * 2)
      const enemyPower = enemy.divinity.faith + (enemy.divinity.believers * 10) + (enemy.atk * 2)

      let txt = `⚔️ *DIVINE WAR: RAGNAROK* ⚔️\n[ ${u.divinity.godName} ] VS [ ${enemy.divinity.godName} ]\n\n*Dunia bergetar akibat benturan kekuatan suci...*\n`

      if (myPower > enemyPower) {
        const convertBelievers = Math.floor(enemy.divinity.believers * 0.2)
        enemy.divinity.believers -= convertBelievers
        u.divinity.believers += convertBelievers
        u.divinity.faith += 10000
        
        txt += `\n🏆 *MENANG!* [ ${u.divinity.godName} ] membuktikan kekuasaannya!\n${formatNum(convertBelievers)} Pengikut lawan berpaling dan menyembahmu!\n+10,000 Faith Points diperoleh.`
      } else {
        const lossFaith = Math.floor(u.divinity.faith * 0.1)
        u.divinity.faith -= lossFaith
        txt += `\n💀 *KALAH!* Keagunganmu memudar. Kamu kehilangan ${formatNum(lossFaith)} Faith Points.`
      }

      saveDb(db)
      await conn.sendMessage(m.chat, { text: txt, mentions: [m.sender, target] }, { quoted: m })
      break
    }

    default:
      break
  }
}

handler.help = ['god', 'temple', 'miracle', 'divinewar']
handler.tags = ['rpg']
handler.command = /^(god|divine|temple|kuil|faith|miracle|mukjizat|divinewar|ragnarok)$/i
handler.limit = false
handler.register = false

export default handler
