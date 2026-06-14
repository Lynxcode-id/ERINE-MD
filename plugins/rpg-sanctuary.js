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

// Injeksi data Sanctuary ke profil player
function ensureSanctuaryData(db, jid) {
  if (!db.users[jid]) return false
  const u = db.users[jid]
  
  u.sanctuary = u.sanctuary || {
    level: 1,
    empSpheres: 0,
    glitchmons: [], // Monster yang dimiliki
    workers: [], // Monster yang dideploy di base
    lastHarvest: 0,
    wildEncounter: null // Simpan data monster yang lagi di-encounter
  }
  
  return u
}

async function showList(conn, m, title, rows, footer = '') {
  const txt = [
    `╔═══『 🏕️ ${title} 』═══`,
    ...rows.map(r => `╠ ⎔ ${r}`),
    `╚══════════════════════`,
    footer ? `[🐾] ${footer}` : ''
  ].filter(Boolean).join('\n')
  await conn.sendMessage(m.chat, { text: txt }, { quoted: m })
}

function replyText(conn, m, text) {
  return conn.sendMessage(m.chat, { text }, { quoted: m })
}

// Database Glitchmon (Pekerja Pasif)
const GLITCHMON_DEX = [
  { id: 'g1', name: 'Cyber-Slime', rarity: 'Common', skill: 'forage', output: ['herb', 'mushroom'], catchRate: 70 },
  { id: 'g2', name: 'Scrap-Rat', rarity: 'Common', skill: 'dig', output: ['stone', 'sand'], catchRate: 65 },
  { id: 'g3', name: 'Neon-Wolf', rarity: 'Rare', skill: 'hunt', output: ['hide', 'bone'], catchRate: 40 },
  { id: 'g4', name: 'Mecha-Bear', rarity: 'Rare', skill: 'chop', output: ['wood', 'amber'], catchRate: 35 },
  { id: 'g5', name: 'Plasma-Golem', rarity: 'Epic', skill: 'mine', output: ['ore', 'crystal'], catchRate: 15 },
  { id: 'g6', name: 'Holo-Dragon', rarity: 'Mythic', skill: 'all', output: ['gem', 'obsidian', 'pearl'], catchRate: 3 }
]

function generateEncounter() {
  const roll = rand(1, 1000)
  if (roll <= 10) return GLITCHMON_DEX.find(g => g.rarity === 'Mythic')
  if (roll <= 100) return pick(GLITCHMON_DEX.filter(g => g.rarity === 'Epic'))
  if (roll <= 400) return pick(GLITCHMON_DEX.filter(g => g.rarity === 'Rare'))
  return pick(GLITCHMON_DEX.filter(g => g.rarity === 'Common'))
}

