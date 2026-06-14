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

// Injeksi data TCG ke profil player
function ensureTcgData(db, jid) {
  if (!db.users[jid]) return false
  const u = db.users[jid]
  
  u.tcg = u.tcg || {
    packs: 0,
    mythicPacks: 0,
    cards: {}, // Format: { 'card_id': qty }
    deck: [null, null, null, null, null], // 5 Slot Kartu
    wins: 0,
    losses: 0,
    holoCoins: 0 // Mata uang TCG untuk beli kartu spesifik
  }
  
  return u
}

async function showList(conn, m, title, rows, footer = '') {
  const txt = [
    `╔═══『 🃏 ${title} 』═══`,
    ...rows.map(r => `╠ ⎔ ${r}`),
    `╚══════════════════════`,
    footer ? `[🎴] ${footer}` : ''
  ].filter(Boolean).join('\n')
  await conn.sendMessage(m.chat, { text: txt }, { quoted: m })
}

function replyText(conn, m, text) {
  return conn.sendMessage(m.chat, { text }, { quoted: m })
}

// Database Kartu TCG Holo-Nexus
const CARD_DATABASE = [
  // Common (C)
  { id: 'c1', name: 'Scrap Drone', rarity: 'C', atk: 10, def: 10 },
  { id: 'c2', name: 'Alley Thug', rarity: 'C', atk: 15, def: 5 },
  { id: 'c3', name: 'Cyber Hound', rarity: 'C', atk: 20, def: 10 },
  
  // Uncommon (U)
  { id: 'u1', name: 'Neon Samurai', rarity: 'U', atk: 40, def: 20 },
  { id: 'u2', name: 'Plasma Gunner', rarity: 'U', atk: 50, def: 10 },
  { id: 'u3', name: 'Holo-Shield', rarity: 'U', atk: 0, def: 80 },
  
  // Rare (R)
  { id: 'r1', name: 'Goliath Mutated-Ape', rarity: 'R', atk: 100, def: 80 },
  { id: 'r2', name: 'Netrunner Prodigy', rarity: 'R', atk: 120, def: 50 },
  { id: 'r3', name: 'Mecha-Leviathan', rarity: 'R', atk: 150, def: 150 },
  
  // Super Rare (SR)
  { id: 'sr1', name: 'Archmage Erine', rarity: 'SR', atk: 300, def: 200 },
  { id: 'sr2', name: 'Speedster Takina', rarity: 'SR', atk: 350, def: 150 },
  { id: 'sr3', name: 'Hydro-Trisha Dragon', rarity: 'SR', atk: 250, def: 400 },
  
  // Ultra Rare (UR)
  { id: 'ur1', name: 'Maou Jemima', rarity: 'UR', atk: 800, def: 600 },
  { id: 'ur2', name: 'Cyber-Godzilla', rarity: 'UR', atk: 700, def: 700 },
  
  // Secret Rare (XR) - Easter Egg
  { id: 'xr1', name: 'Lynx (The Creator)', rarity: 'XR', atk: 999, def: 999 }
]

function getCardGacha(isMythicPack) {
  const roll = rand(1, 1000)
  
  if (isMythicPack) {
     if (roll <= 5) return CARD_DATABASE.find(c => c.rarity === 'XR') // 0.5%
     if (roll <= 100) return pick(CARD_DATABASE.filter(c => c.rarity === 'UR')) // 9.5%
     if (roll <= 400) return pick(CARD_DATABASE.filter(c => c.rarity === 'SR')) // 30%
     return pick(CARD_DATABASE.filter(c => c.rarity === 'R')) // 60%
  } else {
     if (roll <= 10) return pick(CARD_DATABASE.filter(c => c.rarity === 'UR')) // 1%
     if (roll <= 50) return pick(CARD_DATABASE.filter(c => c.rarity === 'SR')) // 4%
     if (roll <= 200) return pick(CARD_DATABASE.filter(c => c.rarity === 'R')) // 15%
     if (roll <= 500) return pick(CARD_DATABASE.filter(c => c.rarity === 'U')) // 30%
     return pick(CARD_DATABASE.filter(c => c.rarity === 'C')) // 50%
  }
}

