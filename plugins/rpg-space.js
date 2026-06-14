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

// Injeksi data Space ke profil player
function ensureSpaceData(db, jid) {
  if (!db.users[jid]) return false
  const u = db.users[jid]
  
  u.space = u.space || {
    hasShip: false,
    shipName: 'INF-Explorer',
    level: 1,
    hull: 2000,
    maxHull: 2000,
    atk: 100,
    shield: 50,
    fuel: 100,
    maxFuel: 100,
    stardust: 0,
    sector: 'inf_orbit',
    kills: 0
  }
  
  return u
}

async function showList(conn, m, title, rows, footer = '') {
  const txt = [
    `╔═══『 🌌 ${title} 』═══`,
    ...rows.map(r => `╠ ⎔ ${r}`),
    `╚══════════════════════`,
    footer ? `[🛸] ${footer}` : ''
  ].filter(Boolean).join('\n')
  await conn.sendMessage(m.chat, { text: txt }, { quoted: m })
}

function replyText(conn, m, text) {
  return conn.sendMessage(m.chat, { text }, { quoted: m })
}

// Data Sector Galaksi
const SECTORS = {
  'inf_orbit': { name: 'Sector INF-01 (Safe Zone)', reqLv: 1, fuel: 0, enemy: 'Scrap Drones', enemyStats: { hp: 1000, atk: 50, def: 20 }, loot: { dust: [10, 30] } },
  'takina_nebula': { name: 'Takina Nebula', reqLv: 5, fuel: 15, enemy: 'Plasma Pirates', enemyStats: { hp: 5000, atk: 300, def: 150 }, loot: { dust: [50, 150], item: 'crystal' } },
  'erine_cluster': { name: 'Erine Supercluster', reqLv: 12, fuel: 30, enemy: 'Alien Warfleet', enemyStats: { hp: 15000, atk: 1200, def: 600 }, loot: { dust: [200, 500], item: 'cybercore' } },
  'jemima_void': { name: 'Jemima Void (Endgame)', reqLv: 25, fuel: 50, enemy: 'Cosmic Devourer', enemyStats: { hp: 50000, atk: 5000, def: 2500 }, loot: { dust: [1000, 3000], item: 'voidcore' } }
}

