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

// Injeksi data Mech ke profil player
function ensureMechData(db, jid) {
  if (!db.users[jid]) return false
  const u = db.users[jid]
  
  u.mech = u.mech || {
    name: "Gundam Prototype",
    level: 1,
    core: 1,      // Menentukan ATK Mech
    armor: 1,     // Menentukan DEF Mech
    frame: 1,     // Menentukan MAX HP Mech
    battery: 100, // Max 100
    durability: 5000,
    maxDurability: 5000,
    kills: 0,
    lastCharge: 0
  }
  
  return u
}

async function showList(conn, m, title, rows, footer = '') {
  const txt = [
    `╔═══『 🤖 ${title} 』═══`,
    ...rows.map(r => `╠ ⎔ ${r}`),
    `╚══════════════════════`,
    footer ? `[☢️] ${footer}` : ''
  ].filter(Boolean).join('\n')
  await conn.sendMessage(m.chat, { text: txt }, { quoted: m })
}

function replyText(conn, m, text) {
  return conn.sendMessage(m.chat, { text }, { quoted: m })
}

// Daftar Kaiju (Musuh Raksasa)
const KAIJU_LIST = [
  { id: '1', name: 'Goliath Mutated-Ape', hp: 50000, atk: 1200, def: 500, reward: 50000, exp: 20000, drop: 'darkmatter' },
  { id: '2', name: 'Mecha-Leviathan', hp: 150000, atk: 3500, def: 1500, reward: 200000, exp: 50000, drop: 'kaijucore' },
  { id: '3', name: 'Void-Eater Entity', hp: 500000, atk: 8000, def: 4000, reward: 800000, exp: 150000, drop: 'voidcore' },
  { id: '4', name: 'Cyber-Godzilla', hp: 2000000, atk: 25000, def: 12000, reward: 3000000, exp: 500000, drop: 'plasma' }
]

