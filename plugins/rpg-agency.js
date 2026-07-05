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

// Injeksi data Agency ke profile player
function ensureAgencyData(db, jid) {
  if (!db.users[jid]) return false
  const u = db.users[jid]
  
  u.agency = u.agency || {
    oshiName: null,
    rank: 'None',     // Trainee, Regular, Senbatsu, Kami-7
    fans: 0,
    popularity: 0,
    tickets: 0,       // Mata uang khusus konser
    lastLive: 0,
    lastTheater: 0
  }
  
  return u
}

const OSHI_NAMES = [
  'Holo-Miku', 'Cyber-Freya', 'Neon-Zee', 'Aero-Christy', 'Mecha-Muthe',
  'Synth-Gracia', 'Pixel-Adel', 'Quantum-Marsha', 'Vocaloid-Ella', 'Nova-Gita'
]

async function showList(conn, m, title, rows, footer = '') {
  const txt = [
    `╔═══『 🎤 ${title} 』═══`,
    ...rows.map(r => `╠ ⎔ ${r}`),
    `╚══════════════════════`,
    footer ? `[✨] ${footer}` : ''
  ].filter(Boolean).join('\n')
  await conn.sendMessage(m.chat, { text: txt }, { quoted: m })
}

function replyText(conn, m, text) {
  return conn.sendMessage(m.chat, { text }, { quoted: m })
}

