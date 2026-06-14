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

// Injeksi data Omniverse ke profil player
function ensureOmniverseData(db, jid) {
  if (!db.users[jid]) return false
  const u = db.users[jid]
  
  u.omniverse = u.omniverse || {
    currentUniverse: 'Prime-Earth',
    omniFragments: 0,
    anomaliesKilled: 0,
    perks: {
      timeDilation: 0, // Mengurangi Cooldown %
      midasTouch: 0,   // Multiplier Gold %
      realityTear: 0   // Multiplier Damage %
    }
  }
  
  return u
}

async function showList(conn, m, title, rows, footer = '') {
  const txt = [
    `╔═══『 🌌 ${title} 』═══`,
    ...rows.map(r => `╠ ⎔ ${r}`),
    `╚══════════════════════`,
    footer ? `[🌀] ${footer}` : ''
  ].filter(Boolean).join('\n')
  await conn.sendMessage(m.chat, { text: txt }, { quoted: m })
}

function replyText(conn, m, text) {
  return conn.sendMessage(m.chat, { text }, { quoted: m })
}

// Daftar Parallel Universes & Bos Alternatif
const UNIVERSES = {
  'prime': { id: 'Prime-Earth', name: 'Prime Earth (Asal)', boss: null },
  'earth404': { id: 'Earth-404', name: 'Earth-404 (Glitch World)', boss: { name: 'Jemima [Alter-Ego]', hp: 10000000, atk: 50000, def: 20000, drop: 1 } },
  'earth616': { id: 'Earth-616', name: 'Earth-616 (Warzone)', boss: { name: 'Darth Takina', hp: 25000000, atk: 120000, def: 50000, drop: 3 } },
  'dark_dim': { id: 'Dark-Dim', name: 'Dark Dimension (Abyssal)', boss: { name: 'Empress Erine', hp: 80000000, atk: 300000, def: 150000, drop: 8 } },
  'omega': { id: 'Omega-Point', name: 'The End of Time', boss: { name: 'Hydro-Trisha [Absolute]', hp: 200000000, atk: 1000000, def: 500000, drop: 25 } }
}

