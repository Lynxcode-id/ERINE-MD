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

// Injeksi data Abyss & Ascension
function ensureAbyssData(db, jid) {
  if (!db.users[jid]) return false
  const u = db.users[jid]
  
  u.abyss = u.abyss || {
    floor: 1,
    highestFloor: 0,
    glitchData: 0,
    vrSickness: 0 // Cooldown kalau kalah di VR
  }
  
  u.ascension = u.ascension || { weapon: 0, armor: 0 }
  u.aura = u.aura || null
  
  return u
}

async function showList(conn, m, title, rows, footer = '') {
  const txt = [
    `╔═══『 🌌 ${title} 』═══`,
    ...rows.map(r => `╠ ⎔ ${r}`),
    `╚══════════════════════`,
    footer ? `[🔥] ${footer}` : ''
  ].filter(Boolean).join('\n')
  await conn.sendMessage(m.chat, { text: txt }, { quoted: m })
}

function replyText(conn, m, text) {
  return conn.sendMessage(m.chat, { text }, { quoted: m })
}

// Katalog Aura
const AURAS = {
  'neon_halo': { name: 'Neon Halo', price: 10, atk: 50, def: 50, luck: 5 },
  'blood_moon': { name: 'Blood Moon', price: 50, atk: 150, def: 50, luck: 10 },
  'void_walker': { name: 'Void Walker', price: 150, atk: 300, def: 300, luck: 20 },
  'cyber_god': { name: 'Cyber God', price: 500, atk: 1000, def: 1000, luck: 50 }
}

