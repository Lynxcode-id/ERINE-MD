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

// Injeksi data Dompet Crypto ke user
function ensureCasinoData(db, jid) {
  if (!db.users[jid]) return false
  const u = db.users[jid]
  
  u.cryptoWallet = u.cryptoWallet || {
    JMC: 0, // JemimaCoin
    TKT: 0, // TakinaToken
    HDG: 0, // HydroDoge
    ERB: 0  // ErineBit
  }
  
  u.stats = u.stats || {}
  u.stats.gamblingWins = u.stats.gamblingWins || 0
  u.stats.gamblingLosses = u.stats.gamblingLosses || 0
  
  return u
}

// Global Crypto Market Update (Update setiap 1 jam)
function refreshCryptoMarket(db) {
  db.world = db.world || {}
  db.world.crypto = db.world.crypto || {
    JMC: { price: 1500, trend: '🚀' },
    TKT: { price: 800, trend: '📉' },
    HDG: { price: 100, trend: '🚀' },
    ERB: { price: 5000, trend: '👑' },
    lastUpdate: 0
  }

  const w = db.world.crypto
  if (now() - w.lastUpdate > 60 * 60 * 1000) { // 1 Jam
    const coins = ['JMC', 'TKT', 'HDG', 'ERB']
    for (const c of coins) {
      // Fluktuasi harga -20% sampai +30%
      const change = 1 + (rand(-20, 30) / 100) 
      const oldPrice = w[c].price
      let newPrice = Math.floor(oldPrice * change)
      
      // Mencegah koin mati (minimal harga 10)
      if (newPrice < 10) newPrice = 10 
      
      w[c].price = newPrice
      w[c].trend = newPrice > oldPrice ? '📈' : (newPrice < oldPrice ? '📉' : '➖')
      
      // Kasih icon khusus kalau tembus harga tertentu
      if (newPrice > 10000) w[c].trend = '🔥'
      if (newPrice < 50) w[c].trend = '💀'
    }
    w.lastUpdate = now()
    saveDb(db)
  }
}

async function showList(conn, m, title, rows, footer = '') {
  const txt = [
    `╔═══『 🎰 ${title} 』═══`,
    ...rows.map(r => `╠ ⎔ ${r}`),
    `╚══════════════════════`,
    footer ? `[💰] ${footer}` : ''
  ].filter(Boolean).join('\n')
  await conn.sendMessage(m.chat, { text: txt }, { quoted: m })
}

function replyText(conn, m, text) {
  return conn.sendMessage(m.chat, { text }, { quoted: m })
}

