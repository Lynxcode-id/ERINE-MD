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

// Injeksi data Farm ke profil player
function ensureFarmData(db, jid) {
  if (!db.users[jid]) return false
  const u = db.users[jid]
  
  u.farm = u.farm || {
    level: 1,
    maxPlots: 2, // Awal mula 2 petak tanah
    plots: [
      { id: 1, seed: null, plantTime: 0 },
      { id: 2, seed: null, plantTime: 0 }
    ],
    fertilizer: 0,
    vipOrders: null,
    orderRefresh: 0
  }
  
  // Storage buff dari makanan
  u.foodBuffs = u.foodBuffs || {
    atk: 0, def: 0, maxHp: 0, luck: 0, expire: 0
  }
  
  return u
}

async function showList(conn, m, title, rows, footer = '') {
  const txt = [
    `╔═══『 🌾 ${title} 』═══`,
    ...rows.map(r => `╠ ⎔ ${r}`),
    `╚══════════════════════`,
    footer ? `[🍽️] ${footer}` : ''
  ].filter(Boolean).join('\n')
  await conn.sendMessage(m.chat, { text: txt }, { quoted: m })
}

function replyText(conn, m, text) {
  return conn.sendMessage(m.chat, { text }, { quoted: m })
}

// Katalog Benih
const SEEDS = {
  'seed_wheat': { name: 'Neon Wheat Seed', cost: 1000, growTime: 2, yieldId: 'neon_wheat', yieldQty: [3, 6] },
  'seed_berry': { name: 'Void Berry Seed', cost: 3000, growTime: 4, yieldId: 'void_berry', yieldQty: [2, 5] },
  'seed_plasma': { name: 'Plasma Fruit Seed', cost: 8000, growTime: 8, yieldId: 'plasma_fruit', yieldQty: [1, 3] },
  'seed_lotus': { name: 'Cyber Lotus Seed', cost: 20000, growTime: 12, yieldId: 'cyber_lotus', yieldQty: [1, 2] }
}

// Katalog Resep Makanan (Culinary)
const RECIPES = {
  'f1': { name: 'Neon Fried Rice', req: { neon_wheat: 2, meat: 1 }, desc: 'ATK +200, HP +1000 (4 Jam)' },
  'f2': { name: 'Void Berry Jam', req: { void_berry: 3, herb: 2 }, desc: 'LUCK +30, DEF +150 (6 Jam)' },
  'f3': { name: 'Plasma Steak', req: { plasma_fruit: 2, meat: 3, spice: 1 }, desc: 'ATK +1000, DEF +500 (8 Jam)' },
  'f4': { name: 'Cyber-Lotus Sushi', req: { cyber_lotus: 1, fish: 3, neon_wheat: 2 }, desc: 'ALL STATS MASSIVE (12 Jam)' }
}

// Pelanggan VIP & Order
const VIP_CUSTOMERS = [
  { name: 'Jemima', reqFood: 'f4', rewardGold: 500000, rewardExp: 10000 },
  { name: 'Erine', reqFood: 'f3', rewardGold: 250000, rewardExp: 5000 },
  { name: 'Takina', reqFood: 'f2', rewardGold: 100000, rewardExp: 2000 },
  { name: 'Trisha (Hydro)', reqFood: 'f1', rewardGold: 50000, rewardExp: 1000 }
]

function generateOrders() {
  const orders = []
  // Random 2 pelanggan
  const shuffled = VIP_CUSTOMERS.sort(() => 0.5 - Math.random())
  orders.push({ ...shuffled[0], isDone: false })
  orders.push({ ...shuffled[1], isDone: false })
  return orders
}

