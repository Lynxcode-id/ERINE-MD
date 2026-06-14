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

// Injeksi data Cultivation ke profil player
function ensureCultivationData(db, jid) {
  if (!db.users[jid]) return false
  const u = db.users[jid]
  
  u.cultivation = u.cultivation || {
    realmId: 0, // Index realm saat ini
    qi: 0,      // Energi kultivasi
    isMeditating: false,
    lastMeditateStart: 0,
    pillToxicity: 0 // Maksimal 100%, kalau kepenuhan ga bisa minum pill
  }
  
  return u
}

async function showList(conn, m, title, rows, footer = '') {
  const txt = [
    `╔═══『 ☯️ ${title} 』═══`,
    ...rows.map(r => `╠ ⎔ ${r}`),
    `╚══════════════════════`,
    footer ? `[🧘] ${footer}` : ''
  ].filter(Boolean).join('\n')
  await conn.sendMessage(m.chat, { text: txt }, { quoted: m })
}

function replyText(conn, m, text) {
  return conn.sendMessage(m.chat, { text }, { quoted: m })
}

// Daftar Alam Kultivasi (Realms)
const REALMS = [
  { id: 0, name: 'Mortal Flesh', qiReq: 1000, buff: { atk: 0, def: 0, hp: 0 }, tribulation: 0 },
  { id: 1, name: 'Data Condensation', qiReq: 5000, buff: { atk: 100, def: 100, hp: 1000 }, tribulation: 0 },
  { id: 2, name: 'Matrix Foundation', qiReq: 25000, buff: { atk: 300, def: 300, hp: 3000 }, tribulation: 5000 },
  { id: 3, name: 'Quantum Core', qiReq: 100000, buff: { atk: 1000, def: 1000, hp: 10000 }, tribulation: 25000 },
  { id: 4, name: 'Neon Soul', qiReq: 500000, buff: { atk: 3500, def: 3500, hp: 35000 }, tribulation: 100000 },
  { id: 5, name: 'Cyber-Immortal', qiReq: 2500000, buff: { atk: 12000, def: 12000, hp: 120000 }, tribulation: 500000 },
  { id: 6, name: 'System Administrator', qiReq: 10000000, buff: { atk: 50000, def: 50000, hp: 500000 }, tribulation: 2500000 }
]

// Resep Nano-Pills
const ALCHEMY_RECIPES = {
  'qi_pill': { name: 'Basic Qi Pill', req: { herb: 5, mushroom: 2 }, effect: 'qi', val: 500, tox: 10 },
  'spirit_pill': { name: 'Matrix Spirit Pill', req: { herb: 15, crystal: 1, pearl: 1 }, effect: 'qi', val: 3000, tox: 15 },
  'tribulation_pill': { name: 'Lightning-Rod Elixir', req: { obsidian: 3, voidcore: 1, amber: 2 }, effect: 'shield', val: 50000, tox: 30 },
  'cleansing_pill': { name: 'Data Cleansing Pill', req: { herb: 20, venom: 1, relic: 1 }, effect: 'detox', val: 50, tox: 0 }
}

