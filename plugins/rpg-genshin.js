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

// Injeksi data Genshin ke profil player
function ensureGenshinData(db, jid) {
  if (!db.users[jid]) return false
  const u = db.users[jid]
  
  u.genshin = u.genshin || {
    ar: 1, // Adventure Rank
    arExp: 0,
    primos: 0,
    mora: 0,
    resin: 160,
    lastResinUpdate: now(),
    pity: 0, // Hitungan pity banner karakter
    characters: [], // ID karakter yang dimiliki
    party: [], // Maksimal 4 karakter aktif
    artifacts: { flower: null, plume: null, sands: null, goblet: null, circlet: null },
    inventory: [], // Simpan artefak yang didapat
    lastCommissions: 0
  }
  
  return u
}

async function showList(conn, m, title, rows, footer = '') {
  const txt = [
    `╔═══『 🌟 ${title} 』═══`,
    ...rows.map(r => `╠ ✧ ${r}`),
    `╚══════════════════════`,
    footer ? `[✨] ${footer}` : ''
  ].filter(Boolean).join('\n')
  await conn.sendMessage(m.chat, { text: txt }, { quoted: m })
}

function replyText(conn, m, text) {
  return conn.sendMessage(m.chat, { text }, { quoted: m })
}

// Data Karakter Genshin (Element & Base Power)
const CHARACTERS = [
  // 4 Stars
  { id: 'bennett', name: 'Bennett', star: 4, element: 'Pyro', power: 100 },
  { id: 'xingqiu', name: 'Xingqiu', star: 4, element: 'Hydro', power: 100 },
  { id: 'xiangling', name: 'Xiangling', star: 4, element: 'Pyro', power: 120 },
  { id: 'kuki', name: 'Kuki Shinobu', star: 4, element: 'Electro', power: 90 },
  { id: 'faruzan', name: 'Faruzan', star: 4, element: 'Anemo', power: 85 },
  // 5 Stars
  { id: 'zhongli', name: 'Zhongli', star: 5, element: 'Geo', power: 500 },
  { id: 'raiden', name: 'Raiden Shogun', star: 5, element: 'Electro', power: 600 },
  { id: 'nahida', name: 'Nahida', star: 5, element: 'Dendro', power: 550 },
  { id: 'furina', name: 'Furina', star: 5, element: 'Hydro', power: 650 },
  { id: 'mavuika', name: 'Mavuika', star: 5, element: 'Pyro', power: 700 },
  { id: 'neuvillette', name: 'Neuvillette', star: 5, element: 'Hydro', power: 800 },
  { id: 'arlecchino', name: 'Arlecchino', star: 5, element: 'Pyro', power: 750 }
]

// Data Artifact Domains
const ARTIFACT_SETS = [
  { name: 'Gladiator', type: 'ATK', minVal: 50, maxVal: 150 },
  { name: 'Crimson Witch', type: 'ATK', minVal: 60, maxVal: 180 },
  { name: 'Noblesse Oblige', type: 'DEF', minVal: 30, maxVal: 100 },
  { name: 'Blizzard Strayer', type: 'LUCK', minVal: 5, maxVal: 20 },
  { name: 'Maiden Beloved', type: 'HP', minVal: 500, maxVal: 2000 }
]