const handler = async (m, { conn, usedPrefix, command, text }) => {
  const db = loadDb()
  if (!db) return replyText(conn, m, '[ ⚠️ ] Database offline. Pancing dengan command .profile di RPG utama.')
  
  refreshCryptoMarket(db)
  
  const u = ensureCasinoData(db, m.sender)
  if (!u) return replyText(conn, m, '[ ⚠️ ] Profil tidak ditemukan. Ketik .profile dulu di RPG utama.')

  const args = String(text || '').trim().split(/\s+/).filter(Boolean)
  const sub = String(command || '').toLowerCase()

  const menu = [
    `*▣ CYBER CRYPTO EXCHANGE ▣*`,
    `${usedPrefix}crypto market`,
    `${usedPrefix}crypto wallet`,
    `${usedPrefix}crypto buy <koin> <jumlah>`,
    `${usedPrefix}crypto sell <koin> <jumlah>`,
    ``,
    `*▣ NEON CASINO ▣*`,
    `${usedPrefix}slot <bet>`,
    `${usedPrefix}coinflip <heads/tails> <bet>`,
    `${usedPrefix}roulette <bet>`
  ]

  switch (sub) {
    case 'casino':
    case 'crypto':
    case 'judi': {
      const action = (args[0] || '').toLowerCase()

      if (!action || action === 'help') {
        await showList(conn, m, 'UNDERGROUND CASINO & EXCHANGE', menu, 'Resiko ditanggung penumpang')
        break
      }

      if (action === 'market') {
        const w = db.world.crypto
        const nextUpdate = 60 - Math.floor((now() - w.lastUpdate) / 60000)
        
        await showList(conn, m, 'CRYPTO MARKET LIVE', [
          `💎 JemimaCoin (JMC): ${formatNum(w.JMC.price)} Gold ${w.JMC.trend}`,
          `💠 TakinaToken (TKT): ${formatNum(w.TKT.price)} Gold ${w.TKT.trend}`,
          `🐕 HydroDoge (HDG): ${formatNum(w.HDG.price)} Gold ${w.HDG.trend}`,
          `👑 ErineBit (ERB): ${formatNum(w.ERB.price)} Gold ${w.ERB.trend}`,
          ``,
          `⏳ Market berubah dalam: ${nextUpdate} Menit`
        ])
      } 
      
      else if (action === 'wallet' || action === 'dompet') {
        await showList(conn, m, 'CRYPTO WALLET', [
          `💼 JemimaCoin: ${formatNum(u.cryptoWallet.JMC)} JMC`,
          `💼 TakinaToken: ${formatNum(u.cryptoWallet.TKT)} TKT`,
          `💼 HydroDoge: ${formatNum(u.cryptoWallet.HDG)} HDG`,
          `💼 ErineBit: ${formatNum(u.cryptoWallet.ERB)} ERB`,
          ``,
          `💰 Saldo Gold: ${formatNum(u.gold)}`
        ])
      }

      else if (action === 'buy' || action === 'beli') {
        const coin = (args[1] || '').toUpperCase()
        const qty = Math.floor(Number(args[2]))
        
        const validCoins = ['JMC', 'TKT', 'HDG', 'ERB']
        if (!validCoins.includes(coin)) return replyText(conn, m, `[ ⚠️ ] Koin tidak valid. Pilih: JMC, TKT, HDG, ERB`)
        if (isNaN(qty) || qty <= 0) return replyText(conn, m, `[ ⚠️ ] Format: ${usedPrefix}crypto buy ${coin} <jumlah>`)
        
        const price = db.world.crypto[coin].price
        const totalCost = price * qty
        
        if (u.gold < totalCost) return replyText(conn, m, `[ ⚠️ ] Saldo Gold tidak cukup!\nButuh: ${formatNum(totalCost)} Gold untuk membeli ${formatNum(qty)} ${coin}.`)
        
        u.gold -= totalCost
        u.cryptoWallet[coin] += qty
        
        saveDb(db)
        await replyText(conn, m, `📈 *PEMBELIAN CRYPTO SUKSES*\nKamu membeli ${formatNum(qty)} ${coin} di harga ${formatNum(price)}/koin.\nTotal Biaya: -${formatNum(totalCost)} Gold`)
      }

      else if (action === 'sell' || action === 'jual') {
        const coin = (args[1] || '').toUpperCase()
        let qty = args[2]
        
        const validCoins = ['JMC', 'TKT', 'HDG', 'ERB']
        if (!validCoins.includes(coin)) return replyText(conn, m, `[ ⚠️ ] Koin tidak valid. Pilih: JMC, TKT, HDG, ERB`)
        
        if (qty === 'all') {
          qty = u.cryptoWallet[coin]
        } else {
          qty = Math.floor(Number(qty))
        }

        if (isNaN(qty) || qty <= 0) return replyText(conn, m, `[ ⚠️ ] Format: ${usedPrefix}crypto sell ${coin} <jumlah/all>`)
        if (u.cryptoWallet[coin] < qty) return replyText(conn, m, `[ ⚠️ ] Saldo ${coin} kamu tidak cukup. Kamu cuma punya ${formatNum(u.cryptoWallet[coin])} ${coin}.`)
        
        const price = db.world.crypto[coin].price
        const totalProfit = price * qty
        
        u.cryptoWallet[coin] -= qty
        u.gold += totalProfit
        
        saveDb(db)
        await replyText(conn, m, `📉 *PENJUALAN CRYPTO SUKSES*\nKamu melepas ${formatNum(qty)} ${coin} di harga ${formatNum(price)}/koin.\nTotal Pendapatan: +${formatNum(totalProfit)} Gold`)
      }
      else {
        replyText(conn, m, `[ ⚠️ ] Command salah. Ketik ${usedPrefix}crypto untuk menu.`)
      }
      break
    }

    // ==========================================
    // MINI GAMES: CASINO
    // ==========================================
    case 'slot': {
      const bet = Math.floor(Number(args[0]))
      if (isNaN(bet) || bet < 500) return replyText(conn, m, `[ ⚠️ ] Taruhan slot minimal 500 Gold.\nFormat: ${usedPrefix}slot <taruhan>`)
      if (u.gold < bet) return replyText(conn, m, '[ ⚠️ ] Gold kamu nggak cukup buat main slot.')
      
      u.gold -= bet
      
      const emojis = ['🍒', '🍇', '🍋', '🔔', '💎', '7️⃣']
      const a = pick(emojis)
      const b = pick(emojis)
      const c = pick(emojis)
      
      let txt = `🎰 *HOLOGRAM SLOT MACHINE* 🎰\n\n[ ${a} | ${b} | ${c} ]\n`
      
      if (a === b && b === c) {
        // Jackpot
        let mult = 5
        if (a === '7️⃣') mult = 15
        if (a === '💎') mult = 10
        
        const win = bet * mult
        u.gold += win
        u.stats.gamblingWins += 1
        txt += `\n🎉 *JACKPOT!* 🎉\nSistem mencetak Gold! Kamu menang ${formatNum(win)} Gold (x${mult})`
      } else if (a === b || b === c || a === c) {
        // Balik modal + dikit
        const win = Math.floor(bet * 1.5)
        u.gold += win
        u.stats.gamblingWins += 1
        txt += `\n✨ *NICE!* Kamu dapat 2 simbol sama!\nMenang ${formatNum(win)} Gold.`
      } else {
        // Kalah
        u.stats.gamblingLosses += 1
        txt += `\n💀 *ZONK!* Taruhanmu ditelan mesin.\nHilang ${formatNum(bet)} Gold.`
      }
      
      saveDb(db)
      await replyText(conn, m, txt)
      break
    }

    case 'coinflip':
    case 'cf': {
      const choice = (args[0] || '').toLowerCase()
      const bet = Math.floor(Number(args[1]))
      
      if (!['heads', 'tails', 'kepala', 'ekor'].includes(choice)) return replyText(conn, m, `[ ⚠️ ] Pilih sisi koin.\nFormat: ${usedPrefix}coinflip <heads/tails> <taruhan>`)
      if (isNaN(bet) || bet < 500) return replyText(conn, m, `[ ⚠️ ] Taruhan minimal 500 Gold.`)
      if (u.gold < bet) return replyText(conn, m, '[ ⚠️ ] Gold kamu nggak cukup.')
      
      u.gold -= bet
      const result = Math.random() < 0.5 ? 'heads' : 'tails'
      const isIndo = choice === 'kepala' || choice === 'ekor'
      const resultTxt = result === 'heads' ? (isIndo ? 'kepala' : 'heads') : (isIndo ? 'ekor' : 'tails')
      
      const isWin = (choice === 'heads' || choice === 'kepala') ? result === 'heads' : result === 'tails'
      
      let txt = `🪙 *CYBER COINFLIP* 🪙\nKoin dilempar ke udara... dan mendarat di sisi *${resultTxt.toUpperCase()}*!\n`
      
      if (isWin) {
        const win = bet * 2
        u.gold += win
        u.stats.gamblingWins += 1
        txt += `\n🎉 *MENANG!* Pilihanmu tepat, dapat +${formatNum(win)} Gold.`
      } else {
        u.stats.gamblingLosses += 1
        txt += `\n💀 *KALAH!* Taruhanmu hangus diambil bandar.`
      }
      
      saveDb(db)
      await replyText(conn, m, txt)
      break
    }

    case 'roulette':
    case 'rr': {
      const bet = Math.floor(Number(args[0]))
      if (isNaN(bet) || bet < 5000) return replyText(conn, m, `[ ⚠️ ] Russian Roulette adalah judi nyawa. Taruhan minimal 5,000 Gold.\nFormat: ${usedPrefix}roulette <taruhan>`)
      if (u.gold < bet) return replyText(conn, m, '[ ⚠️ ] Kamu terlalu miskin untuk ikut judi elit ini.')
      
      u.gold -= bet
      
      // Russian Roulette logic: 1/6 chance to lose, 5/6 chance to win 1.3x
      const chamber = rand(1, 6)
      const bullet = rand(1, 6)
      
      let txt = `🔫 *RUSSIAN ROULETTE* 🔫\nKamu menempelkan pistol ke kepala dan menarik pelatuknya...\n\n*KLIK...*\n`
      
      if (chamber === bullet) {
        // DOR
        u.hp = 1 // Sekarat
        u.stats.gamblingLosses += 1
        txt += `\n💥 *DOR!!!* 💥\nKamu tertembak! Uang taruhan ${formatNum(bet)} Gold hangus dan HP kamu tersisa 1.`
      } else {
        // Selamat
        const win = Math.floor(bet * 1.3)
        u.gold += win
        u.stats.gamblingWins += 1
        txt += `\n😌 *KOSONG!* Kamu selamat.\nAdrenalin terbayar lunas, kamu mengambil uang meja sebesar ${formatNum(win)} Gold.`
      }
      
      saveDb(db)
      await replyText(conn, m, txt)
      break
    }

    default:
      break
  }
}

handler.help = ['casino', 'crypto', 'slot', 'coinflip', 'roulette']
handler.tags = ['rpg']
handler.command = /^(casino|crypto|judi|slot|coinflip|cf|roulette|rr)$/i
handler.limit = false
handler.register = false

export default handler