const handler = async (m, { conn, usedPrefix, command, text }) => {
  const db = loadDb()
  if (!db) return replyText(conn, m, '[ ⚠️ ] Database offline. Pancing dengan command .profile di RPG utama.')
  
  const u = ensureCultivationData(db, m.sender)
  if (!u) return replyText(conn, m, '[ ⚠️ ] Profil tidak ditemukan. Ketik .profile dulu di RPG utama.')

  // Proses penurunan Toxicity (Tiap jam turun 5%)
  if (u.cultivation.pillToxicity > 0) {
     u.cultivation.pillToxicity = Math.max(0, u.cultivation.pillToxicity - 5) // Passive detox
  }

  const args = String(text || '').trim().split(/\s+/).filter(Boolean)
  const sub = String(command || '').toLowerCase()

  const menu = [
    `*▣ HEAVENLY MATRIX (CULTIVATION) ▣*`,
    `Tembus batas kemanusiaan dan jadilah Dewa Sistem!`,
    ``,
    `${usedPrefix}cultivate info`,
    `${usedPrefix}meditate <start/stop>`,
    `${usedPrefix}breakthrough`,
    ``,
    `*▣ CYBER-ALCHEMY ▣*`,
    `${usedPrefix}alchemy list`,
    `${usedPrefix}alchemy craft <id>`,
    `${usedPrefix}swallow <id>`
  ]

  switch (sub) {
    case 'cultivate':
    case 'cultivation':
    case 'dao': {
      const action = (args[0] || '').toLowerCase()

      if (!action || action === 'help') {
        await showList(conn, m, 'TECHNO-DAOISM SECT', menu, 'Menentang kehendak Sistem')
        break
      }

      if (action === 'info') {
        const realm = REALMS[u.cultivation.realmId]
        const nextRealm = REALMS[u.cultivation.realmId + 1]
        
        let qiProgress = 'MAX (Siap Breakthrough!)'
        if (nextRealm && u.cultivation.qi < nextRealm.qiReq) {
           qiProgress = `${formatNum(u.cultivation.qi)} / ${formatNum(nextRealm.qiReq)}`
        } else if (!nextRealm) {
           qiProgress = `${formatNum(u.cultivation.qi)} (Puncak Kultivasi)`
        }

        const medStatus = u.cultivation.isMeditating 
          ? `🧘 Sedang Bermeditasi (Berjalan: ${msToClock(now() - u.cultivation.lastMeditateStart)})`
          : `🚶 Tidak aktif.`

        await showList(conn, m, `CULTIVATOR: @${m.sender.split('@')[0]}`, [
          `☯️ Realm: [ ${realm.name} ]`,
          `🌀 Cyber-Qi: ${qiProgress}`,
          `☢️ Pill Toxicity: ${u.cultivation.pillToxicity}% / 100%`,
          ``,
          `*=== PERTAPAAN ===*`,
          medStatus,
          ``,
          `*=== REALM BUFF (PERMANENT) ===*`,
          `⚔️ ATK +${formatNum(realm.buff.atk)} | 🛡️ DEF +${formatNum(realm.buff.def)} | ❤️ HP +${formatNum(realm.buff.hp)}`
        ])
      }
      break
    }

    case 'meditate':
    case 'meditasi': {
      const action = (args[0] || '').toLowerCase()

      if (action === 'start') {
        if (u.cultivation.isMeditating) return replyText(conn, m, '[ ⚠️ ] Kamu sudah dalam posisi teratai (meditasi). Ketik .meditate stop untuk bangun.')
        
        u.cultivation.isMeditating = true
        u.cultivation.lastMeditateStart = now()
        
        saveDb(db)
        await replyText(conn, m, `🧘 *ENTERING THE MATRIX* 🧘\nKamu menutup mata, menghubungkan kesadaranmu ke dalam jaringan, dan mulai menyerap Cyber-Qi dari alam semesta.\n\n(Jangan lupa ketik ${usedPrefix}meditate stop untuk memanen Qi)`)
      } 
      
      else if (action === 'stop') {
        if (!u.cultivation.isMeditating) return replyText(conn, m, '[ ⚠️ ] Kamu sedang tidak bermeditasi.')
        
        const timeSpent = now() - u.cultivation.lastMeditateStart
        const hrs = timeSpent / (1000 * 60 * 60)
        
        if (hrs < 0.1) {
           u.cultivation.isMeditating = false
           saveDb(db)
           return replyText(conn, m, '[ ⚠️ ] Meditasi terlalu sebentar (Kurang dari 6 menit). Konsentrasimu buyar dan tidak mendapat Qi sama sekali.')
        }

        const capHrs = Math.min(hrs, 24) // Maksimal afk 24 jam
        const qiRate = 500 + (u.cultivation.realmId * 500) // Makin tinggi realm, makin kenceng nyedot Qi
        const qiGained = Math.floor(capHrs * qiRate)
        
        u.cultivation.qi += qiGained
        u.cultivation.isMeditating = false
        
        saveDb(db)
        await replyText(conn, m, `✨ *AWAKENING FROM MATRIX* ✨\nKamu membuka mata dan memuntahkan udara kotor.\n\nWaktu Meditasi: ${msToClock(timeSpent)}\n🌀 Memanen +${formatNum(qiGained)} Cyber-Qi!`)
      }
      else {
        replyText(conn, m, `[ ⚠️ ] Format: ${usedPrefix}meditate start atau ${usedPrefix}meditate stop`)
      }
      break
    }

    case 'breakthrough':
    case 'terobos': {
      if (u.cultivation.isMeditating) return replyText(conn, m, '[ ⚠️ ] Kamu masih bermeditasi. Bangun dulu (.meditate stop).')
      
      const currentRealm = u.cultivation.realmId
      const nextRealm = REALMS[currentRealm + 1]
      
      if (!nextRealm) return replyText(conn, m, '[ ⚠️ ] Kamu telah mencapai puncak kehidupan (System Administrator). Tidak ada lagi langit di atasmu.')
      if (u.cultivation.qi < nextRealm.qiReq) return replyText(conn, m, `[ ⚠️ ] Cyber-Qi belum cukup padat! Butuh total ${formatNum(nextRealm.qiReq)} Qi. (Qi-mu saat ini: ${formatNum(u.cultivation.qi)})`)
      
      if (u.hp <= u.maxHp * 0.5) return replyText(conn, m, '[ ⚠️ ] Kondisi tubuhmu terlalu lemah (HP di bawah 50%). Terobosan saat ini hanya akan membawa kematian. Heal dulu!')

      const tribDamage = nextRealm.tribulation
      let txt = `⚡ *HEAVENLY TRIBULATION INITIATED!* ⚡\n\nLangit digital menjadi merah darah. Awan kode biner berkumpul di atas kepalamu!\nSistem mencoba menghapus eksistensimu dari Matrix!\n`
      
      if (tribDamage > 0) {
         txt += `\n💥 *JLEEEGGG!!!* Petir Firewall menyambar menembus pertahananmu!\n(True Damage: ${formatNum(tribDamage)})\n`
         
         // Cek item pill shield (Tribulation Pill effect)
         let shield = 0
         if (u.foodBuffs && u.foodBuffs.tribShield) {
             shield = u.foodBuffs.tribShield
             txt += `🛡️ *Lightning-Rod Elixir Aktif!* Menahan ${formatNum(shield)} damage petir!\n`
             u.foodBuffs.tribShield = 0 // Habis terpakai
         }
         
         const finalDmg = Math.max(0, tribDamage - shield - Math.floor(u.def))
         u.hp -= finalDmg
         
         if (u.hp <= 0) {
            // GAGAL BREAKTHROUGH
            u.hp = 1
            const qiLoss = Math.floor(u.cultivation.qi * 0.2) // Penalti Qi hangus 20%
            u.cultivation.qi -= qiLoss
            
            saveDb(db)
            return replyText(conn, m, `${txt}\n💀 *BREAKTHROUGH FAILED!* 💀\nTubuhmu hangus terbakar. Kamu muntah darah dan kultivasimu mundur.\n(Kehilangan ${formatNum(qiLoss)} Qi & Tersisa 1 HP)`)
         }
         txt += `\n❤️ Kamu bertahan! Menerima ${formatNum(finalDmg)} Damage.`
      }

      // BERHASIL NAIK REALM
      u.cultivation.realmId += 1
      const newRealm = REALMS[u.cultivation.realmId]
      
      // Inject Buff (Cabut buff lama, masukin buff baru)
      u.atk = u.atk - REALMS[currentRealm].buff.atk + newRealm.buff.atk
      u.def = u.def - REALMS[currentRealm].buff.def + newRealm.buff.def
      u.maxHp = u.maxHp - REALMS[currentRealm].buff.hp + newRealm.buff.hp
      u.hp = u.maxHp // Heal full
      
      saveDb(db)
      await replyText(conn, m, `${txt}\n\n🌌 *ASCENSION SUCCESSFUL!* 🌌\nAwan menghilang. Cahaya suci menyinari tubuh barumu.\n\nKamu melangkah ke alam [ ${newRealm.name} ]!\nStatus Base RPG-mu meningkat gila-gilaan secara permanen!`)
      break
    }

    case 'alchemy':
    case 'alkimia': {
      const action = (args[0] || '').toLowerCase()
      
      if (!action || action === 'list') {
        const rows = Object.entries(ALCHEMY_RECIPES).map(([id, r]) => {
           const reqTxt = Object.entries(r.req).map(([k, v]) => `${k} x${v}`).join(', ')
           return `[ ${id} ] ⚗️ ${r.name}\n    ↳ Resep: ${reqTxt}\n    ↳ Efek: ${r.effect.toUpperCase()} (+${r.val}) | Toxicity: ${r.tox}%`
        })
        return showList(conn, m, 'CAULDRON OF CREATION', rows, `Peleburan: ${usedPrefix}alchemy craft <id>`)
      }

      if (action === 'craft' || action === 'buat') {
        const recipeId = (args[1] || '').toLowerCase()
        const recipe = ALCHEMY_RECIPES[recipeId]
        
        if (!recipe) return replyText(conn, m, '[ ⚠️ ] Resep pil tidak ditemukan. Cek .alchemy list')
        
        u.items = u.items || {}
        
        // Cek Bahan
        for (const [item, qty] of Object.entries(recipe.req)) {
           if ((u.items[item] || 0) < qty) {
              return replyText(conn, m, `[ ⚠️ ] Material alkimia kurang! Kamu tidak memiliki cukup ${item} (Butuh ${qty}).`)
           }
        }
        
        // Potong Bahan
        for (const [item, qty] of Object.entries(recipe.req)) {
           u.items[item] -= qty
        }
        
        // Kasih item pil
        const pillKey = `pill_${recipeId}`
        u.items[pillKey] = (u.items[pillKey] || 0) + 1
        
        saveDb(db)
        await replyText(conn, m, `🔥 *ALCHEMY SUCCESS* 🔥\nApi penyucian membakar kuali...\nKamu berhasil meramu 1x [ ${recipe.name} ]!\n\n(Tersimpan di inventory. Ketik .swallow ${pillKey} untuk menelannya)`)
      }
      break
    }

    case 'swallow':
    case 'telan': {
      const pillKey = (args[0] || '').toLowerCase()
      if (!pillKey.startsWith('pill_')) return replyText(conn, m, `[ ⚠️ ] Format: ${usedPrefix}swallow pill_<id>\nContoh: .swallow pill_qi_pill`)
      
      u.items = u.items || {}
      if ((u.items[pillKey] || 0) < 1) return replyText(conn, m, '[ ⚠️ ] Kamu tidak memiliki pil ini di inventory.')
      
      const recipeId = pillKey.split('_')[1]
      const recipe = ALCHEMY_RECIPES[recipeId]
      
      if (!recipe) return replyText(conn, m, '[ ⚠️ ] Pil telah membusuk atau tidak valid.')
      
      if (u.cultivation.pillToxicity + recipe.tox > 100) {
         return replyText(conn, m, `[ ⚠️ ] Tubuhmu tidak kuat menahan lebih banyak racun pil! (Toxicity saat ini: ${u.cultivation.pillToxicity}%)\nMeminum ini akan meledakkan meridianmu. Lakukan detox atau tunggu beberapa jam.`)
      }
      
      // Consume
      u.items[pillKey] -= 1
      u.cultivation.pillToxicity += recipe.tox
      
      // Apply Effect
      let txt = `💊 Kamu menelan [ ${recipe.name} ].\nEnergi meledak di perutmu!\n`
      
      if (recipe.effect === 'qi') {
         u.cultivation.qi += recipe.val
         txt += `🌀 Mendapatkan +${formatNum(recipe.val)} Cyber-Qi!`
      } 
      else if (recipe.effect === 'shield') {
         u.foodBuffs = u.foodBuffs || {}
         u.foodBuffs.tribShield = recipe.val
         txt += `🛡️ Selimut pelindung menyelimutimu. (Siap menahan ${formatNum(recipe.val)} damage dari Petir Tribulation)`
      }
      else if (recipe.effect === 'detox') {
         u.cultivation.pillToxicity = Math.max(0, u.cultivation.pillToxicity - recipe.val)
         txt += `🌿 Racun kultivasi luntur. Toxicity turun -${recipe.val}%.`
      }
      
      saveDb(db)
      await replyText(conn, m, txt)
      break
    }

    default:
      break
  }
}

handler.help = ['cultivate', 'meditate', 'breakthrough', 'alchemy', 'swallow']
handler.tags = ['rpg']
handler.command = /^(cultivate|cultivation|dao|meditate|meditasi|breakthrough|terobos|alchemy|alkimia|swallow|telan)$/i
handler.limit = false
handler.register = false

export default handler