const handler = async (m, { conn, usedPrefix, command, text }) => {
  const db = loadDb()
  if (!db) return replyText(conn, m, '[ ⚠️ ] Database offline. Pancing dengan command .profile di RPG utama.')
  
  const u = ensureMechData(db, m.sender)
  if (!u) return replyText(conn, m, '[ ⚠️ ] Profil tidak ditemukan. Ketik .profile dulu di RPG utama.')

  const args = String(text || '').trim().split(/\s+/).filter(Boolean)
  const sub = String(command || '').toLowerCase()

  // Auto-Charge Battery Mechanism (10 Battery per Hour)
  const lastCharge = u.mech.lastCharge || now()
  const hrsPassed = Math.floor((now() - lastCharge) / (1000 * 60 * 60))
  if (hrsPassed > 0 && u.mech.battery < 100) {
    u.mech.battery = Math.min(100, u.mech.battery + (hrsPassed * 10))
    u.mech.lastCharge = now()
    saveDb(db)
  }

  const menu = [
    `*▣ EXOSUIT HANGAR ▣*`,
    `Bangun Mecha-mu dan bantai monster raksasa!`,
    ``,
    `${usedPrefix}mech info`,
    `${usedPrefix}mech rename <nama_baru>`,
    `${usedPrefix}mech upgrade <core/armor/frame>`,
    `${usedPrefix}mech repair`,
    `${usedPrefix}mech charge`,
    ``,
    `*▣ KAIJU SUBJUGATION ▣*`,
    `${usedPrefix}kaiju list`,
    `${usedPrefix}mech deploy <nomor_kaiju>`
  ]

  switch (sub) {
    case 'mech':
    case 'mecha':
    case 'exosuit': {
      const action = (args[0] || '').toLowerCase()

      if (!action || action === 'help') {
        await showList(conn, m, 'MECH COMMAND CENTER', menu, 'Pilot Ready.')
        break
      }

      if (action === 'info') {
        // Kalkulasi kekuatan Mech (Bawaan Base + Scaling Mech)
        const mechAtk = (u.mech.core * 1000) + (u.atk * 3) // Mech memperkuat ATK asli pilot 3x lipat
        const mechDef = (u.mech.armor * 800) + (u.def * 3)
        const maxDurability = 5000 + (u.mech.frame * 2000)
        
        // Fix jika maxHP nambah karena upgrade
        if (u.mech.maxDurability !== maxDurability) {
           u.mech.maxDurability = maxDurability
           saveDb(db)
        }

        await showList(conn, m, `EXOSUIT: [ ${u.mech.name} ]`, [
          `👤 Pilot: @${m.sender.split('@')[0]}`,
          `📈 Mech Level: ${u.mech.level}`,
          `💀 Kaiju Slain: ${u.mech.kills}`,
          ``,
          `*=== SYSTEM STATUS ===*`,
          `❤️ Durability: ${formatNum(u.mech.durability)} / ${formatNum(u.mech.maxDurability)}`,
          `🔋 Plasma Battery: ${u.mech.battery}%`,
          ``,
          `*=== COMBAT SPECS ===*`,
          `⚔️ Core Output (ATK): ${formatNum(mechAtk)} (Lv.${u.mech.core})`,
          `🛡️ Plating (DEF): ${formatNum(mechDef)} (Lv.${u.mech.armor})`,
          `🦾 Frame (HP): ${formatNum(u.mech.maxDurability)} (Lv.${u.mech.frame})`
        ])
      } 
      
      else if (action === 'rename') {
        const newName = args.slice(1).join(' ')
        if (!newName) return replyText(conn, m, `[ ⚠️ ] Format: ${usedPrefix}mech rename <nama_baru>`)
        
        u.mech.name = newName.slice(0, 25)
        saveDb(db)
        await replyText(conn, m, `✅ *SYSTEM UPDATED*\nCallsign Exosuit diubah menjadi: *${u.mech.name}*`)
      }

      else if (action === 'repair') {
        if (u.mech.durability >= u.mech.maxDurability) return replyText(conn, m, '[ ⚠️ ] Durability Mech masih penuh, tidak perlu perbaikan.')
        
        const damageTaken = u.mech.maxDurability - u.mech.durability
        const cost = Math.floor(damageTaken * 2) // 2 Gold per 1 HP yang hilang
        
        if (u.gold < cost) return replyText(conn, m, `[ ⚠️ ] Dana kurang! Butuh ${formatNum(cost)} Gold untuk perbaikan penuh.`)
        
        u.gold -= cost
        u.mech.durability = u.mech.maxDurability
        
        saveDb(db)
        await replyText(conn, m, `🔧 *REPAIR COMPLETE*\nMech [ ${u.mech.name} ] kembali ke kondisi 100%.\nBiaya mekanik: -${formatNum(cost)} Gold`)
      }

      else if (action === 'charge') {
        if (u.mech.battery >= 100) return replyText(conn, m, '[ ⚠️ ] Baterai Plasma sudah penuh.')
        
        const batteryNeeded = 100 - u.mech.battery
        const costItems = Math.ceil(batteryNeeded / 10) // 1 Crystal buat 10% battery
        
        if ((u.items['crystal'] || 0) < costItems) {
           return replyText(conn, m, `[ ⚠️ ] Butuh ${costItems} Crystal untuk nge-charge darurat sisa baterai ini.`)
        }
        
        u.items['crystal'] -= costItems
        u.mech.battery = 100
        
        saveDb(db)
        await replyText(conn, m, `⚡ *FAST CHARGE INITIATED*\nMengorbankan ${costItems} Crystal.\nBaterai Mech kembali penuh 100%!`)
      }

      else if (action === 'upgrade') {
        const part = (args[1] || '').toLowerCase()
        if (!['core', 'armor', 'frame'].includes(part)) {
           return replyText(conn, m, `[ ⚠️ ] Bagian yang bisa di-upgrade: core / armor / frame\nFormat: ${usedPrefix}mech upgrade <bagian>`)
        }

        const currentLvl = u.mech[part]
        const costGold = currentLvl * 150000
        const costCore = Math.floor(currentLvl / 2) // Butuh Cybercore tiap kelipatan level tertentu
        
        if (u.gold < costGold || (u.items['cybercore'] || 0) < costCore) {
           return replyText(conn, m, `[ ⚠️ ] Resource kurang untuk upgrade ${part.toUpperCase()} ke Lv.${currentLvl + 1}.\nButuh: 💰 ${formatNum(costGold)} Gold & 💠 ${costCore} Cyber Core.`)
        }

        u.gold -= costGold
        if (costCore > 0) u.items['cybercore'] -= costCore
        
        u.mech[part] += 1
        u.mech.level = Math.floor((u.mech.core + u.mech.armor + u.mech.frame) / 3)
        
        // Auto heal kalau upgrade frame
        if (part === 'frame') {
            u.mech.maxDurability = 5000 + (u.mech.frame * 2000)
            u.mech.durability = u.mech.maxDurability
        }

        saveDb(db)
        await replyText(conn, m, `🛠️ *MECH UPGRADED*\nBagian [ ${part.toUpperCase()} ] berhasil ditingkatkan ke Lv.${u.mech[part]}!\nKekuatan tempur Exosuit meningkat.`)
      }
      else {
        replyText(conn, m, `[ ⚠️ ] Command salah. Ketik ${usedPrefix}mech untuk menu.`)
      }
      break
    }

    case 'kaiju': {
      const rows = KAIJU_LIST.map((k, i) => `[ ${i+1} ] 🦖 ${k.name}\n    ↳ HP: ${formatNum(k.hp)} | ATK: ${formatNum(k.atk)}\n    ↳ Reward: ${formatNum(k.reward)}G`)
      await showList(conn, m, 'THREAT RADAR (KAIJU)', rows, `Serang: ${usedPrefix}mech deploy <nomor>`)
      break
    }

    case 'deploy': {
      if (!args[0] && sub !== 'deploy') return // Cuma proses kalau lewat .mech deploy atau .deploy
      
      const targetIndex = Math.floor(Number(args[0] || args[1])) - 1 // args[1] antisipasi kalau ngetik .mech deploy 1
      const kaiju = KAIJU_LIST[targetIndex]
      
      if (!kaiju) return replyText(conn, m, '[ ⚠️ ] Sinyal Kaiju tidak terdeteksi. Cek radar di .kaiju list')
      
      if (u.mech.battery < 25) return replyText(conn, m, `[ ⚠️ ] Baterai menipis (${u.mech.battery}%). Butuh minimal 25% Battery untuk Deploy.`)
      if (u.mech.durability <= u.mech.maxDurability * 0.2) return replyText(conn, m, '[ ⚠️ ] Kondisi Exosuit rusak parah! Lakukan .mech repair terlebih dahulu.')

      u.mech.battery -= 25
      
      // Kalkulasi Stats Combat Mech
      const mAtk = (u.mech.core * 1000) + (u.atk * 3)
      const mDef = (u.mech.armor * 800) + (u.def * 3)
      
      let mHp = u.mech.durability
      let kHp = kaiju.hp
      let turn = 0
      
      // Battle Engine
      while (mHp > 0 && kHp > 0 && turn < 150) {
         kHp -= Math.max(1, mAtk - Math.floor(kaiju.def / 2) + rand(0, 500))
         if (kHp <= 0) break
         mHp -= Math.max(1, kaiju.atk - Math.floor(mDef / 2) + rand(0, 500))
         turn++
      }

      u.mech.durability = Math.max(0, mHp) // Sisa HP disimpen

      let txt = `☢️ *KAIJU ENGAGEMENT* ☢️\n[ ${u.mech.name} ] diterjunkan dari orbit untuk melawan [ ${kaiju.name} ]!\n`

      if (mHp > 0) {
         // KAIJU MATI
         u.gold += kaiju.reward
         u.exp += kaiju.exp
         u.mech.kills += 1
         
         // Drop item
         u.items = u.items || {}
         u.items[kaiju.drop] = (u.items[kaiju.drop] || 0) + 1
         
         txt += `\n🎉 *THREAT NEUTRALIZED!*\nMeriam plasma-mu berhasil melubangi dada ${kaiju.name} hingga tewas!\n\n💰 Reward: +${formatNum(kaiju.reward)} Gold\n💠 EXP: +${formatNum(kaiju.exp)}\n🎁 Loot: 1x ${kaiju.drop.toUpperCase()}`
      } else {
         // MECH HANCUR
         const repairPenalty = Math.floor(u.gold * 0.05) // Denda 5% dari gold saat ini
         u.gold = Math.max(0, u.gold - repairPenalty)
         
         txt += `\n💥 *CRITICAL FAILURE!* 💥\nExosuit-mu hancur lebur diremukkan oleh ${kaiju.name}!\nSistem Eject darurat menyelamatkan nyawamu, tapi menelan biaya evakuasi sebesar -${formatNum(repairPenalty)} Gold.\nMech Durability: 0 (Butuh perbaikan total!)`
      }

      saveDb(db)
      await replyText(conn, m, txt)
      break
    }

    default:
      break
  }
}

handler.help = ['mech', 'kaiju', 'deploy']
handler.tags = ['rpg']
handler.command = /^(mech|mecha|exosuit|kaiju|deploy)$/i
handler.limit = false
handler.register = false

export default handler
