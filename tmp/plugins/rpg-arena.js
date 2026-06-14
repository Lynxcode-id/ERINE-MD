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

// Injeksi data Arena & Tattoo
function ensureArenaData(db, jid) {
  if (!db.users[jid]) return false
  const u = db.users[jid]
  
  u.arena = u.arena || {
    mmr: 100,
    wins: 0,
    losses: 0,
    glory: 0,
    tickets: 5,
    lastRefill: 0,
    tattoos: [] // Array of tattoo IDs
  }
  
  return u
}

async function showList(conn, m, title, rows, footer = '') {
  const txt = [
    `╔═══『 ⚔️ ${title} 』═══`,
    ...rows.map(r => `╠ ⎔ ${r}`),
    `╚══════════════════════`,
    footer ? `[🔥] ${footer}` : ''
  ].filter(Boolean).join('\n')
  await conn.sendMessage(m.chat, { text: txt }, { quoted: m })
}

function replyText(conn, m, text) {
  return conn.sendMessage(m.chat, { text }, { quoted: m })
}

// Hitung Pangkat Berdasarkan MMR
function getRankTier(mmr) {
  if (mmr < 500) return 'Street Thug'
  if (mmr < 1200) return 'Cyber Brawler'
  if (mmr < 2500) return 'Neon Gladiator'
  if (mmr < 5000) return 'Chrome Champion'
  return 'Apex Legend'
}

// Katalog Tatto (Permanent Buffs)
const TATTOOS = {
  't1': { name: 'Barcode (Leher)', desc: 'ATK +25, HP +200', price: 50, stat: { atk: 25, hp: 200 } },
  't2': { name: 'Neon Serpent (Lengan)', desc: 'ATK +80, DEF +30', price: 200, stat: { atk: 80, def: 30 } },
  't3': { name: 'Cyber-Skull (Dada)', desc: 'DEF +150, HP +1000', price: 500, stat: { def: 150, hp: 1000 } },
  't4': { name: 'Golden Dragon (Punggung)', desc: 'LUCK +20, ATK +300', price: 1500, stat: { luck: 20, atk: 300 } },
  't5': { name: 'Yakuza Koi (Full Body)', desc: 'ALL STATS MASSIVE', price: 5000, stat: { atk: 800, def: 800, luck: 50, hp: 5000 } }
}