const handler = async (m, { conn, usedPrefix, command, text }) => {
  const db = loadDb()
  if (!db) return replyText(conn, m, '[ ⚠️ ] Database offline. Pancing dengan command .profile di RPG utama.')
  
  const u = ensureSanctuaryData(db, m.sender)
  if (!u) return replyText(conn, m, '[ ⚠️ ] Profil tidak ditemukan. Ketik .profile dulu di RPG utama.')

  const args = String(text || '').trim().split(/\s+/).filter(Boolean)
  const sub = String(command || '').toLowerCase()

  const menu = [
    `*▣ NEON SANCTUARY ▣*`,
    `Tangkap Glitchmon dan pekerjakan mereka di peternakanmu!`,
    ``,
    `*Perburuan:*`,
    `${usedPrefix}glitchmon hunt`,
    `${usedPrefix}glitchmon catch`,
    `${usedPrefix}glitchmon buy_emp <jumlah>`,
    ``,
    `*Manajemen Base:*`,
    `${usedPrefix}sanctuary info`,
    `${usedPrefix}sanctuary upgrade`,
    `${usedPrefix}sanctuary deploy <id>`,
    `${usedPrefix}sanctuary recall <id>`,
    `${usedPrefix}sanctuary harvest`
  ]

  switch (sub) {
    case 'glitchmon':
    case 'gmon': {
      const action = (args[0] || '').toLowerCase()

      if (!action || action === 'help') {
        await showList(conn, m, 'GLITCHMON DEX', menu, 'Gotta Catch Em All!')
        break
      }

      if (action === 'buy_emp') {
        const qty = Math.floor(Number(args[1])) || 1
        if (qty <= 0) return replyText(conn, m, `[ ⚠️ ] Format: ${usedPrefix}glitchmon buy_emp <jumlah>`)
        
        const cost = qty * 5000 // 5000 Gold per EMP Sphere
        if (u.gold < cost) return replyText(conn, m, `[ ⚠️ ] Saldo kurang! Butuh 💰 ${formatNum(cost)} Gold untuk membeli ${qty} EMP Sphere.`)
        
        u.gold -= cost
        u.sanctuary.empSpheres += qty
        
        saveDb(db)
        await replyText(conn, m, `🎾 *TRANSAKSI SUKSES*\nKamu membeli ${qty}x EMP Sphere.\nTotal EMP Sphere sekarang: ${u.sanctuary.empSpheres}`)
      }

      else if (action === 'hunt') {
        if (u.energy < 15) return replyText(conn, m, '[ ⚠️ ] Stamina penjelajahmu habis. Butuh 15 Energy untuk mencari jejak di Cyber-Wilderness.')
        if (u.sanctuary.empSpheres < 1) return replyText(conn, m, '[ ⚠️ ] Kamu tidak bawa EMP Sphere! Beli dulu pakai .glitchmon buy_emp')
        
        u.energy -= 15
        const encounter = generateEncounter()
        
        // Simpan data target ke profil sementara
        u.sanctuary.wildEncounter = {
           id: encounter.id,
           name: encounter.name,
           rarity: encounter.rarity,
           catchRate: encounter.catchRate,
           time: now()
        }
        
        saveDb(db)
        await replyText(conn, m, `🌲 *WILD ENCOUNTER!* 🌲\nSemak-semak digital bergetar...\n\nSeekor liar *[ ${encounter.name} ]* (${encounter.rarity}) muncul di hadapanmu!\n\nKetik *${usedPrefix}glitchmon catch* sekarang untuk melempar EMP Sphere!`)
      }

      else if (action === 'catch') {
        const target = u.sanctuary.wildEncounter
        if (!target) return replyText(conn, m, '[ ⚠️ ] Tidak ada Glitchmon di dekatmu. Lakukan .glitchmon hunt terlebih dahulu.')
        
        // Timeout 5 Menit kalau ga ditangkep
        if (now() - target.time > 5 * 60 * 1000) {
           u.sanctuary.wildEncounter = null
           saveDb(db)
           return replyText(conn, m, '[ ⚠️ ] Terlalu lama! Glitchmon incaranmu sudah lari ke dalam sistem.')
        }

        if (u.sanctuary.empSpheres < 1) return replyText(conn, m, '[ ⚠️ ] EMP Sphere kamu habis! Monster itu menertawakanmu.')
        
        u.sanctuary.empSpheres -= 1
        
        // Rumus Catching
        const finalCatchRate = target.catchRate + (u.luck * 0.5)
        const roll = rand(1, 100)
        
        if (roll <= finalCatchRate) {
           // BERHASIL TANGKAP
           const newPet = {
              uid: `gmon_${now().toString().slice(-4)}`, // Unique ID per monster
              name: target.name,
              dexId: target.id
           }
           u.sanctuary.glitchmons.push(newPet)
           u.sanctuary.wildEncounter = null // Reset encounter
           
           saveDb(db)
           await replyText(conn, m, `🎾 *GOTCHA!* 🎾\nKamu berhasil menangkap *[ ${target.name} ]*!\nGlitchmon ini telah ditransfer ke inventory Sanctuary-mu.\n(Gunakan .sanctuary info untuk melihatnya)`)
        } else {
           // GAGAL
           saveDb(db)
           await replyText(conn, m, `💥 *BZZT!* 💥\nEMP Sphere meledak namun *[ ${target.name} ]* berhasil meronta keluar!\nSisa EMP Sphere: ${u.sanctuary.empSpheres}\nLempar lagi ketik .glitchmon catch`)
        }
      }
      else {
        replyText(conn, m, `[ ⚠️ ] Format salah. Cek menu: ${usedPrefix}glitchmon`)
      }
      break
    }

    case 'sanctuary':
    case 'base': {
      const action = (args[0] || '').toLowerCase()

      if (!action || action === 'help') {
        await showList(conn, m, 'NEON SANCTUARY', menu, 'Rumah bagi monster digital')
        break
      }

      if (action === 'info') {
        const workerLimit = u.sanctuary.level * 2 // Lv 1 = 2 worker, Lv 5 = 10 worker
        const workers = u.sanctuary.workers.map(w => w.name).join(', ') || 'Belum ada yang kerja (Mager semua)'
        
        await showList(conn, m, `SANCTUARY: @${m.sender.split('@')[0]}`, [
          `🏕️ Base Level: ${u.sanctuary.level}`,
          `🎾 EMP Spheres: ${formatNum(u.sanctuary.empSpheres)}`,
          `🐾 Total Koleksi: ${u.sanctuary.glitchmons.length} Glitchmon`,
          ``,
          `*=== WORK STATION ===*`,
          `👷 Pekerja Aktif: ${u.sanctuary.workers.length} / ${workerLimit}`,
          `🛠️ Daftar Pekerja: ${workers}`,
          ``,
          `*Koleksimu di Gudang:*`,
          u.sanctuary.glitchmons.map(g => `↳ [ ${g.uid} ] ${g.name}`).join('\n') || 'Kosong.'
        ])
      }

      else if (action === 'upgrade') {
        const currentLvl = u.sanctuary.level
        if (currentLvl >= 10) return replyText(conn, m, '[ ⚠️ ] Sanctuary-mu sudah mencapai perluasan maksimal (Level 10).')
        
        const costGold = currentLvl * 200000
        const costWood = currentLvl * 50
        const costStone = currentLvl * 50
        
        if (u.gold < costGold || (u.items['wood'] || 0) < costWood || (u.items['stone'] || 0) < costStone) {
           return replyText(conn, m, `[ ⚠️ ] Material ekspansi base kurang!\nButuh: 💰 ${formatNum(costGold)} Gold, 🪵 ${costWood} Wood, 🪨 ${costStone} Stone.`)
        }
        
        u.gold -= costGold
        u.items['wood'] -= costWood
        u.items['stone'] -= costStone
        
        u.sanctuary.level += 1
        
        saveDb(db)
        await replyText(conn, m, `🏕️ *BASE UPGRADED*\nSanctuary diperluas ke Level ${u.sanctuary.level}!\nKapasitas pekerja Glitchmon bertambah menjadi ${u.sanctuary.level * 2} Slot.`)
      }

      else if (action === 'deploy' || action === 'pekerjakan') {
        const uid = (args[1] || '').toLowerCase()
        if (!uid) return replyText(conn, m, `[ ⚠️ ] Format: ${usedPrefix}sanctuary deploy <uid_monster>\nCek UID di .sanctuary info`)
        
        const maxWorkers = u.sanctuary.level * 2
        if (u.sanctuary.workers.length >= maxWorkers) return replyText(conn, m, `[ ⚠️ ] Kapasitas Base penuh! Upgrade Sanctuary untuk menampung lebih banyak pekerja.`)
        
        // Cari di gudang
        const gmonIndex = u.sanctuary.glitchmons.findIndex(g => g.uid === uid)
        if (gmonIndex === -1) return replyText(conn, m, `[ ⚠️ ] Glitchmon tidak ditemukan di gudang.`)
        
        const petToDeploy = u.sanctuary.glitchmons.splice(gmonIndex, 1)[0]
        u.sanctuary.workers.push(petToDeploy)
        
        // Reset timer kalau baru deploy pekerja pertama
        if (u.sanctuary.workers.length === 1) u.sanctuary.lastHarvest = now()
        
        saveDb(db)
        await replyText(conn, m, `👷 *DEPLOYED!*\n[ ${petToDeploy.name} ] ditugaskan untuk bekerja di Sanctuary.\nIa akan mulai menghasilkan material secara pasif!`)
      }

      else if (action === 'recall' || action === 'tarik') {
        const uid = (args[1] || '').toLowerCase()
        if (!uid) return replyText(conn, m, `[ ⚠️ ] Format: ${usedPrefix}sanctuary recall <uid_monster>`)
        
        const workerIndex = u.sanctuary.workers.findIndex(w => w.uid === uid)
        if (workerIndex === -1) return replyText(conn, m, `[ ⚠️ ] Glitchmon tersebut tidak sedang bekerja di base.`)
        
        const petToRecall = u.sanctuary.workers.splice(workerIndex, 1)[0]
        u.sanctuary.glitchmons.push(petToRecall)
        
        saveDb(db)
        await replyText(conn, m, `💤 *RECALLED!*\n[ ${petToRecall.name} ] ditarik kembali ke gudang untuk beristirahat.`)
      }

      else if (action === 'harvest' || action === 'panen') {
        if (u.sanctuary.workers.length === 0) return replyText(conn, m, '[ ⚠️ ] Tidak ada Glitchmon yang di-deploy. Base tidak menghasilkan apa-apa.')
        
        const last = u.sanctuary.lastHarvest || now()
        const diffHrs = (now() - last) / (1000 * 60 * 60)
        
        if (diffHrs < 1) return replyText(conn, m, `[ ⚠️ ] Para pekerja masih mengumpulkan resource. Tunggu minimal 1 jam. (Sisa ${Math.floor(60 - (diffHrs * 60))} menit)`)
        
        const capHrs = Math.min(diffHrs, 24) // Maksimal ditimbun 24 jam
        
        let lootList = {}
        let expBonus = 0
        
        // Hitung loot dari tiap pekerja
        for (const worker of u.sanctuary.workers) {
            const dexData = GLITCHMON_DEX.find(d => d.id === worker.dexId)
            if (dexData) {
               // Rarity nentuin jumlah loot
               let multiplier = 1
               if (dexData.rarity === 'Rare') multiplier = 2
               if (dexData.rarity === 'Epic') multiplier = 5
               if (dexData.rarity === 'Mythic') multiplier = 15
               
               for (const item of dexData.output) {
                  const qty = Math.floor(rand(1, 3) * multiplier * capHrs)
                  lootList[item] = (lootList[item] || 0) + qty
               }
               expBonus += (100 * multiplier * capHrs)
            }
        }
        
        // Transfer ke inventory player
        u.items = u.items || {}
        for (const [id, qty] of Object.entries(lootList)) {
           u.items[id] = (u.items[id] || 0) + qty
        }
        u.exp += Math.floor(expBonus)
        
        u.sanctuary.lastHarvest = now()
        saveDb(db)
        
        const harvestTxt = Object.entries(lootList).map(([k, v]) => `📦 ${k} x${formatNum(v)}`).join('\n')
        
        await replyText(conn, m, `🧺 *SANCTUARY HARVEST* 🧺\nGlitchmon-mu bekerja keras dan mengumpulkan hasil bumi dari Cyber-Wilderness:\n\n${harvestTxt}\n💠 +${formatNum(expBonus)} EXP Manajer`)
      }
      else {
        replyText(conn, m, `[ ⚠️ ] Format salah. Cek menu: ${usedPrefix}sanctuary`)
      }
      break
    }

    default:
      break
  }
}

handler.help = ['glitchmon', 'sanctuary']
handler.tags = ['rpg']
handler.command = /^(glitchmon|gmon|sanctuary|base)$/i
handler.limit = false
handler.register = false

export default handler