const handler = async (m, { conn, usedPrefix, command, text }) => {
  const db = loadDb()
  if (!db) return replyText(conn, m, '[ ⚠️ ] Database offline. Pancing dengan command .profile di RPG utama.')
  
  const u = ensureAbyssData(db, m.sender)
  if (!u) return replyText(conn, m, '[ ⚠️ ] Profil tidak ditemukan. Ketik .profile dulu di RPG utama.')

  const args = String(text || '').trim().split(/\s+/).filter(Boolean)
  const sub = String(command || '').toLowerCase()

  const menu = [
    `*▣ THE CYBER-ABYSS (VR) ▣*`,
    `Tantang menara simulasi tanpa akhir!`,
    ``,
    `${usedPrefix}abyss info`,
    `${usedPrefix}abyss dive`,
    `${usedPrefix}abyss leaderboard`,
    ``,
    `*▣ ASCENSION FORGE ▣*`,
    `${usedPrefix}ascend <weapon/armor>`,
    ``,
    `*▣ GLITCH SHOP ▣*`,
    `${usedPrefix}glitchshop`,
    `${usedPrefix}buy_aura <id>`,
    `${usedPrefix}equip_aura <id>`
  ]

  switch (sub) {
    case 'abyss':
    case 'vr': {
      const action = (args[0] || '').toLowerCase()

      if (!action || action === 'help') {
        await showList(conn, m, 'DEEP DIVE VR MATRIX', menu, 'Resiko Kematian Otak (VR Sickness)')
        break
      }

      if (action === 'info') {
        let cdTxt = u.abyss.vrSickness > now() ? `\n⏳ VR Sickness: ${msToClock(u.abyss.vrSickness - now())}` : '\n🟢 Status: Siap Dive'
        
        await showList(conn, m, `ABYSS PROFILE: @${m.sender.split('@')[0]}`, [
          `📶 Lantai Saat Ini: Floor ${u.abyss.floor}`,
          `🏆 Rekor Tertinggi: Floor ${u.abyss.highestFloor}`,
          `👾 Glitch Data: ${formatNum(u.abyss.glitchData)}`,
          `✨ Aura Aktif: ${u.aura ? AURAS[u.aura]?.name : 'Tidak Ada'}` + cdTxt,
          ``,
          `Ketik ${usedPrefix}abyss dive untuk memulai.`
        ])
      } 
      
      else if (action === 'dive') {
        if (u.abyss.vrSickness > now()) {
          return replyText(conn, m, `[ ⚠️ ] Otakmu masih *overheating* akibat kekalahan di VR.\nTunggu sistem saraf pulih dalam: ${msToClock(u.abyss.vrSickness - now())}`)
        }
        
        if (u.energy < 10) return replyText(conn, m, '[ ⚠️ ] Energy minimal 10 untuk masuk ke Deep Dive VR.')
        u.energy -= 10
        
        const f = u.abyss.floor
        
        // Kalkulasi Stats Musuh (Scaling Exponential)
        const eName = `Abyss Glitch Entity Mk.${f}`
        const eHp = 500 + (f * 500) + (f * f * 10)
        const eAtk = 40 + (f * 15)
        const eDef = 15 + (f * 8)
        
        // Kalkulasi Stats Player Ekstra (Aura & Ascension)
        let pAtk = u.atk + (u.enchant?.weapon ? u.enchant.weapon * 5 : 0) + (u.ascension.weapon * 200)
        let pDef = u.def + (u.enchant?.armor ? u.enchant.armor * 5 : 0) + (u.ascension.armor * 200)
        let pMaxHp = u.maxHp
        
        if (u.aura && AURAS[u.aura]) {
           pAtk += AURAS[u.aura].atk
           pDef += AURAS[u.aura].def
           pMaxHp += 500 // Bonus HP dari Aura
        }
        
        // Simulasi Pertarungan
        let php = pMaxHp
        let ehp = eHp
        let turn = 0
        
        while(php > 0 && ehp > 0 && turn < 150) {
           ehp -= Math.max(1, pAtk - Math.floor(eDef/2) + rand(0, 20))
           if (ehp <= 0) break
           php -= Math.max(1, eAtk - Math.floor(pDef/2) + rand(0, 10))
           turn++
        }
        
        if (php > 0) {
           // Menang
           u.abyss.floor += 1
           if (u.abyss.floor > u.abyss.highestFloor) u.abyss.highestFloor = u.abyss.floor
           
           const goldLoot = rand(500, 1500) + (f * 100)
           const expLoot = rand(200, 500) + (f * 50)
           u.gold += goldLoot
           u.exp += expLoot
           
           let glitchTxt = ''
           // Tiap kelipatan 5 lantai, dapet Glitch Data
           if (f % 5 === 0) {
              const glitchGot = Math.floor(f / 5)
              u.abyss.glitchData += glitchGot
              glitchTxt = `\n👾 *Mendapatkan ${glitchGot} Glitch Data!*`
           }
           
           saveDb(db)
           await replyText(conn, m, `⚔️ *FLOOR ${f} CLEARED!* ⚔️\nKamu berhasil menghapus [ ${eName} ] dari sistem.\n\n💰 +${formatNum(goldLoot)} Gold\n💠 +${formatNum(expLoot)} EXP${glitchTxt}\n\n*Lanjut ke Floor ${u.abyss.floor}*`)
        } else {
           // Kalah
           u.hp = 1 // Sekarat
           u.abyss.vrSickness = now() + (2 * 60 * 60 * 1000) // 2 Jam Cooldown
           saveDb(db)
           await replyText(conn, m, `💀 *SYNCHRONIZATION LOST* 💀\nKamu dibantai oleh [ ${eName} ] di Floor ${f}.\nSistem memutus koneksimu secara paksa.\n\n*Terkena efek VR Sickness selama 2 Jam.* (HP tersisa 1)`)
        }
      }

      else if (action === 'leaderboard' || action === 'top') {
        const list = Object.entries(db.users)
          .filter(([_, x]) => x.abyss && x.abyss.highestFloor > 0)
          .sort((a, b) => b[1].abyss.highestFloor - a[1].abyss.highestFloor)
          .slice(0, 10)
          
        if (list.length === 0) return replyText(conn, m, '[ ⚠️ ] Belum ada yang berani masuk ke Abyss.')
        
        const txt = [
          `╔═══『 🏆 ABYSS CONQUERORS 』═══`,
          ...list.map((v, i) => `╠ ${i + 1}. @${v[0].split('@')[0]}\n╠ ↳ Highest Floor: ${v[1].abyss.highestFloor}`),
          `╚═══════════════════════════`
        ].join('\n')

        await conn.sendMessage(m.chat, { text: txt, mentions: list.map(v => v[0]) }, { quoted: m })
      }
      break
    }

    case 'ascend':
    case 'ascension': {
      const slot = (args[0] || '').toLowerCase()
      if (!['weapon', 'armor'].includes(slot)) return replyText(conn, m, '[ ⚠️ ] Format: .ascend <weapon/armor>')
      
      const equipId = u.equipment[slot]
      if (!equipId) return replyText(conn, m, `[ ⚠️ ] Kamu tidak menggunakan ${slot} apapun.`)
      
      const currentEnchant = u.enchant[slot] || 0
      if (currentEnchant < 15) return replyText(conn, m, `[ ⚠️ ] Item harus mencapai Max Enchant (+15) sebelum bisa di-Ascend.\nEnchant saat ini: +${currentEnchant}`)
      
      const currentAscension = u.ascension[slot]
      if (currentAscension >= 5) return replyText(conn, m, `[ ⚠️ ] ${slot} kamu sudah mencapai Limit Kematian (Ascension ★5). Tidak bisa lebih kuat lagi.`)
      
      const reqCores = (currentAscension + 1) * 3
      const reqGlitch = (currentAscension + 1) * 10
      const costGold = (currentAscension + 1) * 500000
      
      if ((u.items['cybercore'] || 0) < reqCores || u.abyss.glitchData < reqGlitch || u.gold < costGold) {
         return replyText(conn, m, `[ ⚠️ ] Resource untuk Ascension kurang!\nButuh: 💠 ${reqCores} Cyber Core, 👾 ${reqGlitch} Glitch Data, 💰 ${formatNum(costGold)} Gold.`)
      }
      
      u.items['cybercore'] -= reqCores
      u.abyss.glitchData -= reqGlitch
      u.gold -= costGold
      
      // Reset enchant, tambah bintang ascension
      u.enchant[slot] = 0
      u.ascension[slot] += 1
      
      let starTxt = '★'.repeat(u.ascension[slot])
      saveDb(db)
      
      await replyText(conn, m, `🌋 *ASCENSION SUCCESSFUL!* 🌋\nBatasan sistem telah dihancurkan!\n\n${slot.toUpperCase()} kamu naik menjadi kelas Relic ${starTxt}!\n(Enchant reset ke +0, tapi Base Stat meningkat super drastis)`)
      break
    }

    case 'glitchshop': {
      const rows = Object.entries(AURAS).map(([id, a]) => `[ ${id} ] ${a.name} \n    ↳ Harga: 👾 ${a.price} Glitch Data\n    ↳ ATK +${a.atk} | DEF +${a.def} | LUCK +${a.luck}`)
      await showList(conn, m, 'GLITCH MARKET (AURAS)', rows, `Beli: ${usedPrefix}buy_aura <id> | Pakai: ${usedPrefix}equip_aura <id>`)
      break
    }

    case 'buy_aura': {
      const id = (args[0] || '').toLowerCase()
      const aura = AURAS[id]
      
      if (!aura) return replyText(conn, m, '[ ⚠️ ] Aura tidak ditemukan. Cek .glitchshop')
      
      u.items = u.items || {}
      const itemKey = `aura_${id}`
      if (u.items[itemKey]) return replyText(conn, m, '[ ⚠️ ] Kamu sudah membeli Aura ini.')
      
      if (u.abyss.glitchData < aura.price) return replyText(conn, m, `[ ⚠️ ] Glitch Data kurang! Butuh 👾 ${aura.price}.`)
      
      u.abyss.glitchData -= aura.price
      u.items[itemKey] = 1 // Masukin inventory sebagai tanda kepemilikan
      
      saveDb(db)
      await replyText(conn, m, `✨ *AURA PURCHASED*\nKamu telah mendapatkan [ ${aura.name} ].\nKetik ${usedPrefix}equip_aura ${id} untuk mengaktifkannya.`)
      break
    }

    case 'equip_aura': {
      const id = (args[0] || '').toLowerCase()
      if (id === 'none' || id === 'lepas') {
         u.aura = null
         saveDb(db)
         return replyText(conn, m, `✨ Aura berhasil dilepas.`)
      }
      
      const aura = AURAS[id]
      if (!aura) return replyText(conn, m, '[ ⚠️ ] Aura tidak ditemukan.')
      
      const itemKey = `aura_${id}`
      if (!u.items || !u.items[itemKey]) return replyText(conn, m, '[ ⚠️ ] Kamu belum memiliki Aura ini. Beli dulu di .glitchshop')
      
      u.aura = id
      saveDb(db)
      await replyText(conn, m, `🌟 *AURA EQUIPPED*\nPenampilan Hologram profilmu sekarang memancarkan [ ${aura.name} ]!\nStatus bertambah secara pasif.`)
      break
    }

    default:
      break
  }
}

handler.help = ['abyss', 'ascend', 'glitchshop']
handler.tags = ['rpg']
handler.command = /^(abyss|vr|ascend|ascension|glitchshop|buy_aura|equip_aura)$/i
handler.limit = false
handler.register = false

export default handler