const handler = async (m, { conn, usedPrefix, command, text }) => {
  const db = loadDb()
  if (!db) return replyText(conn, m, '[ ⚠️ ] Database offline. Pancing dengan command .profile di RPG utama.')
  
  const u = ensureSpaceData(db, m.sender)
  if (!u) return replyText(conn, m, '[ ⚠️ ] Profil tidak ditemukan. Ketik .profile dulu di RPG utama.')

  const args = String(text || '').trim().split(/\s+/).filter(Boolean)
  const sub = String(command || '').toLowerCase()

  const menu = [
    `*▣ GALACTIC COMMAND ▣*`,
    `Rakir pesawatmu dan taklukkan bintang-bintang!`,
    ``,
    `${usedPrefix}space info`,
    `${usedPrefix}space build`,
    `${usedPrefix}space rename <nama>`,
    `${usedPrefix}space upgrade <hull/atk/shield/fuel>`,
    `${usedPrefix}space repair`,
    `${usedPrefix}space refuel`,
    ``,
    `*▣ COSMIC EXPLORATION ▣*`,
    `${usedPrefix}warp <id_sector>`,
    `${usedPrefix}sectors`,
    `${usedPrefix}extract`,
    `${usedPrefix}spacebattle`,
    ``,
    `*▣ RELIC SHOP ▣*`,
    `${usedPrefix}relicshop`
  ]

  switch (sub) {
    case 'space':
    case 'ship': {
      const action = (args[0] || '').toLowerCase()

      if (!action || action === 'help') {
        await showList(conn, m, 'STARFLEET COMMAND', menu, 'Ad Astra!')
        break
      }

      if (action === 'info') {
        if (!u.space.hasShip) return replyText(conn, m, `[ ⚠️ ] Kamu belum punya pesawat luar angkasa. Buat dulu dengan ${usedPrefix}space build`)

        const currentSector = SECTORS[u.space.sector]?.name || 'Unknown Sector'

        await showList(conn, m, `SPACESHIP: [ ${u.space.name} ]`, [
          `👤 Captain: @${m.sender.split('@')[0]}`,
          `🚀 Ship Level: ${u.space.level}`,
          `📍 Lokasi: ${currentSector}`,
          `💀 Alien Kills: ${u.space.kills}`,
          ``,
          `*=== SHIP STATUS ===*`,
          `🛡️ Hull Integrity: ${formatNum(u.space.hull)} / ${formatNum(u.space.maxHull)}`,
          `🔋 Hyperdrive Fuel: ${u.space.fuel} / ${u.space.maxFuel}`,
          `✨ Stardust: ${formatNum(u.space.stardust)}`,
          ``,
          `*=== COMBAT SPECS ===*`,
          `🔫 Blaster (ATK): ${formatNum(u.space.atk)}`,
          `💠 Deflector (Shield): ${formatNum(u.space.shield)}`
        ])
      } 
      
      else if (action === 'build') {
        if (u.space.hasShip) return replyText(conn, m, '[ ⚠️ ] Kamu sudah memiliki Starfighter di Hangar.')
        
        const costGold = 1000000
        const costCore = 5 // Butuh Cybercore buat mesin hyperdrive
        
        if (u.gold < costGold || (u.items['cybercore'] || 0) < costCore) {
           return replyText(conn, m, `[ ⚠️ ] Material pembuatan pesawat kurang!\nButuh: 💰 ${formatNum(costGold)} Gold & 💠 5 Cyber Core.`)
        }

        u.gold -= costGold
        u.items['cybercore'] -= costCore
        u.space.hasShip = true
        
        saveDb(db)
        await replyText(conn, m, `🚀 *SPACESHIP CONSTRUCTED*\nStarfighter kelas [ INF-Explorer ] telah selesai dirakit dan siap meluncur ke orbit!\n\nKetik ${usedPrefix}space info untuk melihat status kapal.`)
      }

      else if (action === 'rename') {
        if (!u.space.hasShip) return replyText(conn, m, '[ ⚠️ ] Bikin pesawatnya dulu bos.')
        const newName = args.slice(1).join(' ')
        if (!newName) return replyText(conn, m, `[ ⚠️ ] Format: ${usedPrefix}space rename <nama_baru>`)
        
        u.space.name = newName.slice(0, 25)
        saveDb(db)
        await replyText(conn, m, `✅ *REGISTRY UPDATED*\nNama pesawat diubah menjadi: *${u.space.name}*`)
      }

      else if (action === 'repair') {
        if (!u.space.hasShip) return replyText(conn, m, '[ ⚠️ ] Ga ada pesawat yang bisa diperbaiki.')
        if (u.space.hull >= u.space.maxHull) return replyText(conn, m, '[ ⚠️ ] Hull pesawat masih mulus 100%.')
        
        const damage = u.space.maxHull - u.space.hull
        const cost = Math.floor(damage * 5) // 5 Gold per 1 Hull
        
        if (u.gold < cost) return replyText(conn, m, `[ ⚠️ ] Gold kurang! Butuh ${formatNum(cost)} Gold untuk perbaikan penuh.`)
        
        u.gold -= cost
        u.space.hull = u.space.maxHull
        
        saveDb(db)
        await replyText(conn, m, `🔧 *MAINTENANCE COMPLETE*\nHull pesawat berhasil diperbaiki.\nBiaya perbaikan: -${formatNum(cost)} Gold`)
      }

      else if (action === 'refuel') {
        if (!u.space.hasShip) return replyText(conn, m, '[ ⚠️ ] Pesawat aja ga punya mau ngisi bensin.')
        if (u.space.fuel >= u.space.maxFuel) return replyText(conn, m, '[ ⚠️ ] Tangki Hyperdrive sudah penuh.')
        
        const fuelNeeded = u.space.maxFuel - u.space.fuel
        const cost = fuelNeeded * 1000 // 1000 Gold per 1 Fuel
        
        if (u.gold < cost) return replyText(conn, m, `[ ⚠️ ] Gold kurang! Butuh ${formatNum(cost)} Gold untuk ngisi full tank.`)
        
        u.gold -= cost
        u.space.fuel = u.space.maxFuel
        
        saveDb(db)
        await replyText(conn, m, `⛽ *REFUELING COMPLETE*\nTangki Hyperdrive terisi penuh!\nBiaya bahan bakar: -${formatNum(cost)} Gold`)
      }

      else if (action === 'upgrade') {
        if (!u.space.hasShip) return replyText(conn, m, '[ ⚠️ ] Buat pesawat dulu!')
        const part = (args[1] || '').toLowerCase()
        
        if (!['hull', 'atk', 'shield', 'fuel'].includes(part)) {
           return replyText(conn, m, `[ ⚠️ ] Bagian yang bisa diupgrade: hull / atk / shield / fuel\nFormat: ${usedPrefix}space upgrade <bagian>`)
        }

        const costStardust = u.space.level * 100
        const costGold = u.space.level * 50000

        if (u.space.stardust < costStardust || u.gold < costGold) {
           return replyText(conn, m, `[ ⚠️ ] Resource kurang untuk upgrade pesawat!\nButuh: ✨ ${formatNum(costStardust)} Stardust & 💰 ${formatNum(costGold)} Gold.`)
        }

        u.space.stardust -= costStardust
        u.gold -= costGold
        u.space.level += 1

        if (part === 'hull') { u.space.maxHull += 1000; u.space.hull = u.space.maxHull; }
        if (part === 'atk') u.space.atk += 250
        if (part === 'shield') u.space.shield += 100
        if (part === 'fuel') { u.space.maxFuel += 20; u.space.fuel = u.space.maxFuel; }

        saveDb(db)
        await replyText(conn, m, `🛠️ *SPACESHIP UPGRADED*\nSistem [ ${part.toUpperCase()} ] berhasil ditingkatkan!\nPesawat mencapai Level ${u.space.level}.`)
      }
      else {
        replyText(conn, m, `[ ⚠️ ] Command salah. Ketik ${usedPrefix}space untuk menu.`)
      }
      break
    }

    case 'sectors':
    case 'sektor': {
      const rows = Object.entries(SECTORS).map(([id, s]) => `[ ${id} ] ${s.name}\n    ↳ Req. Level: ${s.reqLv} | Warp Cost: 🔋 ${s.fuel} Fuel\n    ↳ Danger: ${s.enemy}`)
      await showList(conn, m, 'GALAXY MAP (SECTORS)', rows, `Warp: ${usedPrefix}warp <id>`)
      break
    }

    case 'warp':
    case 'jump': {
      if (!u.space.hasShip) return replyText(conn, m, '[ ⚠️ ] Kamu butuh pesawat untuk melakukan Warp Jump.')
      const targetId = (args[0] || '').toLowerCase()
      const target = SECTORS[targetId]
      
      if (!target) return replyText(conn, m, `[ ⚠️ ] Koordinat sektor tidak terdeteksi. Cek radar di .sectors`)
      if (u.space.level < target.reqLv) return replyText(conn, m, `[ ⚠️ ] Level pesawatmu (${u.space.level}) belum memenuhi syarat untuk masuk ke sektor ini (Butuh Lv.${target.reqLv}). Mesin akan meledak!`)
      if (u.space.sector === targetId) return replyText(conn, m, `[ ⚠️ ] Kamu sudah berada di ${target.name}.`)
      if (u.space.fuel < target.fuel) return replyText(conn, m, `[ ⚠️ ] Bensin Hyperdrive tidak cukup! Butuh ${target.fuel} Fuel. (Ketik .space refuel)`)

      u.space.fuel -= target.fuel
      u.space.sector = targetId
      
      saveDb(db)
      await replyText(conn, m, `🌌 *HYPERDRIVE ENGAGED* 🌌\nPesawat berakselerasi melebihi kecepatan cahaya...\n\nKamu telah tiba di koordinat: *${target.name}*`)
      break
    }

    case 'extract':
    case 'nambang_space': {
      if (!u.space.hasShip) return replyText(conn, m, '[ ⚠️ ] Butuh pesawat.')
      if (!canUseCooldown(u, 'extract')) return replyText(conn, m, `[ ⚠️ ] Laser penambang sedang *cooling down*. Tunggu: ${msToClock(cdLeft(u, 'extract'))}`)
      if (u.energy < 15) return replyText(conn, m, '[ ⚠️ ] Energy manajer di bumi kurang (Butuh 15).')
      
      u.energy -= 15
      const currentSector = SECTORS[u.space.sector]
      
      const dustGain = rand(currentSector.loot.dust[0], currentSector.loot.dust[1]) + (u.luck * 5)
      u.space.stardust += dustGain
      
      let bonusTxt = ''
      if (currentSector.loot.item && Math.random() < 0.25) { // 25% chance dapet rare loot sektor tsb
         u.items = u.items || {}
         u.items[currentSector.loot.item] = (u.items[currentSector.loot.item] || 0) + 1
         bonusTxt = `\n🎁 Scanner mendeteksi anomali! Mendapatkan 1x ${currentSector.loot.item.toUpperCase()}`
      }

      cooldown(u, 'extract', 15 * 60 * 1000) // 15 menit
      saveDb(db)
      
      await replyText(conn, m, `☄️ *ASTEROID EXTRACTION*\nLaser penambang memecah asteroid di ${currentSector.name}!\n\n✨ Mendapatkan +${formatNum(dustGain)} Stardust${bonusTxt}`)
      break
    }

    case 'spacebattle':
    case 'perangbintang': {
      if (!u.space.hasShip) return replyText(conn, m, '[ ⚠️ ] Butuh pesawat.')
      if (!canUseCooldown(u, 'spacebattle')) return replyText(conn, m, `[ ⚠️ ] Radar masih mendeteksi sisa radiasi tempur. Tunggu: ${msToClock(cdLeft(u, 'spacebattle'))}`)
      if (u.space.hull <= u.space.maxHull * 0.2) return replyText(conn, m, '[ ⚠️ ] Hull pesawat kritis! Lakukan .space repair dulu agar tidak hancur di luar angkasa.')
      
      const currentSector = SECTORS[u.space.sector]
      const enemy = currentSector.enemyStats
      const eName = currentSector.enemy
      
      // Simulasi Space Battle (Ship vs Ship)
      let sHp = u.space.hull
      let eHp = enemy.hp + rand(0, enemy.hp * 0.2)
      let turn = 0
      
      while (sHp > 0 && eHp > 0 && turn < 100) {
         // Attack dikurangi shield musuh
         eHp -= Math.max(1, u.space.atk - Math.floor(enemy.def / 2) + rand(0, 50))
         if (eHp <= 0) break
         
         // Serangan musuh ditahan oleh shield pesawat
         sHp -= Math.max(1, enemy.atk - Math.floor(u.space.shield / 2) + rand(0, 50))
         turn++
      }

      u.space.hull = Math.max(0, sHp)

      if (sHp > 0) {
         // MENANG
         const dustReward = rand(currentSector.loot.dust[0] * 2, currentSector.loot.dust[1] * 3) // Reward perang lebih gede dari extract
         const goldReward = u.space.level * 25000
         
         u.space.stardust += dustReward
         u.gold += goldReward
         u.space.kills += 1
         
         cooldown(u, 'spacebattle', 30 * 60 * 1000) // 30 Menit CD kalau menang
         saveDb(db)
         
         await replyText(conn, m, `💥 *TARGET DESTROYED!* 💥\nPesawatmu berhasil meledakkan armada [ ${eName} ] menjadi debu kosmik!\n\n✨ Reward: +${formatNum(dustReward)} Stardust\n💰 Bounty: +${formatNum(goldReward)} Gold\n🛡️ Sisa Hull: ${formatNum(u.space.hull)}`)
      } else {
         // KALAH
         const penalty = Math.floor(u.gold * 0.05)
         u.gold = Math.max(0, u.gold - penalty)
         
         cooldown(u, 'spacebattle', 10 * 60 * 1000) // 10 Menit CD kalau kalah
         saveDb(db)
         
         await replyText(conn, m, `🆘 *MAYDAY! MAYDAY!* 🆘\nKapalmu ditembak jatuh oleh [ ${eName} ]!\nSistem teleport darurat menarikmu ke markas terdekat.\n\nBiaya perbaikan & denda: -${formatNum(penalty)} Gold\nHull Pesawat: 0 (Lakukan Repair!)`)
      }
      break
    }

    case 'relicshop': {
      const action = (args[0] || '').toLowerCase()
      
      const RELICS = {
        '1': { name: 'Cosmic Core (Kecil)', price: 1000, buff: { atk: 50, hp: 500 } },
        '2': { name: 'Dark Matter Plating', price: 5000, buff: { def: 150, maxHp: 2000 } },
        '3': { name: 'Starlight Pendant', price: 15000, buff: { luck: 15, atk: 250 } },
        '4': { name: 'Omniversal Matrix', price: 50000, buff: { atk: 1000, def: 1000, luck: 50, maxHp: 10000 } }
      }

      if (!action || action === 'list') {
        const rows = Object.entries(RELICS).map(([id, r]) => `[ ${id} ] ${r.name}\n    ↳ Harga: ✨ ${formatNum(r.price)} Stardust\n    ↳ Permanen Buff Karakter Utama!`)
        return showList(conn, m, 'ALIEN BLACK MARKET (RELICS)', rows, `Beli: ${usedPrefix}relicshop buy <nomor>`)
      }

      if (action === 'buy') {
        const itemNum = args[1]
        const relic = RELICS[itemNum]
        
        if (!relic) return replyText(conn, m, '[ ⚠️ ] Relik tidak ditemukan.')
        if (u.space.stardust < relic.price) return replyText(conn, m, `[ ⚠️ ] Stardust tidak cukup! Butuh ✨ ${formatNum(relic.price)} Stardust.`)
        
        u.space.stardust -= relic.price
        
        // Suntik stat permanen ke karakter manusia di bumi
        if (relic.buff.atk) u.atk += relic.buff.atk
        if (relic.buff.def) u.def += relic.buff.def
        if (relic.buff.luck) u.luck += relic.buff.luck
        if (relic.buff.hp) u.hp += relic.buff.hp // heal sekalian
        if (relic.buff.maxHp) { u.maxHp += relic.buff.maxHp; u.hp = u.maxHp; }
        
        saveDb(db)
        await replyText(conn, m, `🔮 *RELIC ASSIMILATED*\nKamu membeli [ ${relic.name} ] dari pedagang alien.\nKekuatan kosmik mengalir ke tubuh manusiamu di bumi!\n\nStat dasar RPG utamamu meningkat drastis!`)
      }
      break
    }

    default:
      break
  }
}

handler.help = ['space', 'warp', 'sectors', 'extract', 'spacebattle']
handler.tags = ['rpg']
handler.command = /^(space|ship|warp|jump|sectors|sektor|extract|nambang_space|spacebattle|perangbintang|relicshop)$/i
handler.limit = false
handler.register = false

export default handler