const handler = async (m, { conn, usedPrefix, command, text }) => {
  const db = loadDb()
  if (!db) return replyText(conn, m, '[ ⚠️ ] Database offline.')
  
  const u = ensureOmniverseData(db, m.sender)
  if (!u) return replyText(conn, m, '[ ⚠️ ] Profil tidak ditemukan. Ketik .profile dulu.')

  const args = String(text || '').trim().split(/\s+/).filter(Boolean)
  const sub = String(command || '').toLowerCase()

  const menu = [
    `*▣ THE OMNIVERSE ▣*`,
    `Tembus batas realita, kalahkan dirimu yang lain!`,
    ``,
    `${usedPrefix}omni info`,
    `${usedPrefix}omni map`,
    `${usedPrefix}omni travel <id_universe>`,
    `${usedPrefix}omni hunt`,
    ``,
    `*▣ REALITY NEXUS (PERKS) ▣*`,
    `${usedPrefix}nexus list`,
    `${usedPrefix}nexus upgrade <id_perk>`
  ]

  switch (sub) {
    case 'omni':
    case 'omniverse': {
      const action = (args[0] || '').toLowerCase()

      if (!action || action === 'help') {
        await showList(conn, m, 'MULTIVERSE GATEWAY', menu, 'Nothing is real.')
        break
      }

      if (action === 'info') {
        const p = u.omniverse.perks
        await showList(conn, m, `DIMENSIONAL TRAVELER: @${m.sender.split('@')[0]}`, [
          `🌍 Lokasi Realita: ${u.omniverse.currentUniverse}`,
          `🧩 Omni-Fragments: ${formatNum(u.omniverse.omniFragments)}`,
          `💀 Anomaly Terbunuh: ${formatNum(u.omniverse.anomaliesKilled)}`,
          ``,
          `*=== REALITY PERKS ===*`,
          `⏳ Time Dilation: Lv.${p.timeDilation} (-${p.timeDilation * 5}% All Cooldowns)`,
          `🪙 Midas Touch: Lv.${p.midasTouch} (+${p.midasTouch * 10}% All Gold Drops)`,
          `💥 Reality Tear: Lv.${p.realityTear} (+${p.realityTear * 15}% All Damage)`
        ])
      } 
      
      else if (action === 'map' || action === 'list') {
        const rows = Object.entries(UNIVERSES).map(([k, v]) => `[ ${k} ] ${v.name}\n    ↳ Anomaly Boss: ${v.boss ? v.boss.name : 'Aman'}`)
        await showList(conn, m, 'MULTIVERSE MAP', rows, `Pindah Realita: ${usedPrefix}omni travel <id>`)
      }

      else if (action === 'travel' || action === 'jump') {
        const targetId = (args[1] || '').toLowerCase()
        const target = UNIVERSES[targetId]
        
        if (!target) return replyText(conn, m, `[ ⚠️ ] Koordinat universe tidak ditemukan. Cek .omni map`)
        if (u.omniverse.currentUniverse === target.name) return replyText(conn, m, `[ ⚠️ ] Kamu sudah berada di dimensi ini.`)
        
        // Cost travel: 100 Energy (Ngabisin banget)
        if (u.energy < 100) return replyText(conn, m, `[ ⚠️ ] Menembus batas dimensi butuh konsentrasi absolut. (Butuh 100 Energy)`)
        
        u.energy -= 100
        u.omniverse.currentUniverse = target.name
        
        saveDb(db)
        await replyText(conn, m, `🌌 *REALITY SHIFT INITIATED* 🌌\nTubuhmu terurai menjadi piksel cahaya dan disatukan kembali di semesta lain...\n\nSelamat datang di [ *${target.name}* ].\nHati-hati dengan Anomaly lokal.`)
      }

      else if (action === 'hunt' || action === 'anomaly') {
        const currentUniv = Object.values(UNIVERSES).find(v => v.name === u.omniverse.currentUniverse)
        
        if (!currentUniv || !currentUniv.boss) {
           return replyText(conn, m, `[ ⚠️ ] Dimensi ini aman. Tidak ada Anomaly kelas dewa di sini. Pindah ke dimensi lain untuk berburu.`)
        }
        
        if (u.hp <= u.maxHp * 0.5) return replyText(conn, m, '[ ⚠️ ] Anomaly di dimensi ini bisa menghapusmu dalam sekali serang. Heal HP-mu sampai full dulu!')

        const boss = currentUniv.boss
        
        // Kalkulasi Kekuatan Total Player + Reality Perks
        const dmgMulti = 1 + (u.omniverse.perks.realityTear * 0.15) // +15% per level
        const pAtk = Math.floor(u.atk * dmgMulti)
        const pDef = Math.floor(u.def * dmgMulti)
        
        let php = u.hp
        let bhp = boss.hp
        let turn = 0
        
        while (php > 0 && bhp > 0 && turn < 200) {
           bhp -= Math.max(1, pAtk - Math.floor(boss.def / 2) + rand(0, 10000))
           if (bhp <= 0) break
           php -= Math.max(1, boss.atk - Math.floor(pDef / 2) + rand(0, 10000))
           turn++
        }

        u.hp = Math.max(1, php)

        let txt = `🌀 *ANOMALY ENCOUNTERED!* 🌀\nRuang dan waktu bergetar! Varian dari dimensi lain, [ ${boss.name} ] menyerangmu!\n`

        if (php > 0) {
           // MENANG
           const fragDrop = boss.drop + (Math.random() > 0.8 ? 1 : 0) // Chance dapet extra 1 fragment
           
           u.omniverse.omniFragments += fragDrop
           u.omniverse.anomaliesKilled += 1
           
           txt += `\n🎉 *REALITY RESTORED!*\nKamu berhasil menghancurkan eksistensi [ ${boss.name} ] dari dimensi ini!\n\n🧩 Mendapatkan: +${fragDrop} Omni-Fragments\n❤️ Sisa HP: ${formatNum(u.hp)}`
        } else {
           // KALAH
           u.hp = 1
           const penalty = Math.floor(u.gold * 0.2) // Denda 20% gold total karena dilempar balik ke dimensi asal
           u.gold = Math.max(0, u.gold - penalty)
           u.omniverse.currentUniverse = UNIVERSES['prime'].name // Paksa pulang
           
           txt += `\n💀 *TIMELINE ERASED!* 💀\nKekuatan [ ${boss.name} ] melampaui logikamu! Tubuhmu hancur dan jiwamu terlempar paksa kembali ke Prime Earth.\n\nKehilangan ${formatNum(penalty)} Gold (Sisa 1 HP).`
        }

        saveDb(db)
        await conn.sendMessage(m.chat, { text: txt, mentions: [m.sender] }, { quoted: m })
      }
      else {
        replyText(conn, m, `[ ⚠️ ] Format salah. Ketik ${usedPrefix}omni untuk panduan.`)
      }
      break
    }

    case 'nexus': {
      const action = (args[0] || '').toLowerCase()
      
      const PERK_INFO = {
        'time': { name: 'Time Dilation', desc: 'Cooldown -5% per level.', varName: 'timeDilation' },
        'midas': { name: 'Midas Touch', desc: 'Gold Drops +10% per level.', varName: 'midasTouch' },
        'reality': { name: 'Reality Tear', desc: 'All Damage +15% per level.', varName: 'realityTear' }
      }

      if (!action || action === 'list') {
        const rows = Object.entries(PERK_INFO).map(([id, p]) => {
           const curlv = u.omniverse.perks[p.varName]
           const cost = (curlv + 1) * 2 // Harga naik 2 frag tiap level
           return `[ ${id} ] ${p.name} (Lv.${curlv})\n    ↳ Efek: ${p.desc}\n    ↳ Upgrade: 🧩 ${cost} Omni-Fragments`
        })
        return showList(conn, m, 'REALITY NEXUS CORE', rows, `Upgrade: ${usedPrefix}nexus upgrade <id>`)
      }

      if (action === 'upgrade') {
        const perkId = (args[1] || '').toLowerCase()
        const perk = PERK_INFO[perkId]
        
        if (!perk) return replyText(conn, m, '[ ⚠️ ] Perk tidak ditemukan. (time / midas / reality)')
        
        const currentLv = u.omniverse.perks[perk.varName]
        if (currentLv >= 10) return replyText(conn, m, '[ ⚠️ ] Perk ini sudah mencapai batas pengubahan realita (Level 10 MAX).')
        
        const cost = (currentLv + 1) * 2
        
        if (u.omniverse.omniFragments < cost) return replyText(conn, m, `[ ⚠️ ] Omni-Fragments kurang! Butuh 🧩 ${cost}. Lawan bos di dimensi lain untuk mendapatkannya.`)
        
        u.omniverse.omniFragments -= cost
        u.omniverse.perks[perk.varName] += 1
        
        saveDb(db)
        await replyText(conn, m, `💠 *REALITY REWRITTEN* 💠\nPerk [ ${perk.name} ] berhasil ditingkatkan ke Lv.${currentLv + 1}!\nAturan di alam semesta telah dimodifikasi untuk menguntungkanmu.`)
      }
      break
    }

    default:
      break
  }
}

handler.help = ['omni', 'nexus']
handler.tags = ['rpg']
handler.command = /^(omni|omniverse|nexus)$/i
handler.limit = false
handler.register = false

export default handler
