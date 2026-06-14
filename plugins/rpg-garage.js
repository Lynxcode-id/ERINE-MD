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

// Injeksi data Garage tanpa merusak profil lama
function ensureGarageData(db, jid) {
  if (!db.users[jid]) return false
  const u = db.users[jid]
  
  u.garage = u.garage || {
    vehicles: {}, // Tempat simpan kendaraan yang dibeli
    activeRide: null, // ID kendaraan yang lagi dipakai
    techScrap: 0, // Mata uang khusus bengkel
    wins: 0,
    losses: 0,
    lastScavenge: 0
  }
  
  return u
}

async function showList(conn, m, title, rows, footer = '') {
  const txt = [
    `╔═══『 🏎️ ${title} 』═══`,
    ...rows.map(r => `╠ ⎔ ${r}`),
    `╚══════════════════════`,
    footer ? `[🔧] ${footer}` : ''
  ].filter(Boolean).join('\n')
  await conn.sendMessage(m.chat, { text: txt }, { quoted: m })
}

function replyText(conn, m, text) {
  return conn.sendMessage(m.chat, { text }, { quoted: m })
}

// Katalog Kendaraan
const VEHICLES = {
  'hoverbike': { name: 'Rusty Hover-Bike', price: 50000, speed: 20, accel: 30, handling: 15 },
  'neoncruiser': { name: 'Neon Cruiser', price: 150000, speed: 45, accel: 40, handling: 35 },
  'plasmadrifter': { name: 'Plasma Drifter', price: 350000, speed: 70, accel: 65, handling: 80 },
  'quantuminterceptor': { name: 'Quantum Interceptor', price: 800000, speed: 120, accel: 110, handling: 95 }
}

// Bos Balapan Liar (PvE)
const RACING_BOSSES = [
  { id: 'phantom_jemima', name: 'Phantom Jemima', diff: 50, reward: 25000, req: 1 },
  { id: 'speedster_takina', name: 'Speedster Takina', diff: 120, reward: 80000, req: 3 },
  { id: 'hydro_trisha', name: 'Hydro Trisha', diff: 250, reward: 200000, req: 5 },
  { id: 'erine_apex', name: 'Erine Apex-Predator', diff: 400, reward: 500000, req: 8 }
]

