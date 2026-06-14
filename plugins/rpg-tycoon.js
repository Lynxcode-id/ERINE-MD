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

// Injeksi data Tycoon & Mercenary
function ensureTycoonData(db, jid) {
  if (!db.users[jid]) return false
  const u = db.users[jid]
  
  u.tycoon = u.tycoon || {
    properties: [], // Array of property IDs
    lastCollect: 0,
    mercs: [], // Array of hired mercenaries { id, name, rarity, level }
    dispatch: null // { mercId, endTime, type }
  }
  
  return u
}

async function showList(conn, m, title, rows, footer = '') {
  const txt = [
    `╔═══『 🏙️ ${title} 』═══`,
    ...rows.map(r => `╠ ⎔ ${r}`),
    `╚══════════════════════`,
    footer ? `[🏢] ${footer}` : ''
  ].filter(Boolean).join('\n')
  await conn.sendMessage(m.chat, { text: txt }, { quoted: m })
}

function replyText(conn, m, text) {
  return conn.sendMessage(m.chat, { text }, { quoted: m })
}

// Katalog Properti
const PROPERTIES = {
  'nightclub': { name: 'Neon Nightclub', price: 200000, desc: 'Pasif Gold', output: { gold: 15000 } },
  'arcade': { name: 'Holo-Arcade', price: 300000, desc: 'Pasif EXP', output: { exp: 5000 } },
  'biolab': { name: 'Underground Bio-Lab', price: 500000, desc: 'Pasif Potion & Energy', output: { items: ['hi_potion', 'energy_drink'] } },
  'factory': { name: 'Cyber-Weapon Factory', price: 1000000, desc: 'Pasif Tech-Scrap & Ore', output: { techScrap: 100, items: ['ore', 'iron'] } },
  'syndicate_hq': { name: 'Fixer Penthouse HQ', price: 5000000, desc: 'Pasif Cybercore & Crate', output: { items: ['cybercore', 'crate_iron'] } }
}

// Gacha Mercenary (Pembunuh Bayaran)
const MERCENARY_POOL = [
  { id: 'm1', name: 'Street Punk', rarity: 'Common', power: 10 },
  { id: 'm2', name: 'Gun-for-Hire', rarity: 'Common', power: 15 },
  { id: 'm3', name: 'Cyber-Ninja', rarity: 'Rare', power: 40 },
  { id: 'm4', name: 'Ex-Military Sniper', rarity: 'Rare', power: 50 },
  { id: 'm5', name: 'Netrunner Prodigy', rarity: 'Epic', power: 90 },
  { id: 'm6', name: 'Cyborg Enforcer', rarity: 'Epic', power: 110 },
  { id: 'm7', name: 'Ghost Assassin', rarity: 'Legendary', power: 250 },
  { id: 'm8', name: 'Apex-Predator', rarity: 'Mythic', power: 500 }
]

function getMercGacha() {
  const roll = rand(1, 1000)
  if (roll <= 10) return MERCENARY_POOL.find(m => m.rarity === 'Mythic') // 1%
  if (roll <= 60) return pick(MERCENARY_POOL.filter(m => m.rarity === 'Legendary')) // 5%
  if (roll <= 260) return pick(MERCENARY_POOL.filter(m => m.rarity === 'Epic')) // 20%
  if (roll <= 600) return pick(MERCENARY_POOL.filter(m => m.rarity === 'Rare')) // 34%
  return pick(MERCENARY_POOL.filter(m => m.rarity === 'Common')) // 40%
}

