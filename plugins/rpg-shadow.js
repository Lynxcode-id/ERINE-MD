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

// Injeksi data Shadow Monarch ke profil player
function ensureShadowData(db, jid) {
  if (!db.users[jid]) return false
  const u = db.users[jid]
  
  u.shadow = u.shadow || {
    isAwakened: false,
    job: 'Shadow Sovereign',
    souls: 0, // Mata uang khusus buat bangkitin bayangan
    armyLimit: 5,
    army: [], // Array of shadow objects
    gatesCleared: 0,
    lastGate: 0
  }
  
  return u
}

async function showList(conn, m, title, rows, footer = '') {
  const txt = [
    `╔═══『 🌑 ${title} 』═══`,
    ...rows.map(r => `╠ ⎔ ${r}`),
    `╚══════════════════════`,
    footer ? `[👑] ${footer}` : ''
  ].filter(Boolean).join('\n')
  await conn.sendMessage(m.chat, { text: txt }, { quoted: m })
}

function replyText(conn, m, text) {
  return conn.sendMessage(m.chat, { text }, { quoted: m })
}

// Shadow Ranks & Power Scaling
const SHADOW_RANKS = {
  1: { name: 'Infantry', power: 100, buff: 50 },
  2: { name: 'Elite', power: 300, buff: 150 },
  3: { name: 'Knight', power: 1000, buff: 500 },
  4: { name: 'Commander', power: 3500, buff: 1500 },
  5: { name: 'Marshal', power: 12000, buff: 5000 },
  6: { name: 'Grand Marshal', power: 50000, buff: 20000 }
}

const SHADOW_NAMES = ['Igris', 'Beru', 'Iron', 'Tank', 'Kaisel', 'Greed', 'Bellion', 'Tusk', 'Jima']

// Dimensional Gates
const GATES = {
  'E': { powerReq: 300, soulReward: [5, 15], goldReward: 50000 },
  'D': { powerReq: 1000, soulReward: [20, 50], goldReward: 150000 },
  'C': { powerReq: 3500, soulReward: [60, 120], goldReward: 400000 },
  'B': { powerReq: 10000, soulReward: [150, 300], goldReward: 1000000 },
  'A': { powerReq: 35000, soulReward: [400, 800], goldReward: 3000000 },
  'S': { powerReq: 100000, soulReward: [1000, 2500], goldReward: 10000000 },
  'SSS': { powerReq: 500000, soulReward: [5000, 10000], goldReward: 50000000, drop: 'voidcore' }
}

