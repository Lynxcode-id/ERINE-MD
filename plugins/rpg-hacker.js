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

// Injeksi data Hacker ke profile player tanpa ngerusak data lama (Tanpa ||=)
function ensureHackerData(db, jid) {
  if (!db.users[jid]) return false // Harus register/profile di RPG utama dulu
  const u = db.users[jid]
  
  u.hacker = u.hacker || {
    botnetLvl: 0,
    dataFragments: 0,
    encryptedFiles: 0,
    aiCores: 0,
    lastBreach: 0
  }
  
  return u
}

async function showList(conn, m, title, rows, footer = '') {
  const txt = [
    `╔═══『 💀 ${title} 』═══`,
    ...rows.map(r => `╠ ⎔ ${r}`),
    `╚══════════════════════`,
    footer ? `[💻] ${footer}` : ''
  ].filter(Boolean).join('\n')
  await conn.sendMessage(m.chat, { text: txt }, { quoted: m })
}

function replyText(conn, m, text) {
  return conn.sendMessage(m.chat, { text }, { quoted: m })
}

// Target Hacking
const TARGETS = {
  'corp': { name: 'Mega-Corporation', energy: 15, baseSuccess: 70, rewardData: [10, 30], files: 1 },
  'bank': { name: 'Cyber-Bank Vault', energy: 25, baseSuccess: 50, rewardData: [30, 80], files: 2 },
  'military': { name: 'Military Mainframe', energy: 40, baseSuccess: 30, rewardData: [100, 250], files: 3 }
}