const handler = async (m, { conn, usedPrefix, command, text }) => {
  const db = loadDb()
  if (!db) return replyText(conn, m, '[ ⚠️ ] Database offline. Pancing dengan command .profile di RPG utama.')
  
  const u = ensureTcgData(db, m.sender)
  if (!u) return replyText(conn, m, '[ ⚠️ ] Profil tidak ditemukan. Ketik .profile dulu di RPG utama.')

  const args = String(text || '').trim().split(/\s+/).filter(Boolean)
  const sub = String(command || '').toLowerCase()

  const menu = [
    `*▣ HOLO-NEXUS TCG ▣*`,
    `Kumpulkan kartu holografis dan jadilah Raja Duel!`,
    ``,
    `*Koleksi & Pack:*`,
    `${usedPrefix}tcg info`,
    `${usedPrefix}tcg shop`,
    `${usedPrefix}tcg buy <cyber/mythic> <qty>`,
    `${usedPrefix}tcg open <cyber/mythic>`,
    `${usedPrefix}tcg cards`,
    ``,
    `*Deck & Duel:*`,
    `${usedPrefix}tcg deck`,
    `${usedPrefix}tcg equip <slot_1-5> <card_id>`,
    `${usedPrefix}tcg duel @user <taruhan_gold>`,
    `${usedPrefix}tcg dismantle <card_id>`
  ]

  switch (sub) {
    case 'tcg':
    case 'cards':
    case 'duel': {
      const action = (args[0] || '').toLowerCase()

      if (!action || action === 'help') {
        await showList(conn, m, 'HOLO-NEXUS TCG (BETA)', menu, 'It\'s time to D-D-D-DUEL!')
        break
      }

      if (action === 'info') {
        const totalCards = Object.values(u.tcg.cards).reduce((a, b) => a + b, 0)
        const uniqueCards = Object.keys(u.tcg.cards).length
        const wr = u.tcg.wins + u.tcg.losses > 0 ? Math.floor((u.tcg.wins / (u.tcg.wins + u.tcg.losses)) * 100) : 0

        await showList(conn, m, `DUELIST: @${m.sender.split('@')[0]}`, [
          `🏆 Rekor TCG: ${u.tcg.wins} Menang | ${u.tcg.losses} Kalah (${wr}% WR)`,
          `📦 Booster Packs: ${u.tcg.packs} Cyber | ${u.tcg.mythicPacks} Mythic`,
          `🎴 Total Koleksi: ${totalCards} Kartu (${uniqueCards}/${CARD_DATABASE.length} Unique)`,
          `🪙 Holo-Coins: ${formatNum(u.tcg.holoCoins)}`
        ])
      } 
      
      else if (action === 'shop') {
        const rows = [
          `[ 1 ] Cyber Pack (Normal)\n    ↳ Berisi 5 Kartu Campur\n    ↳ Harga: 💰 500,000 Gold`,
          `[ 2 ] Mythic Pack (Premium)\n    ↳ Berisi 5 Kartu (Min. RARE)\n    ↳ Harga: 💠 5 Cyber Core`
        ]
        await showList(conn, m, 'TCG CARD SHOP', rows, `Beli: ${usedPrefix}tcg buy <cyber/mythic> <jumlah>`)
      }

      else if (action === 'buy') {
        const type = (args[1] || '').toLowerCase()
        const qty = Math.floor(Number(args[2])) || 1
        
        if (qty <= 0) return replyText(conn, m, '[ ⚠️ ] Jumlah tidak valid.')
        
        if (type === 'cyber') {
           const cost = qty * 500000
           if (u.gold < cost) return replyText(conn, m, `[ ⚠️ ] Gold kurang! Butuh 💰 ${formatNum(cost)} Gold.`)
           u.gold -= cost
           u.tcg.packs += qty
           saveDb(db)
           await replyText(conn, m, `📦 *PACK DIBELI*\nKamu membeli ${qty}x Cyber Pack!\nBuka dengan: ${usedPrefix}tcg open cyber`)
        } 
        else if (type === 'mythic') {
           const cost = qty * 5
           u.items = u.items || {}
           if ((u.items['cybercore'] || 0) < cost) return replyText(conn, m, `[ ⚠️ ] Cyber Core kurang! Butuh 💠 ${cost} Cyber Core. (Lawan Boss/Hacking)`)
           u.items['cybercore'] -= cost
           u.tcg.mythicPacks += qty
           saveDb(db)
           await replyText(conn, m, `✨📦 *MYTHIC PACK DIBELI*\nKamu membeli ${qty}x Mythic Pack!\nBuka dengan: ${usedPrefix}tcg open mythic`)
        } else {
           replyText(conn, m, `[ ⚠️ ] Tipe pack tidak valid. Pilih 'cyber' atau 'mythic'.`)
        }
      }

      else if (action === 'open') {
        const type = (args[1] || '').toLowerCase()
        let isMythic = false
        
        if (type === 'cyber') {
           if (u.tcg.packs < 1) return replyText(conn, m, '[ ⚠️ ] Kamu tidak punya Cyber Pack.')
           u.tcg.packs -= 1
        } else if (type === 'mythic') {
           if (u.tcg.mythicPacks < 1) return replyText(conn, m, '[ ⚠️ ] Kamu tidak punya Mythic Pack.')
           u.tcg.mythicPacks -= 1
           isMythic = true
        } else {
           return replyText(conn, m, `[ ⚠️ ] Pilih pack yang mau dibuka: 'cyber' atau 'mythic'.`)
        }

        const pulledCards = []
        let hasNew = false
        
        for (let i = 0; i < 5; i++) {
           const card = getCardGacha(isMythic)
           pulls:
           if (!u.tcg.cards[card.id]) {
              u.tcg.cards[card.id] = 1
              hasNew = true
           } else {
              u.tcg.cards[card.id] += 1
           }
           
           let rColor = ''
           if (card.rarity === 'UR' || card.rarity === 'XR') rColor = '🌟'
           else if (card.rarity === 'SR') rColor = '✨'
           else if (card.rarity === 'R') rColor = '🔵'
           else rColor = '⚪'
           
           pulledCards.push(`${rColor} [${card.rarity}] ${card.name} (ATK: ${card.atk} | DEF: ${card.def})`)
        }

        saveDb(db)
        
        const header = isMythic ? `✨📦 *MEMBUKA MYTHIC PACK...* 📦✨` : `📦 *MEMBUKA CYBER PACK...* 📦`
        await replyText(conn, m, `${header}\nSinar hologram memancar dari bungkus kartu:\n\n${pulledCards.map(p => `► ${p}`).join('\n')}\n\n${hasNew ? '*NEW!* Kartu baru ditambahkan ke koleksi.' : 'Semua kartu sudah dimiliki (Duplikat ditambahkan).'}`)
      }

      else if (action === 'cards' || action === 'koleksi') {
        const myCards = Object.entries(u.tcg.cards).filter(([_, qty]) => qty > 0)
        if (myCards.length === 0) return replyText(conn, m, '[ ⚠️ ] Koleksi kartumu kosong. Beli pack di .tcg shop')
        
        const rows = myCards.map(([id, qty]) => {
           const card = CARD_DATABASE.find(c => c.id === id)
           return `[ ${id} ] ${card.name} (${card.rarity}) — x${qty}\n    ↳ ATK: ${card.atk} | DEF: ${card.def}`
        })
        
        await showList(conn, m, 'KOTAK KARTU TCG', rows, `Pasang di deck: ${usedPrefix}tcg equip <slot> <id>`)
      }

      else if (action === 'deck') {
        const rows = u.tcg.deck.map((id, index) => {
           if (!id) return `Slot ${index + 1}: [ Kosong ]`
           const c = CARD_DATABASE.find(c => c.id === id)
           return `Slot ${index + 1}: ${c.name} (${c.rarity}) [ATK: ${c.atk} | DEF: ${c.def}]`
        })
        
        let totalAtk = 0, totalDef = 0
        u.tcg.deck.forEach(id => {
           if (id) {
             const c = CARD_DATABASE.find(c => c.id === id)
             totalAtk += c.atk
             totalDef += c.def
           }
        })
        
        rows.push(``)
        rows.push(`*=== DECK POWER ===*`)
        rows.push(`💥 Total ATK: ${totalAtk}`)
        rows.push(`🛡️ Total DEF: ${totalDef}`)
        
        await showList(conn, m, 'ACTIVE BATTLE DECK', rows, `Ubah kartu: ${usedPrefix}tcg equip <1-5> <card_id>`)
      }

      else if (action === 'equip' || action === 'pasang') {
        const slot = Math.floor(Number(args[1])) - 1
        const cardId = (args[2] || '').toLowerCase()
        
        if (slot < 0 || slot > 4) return replyText(conn, m, '[ ⚠️ ] Slot deck hanya ada 1 sampai 5.')
        if (!u.tcg.cards[cardId] || u.tcg.cards[cardId] < 1) return replyText(conn, m, `[ ⚠️ ] Kamu tidak memiliki kartu dengan ID ${cardId}.`)
        
        // Cek kalau kartu udah dipakai di slot lain
        if (u.tcg.deck.includes(cardId)) {
           // Boleh pasang kalau punya duplikatnya sejumlah yg mau dipasang
           const usedCount = u.tcg.deck.filter(id => id === cardId).length
           if (u.tcg.cards[cardId] <= usedCount) {
              return replyText(conn, m, `[ ⚠️ ] Kamu hanya memiliki ${u.tcg.cards[cardId]} copy kartu ini dan semuanya sudah di Deck.`)
           }
        }
        
        u.tcg.deck[slot] = cardId
        saveDb(db)
        
        const card = CARD_DATABASE.find(c => c.id === cardId)
        await replyText(conn, m, `🎴 *DECK UPDATED*\nKartu [ ${card.name} ] berhasil dipasang pada Slot ${slot + 1}.`)
      }

      else if (action === 'dismantle' || action === 'pecah') {
        const cardId = (args[1] || '').toLowerCase()
        if (!u.tcg.cards[cardId] || u.tcg.cards[cardId] < 1) return replyText(conn, m, '[ ⚠️ ] Kamu tidak punya kartu ini.')
        
        const usedCount = u.tcg.deck.filter(id => id === cardId).length
        if (u.tcg.cards[cardId] <= usedCount) return replyText(conn, m, '[ ⚠️ ] Kartu sedang dipakai di Deck. Copot dulu sebelum dipecah.')
        
        const card = CARD_DATABASE.find(c => c.id === cardId)
        let coinYield = 1
        if (card.rarity === 'U') coinYield = 5
        if (card.rarity === 'R') coinYield = 20
        if (card.rarity === 'SR') coinYield = 100
        if (card.rarity === 'UR') coinYield = 500
        if (card.rarity === 'XR') coinYield = 5000
        
        u.tcg.cards[cardId] -= 1
        u.tcg.holoCoins += coinYield
        
        saveDb(db)
        await replyText(conn, m, `♻️ *CARD DISMANTLED*\nKartu [ ${card.name} ] dihancurkan menjadi debu digital.\nKamu mendapatkan 🪙 +${coinYield} Holo-Coins.`)
      }

      else if (action === 'duel' || action === 'vs') {
        const target = m.mentionedJid?.[0] || args[1]
        const bet = Math.floor(Number(args[2]))
        
        if (!target?.includes('@')) return replyText(conn, m, `[ ⚠️ ] Tag lawanmu. Format: ${usedPrefix}tcg duel @user <taruhan>`)
        if (target === m.sender) return replyText(conn, m, '[ ⚠️ ] Ga bisa duel sama diri sendiri.')
        if (isNaN(bet) || bet < 10000) return replyText(conn, m, '[ ⚠️ ] Taruhan minimal 10,000 Gold.')
        
        const enemy = ensureTcgData(db, target)
        if (!enemy) return replyText(conn, m, '[ ⚠️ ] Target belum pernah main RPG ini.')
        
        if (u.tcg.deck.includes(null)) return replyText(conn, m, '[ ⚠️ ] Deck kamu belum penuh! Isi kelima slot di .tcg deck')
        if (enemy.tcg.deck.includes(null)) return replyText(conn, m, '[ ⚠️ ] Deck target belum siap (belum 5 kartu).')
        
        if (u.gold < bet) return replyText(conn, m, `[ ⚠️ ] Uang taruhanmu kurang!`)
        if (enemy.gold < bet) return replyText(conn, m, `[ ⚠️ ] Uang taruhan target kurang!`)

        u.gold -= bet
        enemy.gold -= bet

        // Hitung Power Deck
        const getDeckPower = (deckArr) => {
           let atk = 0, def = 0
           deckArr.forEach(id => {
              const c = CARD_DATABASE.find(c => c.id === id)
              atk += c.atk
              def += c.def
           })
           return { atk, def }
        }

        const myPwr = getDeckPower(u.tcg.deck)
        const ePwr = getDeckPower(enemy.tcg.deck)
        
        // Simulasikan 3 Ronde (Fase)
        // Ronde 1: Total ATK vs Total DEF
        // Ronde 2: RNG Luck (Heart of the Cards)
        // Ronde 3: Gabungan
        
        const myScore = myPwr.atk + myPwr.def + rand(0, 200) + (u.luck * 10)
        const eScore = ePwr.atk + ePwr.def + rand(0, 200) + (enemy.luck * 10)
        
        let txt = `🎴 *HOLO-NEXUS DUEL INITIATED!* 🎴\n\n@${m.sender.split('@')[0]} (ATK:${myPwr.atk}/DEF:${myPwr.def})\n⚔️ VS ⚔️\n@${target.split('@')[0]} (ATK:${ePwr.atk}/DEF:${ePwr.def})\n\nArena Hologram menyala! Kartu-kartu bertabrakan di udara!\n`

        if (myScore > eScore) {
           const prize = bet * 2
           u.gold += prize
           u.tcg.wins += 1
           enemy.tcg.losses += 1
           txt += `\n🎉 *KAMU MENANG!*\nKombinasi kartumu berhasil menghancurkan Life Point lawan menjadi 0!\nKamu menyapu bersih meja dan memenangkan 💰 ${formatNum(prize)} Gold.`
        } else if (eScore > myScore) {
           const prize = bet * 2
           enemy.gold += prize
           enemy.tcg.wins += 1
           u.tcg.losses += 1
           txt += `\n💀 *KAMU KALAH!*\nLawan menarik kartu kunci dari decknya dan melancarkan serangan pemungkas!\nUang taruhanmu (💰 ${formatNum(bet)}) dirampas lawan.`
        } else {
           u.gold += bet
           enemy.gold += bet
           txt += `\n🤝 *DRAW!*\nKekuatan kedua Deck seimbang. Pertandingan berakhir seri dan uang taruhan dikembalikan.`
        }
        
        saveDb(db)
        await conn.sendMessage(m.chat, { text: txt, mentions: [m.sender, target] }, { quoted: m })
      }
      else {
        replyText(conn, m, `[ ⚠️ ] Format salah. Cek menu: ${usedPrefix}tcg`)
      }
      break
    }

    default:
      break
  }
}

handler.help = ['tcg', 'duel']
handler.tags = ['rpg']
handler.command = /^(tcg|cards|duel)$/i
handler.limit = false
handler.register = false

export default handler