const handler = async (m, { conn, usedPrefix, command, text }) => {
  const db = loadDb()
  if (!db) return replyText(conn, m, '[ ⚠️ ] Database offline. Pancing dengan command .profile di RPG utama.')
  
  const u = ensureTycoonData(db, m.sender)
  if (!u) return replyText(conn, m, '[ ⚠️ ] Profil tidak ditemukan. Ketik .profile dulu di RPG utama.')

  const args = String(text || '').trim().split(/\s+/).filter(Boolean)
  const sub = String(command || '').toLowerCase()

  const menu = [
    `*▣ CYBER-CITY TYCOON ▣*`,
    `Kuasai distrik, rekrut agen, dan jadilah bos mafia!`,
    ``,
    `*Real Estate:*`,
    `${usedPrefix}city info`,
    `${usedPrefix}property list`,
    `${usedPrefix}property buy <id>`,
    `${usedPrefix}property collect`,
    ``,
    `*Black-Ops:*`,
    `${usedPrefix}merc list`,
    `${usedPrefix}merc hire`,
    `${usedPrefix}dispatch <nomor_merc> <jam>`,
    `${usedPrefix}dispatch claim`
  ]

  switch (sub) {
    case 'city':
    case 'tycoon': {
      if (args[0] === 'info') {
        const props = u.tycoon.properties.length > 0 
          ? u.tycoon.properties.map(p => `🏢 ${PROPERTIES[p].name}`).join('\n╠ ') 
          : 'Belum punya properti.'
          
        const mercCount = u.tycoon.mercs.length
        const isDispatch = u.tycoon.dispatch ? `Aktif (${msToClock(Math.max(0, u.tycoon.dispatch.endTime - now()))} tersisa)` : 'Standby'

        await showList(conn, m, `FIXER PROFILE: @${m.sender.split('@')[0]}`, [
          `*=== ASET PROPERTI ===*`,
          `╠ ${props}`,
          ``,
          `*=== BLACK-OPS ===*`,
          `👥 Total Agen (Mercs): ${mercCount}`,
          `🚁 Status Dispatch: ${isDispatch}`
        ])
      } else {
        await showList(conn, m, 'NEON CITY FIXER', menu, 'Bangun Kekaisaran Bawah Tanahmu')
      }
      break
    }

    case 'property':
    case 'properti': {
      const action = (args[0] || '').toLowerCase()

      if (action === 'list' || action === 'shop') {
        const rows = Object.entries(PROPERTIES).map(([id, p]) => `[ ${id} ] ${p.name} \n    ↳ Harga: 💰 ${formatNum(p.price)} Gold\n    ↳ Output: ${p.desc}`)
        await showList(conn, m, 'REAL ESTATE MARKET', rows, `Beli: ${usedPrefix}property buy <id>`)
      }

      else if (action === 'buy') {
        const id = (args[1] || '').toLowerCase()
        const prop = PROPERTIES[id]
        if (!prop) return replyText(conn, m, '[ ⚠️ ] ID Properti tidak ditemukan.')
        if (u.tycoon.properties.includes(id)) return replyText(conn, m, '[ ⚠️ ] Kamu sudah menguasai properti ini.')
        
        if (u.gold < prop.price) return replyText(conn, m, `[ ⚠️ ] Saldo Gold tidak cukup! Butuh ${formatNum(prop.price)} Gold.`)
        
        u.gold -= prop.price
        u.tycoon.properties.push(id)
        if (!u.tycoon.lastCollect) u.tycoon.lastCollect = now()
        
        saveDb(db)
        await replyText(conn, m, `🏢 *AKUISISI SUKSES*\nSelamat! Kamu telah membeli [ ${prop.name} ].\nJangan lupa klaim hasil pasifnya lewat .property collect setiap hari!`)
      }

      else if (action === 'collect' || action === 'claim') {
        if (u.tycoon.properties.length === 0) return replyText(conn, m, '[ ⚠️ ] Kamu belum punya properti satupun. Beli di .property list')
        
        const last = u.tycoon.lastCollect || now()
        const diffHrs = (now() - last) / (1000 * 60 * 60)
        
        if (diffHrs < 1) return replyText(conn, m, `[ ⚠️ ] Pajak/Output belum terkumpul. Tunggu minimal 1 jam. (Kurang ${Math.floor(60 - (diffHrs * 60))} menit)`)
        
        const capHrs = Math.min(diffHrs, 24) // Maksimal akumulasi 24 jam
        
        let totalGold = 0
        let totalExp = 0
        let totalScrap = 0
        let itemsGot = {}

        for (const pid of u.tycoon.properties) {
          const out = PROPERTIES[pid].output
          if (out.gold) totalGold += Math.floor(out.gold * capHrs)
          if (out.exp) totalExp += Math.floor(out.exp * capHrs)
          if (out.techScrap && u.garage) u.garage.techScrap += Math.floor(out.techScrap * capHrs)
          
          if (out.items && diffHrs >= 12) { // Item khusus turun tiap 12 jam minimal
            for (const item of out.items) {
               itemsGot[item] = (itemsGot[item] || 0) + 1
            }
          }
        }

        u.gold += totalGold
        u.exp += totalExp
        if (Object.keys(itemsGot).length > 0) {
           u.items = u.items || {}
           for (const [id, qty] of Object.entries(itemsGot)) {
              u.items[id] = (u.items[id] || 0) + qty
           }
        }

        u.tycoon.lastCollect = now()
        saveDb(db)
        
        let itemTxt = Object.keys(itemsGot).length > 0 ? `\n🎁 *Bonus Produksi:* ` + Object.entries(itemsGot).map(([k,v]) => `${k} x${v}`).join(', ') : ''
        await replyText(conn, m, `💼 *PROPERTY REVENUE CLAIMED*\nKeuntungan dari seluruh bisnismu telah cair:\n\n💰 +${formatNum(totalGold)} Gold\n💠 +${formatNum(totalExp)} EXP${itemTxt}`)
      }
      else {
        replyText(conn, m, `[ ⚠️ ] Format salah. Cek menu: ${usedPrefix}city`)
      }
      break
    }

    case 'merc':
    case 'mercenary': {
      const action = (args[0] || '').toLowerCase()

      if (action === 'list') {
        if (u.tycoon.mercs.length === 0) return replyText(conn, m, '[ ⚠️ ] Kamu belum merekrut agen manapun. Ketik .merc hire')
        
        const rows = u.tycoon.mercs.map((m, i) => `[ ${i+1} ] ${m.name} | [${m.rarity}] | PWR: ${m.power}`)
        await showList(conn, m, 'MERCENARY ROSTER', rows, `Kirim misi: ${usedPrefix}dispatch <nomor> <jam>`)
      }

      else if (action === 'hire' || action === 'rekrut') {
        const costGold = 50000
        const costCore = 1 // Butuh 1 Cyber Core buat panggil agen dari dark web
        
        if (u.gold < costGold || (u.items['cybercore'] || 0) < costCore) {
          return replyText(conn, m, `[ ⚠️ ] Dana atau kontak koneksi kurang!\nBiaya Rekrut: 💰 ${formatNum(costGold)} Gold & 💠 1 Cyber Core.`)
        }
        
        u.gold -= costGold
        u.items['cybercore'] -= 1
        
        const newMerc = getMercGacha()
        // Buat ID unik untuk list user
        const mercData = {
          name: newMerc.name,
          rarity: newMerc.rarity,
          power: newMerc.power + rand(0, 10) // Variasi status
        }
        
        u.tycoon.mercs.push(mercData)
        saveDb(db)
        
        let rareTxt = newMerc.rarity === 'Legendary' || newMerc.rarity === 'Mythic' ? '🌟 *SUPER JACKPOT!* 🌟\n' : ''
        await replyText(conn, m, `${rareTxt}🤝 *MERCENARY HIRED*\nKamu menyewa agen baru dari Dark Web:\n\n👤 Nama: ${mercData.name}\n✨ Rarity: ${mercData.rarity}\n⚔️ Base Power: ${mercData.power}`)
      }
      break
    }

    case 'dispatch': {
      const action = (args[0] || '').toLowerCase()

      if (action === 'claim') {
        if (!u.tycoon.dispatch) return replyText(conn, m, '[ ⚠️ ] Tidak ada tim yang sedang dalam misi.')
        
        if (now() < u.tycoon.dispatch.endTime) {
          return replyText(conn, m, `[ ⚠️ ] Tim belum kembali. Sisa waktu: ${msToClock(u.tycoon.dispatch.endTime - now())}`)
        }
        
        // Misi Selesai
        const merc = u.tycoon.dispatch.merc
        const duration = u.tycoon.dispatch.duration
        
        // Reward Scale = Duration * Merc Power
        const rewardGold = duration * merc.power * rand(50, 100)
        const rewardExp = duration * merc.power * rand(20, 50)
        
        u.gold += rewardGold
        u.exp += rewardExp
        
        // Gacha Item Drops
        let drops = []
        u.items = u.items || {}
        if (duration >= 3 && Math.random() > 0.5) { drops.push('crate_iron'); u.items['crate_iron'] = (u.items['crate_iron'] || 0) + 1; }
        if (duration >= 8 && Math.random() > 0.3) { drops.push('crate_gold'); u.items['crate_gold'] = (u.items['crate_gold'] || 0) + 1; }
        if (merc.rarity === 'Mythic' || merc.rarity === 'Legendary') {
           if (Math.random() > 0.5) { drops.push('cybercore'); u.items['cybercore'] = (u.items['cybercore'] || 0) + 1; }
        }

        u.tycoon.dispatch = null // Kosongin status
        saveDb(db)
        
        let dropTxt = drops.length > 0 ? `\n🎁 *Loot Selundupan:* ` + drops.join(', ') : ''
        await replyText(conn, m, `🚁 *DISPATCH RETURNED*\nAgen [ ${merc.name} ] berhasil menyelesaikan misi Black-Ops!\n\n💰 +${formatNum(rewardGold)} Gold\n💠 +${formatNum(rewardExp)} EXP${dropTxt}`)
      }
      
      else {
        // Start Dispatch
        if (u.tycoon.dispatch) return replyText(conn, m, `[ ⚠️ ] Kamu sudah menugaskan agen. Tunggu sampai selesai, atau klaim dengan ${usedPrefix}dispatch claim`)
        
        const mercIndex = Math.floor(Number(args[0])) - 1
        let hrs = Math.floor(Number(args[1]))
        
        if (isNaN(mercIndex) || !u.tycoon.mercs[mercIndex]) return replyText(conn, m, `[ ⚠️ ] Agen tidak valid. Cek nomor di .merc list`)
        if (isNaN(hrs) || hrs < 1 || hrs > 12) return replyText(conn, m, `[ ⚠️ ] Durasi misi tidak valid (Pilih 1 - 12 jam).\nFormat: ${usedPrefix}dispatch <nomor_merc> <jam>`)
        
        const merc = u.tycoon.mercs[mercIndex]
        
        u.tycoon.dispatch = {
          merc: merc,
          duration: hrs,
          endTime: now() + (hrs * 60 * 60 * 1000)
        }
        
        saveDb(db)
        await replyText(conn, m, `🚁 *DISPATCH INITIATED*\nAgen [ ${merc.name} ] berangkat melakukan operasi rahasia selama ${hrs} Jam.\nJangan lupa ${usedPrefix}dispatch claim setelah waktunya habis!`)
      }
      break
    }

    default:
      break
  }
}

handler.help = ['city', 'property', 'merc', 'dispatch']
handler.tags = ['rpg']
handler.command = /^(city|tycoon|property|properti|merc|mercenary|dispatch)$/i
handler.limit = false
handler.register = false

export default handler