const handler = async (m, { conn, usedPrefix, command, text }) => {
  const db = loadDb()
  if (!db) return replyText(conn, m, '[ ⚠️ ] Database offline. Pancing dengan command .profile di RPG utama.')
  
  const u = ensureGarageData(db, m.sender)
  if (!u) return replyText(conn, m, '[ ⚠️ ] Profil tidak ditemukan. Ketik .profile dulu di RPG utama.')

  const args = String(text || '').trim().split(/\s+/).filter(Boolean)
  const sub = String(command || '').toLowerCase()

  const menu = [
    `*▣ CYBER-GARAGE & RACING ▣*`,
    `Bangun monster jalanan dan kuasai sirkuit neon!`,
    ``,
    `${usedPrefix}garage info`,
    `${usedPrefix}garage shop`,
    `${usedPrefix}garage buy <id>`,
    `${usedPrefix}garage equip <id>`,
    `${usedPrefix}tune <engine/thruster/chassis>`,
    `${usedPrefix}scavenge`,
    `${usedPrefix}race @user <taruhan>`,
    `${usedPrefix}raceboss`
  ]

  switch (sub) {
    case 'garage':
    case 'bengkel': {
      const action = (args[0] || '').toLowerCase()

      if (!action || action === 'help') {
        await showList(conn, m, 'NEON GARAGE', menu, 'Welcome to the Underground')
        break
      }

      if (action === 'info') {
        const rideId = u.garage.activeRide
        const ride = rideId ? u.garage.vehicles[rideId] : null

        const rows = [
          `⚙️ Tech-Scrap: ${formatNum(u.garage.techScrap)}`,
          `🏁 Rekor Balap: ${u.garage.wins} Menang | ${u.garage.losses} Kalah`,
          `🚗 Kendaraan Dimiliki: ${Object.keys(u.garage.vehicles).length}`,
          ``,
          `*=== ACTIVE RIDE ===*`
        ]

        if (ride) {
          rows.push(
            `🏎️ Nama: ${ride.name}`,
            `💨 Speed: ${ride.speed} (Lv.${ride.upgrades.engine})`,
            `🚀 Acceleration: ${ride.accel} (Lv.${ride.upgrades.thruster})`,
            `🕹️ Handling: ${ride.handling} (Lv.${ride.upgrades.chassis})`,
            `🌟 Performance Rating (PR): ${ride.speed + ride.accel + ride.handling}`
          )
        } else {
          rows.push(`[ Tidak ada kendaraan yang dipakai. Beli di .garage shop ]`)
        }

        await showList(conn, m, `GARAGE: @${m.sender.split('@')[0]}`, rows)
      } 
      
      else if (action === 'shop') {
        const rows = Object.entries(VEHICLES).map(([id, v]) => `[ ${id} ] ${v.name} — 💰 ${formatNum(v.price)} Gold\n    ↳ SPD: ${v.speed} | ACC: ${v.accel} | HND: ${v.handling}`)
        await showList(conn, m, 'VEHICLE DEALERSHIP', rows, `Beli: ${usedPrefix}garage buy <id>`)
      }

      else if (action === 'buy') {
        const id = args[1]?.toLowerCase()
        const veh = VEHICLES[id]
        if (!veh) return replyText(conn, m, '[ ⚠️ ] Kendaraan tidak ditemukan. Cek id di .garage shop')
        if (u.garage.vehicles[id]) return replyText(conn, m, '[ ⚠️ ] Kamu sudah memiliki kendaraan ini di garasi.')
        
        if (u.gold < veh.price) return replyText(conn, m, `[ ⚠️ ] Gold tidak cukup! Butuh ${formatNum(veh.price)} Gold.`)
        
        u.gold -= veh.price
        u.garage.vehicles[id] = {
          name: veh.name,
          speed: veh.speed,
          accel: veh.accel,
          handling: veh.handling,
          upgrades: { engine: 1, thruster: 1, chassis: 1 }
        }
        
        // Otomatis equip kalau belum punya
        if (!u.garage.activeRide) u.garage.activeRide = id
        
        saveDb(db)
        await replyText(conn, m, `🔑 *DEAL SUCCESS!*\nKunci [ ${veh.name} ] resmi berpindah tangan ke kamu.\nOtomatis disimpan di garasi.`)
      }

      else if (action === 'equip') {
        const id = args[1]?.toLowerCase()
        if (!u.garage.vehicles[id]) return replyText(conn, m, '[ ⚠️ ] Kamu tidak memiliki kendaraan tersebut.')
        
        u.garage.activeRide = id
        saveDb(db)
        await replyText(conn, m, `🏎️ *RIDE SWITCHED*\nKamu sekarang mengendarai [ ${u.garage.vehicles[id].name} ].`)
      }
      break
    }

    case 'tune':
    case 'modifikasi': {
      const part = (args[0] || '').toLowerCase()
      const rideId = u.garage.activeRide
      if (!rideId) return replyText(conn, m, '[ ⚠️ ] Equip kendaraan dulu sebelum di-tune!')
      
      const ride = u.garage.vehicles[rideId]
      const validParts = ['engine', 'thruster', 'chassis']
      
      if (!validParts.includes(part)) {
        return replyText(conn, m, `[ ⚠️ ] Bagian yang bisa di-tune: engine (Speed), thruster (Accel), chassis (Handling).\nFormat: ${usedPrefix}tune <bagian>`)
      }

      const currentLvl = ride.upgrades[part]
      if (currentLvl >= 20) return replyText(conn, m, `[ ⚠️ ] Upgrade ${part.toUpperCase()} sudah mencapai MAX Level (Lv.20).`)

      const costScrap = currentLvl * 15
      const costGold = currentLvl * 10000

      if (u.garage.techScrap < costScrap || u.gold < costGold) {
        return replyText(conn, m, `[ ⚠️ ] Komponen tidak cukup untuk tune ${part} ke Lv.${currentLvl + 1}.\nButuh: ⚙️ ${costScrap} Tech-Scrap & 💰 ${formatNum(costGold)} Gold.`)
      }

      u.garage.techScrap -= costScrap
      u.gold -= costGold
      ride.upgrades[part] += 1
      
      // Tambah stat
      if (part === 'engine') ride.speed += rand(3, 7)
      if (part === 'thruster') ride.accel += rand(3, 7)
      if (part === 'chassis') ride.handling += rand(3, 7)

      saveDb(db)
      await replyText(conn, m, `🔧 *TUNING SUCCESS*\nMekanik selesai mengotak-atik [ ${ride.name} ]!\nLevel ${part.toUpperCase()} naik ke Lv.${ride.upgrades[part]}.\nPerforma kendaraan meningkat!`)
      break
    }

    case 'scavenge':
    case 'mulung': {
      if (!canUseCooldown(u, 'scavenge')) return replyText(conn, m, `[ ⚠️ ] Area rongsokan sedang dijaga Cyber-Police. Balik lagi dalam: ${msToClock(cdLeft(u, 'scavenge'))}`)
      if (u.energy < 20) return replyText(conn, m, '[ ⚠️ ] Energy manajer kurang untuk menggali rongsokan (Butuh 20).')
      
      u.energy -= 20
      const scrapGained = rand(10, 40) + (u.luck * 2)
      u.garage.techScrap += scrapGained
      
      let bonusText = ''
      // Bonus item dari base RPG
      if (Math.random() < 0.2) {
        u.items = u.items || {}
        const rareDrop = pick(['obsidian', 'cybercore', 'crystal'])
        u.items[rareDrop] = (u.items[rareDrop] || 0) + 1
        bonusText = `\n🎁 Hoki! Nemu 1x ${rareDrop} di tumpukan sampah!`
      }
      
      cooldown(u, 'scavenge', 15 * 60 * 1000)
      saveDb(db)
      
      await replyText(conn, m, `🗑️ *SCAVENGE COMPLETE*\nKamu mengacak-acak tempat pembuangan mekanik dan mendapatkan:\n⚙️ +${scrapGained} Tech-Scrap${bonusText}`)
      break
    }

    case 'race':
    case 'balap': {
      const target = m.mentionedJid?.[0] || args[0]
      const bet = Math.floor(Number(args[1]))
      
      if (!target?.includes('@')) return replyText(conn, m, `[ ⚠️ ] Tag musuh balapanmu! Format: ${usedPrefix}race @user <taruhan>`)
      if (target === m.sender) return replyText(conn, m, '[ ⚠️ ] Mau balapan sama bayangan?')
      if (isNaN(bet) || bet < 1000) return replyText(conn, m, '[ ⚠️ ] Taruhan minimal 1,000 Gold.')
      
      const enemy = ensureGarageData(db, target)
      if (!enemy) return replyText(conn, m, '[ ⚠️ ] Target belum pernah main RPG. Suruh ketik .profile dulu.')
      
      if (!u.garage.activeRide) return replyText(conn, m, '[ ⚠️ ] Kamu belum pakai kendaraan. Jalan kaki mau balapan?')
      if (!enemy.garage.activeRide) return replyText(conn, m, '[ ⚠️ ] Target tidak punya kendaraan aktif.')
      
      if (u.gold < bet) return replyText(conn, m, `[ ⚠️ ] Uang taruhanmu kurang!`)
      if (enemy.gold < bet) return replyText(conn, m, `[ ⚠️ ] Target lagi kere, ga punya uang buat taruhan segitu.`)

      const myRide = u.garage.vehicles[u.garage.activeRide]
      const enemyRide = enemy.garage.vehicles[enemy.garage.activeRide]

      // Rumus Balapan: (PR = Speed + Accel + Handling) + RNG Luck + RNG Track
      const myPR = myRide.speed + myRide.accel + myRide.handling + (u.luck * 2) + rand(10, 50)
      const enemyPR = enemyRide.speed + enemyRide.accel + enemyRide.handling + (enemy.luck * 2) + rand(10, 50)

      u.gold -= bet
      enemy.gold -= bet

      let txt = `🏁 *STREET RACE INITIATED* 🏁\n\n[ ${myRide.name} ]\nVS\n[ ${enemyRide.name} ]\n\nTaruhan: 💰 ${formatNum(bet)} Gold\n\n*MENYALAKAN MESIN...*\n`

      if (myPR > enemyPR) {
        const totalPrize = bet * 2
        u.gold += totalPrize
        u.garage.wins += 1
        enemy.garage.losses += 1
        txt += `\n🏎️💨 *KAMU MENANG!*\nManuver gila dari [ ${myRide.name} ] memotong garis finish duluan!\nKamu membawa pulang ${formatNum(totalPrize)} Gold.`
      } else if (enemyPR > myPR) {
        const totalPrize = bet * 2
        enemy.gold += totalPrize
        enemy.garage.wins += 1
        u.garage.losses += 1
        txt += `\n💥 *KAMU KALAH!*\n[ ${myRide.name} ] tertinggal jauh di belakang debu knalpot lawan!\nUang taruhan hangus diambil @${target.split('@')[0]}.`
      } else {
        u.gold += bet
        enemy.gold += bet
        txt += `\n🤝 *DRAW!*\nKalian melewati garis finish di detik yang sama. Uang taruhan dikembalikan.`
      }

      saveDb(db)
      await conn.sendMessage(m.chat, { text: txt, mentions: [target] }, { quoted: m })
      break
    }

    case 'raceboss': {
      if (!u.garage.activeRide) return replyText(conn, m, '[ ⚠️ ] Jalan kaki ga bisa ngelawan bos balap. Beli kendaraan dulu.')
      
      const action = (args[0] || '').toLowerCase()
      if (!action || action === 'list') {
        const rows = RACING_BOSSES.map((b, i) => `[ ${i+1} ] 💀 ${b.name}\n    ↳ Difficulty PR: ~${b.diff} | Reward: ${formatNum(b.reward)}G`)
        return showList(conn, m, 'UNDERGROUND KINGS', rows, `Lawan: ${usedPrefix}raceboss <nomor>`)
      }

      const bossNum = Math.floor(Number(args[0])) - 1
      const boss = RACING_BOSSES[bossNum]
      if (!boss) return replyText(conn, m, '[ ⚠️ ] Boss tidak ditemukan. Cek list dengan .raceboss list')

      // Cegah spam boss
      const last = u.garage.lastScavenge || 0 // Pakai timer bareng scavenge / cooldown khusus boss
      const bossCdKey = `boss_race_${boss.id}`
      if (!canUseCooldown(u, bossCdKey)) return replyText(conn, m, `[ ⚠️ ] Bos ini lagi modif mobilnya. Tantang lagi dalam: ${msToClock(cdLeft(u, bossCdKey))}`)

      if (u.energy < 30) return replyText(conn, m, '[ ⚠️ ] Balapan ekstrem butuh konsentrasi penuh. Energy minimal 30.')
      u.energy -= 30
      
      const myRide = u.garage.vehicles[u.garage.activeRide]
      const myPR = myRide.speed + myRide.accel + myRide.handling + (u.luck * 2) + rand(10, 30)
      const bossPR = boss.diff + rand(0, 40) // Bos juga punya RNG kecil

      let txt = `🏁 *BOSS RACE PROTOCOL* 🏁\n\n@${m.sender.split('@')[0]} [ ${myRide.name} ]\nVS\n👑 [ ${boss.name} ]\n\nMemasuki sirkuit... Drift beradu...`

      if (myPR > bossPR) {
        u.gold += boss.reward
        u.garage.wins += 1
        
        // Item drop
        u.items = u.items || {}
        u.items['crate_neon'] = (u.items['crate_neon'] || 0) + 1
        
        txt += `\n\n🎉 *EPIC VICTORY!*\nKamu berhasil mengalahkan legenda Underground!\n\n💰 Reward: +${formatNum(boss.reward)} Gold\n🎁 Bonus: 1x Neon Crate`
        cooldown(u, bossCdKey, 12 * 60 * 60 * 1000) // 12 jam CD kalau menang
      } else {
        u.garage.losses += 1
        const repairCost = rand(5000, 15000)
        u.gold = Math.max(0, u.gold - repairCost)
        
        txt += `\n\n💀 *CRUSHED!*\nKamu diasapi tanpa ampun oleh ${boss.name}.\nMobil lecet parah, biaya bengkel memotong -${formatNum(repairCost)} Gold dari saldo.`
        cooldown(u, bossCdKey, 1 * 60 * 60 * 1000) // 1 jam CD kalau kalah
      }

      saveDb(db)
      await conn.sendMessage(m.chat, { text: txt, mentions: [m.sender] }, { quoted: m })
      break
    }

    default:
      break
  }
}

handler.help = ['garage', 'scavenge', 'race']
handler.tags = ['rpg']
handler.command = /^(garage|bengkel|tune|modifikasi|scavenge|mulung|race|balap|raceboss)$/i
handler.limit = false
handler.register = false

export default handler