const handler = async (m, { conn, usedPrefix, command, text }) => {
  const db = loadDb()
  if (!db) return replyText(conn, m, '[ ⚠️ ] Database offline. Pancing dengan command .profile di RPG utama.')
  
  const u = ensureGenshinData(db, m.sender)
  if (!u) return replyText(conn, m, '[ ⚠️ ] Profil tidak ditemukan. Ketik .profile dulu di RPG utama.')

  const args = String(text || '').trim().split(/\s+/).filter(Boolean)
  const sub = String(command || '').toLowerCase()

  // Resin Regeneration Logic (1 Resin per 8 Minutes)
  const lastResin = u.genshin.lastResinUpdate || now()
  const minsPassed = Math.floor((now() - lastResin) / (1000 * 60 * 8))
  if (minsPassed > 0 && u.genshin.resin < 160) {
    u.genshin.resin = Math.min(160, u.genshin.resin + minsPassed)
    u.genshin.lastResinUpdate = now()
    saveDb(db)
  }

  const menu = [
    `*▣ TEYVAT TRAVELER (GENSHIN) ▣*`,
    `Gacha, farming artefak, dan bentuk Party terkuatmu!`,
    ``,
    `${usedPrefix}teyvat info`,
    `${usedPrefix}commissions`,
    `${usedPrefix}wish <1/10>`,
    `${usedPrefix}party set <char_id>`,
    `${usedPrefix}domain`,
    `${usedPrefix}artifact list`,
    `${usedPrefix}artifact equip <id>`,
    `${usedPrefix}convertmora <jumlah>`
  ]

  switch (sub) {
    case 'teyvat':
    case 'genshin': {
      const action = (args[0] || '').toLowerCase()

      if (!action || action === 'help') {
        await showList(conn, m, 'ADVENTURERS GUILD', menu, 'Ad astra abyssosque!')
        break
      }

      if (action === 'info') {
        let resinTxt = u.genshin.resin >= 160 ? '160 / 160 (Penuh!)' : `${u.genshin.resin} / 160`
        
        // Hitung kekuatan Party
        let partyPower = 0
        let elements = {}
        let resonance = 'Tidak Ada'
        
        const activeParty = u.genshin.party.map(id => CHARACTERS.find(c => c.id === id)).filter(Boolean)
        
        activeParty.forEach(c => {
           partyPower += c.power
           elements[c.element] = (elements[c.element] || 0) + 1
        })
        
        // Cek Elemental Resonance
        if (elements['Pyro'] >= 2) resonance = 'Fervent Flames (ATK+++)'
        else if (elements['Hydro'] >= 2) resonance = 'Soothing Water (HP+++)'
        else if (elements['Geo'] >= 2) resonance = 'Enduring Rock (DEF+++)'
        else if (activeParty.length === 4) resonance = 'Protective Canopy (All Resist)'

        const partyNames = activeParty.length > 0 ? activeParty.map(c => c.name).join(', ') : 'Solo Traveler'

        await showList(conn, m, `TRAVELER CARD: @${m.sender.split('@')[0]}`, [
          `🎖️ Adventure Rank (AR): ${u.genshin.ar}`,
          `🌙 Original Resin: ${resinTxt}`,
          `💎 Primogems: ${formatNum(u.genshin.primos)}`,
          `🪙 Mora: ${formatNum(u.genshin.mora)}`,
          `✨ Pity Rate: ${u.genshin.pity} / 90`,
          ``,
          `*=== ACTIVE PARTY ===*`,
          `👥 Anggota: ${partyNames}`,
          `💥 Resonance: ${resonance}`,
          `⚔️ Party Power Bonus: +${formatNum(partyPower)}`
        ])
      }
      break
    }

    case 'commissions':
    case 'dailyquest': {
      const lastCom = u.genshin.lastCommissions || 0
      const diffHrs = (now() - lastCom) / (1000 * 60 * 60)
      
      if (diffHrs < 24) return replyText(conn, m, `[ ⚠️ ] Katheryne bilang misi harianmu sudah selesai. Kembali dalam: ${msToClock((lastCom + 24 * 60 * 60 * 1000) - now())}`)
      
      const primosGained = rand(40, 60) // Standar Genshin 60 Primos
      const moraGained = rand(10000, 30000)
      const arExp = 250
      
      u.genshin.primos += primosGained
      u.genshin.mora += moraGained
      u.genshin.arExp += arExp
      
      // Level Up AR Logic
      let arUp = false
      const expNeeded = u.genshin.ar * 500
      if (u.genshin.arExp >= expNeeded) {
         u.genshin.arExp -= expNeeded
         u.genshin.ar += 1
         arUp = true
      }
      
      u.genshin.lastCommissions = now()
      saveDb(db)
      
      let upTxt = arUp ? `\n\n🌟 *ADVENTURE RANK UP!* Kamu mencapai AR ${u.genshin.ar}.` : ''
      await replyText(conn, m, `📋 *DAILY COMMISSIONS CLEARED*\n\nKatheryne memberikan hadiahmu:\n💎 +${primosGained} Primogems\n🪙 +${formatNum(moraGained)} Mora\n💠 +${arExp} AR EXP${upTxt}\n\n"Ad astra abyssosque!"`)
      break
    }

    case 'wish':
    case 'gacha': {
      const pullType = Math.floor(Number(args[0])) === 10 ? 10 : 1
      const cost = pullType * 160
      
      if (u.genshin.primos < cost) return replyText(conn, m, `[ ⚠️ ] Primogems tidak cukup! Butuh 💎 ${cost} Primos untuk ${pullType}x Pull. (Gunakan .commissions)`)
      
      u.genshin.primos -= cost
      let pulls = []
      let got5Star = false
      
      for(let i=0; i<pullType; i++) {
        u.genshin.pity += 1
        
        let roll = Math.random() * 100
        let is5Star = false
        let is4Star = false
        
        // Hard Pity & Soft Pity Logic
        if (u.genshin.pity >= 90) { is5Star = true; roll = 0; } // Guaranteed
        else if (u.genshin.pity >= 75) { roll -= 20; } // Soft Pity boost
        
        if (roll <= 0.6 || is5Star) {
           is5Star = true
           u.genshin.pity = 0 // Reset Pity
           got5Star = true
           const char5 = pick(CHARACTERS.filter(c => c.star === 5))
           pulls.push(`🌟🌟🌟🌟🌟 ${char5.name} [${char5.element}]`)
           if (!u.genshin.characters.includes(char5.id)) u.genshin.characters.push(char5.id)
           else pulls[pulls.length-1] += ` (Constellation)` // Dupe jadi cons (easter egg teks aja)
        } 
        else if (roll <= 5.1 || u.genshin.pity % 10 === 0) { // Garansi bintang 4 tiap 10 pull
           is4Star = true
           const char4 = pick(CHARACTERS.filter(c => c.star === 4))
           pulls.push(`⭐🌟⭐⭐ ${char4.name} [${char4.element}]`)
           if (!u.genshin.characters.includes(char4.id)) u.genshin.characters.push(char4.id)
        } 
        else {
           pulls.push(`⭐⭐⭐ Debate Club (Weapon)`)
        }
      }
      
      saveDb(db)
      
      let header = got5Star ? `✨ *GOLDEN METEOR FALLS!* ✨` : `☄️ *PURPLE METEOR FALLS!*`
      await replyText(conn, m, `${header}\n\nHasil Wish (${pullType}x Pull):\n${pulls.map(p => `• ${p}`).join('\n')}\n\nPity Saat Ini: ${u.genshin.pity}/90`)
      break
    }

    case 'party': {
      const action = (args[0] || '').toLowerCase()
      
      if (action === 'set' || action === 'add') {
         const charId = (args[1] || '').toLowerCase()
         const charData = CHARACTERS.find(c => c.id === charId || c.name.toLowerCase().includes(charId))
         
         if (!charData) {
            const myChars = u.genshin.characters.map(id => CHARACTERS.find(c => c.id === id)?.name).join(', ')
            return replyText(conn, m, `[ ⚠️ ] Karakter tidak ditemukan.\nKaraktermu: ${myChars || 'Belum punya'}\nFormat: ${usedPrefix}party set <nama_karakter>`)
         }
         
         if (!u.genshin.characters.includes(charData.id)) return replyText(conn, m, `[ ⚠️ ] Kamu belum gacha karakter ini.`)
         if (u.genshin.party.includes(charData.id)) return replyText(conn, m, `[ ⚠️ ] Karakter sudah ada di Party.`)
         if (u.genshin.party.length >= 4) return replyText(conn, m, `[ ⚠️ ] Party penuh! Ketik .party clear untuk mereset party.`)
         
         u.genshin.party.push(charData.id)
         saveDb(db)
         await replyText(conn, m, `👥 *PARTY UPDATED*\n${charData.name} bergabung ke dalam Party! (${u.genshin.party.length}/4)`)
      }
      
      else if (action === 'clear') {
         u.genshin.party = []
         saveDb(db)
         await replyText(conn, m, `👥 *PARTY CLEARED*\nSemua karakter telah diistirahatkan.`)
      }
      else {
         replyText(conn, m, `[ ⚠️ ] Gunakan ${usedPrefix}party set <nama> atau ${usedPrefix}party clear`)
      }
      break
    }

    case 'domain':
    case 'artefak': {
      if (u.genshin.resin < 20) return replyText(conn, m, `[ ⚠️ ] Original Resin tidak cukup. Butuh 20 Resin. (Resin kamu: ${u.genshin.resin})`)
      
      u.genshin.resin -= 20
      
      const set = pick(ARTIFACT_SETS)
      const slots = ['flower', 'plume', 'sands', 'goblet', 'circlet']
      const slotName = pick(slots)
      const val = rand(set.minVal, set.maxVal)
      
      // Buat ID unik untuk item
      const artfId = `artf_${now().toString().slice(-6)}`
      const artifactData = {
         id: artfId,
         set: set.name,
         slot: slotName,
         type: set.type,
         value: val
      }
      
      u.genshin.inventory.push(artifactData)
      
      // Dapet Mora juga
      const moraLoot = rand(5000, 15000)
      u.genshin.mora += moraLoot
      
      saveDb(db)
      await replyText(conn, m, `🌳 *DOMAIN CLEARED* (Resin -20)\nKamu menaklukkan ruang ilusi dan mendapatkan:\n\n🪙 +${formatNum(moraLoot)} Mora\n✨ *ARTIFACT DROPPED!*\n↳ Set: ${set.name}\n↳ Tipe: ${slotName.toUpperCase()} (+${val} ${set.type})\n↳ ID: ${artfId}\n\n*Gunakan ${usedPrefix}artifact equip ${artfId} untuk memakainya.*`)
      break
    }

    case 'artifact': {
      const action = (args[0] || '').toLowerCase()
      
      if (action === 'list') {
         if (u.genshin.inventory.length === 0) return replyText(conn, m, '[ ⚠️ ] Tas artefakmu kosong. Farming dulu di .domain')
         
         const rows = u.genshin.inventory.slice(-15).map(a => `[ ${a.id} ] ${a.set} (${a.slot.toUpperCase()}) | +${a.value} ${a.type}`)
         await showList(conn, m, 'INVENTORY (LAST 15 ARTIFACTS)', rows, `Equip: ${usedPrefix}artifact equip <id>`)
      }
      
      else if (action === 'equip') {
         const artfId = (args[1] || '').toLowerCase()
         const artf = u.genshin.inventory.find(a => a.id === artfId)
         
         if (!artf) return replyText(conn, m, '[ ⚠️ ] Artefak tidak ditemukan di tasmu.')
         
         const slotTarget = artf.slot
         u.genshin.artifacts[slotTarget] = artf
         
         // Injeksi stat ke base profile RPG
         if (artf.type === 'ATK') u.atk += artf.value
         if (artf.type === 'DEF') u.def += artf.value
         if (artf.type === 'HP') { u.maxHp += artf.value; u.hp = u.maxHp; }
         if (artf.type === 'LUCK') u.luck += artf.value
         
         saveDb(db)
         await replyText(conn, m, `🛡️ *ARTIFACT EQUIPPED*\n[ ${artf.set} ] dipasang pada slot ${slotTarget.toUpperCase()}.\nStat dasar tubuh utamamu meningkat drastis!`)
      }
      break
    }

    case 'convertmora': {
      const amount = Math.floor(Number(args[0]))
      if (isNaN(amount) || amount < 1000) return replyText(conn, m, `[ ⚠️ ] Minimal convert 1000 Gold.\nFormat: ${usedPrefix}convertmora <jumlah_gold>`)
      if (u.gold < amount) return replyText(conn, m, '[ ⚠️ ] Gold kamu kurang.')
      
      u.gold -= amount
      // Rate tukar 1 Gold = 2 Mora (Teyvat inflasi)
      const moraGained = amount * 2
      u.genshin.mora += moraGained
      
      saveDb(db)
      await replyText(conn, m, `💱 *CURRENCY CONVERTED*\nBank Teyvat menukar ${formatNum(amount)} Gold menjadi ${formatNum(moraGained)} Mora!`)
      break
    }

    default:
      break
  }
}

handler.help = ['teyvat', 'commissions', 'wish', 'domain']
handler.tags = ['rpg']
handler.command = /^(teyvat|genshin|commissions|dailyquest|wish|gacha|party|domain|artefak|artifact|convertmora)$/i
handler.limit = false
handler.register = false

export default handler