const handler = async (m, { conn, usedPrefix, command, text }) => {
  const db = loadDb()
  if (!db) return replyText(conn, m, '[ ⚠️ ] Database belum siap. Buat profile di RPG utama dulu.')
  
  const u = ensureAgencyData(db, m.sender)
  if (!u) return replyText(conn, m, '[ ⚠️ ] Profil tidak ditemukan. Ketik .profile dulu di RPG utama.')

  const args = String(text || '').trim().split(/\s+/).filter(Boolean)
  const sub = String(command || '').toLowerCase()

  const menu = [
    `*▣ CYBER-IDOL AGENCY ▣*`,
    `Bangun agensi, orbitkan Oshi, dan kuasai panggung!`,
    ``,
    `${usedPrefix}agency info`,
    `${usedPrefix}agency scout`,
    `${usedPrefix}agency live`,
    `${usedPrefix}agency handshake`,
    `${usedPrefix}agency theater`,
    `${usedPrefix}agency rename <nama_baru>`
  ]

  switch (sub) {
    case 'agency':
    case 'idol':
    case 'oshi': {
      const action = (args[0] || '').toLowerCase()

      if (!action || action === 'help') {
        await showList(conn, m, 'AGENCY MENU', menu, 'Manajemen Holo-Idol')
        break
      }

      if (action === 'info') {
        if (!u.agency.oshiName) return replyText(conn, m, `[ ⚠️ ] Agensimu masih kosong. Lakukan rekrutmen: ${usedPrefix}agency scout`)
        
        let buffTxt = 'Tidak ada'
        if (u.agency.rank === 'Trainee') buffTxt = '+5% EXP dari Command'
        if (u.agency.rank === 'Regular') buffTxt = '+10% EXP & +5% Gold'
        if (u.agency.rank === 'Senbatsu') buffTxt = '+15% EXP, +10% Gold, +5 LUCK'
        if (u.agency.rank === 'Kami-7') buffTxt = '+30% Semua Income & +10 LUCK'

        await showList(conn, m, `AGENCY INFO: @${m.sender.split('@')[0]}`, [
          `🌟 Oshi: ${u.agency.oshiName}`,
          `🎖️ Rank: ${u.agency.rank}`,
          `👥 Fans (Wota): ${formatNum(u.agency.fans)}`,
          `🔥 Popularity: ${formatNum(u.agency.popularity)} / 100`,
          `🎫 Theater Tickets: ${formatNum(u.agency.tickets)}`,
          ``,
          `✨ *Passive Buff:* ${buffTxt}`
        ])
      } 
      
      else if (action === 'scout') {
        if (u.agency.oshiName) return replyText(conn, m, `[ ⚠️ ] Kamu sudah mengorbitkan ${u.agency.oshiName}. Pecat dulu kalau mau ganti (Segera hadir).`)
        
        const cost = 25000
        if (u.gold < cost) return replyText(conn, m, `[ ⚠️ ] Biaya pendaftaran Trainee kurang. Butuh ${formatNum(cost)} Gold.`)
        
        u.gold -= cost
        const newOshi = pick(OSHI_NAMES)
        u.agency.oshiName = newOshi
        u.agency.rank = 'Trainee'
        u.agency.fans = rand(10, 50)
        u.agency.popularity = 10
        
        saveDb(db)
        await replyText(conn, m, `🎉 *REKRUTMEN SUKSES*\nKamu berhasil mengorbitkan Trainee baru bernama *${newOshi}*!\nLakukan Live Showroom untuk mencari massa.`)
      }

      else if (action === 'live' || action === 'showroom') {
        if (!u.agency.oshiName) return replyText(conn, m, '[ ⚠️ ] Kamu belum punya Oshi.')
        
        const last = u.agency.lastLive || 0
        if (now() - last < 30 * 60 * 1000) return replyText(conn, m, `[ ⚠️ ] ${u.agency.oshiName} sedang istirahat. Tunggu: ${msToClock((last + 30 * 60 * 1000) - now())}`)
        if (u.energy < 15) return replyText(conn, m, '[ ⚠️ ] Energy manajer kurang untuk setting setup stream (Butuh 15).')
        
        u.energy -= 15
        const newFans = rand(10, 50) * (u.agency.popularity / 10)
        const saweria = rand(500, 2000) + (u.agency.fans * 2)
        
        u.agency.fans += Math.floor(newFans)
        u.gold += saweria
        u.agency.lastLive = now()
        
        // Cek Auto-Rank Up
        let rankUp = false
        if (u.agency.fans >= 1000 && u.agency.rank === 'Trainee') { u.agency.rank = 'Regular'; rankUp = true; u.agency.popularity += 10 }
        if (u.agency.fans >= 5000 && u.agency.rank === 'Regular') { u.agency.rank = 'Senbatsu'; rankUp = true; u.agency.popularity += 20 }
        if (u.agency.fans >= 20000 && u.agency.rank === 'Senbatsu') { u.agency.rank = 'Kami-7'; rankUp = true; u.agency.popularity += 30 }

        saveDb(db)
        await replyText(conn, m, `🔴 *LIVE SHOWROOM SELESAI*\n${u.agency.oshiName} menyapa fans dengan ceria!\n\n📈 Fans Baru: +${formatNum(newFans)}\n💰 Saweria/Gift: +${formatNum(saweria)} Gold${rankUp ? `\n\n🌟 *RANK UP!* Oshi kamu naik tingkat ke ${u.agency.rank}!` : ''}`)
      }

      else if (action === 'handshake') {
        if (!u.agency.oshiName) return replyText(conn, m, '[ ⚠️ ] Kamu belum punya Oshi.')
        if (u.agency.rank === 'Trainee') return replyText(conn, m, '[ ⚠️ ] Event Handshake cuma buat rank Regular ke atas. Perbanyak fans dulu!')
        if (u.gold < 5000) return replyText(conn, m, '[ ⚠️ ] Butuh modal 5,000 Gold untuk sewa venue event.')
        
        u.gold -= 5000
        const ticketSales = rand(5, 20)
        u.agency.tickets += ticketSales
        u.agency.popularity = Math.min(100, u.agency.popularity + 2)
        
        saveDb(db)
        await replyText(conn, m, `🤝 *HANDSHAKE EVENT BERHASIL*\nFans antusias bertemu ${u.agency.oshiName}.\nPopularity +2\n🎫 Mendapatkan +${ticketSales} Theater Tickets!`)
      }

      else if (action === 'theater') {
        if (!u.agency.oshiName) return replyText(conn, m, '[ ⚠️ ] Kamu belum punya Oshi.')
        if (u.agency.tickets < 50) return replyText(conn, m, `[ ⚠️ ] Butuh 50 Theater Tickets untuk buka konser. Tiket kamu: ${u.agency.tickets}`)
        
        const last = u.agency.lastTheater || 0
        if (now() - last < 12 * 60 * 60 * 1000) return replyText(conn, m, `[ ⚠️ ] Venue theater sedang dibersihkan. Tunggu: ${msToClock((last + 12 * 60 * 60 * 1000) - now())}`)
        
        u.agency.tickets -= 50
        u.agency.lastTheater = now()
        
        // Massive reward dari konser
        const goldGain = rand(20000, 50000) + (u.agency.fans * 5)
        const expGain = rand(5000, 10000)
        
        u.gold += goldGain
        // nambahin exp user
        const mult = u.xpBoost > now() ? 1.2 : 1
        u.exp += Math.floor(expGain * mult)
        
        // item drop (bisa dapet crate dari fans)
        u.items = u.items || {}
        u.items['crate_iron'] = (u.items['crate_iron'] || 0) + 1
        
        saveDb(db)
        await replyText(conn, m, `🎙️ *THEATER PERFORMANCE!* 🎙️\nPenampilan epik dari ${u.agency.oshiName} mengguncang panggung!\n\n💸 Keuntungan Tiket: +${formatNum(goldGain)} Gold\n💠 Manajer EXP: +${formatNum(expGain)}\n🎁 Fans melempar 1x Iron Crate ke panggung!`)
      }

      else if (action === 'rename') {
        const newName = args.slice(1).join(' ')
        if (!u.agency.oshiName) return replyText(conn, m, '[ ⚠️ ] Gak ada yang bisa diganti namanya.')
        if (!newName) return replyText(conn, m, `[ ⚠️ ] Format: ${usedPrefix}agency rename <nama_baru>`)
        if (u.items['crystal'] < 1) return replyText(conn, m, '[ ⚠️ ] Butuh 1 Crystal untuk mengurus berkas ganti nama panggung.')
        
        u.items['crystal'] -= 1
        u.agency.oshiName = newName.slice(0, 20) // limit panjang nama
        saveDb(db)
        await replyText(conn, m, `✨ *REBRANDING SUKSES*\nOshi kamu sekarang dikenal sebagai *${u.agency.oshiName}*!`)
      }
      
      else {
        replyText(conn, m, `[ ⚠️ ] Command salah. Ketik ${usedPrefix}agency untuk menu.`)
      }
      break
    }
  }
}

handler.help = ['agency']
handler.tags = ['rpg']
handler.command = /^(agency|idol|oshi)$/i
handler.limit = false
handler.register = false

export default handler