const handler = async (m, { conn, usedPrefix, command, text }) => {
  const db = loadDb()
  if (!db) return replyText(conn, m, '[ ⚠️ ] Database offline. Pancing dengan command .profile di RPG utama.')
  
  const u = ensureArenaData(db, m.sender)
  if (!u) return replyText(conn, m, '[ ⚠️ ] Profil tidak ditemukan. Ketik .profile dulu di RPG utama.')

  const args = String(text || '').trim().split(/\s+/).filter(Boolean)
  const sub = String(command || '').toLowerCase()

  // Refill Tiket Arena (Maks 5, nambah 1 tiap jam)
  const lastRefill = u.arena.lastRefill || now()
  const hrsPassed = Math.floor((now() - lastRefill) / (1000 * 60 * 60))
  if (hrsPassed > 0 && u.arena.tickets < 5) {
    u.arena.tickets = Math.min(5, u.arena.tickets + hrsPassed)
    u.arena.lastRefill = now()
    saveDb(db)
  }

  const menu = [
    `*▣ UNDERGROUND COLOSSEUM ▣*`,
    `Tingkatkan MMR dan jadilah petarung nomor 1!`,
    ``,
    `${usedPrefix}arena info`,
    `${usedPrefix}arena match`,
    `${usedPrefix}arena top`,
    ``,
    `*▣ TATTOO PARLOR (GLORY SHOP) ▣*`,
    `${usedPrefix}tattoo list`,
    `${usedPrefix}tattoo ink <id>`
  ]

  switch (sub) {
    case 'arena':
    case 'colosseum': {
      const action = (args[0] || '').toLowerCase()

      if (!action || action === 'help') {
        await showList(conn, m, 'NEON COLOSSEUM', menu, 'Glory awaits the bold!')
        break
      }

      if (action === 'info') {
        const winrate = u.arena.wins + u.arena.losses > 0 ? Math.floor((u.arena.wins / (u.arena.wins + u.arena.losses)) * 100) : 0
        const rank = getRankTier(u.arena.mmr)

        await showList(conn, m, `GLADIATOR: @${m.sender.split('@')[0]}`, [
          `🎖️ Rank Tier: ${rank}`,
          `📈 MMR: ${formatNum(u.arena.mmr)}`,
          `⚔️ Rekor: ${u.arena.wins} Menang / ${u.arena.losses} Kalah (${winrate}% WR)`,
          `💎 Glory Tokens: ${formatNum(u.arena.glory)}`,
          `🎫 Arena Tickets: ${u.arena.tickets} / 5`,
          ``,
          `*Tattoo Aktif:* ${u.arena.tattoos.length > 0 ? u.arena.tattoos.map(t => TATTOOS[t]?.name).join(', ') : 'Kulit masih mulus'}`
        ])
      } 
      
      else if (action === 'match' || action === 'fight') {
        if (u.arena.tickets < 1) return replyText(conn, m, `[ ⚠️ ] Tiket Arena habis! Menunggu jadwal tanding berikutnya... (Refill 1 tiket / jam)`)
        if (u.hp <= 50) return replyText(conn, m, `[ ⚠️ ] Kamu terlalu lemah buat tanding. Heal dulu (HP kamu: ${formatNum(u.hp)}).`)
        
        u.arena.tickets -= 1
        
        // Kalkulasi Base Stat
        let pAtk = u.atk + (u.enchant?.weapon ? u.enchant.weapon * 5 : 0) + (u.ascension?.weapon ? u.ascension.weapon * 200 : 0)
        let pDef = u.def + (u.enchant?.armor ? u.enchant.armor * 5 : 0) + (u.ascension?.armor ? u.ascension.armor * 200 : 0)
        
        // Generate Musuh Berdasarkan MMR Player
        const isBossMatch = Math.random() < 0.1 // 10% chance ketemu penjaga rank
        const mmrMultiplier = u.arena.mmr / 100
        
        const eName = isBossMatch ? `Champion of ${getRankTier(u.arena.mmr)}` : `Unknown Gladiator`
        // Stats musuh dibikin scaling sama kekuatan player, biar ga bisa asal bantai
        const eHp = 1000 + (mmrMultiplier * 200) + rand(100, 500)
        const eAtk = pAtk * (isBossMatch ? 1.2 : 0.8) + rand(10, 50)
        const eDef = pDef * (isBossMatch ? 1.2 : 0.8) + rand(10, 50)

        // Simulasi Pertarungan Arena
        let php = u.hp
        let ehp = eHp
        let turn = 0
        
        while(php > 0 && ehp > 0 && turn < 80) {
           ehp -= Math.max(1, pAtk - Math.floor(eDef/2) + rand(0, 30))
           if (ehp <= 0) break
           php -= Math.max(1, eAtk - Math.floor(pDef/2) + rand(0, 30))
           turn++
        }
        
        u.hp = Math.max(1, php) // Simpan sisa HP ke profil
        
        if (php > 0) {
           // MENANG
           const mmrGain = isBossMatch ? rand(40, 60) : rand(15, 30)
           const gloryGain = isBossMatch ? rand(10, 25) : rand(3, 10)
           const goldGain = rand(5000, 15000) * (u.arena.mmr / 500 + 1)
           
           u.arena.mmr += mmrGain
           u.arena.glory += gloryGain
           u.gold += Math.floor(goldGain)
           u.arena.wins += 1
           
           const oldRank = getRankTier(u.arena.mmr - mmrGain)
           const newRank = getRankTier(u.arena.mmr)
           const rankUpTxt = oldRank !== newRank ? `\n\n🌟 *RANK UP!* Kamu naik pangkat menjadi [ ${newRank} ]!` : ''
           
           saveDb(db)
           await replyText(conn, m, `🏆 *VICTORY IN THE ARENA!* 🏆\nKamu menumbangkan [ ${eName} ] di depan sorak sorai penonton!\n\n📈 MMR +${mmrGain} (Total: ${u.arena.mmr})\n💎 Glory Tokens +${gloryGain}\n💰 Prize: +${formatNum(goldGain)} Gold\n❤️ Sisa HP: ${formatNum(u.hp)}${rankUpTxt}`)
        } else {
           // KALAH
           const mmrLoss = rand(10, 25)
           u.arena.mmr = Math.max(0, u.arena.mmr - mmrLoss)
           u.arena.losses += 1
           
           const oldRank = getRankTier(u.arena.mmr + mmrLoss)
           const newRank = getRankTier(u.arena.mmr)
           const rankDownTxt = oldRank !== newRank ? `\n\n📉 *DEMOTED!* Kamu turun pangkat menjadi [ ${newRank} ].` : ''
           
           saveDb(db)
           await replyText(conn, m, `💀 *DEFEAT!* 💀\nKamu babak belur dihajar oleh [ ${eName} ] dan diseret keluar dari arena.\n\n📉 MMR -${mmrLoss} (Total: ${u.arena.mmr})\n❤️ Sisa HP: 1 (Sekarat!)${rankDownTxt}`)
        }
      }

      else if (action === 'top' || action === 'leaderboard') {
        const list = Object.entries(db.users)
          .filter(([_, x]) => x.arena && x.arena.mmr > 100)
          .sort((a, b) => b[1].arena.mmr - a[1].arena.mmr)
          .slice(0, 10)
          
        if (list.length === 0) return replyText(conn, m, '[ ⚠️ ] Belum ada petarung yang menonjol.')
        
        const txt = [
          `╔═══『 🏆 ARENA CHAMPIONS 』═══`,
          ...list.map((v, i) => `╠ ${i + 1}. @${v[0].split('@')[0]}\n╠ ↳ MMR: ${v[1].arena.mmr} | Rank: ${getRankTier(v[1].arena.mmr)}`),
          `╚═══════════════════════════`
        ].join('\n')

        await conn.sendMessage(m.chat, { text: txt, mentions: list.map(v => v[0]) }, { quoted: m })
      }
      break
    }

    case 'tattoo':
    case 'tato': {
      const action = (args[0] || '').toLowerCase()

      if (action === 'list' || action === 'shop') {
        const rows = Object.entries(TATTOOS).map(([id, t]) => `[ ${id} ] ${t.name} \n    ↳ Harga: 💎 ${formatNum(t.price)} Glory\n    ↳ Efek: ${t.desc}`)
        await showList(conn, m, 'TATTOO PARLOR (GLORY SHOP)', rows, `Buat Tato: ${usedPrefix}tattoo ink <id>`)
      }

      else if (action === 'ink' || action === 'buat') {
        const id = (args[1] || '').toLowerCase()
        const tat = TATTOOS[id]
        
        if (!tat) return replyText(conn, m, '[ ⚠️ ] Desain tato tidak ditemukan. Cek .tattoo list')
        if (u.arena.tattoos.includes(id)) return replyText(conn, m, `[ ⚠️ ] Kamu sudah memiliki tato [ ${tat.name} ]. Cari ruang kulit yang kosong!`)
        
        if (u.arena.glory < tat.price) return replyText(conn, m, `[ ⚠️ ] Glory Tokens kurang! Butuh 💎 ${formatNum(tat.price)}.\nBertarunglah di .arena match untuk mendapatkannya.`)
        
        u.arena.glory -= tat.price
        u.arena.tattoos.push(id)
        
        // Suntik status permanen ke profile dasar
        if (tat.stat.atk) u.atk += tat.stat.atk
        if (tat.stat.def) u.def += tat.stat.def
        if (tat.stat.luck) u.luck += tat.stat.luck
        if (tat.stat.hp) {
          u.maxHp += tat.stat.hp
          u.hp = u.maxHp
        }
        
        saveDb(db)
        await replyText(conn, m, `💉 *INK INJECTED!* 💉\nMesin tato mekanik selesai mengukir [ ${tat.name} ] di tubuhmu!\n\nStat dasar telah ditingkatkan secara permanen sesuai efek tato. Rasa sakit ini membuatmu makin kuat!`)
      }
      else {
        replyText(conn, m, `[ ⚠️ ] Format salah. Ketik ${usedPrefix}arena untuk bantuan.`)
      }
      break
    }

    default:
      break
  }
}

handler.help = ['arena', 'tattoo']
handler.tags = ['rpg']
handler.command = /^(arena|colosseum|tattoo|tato)$/i
handler.limit = false
handler.register = false

export default handler