const handler = async (m, { conn, usedPrefix, command, text }) => {
  const db = loadDb()
  if (!db) return replyText(conn, m, '[ ⚠️ ] Database offline. Pancing dengan command .profile di RPG utama.')
  
  const u = ensureFarmData(db, m.sender)
  if (!u) return replyText(conn, m, '[ ⚠️ ] Profil tidak ditemukan. Ketik .profile dulu di RPG utama.')

  // Reset Food Buffs if expired
  if (u.foodBuffs.expire > 0 && now() > u.foodBuffs.expire) {
    u.atk -= u.foodBuffs.atk
    u.def -= u.foodBuffs.def
    u.maxHp -= u.foodBuffs.maxHp
    u.hp = Math.min(u.hp, u.maxHp)
    u.luck -= u.foodBuffs.luck
    
    u.foodBuffs = { atk: 0, def: 0, maxHp: 0, luck: 0, expire: 0 }
    saveDb(db)
  }

  // Auto-Refresh VIP Orders (Tiap 24 Jam)
  if (!u.farm.vipOrders || now() - u.farm.orderRefresh > 24 * 60 * 60 * 1000) {
    u.farm.vipOrders = generateOrders()
    u.farm.orderRefresh = now()
    saveDb(db)
  }

  const args = String(text || '').trim().split(/\s+/).filter(Boolean)
  const sub = String(command || '').toLowerCase()

  const menu = [
    `*▣ HOLO-GREENHOUSE ▣*`,
    `${usedPrefix}farm info`,
    `${usedPrefix}farm seedshop`,
    `${usedPrefix}farm buyseed <id> <qty>`,
    `${usedPrefix}farm plant <seed_id> <plot_id>`,
    `${usedPrefix}farm harvest`,
    `${usedPrefix}farm expand`,
    ``,
    `*▣ CYBER-KITCHEN ▣*`,
    `${usedPrefix}cook menu`,
    `${usedPrefix}cook make <id>`,
    `${usedPrefix}eat <id>`,
    ``,
    `*▣ VIP DELIVERY ▣*`,
    `${usedPrefix}delivery`
  ]

  switch (sub) {
    case 'farm':
    case 'kebun': {
      const action = (args[0] || '').toLowerCase()

      if (!action || action === 'help') {
        await showList(conn, m, 'NEON VALLEY FARM', menu, 'Tanam, Masak, Kaya Raya!')
        break
      }

      if (action === 'info') {
        const rows = []
        rows.push(`👨‍🌾 Level Petani: ${u.farm.level}`)
        rows.push(`🟩 Kapasitas Lahan: ${u.farm.maxPlots} Petak`)
        rows.push(``)
        rows.push(`*=== STATUS LAHAN ===*`)
        
        for (const plot of u.farm.plots) {
           if (!plot.seed) {
             rows.push(`[ Petak ${plot.id} ] 🟫 Kosong`)
           } else {
             const seedData = SEEDS[plot.seed]
             const finishTime = plot.plantTime + (seedData.growTime * 60 * 60 * 1000)
             if (now() >= finishTime) {
               rows.push(`[ Petak ${plot.id} ] 🌿 Siap Panen! (${seedData.name})`)
             } else {
               rows.push(`[ Petak ${plot.id} ] 🌱 Tumbuh... Sisa: ${msToClock(finishTime - now())}`)
             }
           }
        }
        
        await showList(conn, m, `GREENHOUSE: @${m.sender.split('@')[0]}`, rows)
      }

      else if (action === 'seedshop' || action === 'shop') {
        const rows = Object.entries(SEEDS).map(([id, s]) => `[ ${id} ] ${s.name}\n    ↳ Harga: 💰 ${formatNum(s.cost)} Gold | Waktu Tumbuh: ${s.growTime} Jam`)
        await showList(conn, m, 'CYBER-BOTANICAL SHOP', rows, `Beli: ${usedPrefix}farm buyseed <id> <jumlah>`)
      }

      else if (action === 'buyseed') {
        const seedId = (args[1] || '').toLowerCase()
        const qty = Math.floor(Number(args[2])) || 1
        
        const seed = SEEDS[seedId]
        if (!seed) return replyText(conn, m, '[ ⚠️ ] Benih tidak ditemukan. Cek id di .farm seedshop')
        if (qty <= 0) return replyText(conn, m, '[ ⚠️ ] Jumlah tidak valid.')
        
        const cost = seed.cost * qty
        if (u.gold < cost) return replyText(conn, m, `[ ⚠️ ] Gold kurang! Butuh 💰 ${formatNum(cost)} Gold.`)
        
        u.gold -= cost
        u.items = u.items || {}
        u.items[seedId] = (u.items[seedId] || 0) + qty
        
        saveDb(db)
        await replyText(conn, m, `🌱 *BENIH DIBELI*\nMembeli ${qty}x ${seed.name}.\nTotal Biaya: -${formatNum(cost)} Gold\n(Gunakan .farm plant untuk menanam)`)
      }

      else if (action === 'plant' || action === 'tanam') {
        const seedId = (args[1] || '').toLowerCase()
        const plotId = Math.floor(Number(args[2]))
        
        if (!seedId || !plotId) return replyText(conn, m, `[ ⚠️ ] Format: ${usedPrefix}farm plant <seed_id> <plot_id>\nContoh: .farm plant seed_wheat 1`)
        if (!SEEDS[seedId]) return replyText(conn, m, '[ ⚠️ ] ID Benih tidak valid.')
        
        u.items = u.items || {}
        if ((u.items[seedId] || 0) < 1) return replyText(conn, m, '[ ⚠️ ] Kamu tidak memiliki benih ini di inventory.')
        
        const plot = u.farm.plots.find(p => p.id === plotId)
        if (!plot) return replyText(conn, m, `[ ⚠️ ] Petak ${plotId} tidak ditemukan. Kamu hanya punya ${u.farm.maxPlots} petak lahan.`)
        if (plot.seed) return replyText(conn, m, '[ ⚠️ ] Petak ini sudah ditanami sesuatu!')
        
        u.items[seedId] -= 1
        plot.seed = seedId
        plot.plantTime = now()
        
        saveDb(db)
        await replyText(conn, m, `💦 *BENIH DITANAM!*\nMenanam [ ${SEEDS[seedId].name} ] di Petak ${plotId}.\nSistem penyiram otomatis diaktifkan. Panen dalam ${SEEDS[seedId].growTime} Jam.`)
      }

      else if (action === 'harvest' || action === 'panen') {
        let totalHarvest = {}
        let expBonus = 0
        let harvestedPlots = 0
        
        for (const plot of u.farm.plots) {
          if (plot.seed) {
            const seedData = SEEDS[plot.seed]
            const finishTime = plot.plantTime + (seedData.growTime * 60 * 60 * 1000)
            
            if (now() >= finishTime) {
               // Sukses Panen
               const qty = rand(seedData.yieldQty[0], seedData.yieldQty[1])
               totalHarvest[seedData.yieldId] = (totalHarvest[seedData.yieldId] || 0) + qty
               expBonus += (seedData.growTime * 100) // Makin lama tanam, exp makin gede
               
               // Bersihin petak
               plot.seed = null
               plot.plantTime = 0
               harvestedPlots++
            }
          }
        }
        
        if (harvestedPlots === 0) return replyText(conn, m, '[ ⚠️ ] Belum ada tanaman yang siap dipanen.')
        
        // Masukin ke inventory
        u.items = u.items || {}
        for (const [item, qty] of Object.entries(totalHarvest)) {
           u.items[item] = (u.items[item] || 0) + qty
        }
        u.exp += expBonus
        
        saveDb(db)
        
        const harvestTxt = Object.entries(totalHarvest).map(([k, v]) => `🌿 ${k} x${v}`).join('\n')
        await replyText(conn, m, `🧺 *PANEN RAYA!* 🧺\nKamu memanen ${harvestedPlots} petak lahan dan mendapatkan:\n\n${harvestTxt}\n💠 +${formatNum(expBonus)} EXP Petani`)
      }

      else if (action === 'expand' || action === 'perluas') {
        if (u.farm.maxPlots >= 10) return replyText(conn, m, '[ ⚠️ ] Lahan Greenhouse sudah mencapai batas maksimal (10 Petak).')
        
        const costGold = u.farm.maxPlots * 500000
        const costCrystal = u.farm.maxPlots * 2
        
        if (u.gold < costGold || (u.items['crystal'] || 0) < costCrystal) {
           return replyText(conn, m, `[ ⚠️ ] Material ekspansi kurang!\nButuh: 💰 ${formatNum(costGold)} Gold & 💠 ${costCrystal} Crystal.`)
        }
        
        u.gold -= costGold
        u.items['crystal'] -= costCrystal
        u.farm.maxPlots += 1
        u.farm.plots.push({ id: u.farm.maxPlots, seed: null, plantTime: 0 })
        u.farm.level += 1
        
        saveDb(db)
        await replyText(conn, m, `🚜 *LAHAN DIPERLUAS*\nHolo-Greenhouse ditingkatkan!\nTotal lahan sekarang: ${u.farm.maxPlots} Petak.`)
      }
      else {
        replyText(conn, m, `[ ⚠️ ] Command salah. Ketik ${usedPrefix}farm untuk menu.`)
      }
      break
    }

    case 'cook':
    case 'masak': {
      const action = (args[0] || '').toLowerCase()
      
      if (!action || action === 'menu' || action === 'list') {
        const rows = Object.entries(RECIPES).map(([id, r]) => {
           const reqTxt = Object.entries(r.req).map(([k, v]) => `${k} x${v}`).join(', ')
           return `[ ${id} ] 🍳 ${r.name}\n    ↳ Resep: ${reqTxt}\n    ↳ Buff: ${r.desc}`
        })
        return showList(conn, m, 'CYBER-KITCHEN MENU', rows, `Masak: ${usedPrefix}cook make <id>`)
      }

      if (action === 'make' || action === 'buat') {
        const recipeId = (args[1] || '').toLowerCase()
        const recipe = RECIPES[recipeId]
        
        if (!recipe) return replyText(conn, m, '[ ⚠️ ] Resep tidak ditemukan. Cek .cook menu')
        
        u.items = u.items || {}
        
        // Cek Bahan
        for (const [item, qty] of Object.entries(recipe.req)) {
           if ((u.items[item] || 0) < qty) {
              return replyText(conn, m, `[ ⚠️ ] Bahan kurang! Kamu tidak punya cukup ${item} (Butuh ${qty}).\nPergi memancing, berburu, atau bertani!`)
           }
        }
        
        // Potong Bahan
        for (const [item, qty] of Object.entries(recipe.req)) {
           u.items[item] -= qty
        }
        
        // Kasih item makanan
        const foodItemKey = `food_${recipeId}`
        u.items[foodItemKey] = (u.items[foodItemKey] || 0) + 1
        
        saveDb(db)
        await replyText(conn, m, `🔥 *COOKING SUCCESS* 🔥\nKoki mengaduk bahan di atas wajan plasma...\nKamu berhasil memasak 1x [ ${recipe.name} ]!\n\n(Makanan tersimpan di inventory. Ketik .eat ${foodItemKey} untuk makan)`)
      }
      break
    }

    case 'eat':
    case 'makan': {
      const foodKey = (args[0] || '').toLowerCase()
      if (!foodKey.startsWith('food_')) return replyText(conn, m, `[ ⚠️ ] Format: ${usedPrefix}eat food_<id>\nContoh: .eat food_f1`)
      
      u.items = u.items || {}
      if ((u.items[foodKey] || 0) < 1) return replyText(conn, m, '[ ⚠️ ] Kamu tidak memiliki makanan ini di inventory.')
      
      const recipeId = foodKey.split('_')[1]
      const recipe = RECIPES[recipeId]
      
      if (!recipe) return replyText(conn, m, '[ ⚠️ ] Makanan kadaluarsa atau tidak valid.')
      if (u.foodBuffs.expire > now()) return replyText(conn, m, '[ ⚠️ ] Perutmu masih penuh! Efek makanan sebelumnya masih aktif.')
      
      // Consume
      u.items[foodKey] -= 1
      
      // Apply Buffs (Overpowered)
      let buffAtk = 0, buffDef = 0, buffHp = 0, buffLuck = 0, hrs = 0
      
      if (recipeId === 'f1') { buffAtk = 200; buffHp = 1000; hrs = 4; }
      if (recipeId === 'f2') { buffLuck = 30; buffDef = 150; hrs = 6; }
      if (recipeId === 'f3') { buffAtk = 1000; buffDef = 500; hrs = 8; }
      if (recipeId === 'f4') { buffAtk = 2500; buffDef = 2500; buffHp = 5000; buffLuck = 50; hrs = 12; }
      
      u.foodBuffs = {
         atk: buffAtk,
         def: buffDef,
         maxHp: buffHp,
         luck: buffLuck,
         expire: now() + (hrs * 60 * 60 * 1000)
      }
      
      // Inject temporary stat
      u.atk += buffAtk
      u.def += buffDef
      u.maxHp += buffHp
      u.hp = u.maxHp
      u.luck += buffLuck
      
      saveDb(db)
      await replyText(conn, m, `🍽️ *ITADAKIMASU!* 🍽️\nKamu melahap [ ${recipe.name} ] sampai habis.\nTenaga meluap-luap di nadimu!\n\n✨ *BUFF AKTIF:*\nATK +${buffAtk} | DEF +${buffDef} | HP +${buffHp} | LUCK +${buffLuck}\n⏳ Durasi: ${hrs} Jam`)
      break
    }

    case 'delivery':
    case 'gocyber': {
      const orders = u.farm.vipOrders
      if (!orders) return replyText(conn, m, '[ ⚠️ ] Sistem delivery sedang error.')
      
      const action = (args[0] || '').toLowerCase()
      
      if (!action || action === 'list') {
        const nextRefresh = 24 - Math.floor((now() - u.farm.orderRefresh) / (1000 * 60 * 60))
        const rows = orders.map((o, i) => {
           const foodName = RECIPES[o.reqFood].name
           const status = o.isDone ? '✅ Selesai' : '❌ Menunggu'
           return `[ Pesanan ${i+1} ]\n    ↳ Pelanggan: 👑 VIP ${o.name}\n    ↳ Minta: 🍳 ${foodName}\n    ↳ Reward: 💰 ${formatNum(o.rewardGold)}G | 💠 ${formatNum(o.rewardExp)} EXP\n    ↳ Status: ${status}`
        })
        
        await showList(conn, m, 'VIP FOOD DELIVERY (GO-CYBER)', rows, `Kirim: ${usedPrefix}delivery send <nomor>\nRefresh dalam: ${nextRefresh} Jam`)
      }

      else if (action === 'send' || action === 'kirim') {
        const orderIndex = Math.floor(Number(args[1])) - 1
        const order = orders[orderIndex]
        
        if (!order) return replyText(conn, m, '[ ⚠️ ] Pesanan tidak ditemukan.')
        if (order.isDone) return replyText(conn, m, '[ ⚠️ ] Pesanan ini sudah kamu selesaikan.')
        
        const reqFoodKey = `food_${order.reqFood}`
        u.items = u.items || {}
        
        if ((u.items[reqFoodKey] || 0) < 1) {
           return replyText(conn, m, `[ ⚠️ ] Kamu belum memasak pesanan ini! Pelanggan VIP ${order.name} menginginkan 1x [ ${RECIPES[order.reqFood].name} ]. Masak dulu di .cook make`)
        }
        
        // Selesaikan pesanan
        u.items[reqFoodKey] -= 1
        order.isDone = true
        
        u.gold += order.rewardGold
        u.exp += order.rewardExp
        
        // Easter Egg dialog
        let dialog = ''
        if (order.name === 'Jemima') dialog = '"Wah! Makanannya enak banget, makasih ya manajer-kun!" - Jemima'
        if (order.name === 'Erine') dialog = '"Hmph, lumayan juga masakanmu. Ini bayarannya." - Erine'
        if (order.name === 'Takina') dialog = '"Slurp... Enak. Kapan-kapan buatin lagi ya." - Takina'
        if (order.name === 'Trisha (Hydro)') dialog = '"Kualitas bintang 5! Proyek kita bakal sukses kalau kamu terus begini!" - Trisha'
        
        saveDb(db)
        await replyText(conn, m, `🛵 *DELIVERY SUCCESS* 🛵\nPesanan tiba dengan selamat di meja pelanggan!\n\n💬 ${dialog}\n\n💰 Mendapatkan: +${formatNum(order.rewardGold)} Gold\n💠 Mendapatkan: +${formatNum(order.rewardExp)} EXP`)
      }
      break
    }

    default:
      break
  }
}

handler.help = ['farm', 'cook', 'eat', 'delivery']
handler.tags = ['rpg']
handler.command = /^(farm|kebun|cook|masak|eat|makan|delivery|gocyber)$/i
handler.limit = false
handler.register = false

export default handler