const handler = async (m, { conn, usedPrefix, command, text }) => {
  const db = loadDb()
  if (!db) return replyText(conn, m, '[ ⚠️ ] Database offline. Pancing dengan command .profile di RPG utama.')
  
  const u = ensureHackerData(db, m.sender)
  if (!u) return replyText(conn, m, '[ ⚠️ ] Profil tidak ditemukan. Ketik .profile dulu di RPG utama.')

  const args = String(text || '').trim().split(/\s+/).filter(Boolean)
  const sub = String(command || '').toLowerCase()

  const menu = [
    `*▣ HACKER PROTOCOL ▣*`,
    `Bangun Botnet, retas server, curi data intelijen!`,
    ``,
    `${usedPrefix}hack info`,
    `${usedPrefix}hack upgrade`,
    `${usedPrefix}hack breach <corp/bank/military>`,
    `${usedPrefix}hack decrypt`,
    `${usedPrefix}darkweb`
  ]

  switch (sub) {
    case 'hack':
    case 'hacker': {
      const action = (args[0] || '').toLowerCase()

      if (!action || action === 'help') {
        await showList(conn, m, 'TERMINAL OS', menu, 'Root Access Granted')
        break
      }

      if (action === 'info') {
        let botnetStatus = 'Basic Script Kiddie'
        if (u.hacker.botnetLvl >= 5) botnetStatus = 'Advanced Malware'
        if (u.hacker.botnetLvl >= 10) botnetStatus = 'Self-Healing AI Engine'

        await showList(conn, m, `NETRUNNER: @${m.sender.split('@')[0]}`, [
          `🖥️ Botnet Level: ${u.hacker.botnetLvl} (${botnetStatus})`,
          `📡 Success Rate Boost: +${u.hacker.botnetLvl * 2}%`,
          `🧩 Data Fragments: ${formatNum(u.hacker.dataFragments)}`,
          `🔒 Encrypted Files: ${formatNum(u.hacker.encryptedFiles)}`,
          `🧠 AI Cores: ${formatNum(u.hacker.aiCores)}`,
          ``,
          `*Tips:* Decrypt file untuk dapat AI Cores.`
        ])
      } 
      
      else if (action === 'upgrade') {
        const currentLvl = u.hacker.botnetLvl
        if (currentLvl >= 20) return replyText(conn, m, '[ ⚠️ ] Botnet kamu sudah mencapai limit maksimal (Lv.20).')
        
        const costGold = 10000 + (currentLvl * 5000)
        const costData = currentLvl * 50 // Butuh Data Fragments untuk upgrade setelah lv 1
        
        if (u.gold < costGold || u.hacker.dataFragments < costData) {
          return replyText(conn, m, `[ ⚠️ ] Resource kurang untuk upgrade Botnet ke Lv.${currentLvl + 1}.\nButuh: ${formatNum(costGold)} Gold & ${costData} Data Fragments.`)
        }
        
        u.gold -= costGold
        u.hacker.dataFragments -= costData
        u.hacker.botnetLvl += 1
        
        saveDb(db)
        await replyText(conn, m, `💻 *SYSTEM UPGRADED*\nBotnet berhasil di-upgrade ke Level ${u.hacker.botnetLvl}!\nSuccess rate meretas server meningkat +2%.`)
      }

      else if (action === 'breach') {
        const targetKey = (args[1] || '').toLowerCase()
        const target = TARGETS[targetKey]
        
        if (!target) return showList(conn, m, 'TARGET PROTOCOL', Object.entries(TARGETS).map(([k, v]) => `${k} — ${v.name} | Energi: ${v.energy} | Rate: ${v.baseSuccess}%`), `Format: ${usedPrefix}hack breach <target>`)
        
        const last = u.hacker.lastBreach || 0
        if (now() - last < 15 * 60 * 1000) return replyText(conn, m, `[ ⚠️ ] IP kamu sedang dilacak ICE! Sembunyi selama: ${msToClock((last + 15 * 60 * 1000) - now())}`)
        
        if (u.energy < target.energy) return replyText(conn, m, `[ ⚠️ ] Fokus mental (Energy) kurang. Butuh ${target.energy} Energy.`)
        
        u.energy -= target.energy
        u.hacker.lastBreach = now()
        
        const successRate = target.baseSuccess + (u.hacker.botnetLvl * 2) + (u.luck * 0.5)
        const roll = rand(1, 100)
        
        if (roll <= successRate) {
          const lootData = rand(target.rewardData[0], target.rewardData[1])
          const lootFiles = target.files
          
          u.hacker.dataFragments += lootData
          u.hacker.encryptedFiles += lootFiles
          
          // Bonus EXP RPG base game
          const expGain = rand(300, 800)
          u.exp += expGain
          
          saveDb(db)
          await replyText(conn, m, `🌐 *BREACH SUCCESSFUL!* 🌐\nFirewall ${target.name} berhasil ditembus!\n\n🧩 +${lootData} Data Fragments\n🔒 +${lootFiles} Encrypted Files\n💠 +${expGain} EXP Manajer/Player`)
        } else {
          // Gagal, denda gold / hp drop
          const damage = rand(20, 50)
          u.hp = Math.max(1, u.hp - damage)
          saveDb(db)
          await replyText(conn, m, `🛑 *BREACH FAILED!* 🛑\nSistem ICE dari ${target.name} menyerang balik neural link kamu!\nTerkena ${damage} Damage (Sisa HP: ${u.hp}).`)
        }
      }

      else if (action === 'decrypt') {
        if (u.hacker.encryptedFiles < 1) return replyText(conn, m, '[ ⚠️ ] Kamu tidak punya Encrypted Files untuk di-decrypt.')
        
        let filesToDecrypt = 1
        if (args[1] && args[1] === 'all') filesToDecrypt = u.hacker.encryptedFiles
        else if (Number(args[1]) > 0) filesToDecrypt = Math.min(u.hacker.encryptedFiles, Number(args[1]))

        u.hacker.encryptedFiles -= filesToDecrypt
        
        let gotCores = 0
        let gotGold = 0
        
        // Proses gacha decrypting
        for(let i = 0; i < filesToDecrypt; i++) {
           if (Math.random() < 0.3) { // 30% chance dapet AI Core
             gotCores += 1
           } else {
             gotGold += rand(2000, 5000)
           }
        }
        
        u.hacker.aiCores += gotCores
        u.gold += gotGold
        
        saveDb(db)
        await replyText(conn, m, `🔓 *DECRYPTION COMPLETE*\nMemproses ${filesToDecrypt} file...\n\n🧠 Ditemukan: ${gotCores} AI Cores\n💰 Dijual otomatis ke broker: +${formatNum(gotGold)} Gold`)
      }
      
      else {
        replyText(conn, m, `[ ⚠️ ] Command salah. Ketik ${usedPrefix}hack untuk menu.`)
      }
      break
    }

    // ==========================================
    // BLACK MARKET (Menghubungkan RPG Hacker dengan Base RPG)
    // ==========================================
    case 'darkweb': {
      const action = (args[0] || '').toLowerCase()
      
      const darkItems = {
        '1': { name: 'Neon Shard', cost: 2, id: 'neonshard', type: 'item' },
        '2': { name: 'Cyber Core', cost: 3, id: 'cybercore', type: 'item' },
        '3': { name: 'Neon Crate', cost: 5, id: 'crate_neon', type: 'item' },
        '4': { name: 'Black Market Gold x100.000', cost: 4, type: 'gold', val: 100000 },
        '5': { name: 'Reset All Cooldowns', cost: 10, type: 'reset_cd' }
      }

      if (!action || action === 'list') {
        const rows = Object.entries(darkItems).map(([k, v]) => `[${k}] ${v.name} — Harga: ${v.cost} AI Cores`)
        await showList(conn, m, 'DARK WEB MARKET', rows, `Beli: ${usedPrefix}darkweb buy <nomor>`)
        break
      }

      if (action === 'buy') {
        const itemNum = args[1]
        const product = darkItems[itemNum]
        
        if (!product) return replyText(conn, m, '[ ⚠️ ] Barang tidak ada di katalog Dark Web.')
        if (u.hacker.aiCores < product.cost) return replyText(conn, m, `[ ⚠️ ] AI Cores tidak cukup! Butuh ${product.cost} AI Cores.`)
        
        u.hacker.aiCores -= product.cost
        
        if (product.type === 'item') {
          u.items = u.items || {}
          u.items[product.id] = (u.items[product.id] || 0) + 1
          await replyText(conn, m, `🛒 *TRANSAKSI GELAP SUKSES*\nBarang [ ${product.name} ] berhasil dikirim ke inventory utamamu!`)
        } 
        else if (product.type === 'gold') {
          u.gold += product.val
          await replyText(conn, m, `🛒 *PENCUCIAN UANG SUKSES*\nSaldo Gold kamu bertambah +${formatNum(product.val)}!`)
        }
        else if (product.type === 'reset_cd') {
          u.cooldowns = {}
          u.hacker.lastBreach = 0
          if (u.agency) { u.agency.lastLive = 0; u.agency.lastTheater = 0; }
          await replyText(conn, m, `🛒 *SYSTEM OVERRIDE*\nSemua cooldown RPG, Hacking, dan Agency telah direset menjadi 0!`)
        }
        
        saveDb(db)
      }
      break
    }

    default:
      break
  }
}

handler.help = ['hack', 'darkweb']
handler.tags = ['rpg']
handler.command = /^(hack|hacker|darkweb)$/i
handler.limit = false
handler.register = false

export default handler