const handler = async (m, { conn, usedPrefix, command, text }) => {
  const db = loadDb()
  if (!db) return replyText(conn, m, '[ ⚠️ ] Database offline. Pancing dengan command .profile di RPG utama.')
  
  const u = ensureShadowData(db, m.sender)
  if (!u) return replyText(conn, m, '[ ⚠️ ] Profil tidak ditemukan. Ketik .profile dulu di RPG utama.')

  const args = String(text || '').trim().split(/\s+/).filter(Boolean)
  const sub = String(command || '').toLowerCase()

  const menu = [
    `*▣ SHADOW MONARCH SYSTEM ▣*`,
    `Bangkitkan yang telah mati menjadi pasukanmu!`,
    ``,
    `${usedPrefix}shadow info`,
    `${usedPrefix}awaken`,
    `${usedPrefix}arise`,
    `${usedPrefix}shadow army`,
    `${usedPrefix}shadow fuse <id1> <id2>`,
    `${usedPrefix}shadow expand`,
    ``,
    `*▣ DIMENSIONAL GATES ▣*`,
    `${usedPrefix}gate list`,
    `${usedPrefix}gate enter <Rank>`
  ]

  switch (sub) {
    case 'shadow':
    case 'monarch': {
      const action = (args[0] || '').toLowerCase()

      if (!action || action === 'help') {
        await showList(conn, m, 'SYSTEM: PLAYER VERIFIED', menu, 'Arise.')
        break
      }

      if (action === 'info') {
        if (!u.shadow.isAwakened) return replyText(conn, m, `[ ⚠️ ] Kamu belum melewati proses Awakening. Ketik ${usedPrefix}awaken`)

        let totalPower = 0
        let totalBuff = 0
        u.shadow.army.forEach(s => {
           totalPower += SHADOW_RANKS[s.rank].power
           totalBuff += SHADOW_RANKS[s.rank].buff
        })

        await showList(conn, m, `SOVEREIGN: @${m.sender.split('@')[0]}`, [
          `👑 Job: ${u.shadow.job}`,
          `👻 Soul Essence: ${formatNum(u.shadow.souls)}`,
          `🌀 Gates Cleared: ${formatNum(u.shadow.gatesCleared)}`,
          ``,
          `*=== SHADOW ARMY ===*`,
          `👥 Kapasitas: ${u.shadow.army.length} / ${u.shadow.armyLimit}`,
          `⚔️ Army Power: ${formatNum(totalPower)}`,
          `🛡️ Passive Buff ke Player: ATK/DEF +${formatNum(totalBuff)}`
        ])
      } 
      
      else if (action === 'army') {
        if (!u.shadow.isAwakened) return replyText(conn, m, '[ ⚠️ ] Awaken dulu!')
        if (u.shadow.army.length === 0) return replyText(conn, m, `[ ⚠️ ] Pasukanmu kosong. Bunuh monster di RPG / Abyss atau gunakan ${usedPrefix}arise`)
        
        const rows = u.shadow.army.map(s => `[ ID: ${s.id} ] ${s.name} \n    ↳ Rank: ${SHADOW_RANKS[s.rank].name} | Power: ${formatNum(SHADOW_RANKS[s.rank].power)}`)
        await showList(conn, m, 'YOUR SHADOW SOLDIERS', rows, `Fuse pasukan: ${usedPrefix}shadow fuse <id1> <id2>`)
      }

      else if (action === 'fuse' || action === 'gabung') {
        const id1 = args[1]
        const id2 = args[2]
        
        if (!id1 || !id2) return replyText(conn, m, `[ ⚠️ ] Format: ${usedPrefix}shadow fuse <id1> <id2>\nLihat ID di .shadow army`)
        if (id1 === id2) return replyText(conn, m, '[ ⚠️ ] Tidak bisa menggabungkan bayangan yang sama dengan dirinya sendiri.')
        
        const s1Index = u.shadow.army.findIndex(s => s.id === id1)
        const s2Index = u.shadow.army.findIndex(s => s.id === id2)
        
        if (s1Index === -1 || s2Index === -1) return replyText(conn, m, '[ ⚠️ ] ID Shadow tidak ditemukan di pasukanmu.')
        
        const s1 = u.shadow.army[s1Index]
        const s2 = u.shadow.army[s2Index]
        
        if (s1.rank !== s2.rank) return replyText(conn, m, `[ ⚠️ ] Hanya bisa melakukan fusi pada Shadow dengan Rank yang SAMA!\n(${s1.name} Rank ${s1.rank} vs ${s2.name} Rank ${s2.rank})`)
        if (s1.rank >= 6) return replyText(conn, m, '[ ⚠️ ] Rank Grand Marshal adalah batas maksimal. Tidak bisa difusi lagi.')
        
        const costGold = s1.rank * 500000
        if (u.gold < costGold) return replyText(conn, m, `[ ⚠️ ] Fusi butuh katalis Gold! Biaya: ${formatNum(costGold)} Gold.`)
        
        // Proses Fusi
        u.gold -= costGold
        const newRank = s1.rank + 1
        
        // Buang yang lama, masukin yang baru
        // Urutkan index dari yang terbesar biar pas di-splice index satunya ga geser
        const indices = [s1Index, s2Index].sort((a, b) => b - a)
        u.shadow.army.splice(indices[0], 1)
        u.shadow.army.splice(indices[1], 1)
        
        const newShadow = {
           id: `sh_${now().toString().slice(-5)}`,
           name: `${s1.name} (Evolved)`,
           rank: newRank
        }
        
        u.shadow.army.push(newShadow)
        
        // Suntik tambahan buff ke profil player utama
        const buffDiff = SHADOW_RANKS[newRank].buff - (SHADOW_RANKS[s1.rank].buff * 2) // Hitung selisih power yg didapat
        if (buffDiff > 0) {
           u.atk += buffDiff
           u.def += buffDiff
        }
        
        saveDb(db)
        await replyText(conn, m, `🌑 *SHADOW EXTRACTION FUSION!* 🌑\n\n${s1.name} dan ${s2.name} melebur menjadi entitas yang lebih kuat...\nLahir Shadow baru: [ ${newShadow.name} ] - Rank: ${SHADOW_RANKS[newRank].name}!\n\nStat dasar Player (ATK/DEF) meningkat menyesuaikan kekuatan pasukan!`)
      }

      else if (action === 'expand') {
        const currentLimit = u.shadow.armyLimit
        if (currentLimit >= 20) return replyText(conn, m, '[ ⚠️ ] Kapasitas pasukanmu sudah MAX (20 Slots).')
        
        const costCores = Math.floor(currentLimit / 5) + 1
        const costGold = currentLimit * 1000000
        
        if ((u.items['cybercore'] || 0) < costCores || u.gold < costGold) {
           return replyText(conn, m, `[ ⚠️ ] Butuh 💰 ${formatNum(costGold)} Gold & 💠 ${costCores} Cyber Core untuk memperluas kapasitas pasukan (+1 Slot).`)
        }
        
        u.gold -= costGold
        u.items['cybercore'] -= costCores
        u.shadow.armyLimit += 1
        
        saveDb(db)
        await replyText(conn, m, `🌌 *DOMAIN EXPANDED*\nKapasitas Shadow Army bertambah!\nBatas Pasukan: ${u.shadow.army.length} / ${u.shadow.armyLimit}`)
      }
      else {
        replyText(conn, m, `[ ⚠️ ] Command salah. Ketik ${usedPrefix}shadow untuk menu.`)
      }
      break
    }

    case 'awaken': {
      if (u.shadow.isAwakened) return replyText(conn, m, '[ ⚠️ ] Kamu sudah menjadi Shadow Sovereign.')
      if (u.level < 50) return replyText(conn, m, '[ ⚠️ ] Hanya Player Level 50+ (Hero/Mythic) yang bisa bertahan dari proses Awakening ini.')
      
      u.shadow.isAwakened = true
      u.shadow.souls += 10 // Modal awal
      
      saveDb(db)
      await replyText(conn, m, `[SYSTEM WARNING: DANGER DETECTED]\n[SECRET QUEST COMPLETED: THE HIDDEN POWER]\n\n🌑 *AWAKENING SUCCESSFUL* 🌑\nDetak jantungmu berhenti sejenak... lalu bayanganmu bangkit hidup.\nKamu kini mengemban class rahasia: *Shadow Sovereign*.\n\nGunakan .arise untuk memanggil pasukan pertamamu!`)
      break
    }

    case 'arise':
    case 'bangkitlah': {
      if (!u.shadow.isAwakened) return replyText(conn, m, '[ ⚠️ ] Jalani .awaken terlebih dahulu.')
      if (u.shadow.army.length >= u.shadow.armyLimit) return replyText(conn, m, `[ ⚠️ ] Kapasitas pasukan penuh! (${u.shadow.armyLimit}). Gunakan .shadow expand atau .shadow fuse`)
      
      const costSouls = 5
      if (u.shadow.souls < costSouls) return replyText(conn, m, `[ ⚠️ ] Soul Essence kurang! Butuh 👻 ${costSouls}.\n(Dapatkan Soul dari mengeksplorasi Dimensional .gate)`)
      
      u.shadow.souls -= costSouls
      
      const shadowName = pick(SHADOW_NAMES) + (Math.random() > 0.5 ? ' Knight' : ' Mage')
      const newShadow = {
         id: `sh_${now().toString().slice(-4)}`, // Random 4 digit ID
         name: shadowName,
         rank: 1 // Selalu mulai dari Infantry
      }
      
      u.shadow.army.push(newShadow)
      
      // Tambah stat pasif ke player
      u.atk += SHADOW_RANKS[1].buff
      u.def += SHADOW_RANKS[1].buff
      
      saveDb(db)
      await replyText(conn, m, `🗣️ *"ARISE."*\n\nBayangan hitam merayap dari tanah, membentuk wujud prajurit.\nKamu mendapatkan Shadow Soldier: [ ${newShadow.name} ] (ID: ${newShadow.id})\n\nKekuatan mereka mengalir kepadamu: ATK & DEF +${SHADOW_RANKS[1].buff}!`)
      break
    }

    case 'gate': {
      if (!u.shadow.isAwakened) return replyText(conn, m, '[ ⚠️ ] Tylak bisa akses. Awaken dulu.')
      
      const action = (args[0] || '').toLowerCase()
      if (!action || action === 'list') {
        const rows = Object.entries(GATES).map(([rank, g]) => `[ Rank ${rank} ] Gate\n    ↳ Req. Army Power: ${formatNum(g.powerReq)}\n    ↳ Reward: 👻 ${g.soulReward[0]}-${g.soulReward[1]} Souls | 💰 ${formatNum(g.goldReward)}G`)
        return showList(conn, m, 'DIMENSIONAL GATES', rows, `Masuk: ${usedPrefix}gate enter <Rank>`)
      }

      if (action === 'enter' || action === 'masuk') {
        const rank = (args[1] || '').toUpperCase()
        const gate = GATES[rank]
        
        if (!gate) return replyText(conn, m, '[ ⚠️ ] Rank Gate tidak valid. (E/D/C/B/A/S/SSS)')
        
        const lastGate = u.shadow.lastGate || 0
        if (now() - lastGate < 30 * 60 * 1000) return replyText(conn, m, `[ ⚠️ ] Portal Gate sedang dalam cooldown. Tunggu: ${msToClock((lastGate + 30 * 60 * 1000) - now())}`)

        // Hitung Total Power Army
        let armyPower = 0
        u.shadow.army.forEach(s => { armyPower += SHADOW_RANKS[s.rank].power })
        
        if (armyPower < gate.powerReq) {
           return replyText(conn, m, `[ ⚠️ ] Gate Rank ${rank} memancarkan energi menakutkan!\nTotal Power Army kamu (${formatNum(armyPower)}) tidak cukup untuk menembusnya (Butuh: ${formatNum(gate.powerReq)}). Lakukan Fusi atau ekspansi pasukanmu!`)
        }

        u.shadow.lastGate = now()
        
        const soulsGot = rand(gate.soulReward[0], gate.soulReward[1]) + (u.luck > 100 ? 5 : 0)
        u.shadow.souls += soulsGot
        u.gold += gate.goldReward
        u.shadow.gatesCleared += 1
        
        let dropTxt = ''
        if (gate.drop && Math.random() > 0.5) {
           u.items = u.items || {}
           u.items[gate.drop] = (u.items[gate.drop] || 0) + 1
           dropTxt = `\n🎁 *Loot Ekstra:* 1x ${gate.drop.toUpperCase()}`
        }

        saveDb(db)
        await replyText(conn, m, `🌀 *GATE CLEARED!* 🌀\nPasukan bayanganmu menyerbu ke dalam Gate Rank ${rank} dan membantai bos di dalamnya tanpa sisa!\n\n👻 Mendapatkan: +${formatNum(soulsGot)} Soul Essence\n💰 Mendapatkan: +${formatNum(gate.goldReward)} Gold${dropTxt}\n\n*Gate akan terbuka lagi dalam 30 Menit.*`)
      }
      break
    }

    default:
      break
  }
}

handler.help = ['shadow', 'awaken', 'arise', 'gate']
handler.tags = ['rpg']
handler.command = /^(shadow|monarch|awaken|arise|bangkitlah|gate)$/i
handler.limit = false
handler.register = false

export default handler
