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

// Injeksi struktur data baru ke database lama tanpa merusak
function ensureExpansionData(db, jid) {
  if (!db.users[jid]) return false // Biarkan script utama yg buat profil dasar
  
  const u = db.users[jid]
  // Tambahan data Expansion
  u.mining = u.mining || { rigs: 0, lastHarvest: 0 }
  u.implants = u.implants || { optic: 0, neural: 0, dermal: 0, motor: 0 }
  u.syndicate = u.syndicate || null
  
  // Data Global Expansion
  db.syndicates = db.syndicates || {}
  db.bounties = db.bounties || {}
  
  return u
}

async function showList(conn, m, title, rows, footer = '') {
  const txt = [
    `╔═══『 🌐 ${title} 』═══`,
    ...rows.map(r => `╠ ⎔ ${r}`),
    `╚══════════════════════`,
    footer ? `[💻] ${footer}` : ''
  ].filter(Boolean).join('\n')
  await conn.sendMessage(m.chat, { text: txt }, { quoted: m })
}

function replyText(conn, m, text) {
  return conn.sendMessage(m.chat, { text }, { quoted: m })
}

const handler = async (m, { conn, usedPrefix, command, text }) => {
  const db = loadDb()
  if (!db) return replyText(conn, m, '[ ⚠️ ] Database belum siap. Buat profile di RPG utama dulu (ketik .profile)')
  
  const u = ensureExpansionData(db, m.sender)
  if (!u) return replyText(conn, m, '[ ⚠️ ] Profil tidak ditemukan. Ketik .profile dulu di RPG utama.')

  const args = String(text || '').trim().split(/\s+/).filter(Boolean)
  const sub = String(command || '').toLowerCase()

  const menu = [
    `*▣ CYBER SYNDICATE ▣*`,
    `${usedPrefix}syndicate create <nama>`,
    `${usedPrefix}syndicate join <nama>`,
    `${usedPrefix}syndicate leave`,
    `${usedPrefix}syndicate info`,
    `${usedPrefix}syndicate donate <jumlah_gold>`,
    ``,
    `*▣ CRYPTO MINING ▣*`,
    `${usedPrefix}mining info`,
    `${usedPrefix}mining buyrig`,
    `${usedPrefix}harvest`,
    ``,
    `*▣ CYBER IMPLANTS ▣*`,
    `${usedPrefix}implant list`,
    `${usedPrefix}implant upgrade <tipe>`,
    ``,
    `*▣ DARK WEB BOUNTY ▣*`,
    `${usedPrefix}bounty list`,
    `${usedPrefix}bounty set @user <harga>`,
    `${usedPrefix}hitman @user`
  ]

  switch (sub) {
    case 'rpgex':
    case 'rpgexpansion':
      await showList(conn, m, 'CYBER-EXPANSION MENU', menu, 'End-Game Features Activated')
      break

    // ==========================================
    // 1. SYSTEM SYNDICATE (GUILD)
    // ==========================================
    case 'syndicate':
    case 'synd': {
      const action = (args[0] || '').toLowerCase()
      const argName = args.slice(1).join(' ')

      if (action === 'create') {
        if (u.syndicate) return replyText(conn, m, '[ ⚠️ ] Kamu sudah bergabung dalam Syndicate. Keluar dulu jika ingin buat baru.')
        if (!argName) return replyText(conn, m, `[ ⚠️ ] Format: ${usedPrefix}syndicate create <Nama Faksi>`)
        if (db.syndicates[argName]) return replyText(conn, m, '[ ⚠️ ] Nama Syndicate sudah dipakai.')
        
        const cost = 50000
        if (u.gold < cost) return replyText(conn, m, `[ ⚠️ ] Butuh Modal ${formatNum(cost)} Gold untuk mendaftarkan Syndicate di Dark Web.`)
        
        u.gold -= cost
        db.syndicates[argName] = {
          name: argName,
          leader: m.sender,
          members: [m.sender],
          level: 1,
          exp: 0,
          vault: 0
        }
        u.syndicate = argName
        saveDb(db)
        await replyText(conn, m, `🏴‍☠️ *SYNDICATE CREATED*\nFaksi [ ${argName} ] resmi terdaftar di Dark Web!`)
        
      } else if (action === 'join') {
        if (u.syndicate) return replyText(conn, m, '[ ⚠️ ] Kamu sudah di dalam Syndicate.')
        if (!argName) return replyText(conn, m, `[ ⚠️ ] Masukkan nama syndicate yang mau di-join.`)
        const synd = db.syndicates[argName]
        if (!synd) return replyText(conn, m, '[ ⚠️ ] Syndicate tidak ditemukan.')
        if (synd.members.length >= 5 + (synd.level * 2)) return replyText(conn, m, '[ ⚠️ ] Kapasitas Syndicate penuh. Suruh leader up level.')
        
        synd.members.push(m.sender)
        u.syndicate = argName
        saveDb(db)
        await replyText(conn, m, `🤝 *JOINED*\nKamu sekarang adalah anggota Syndicate [ ${argName} ].`)
        
      } else if (action === 'leave') {
        if (!u.syndicate) return replyText(conn, m, '[ ⚠️ ] Kamu gelandangan, tidak punya Syndicate.')
        const synd = db.syndicates[u.syndicate]
        if (synd.leader === m.sender) return replyText(conn, m, '[ ⚠️ ] Leader tidak bisa leave. Serahkan leader atau bubarkan (segera hadir).')
        
        synd.members = synd.members.filter(m => m !== m.sender)
        const oldName = u.syndicate
        u.syndicate = null
        saveDb(db)
        await replyText(conn, m, `🚶 *LEFT*\nKamu telah membelot dari Syndicate [ ${oldName} ].`)

      } else if (action === 'info') {
        if (!u.syndicate) return replyText(conn, m, '[ ⚠️ ] Kamu gelandangan, tidak punya Syndicate.')
        const synd = db.syndicates[u.syndicate]
        const maxMem = 5 + (synd.level * 2)
        const expNeed = synd.level * 100000
        
        await showList(conn, m, `SYNDICATE: ${synd.name}`, [
          `👑 Leader: @${synd.leader.split('@')[0]}`,
          `📈 Level: ${synd.level}`,
          `💠 EXP: ${formatNum(synd.exp)} / ${formatNum(expNeed)}`,
          `🏦 Vault: ${formatNum(synd.vault)} Gold`,
          `👥 Members: ${synd.members.length} / ${maxMem}`,
          `🔥 Buff Aktif: +${synd.level * 2}% Gold & DMG`
        ])
        
      } else if (action === 'donate') {
        if (!u.syndicate) return replyText(conn, m, '[ ⚠️ ] Kamu tidak punya Syndicate.')
        const amount = Number(args[1])
        if (!amount || amount <= 0) return replyText(conn, m, `[ ⚠️ ] Format: ${usedPrefix}syndicate donate <jumlah>`)
        if (u.gold < amount) return replyText(conn, m, '[ ⚠️ ] Gold kamu nggak cukup buat donasi.')
        
        const synd = db.syndicates[u.syndicate]
        u.gold -= amount
        synd.vault += amount
        synd.exp += amount // 1 Gold = 1 EXP Syndicate
        
        let up = false
        while (synd.exp >= synd.level * 100000) {
          synd.exp -= synd.level * 100000
          synd.level++
          up = true
        }
        
        saveDb(db)
        await replyText(conn, m, `💸 *DONASI SUKSES*\nKamu menyumbang ${formatNum(amount)} Gold ke Syndicate.${up ? `\n🎉 SYNDICATE NAIK KE LEVEL ${synd.level}!` : ''}`)
      } else {
         replyText(conn, m, `[ ⚠️ ] Command salah. Ketik ${usedPrefix}rpgex untuk menu.`)
      }
      break
    }

    // ==========================================
    // 2. SYSTEM CRYPTO MINING
    // ==========================================
    case 'mining': {
      const action = (args[0] || '').toLowerCase()
      if (action === 'info') {
        const rigs = u.mining.rigs || 0
        const rate = rigs * 250 // 250 gold per jam per rig
        await showList(conn, m, 'MINING FARM', [
          `🖥️ Total Rigs: ${rigs}`,
          `⚡ Hash Rate: ${formatNum(rate)} Gold/Jam`,
          `⏳ Status: ${u.mining.lastHarvest ? 'Online' : 'Offline'}`
        ], `Klaim pasif income: ${usedPrefix}harvest`)
      } else if (action === 'buyrig') {
        const costGold = 25000 + ((u.mining.rigs || 0) * 10000)
        const costCore = 1 + Math.floor((u.mining.rigs || 0) / 2)
        
        if (u.gold < costGold || (u.items['cybercore'] || 0) < costCore) {
          return replyText(conn, m, `[ ⚠️ ] Gagal beli Rig.\nButuh: ${formatNum(costGold)} Gold & ${costCore} Cyber Core.`)
        }
        
        u.gold -= costGold
        u.items['cybercore'] -= costCore
        u.mining.rigs = (u.mining.rigs || 0) + 1
        if (!u.mining.lastHarvest) u.mining.lastHarvest = now()
        
        saveDb(db)
        await replyText(conn, m, `🖥️ *RIG PURCHASED*\nMining Rig berhasil di-install. Total Rig: ${u.mining.rigs}\nJangan lupa di ${usedPrefix}harvest tiap beberapa jam!`)
      }
      break
    }

    case 'harvest': {
      if ((u.mining.rigs || 0) < 1) return replyText(conn, m, '[ ⚠️ ] Kamu belum punya Mining Rig. Beli pakai .mining buyrig')
      
      const last = u.mining.lastHarvest || now()
      const diffHrs = (now() - last) / (1000 * 60 * 60)
      
      if (diffHrs < 1) return replyText(conn, m, '[ ⚠️ ] Proses mining belum selesai. Minimal harvest 1 jam sekali.')
      
      // Limit max 24 jam biar orang tetep aktif login
      const capHrs = Math.min(diffHrs, 24) 
      const income = Math.floor(capHrs * (u.mining.rigs * 250))
      
      u.gold += income
      u.mining.lastHarvest = now()
      saveDb(db)
      
      await replyText(conn, m, `⛏️ *CRYPTO HARVESTED*\nFarm kamu menghasilkan +${formatNum(income)} Gold!`)
      break
    }

    // ==========================================
    // 3. SYSTEM CYBER IMPLANTS
    // ==========================================
    case 'implant': {
      const action = (args[0] || '').toLowerCase()
      if (action === 'list') {
        await showList(conn, m, 'CLINIC: CYBER IMPLANTS', [
          `👁️ Optic (Lv.${u.implants.optic}) | +Luck | Butuh: Neon Shard`,
          `🧠 Neural (Lv.${u.implants.neural}) | +EXP Bonus | Butuh: Plasma`,
          `🦾 Dermal (Lv.${u.implants.dermal}) | +DEF% | Butuh: Obsidian`,
          `🦵 Motor (Lv.${u.implants.motor}) | +ATK% | Butuh: Void Core`,
          ``,
          `*Cara upgrade:* ${usedPrefix}implant upgrade optic`
        ], `PERINGATAN: Modifikasi ini permanen.`)
      } else if (action === 'upgrade') {
        const type = (args[1] || '').toLowerCase()
        const validTypes = {
          'optic': { item: 'neonshard', name: 'Optic System' },
          'neural': { item: 'plasma', name: 'Neural Link' },
          'dermal': { item: 'obsidian', name: 'Dermal Plating' },
          'motor': { item: 'voidcore', name: 'Motor Servo' }
        }
        
        if (!validTypes[type]) return replyText(conn, m, '[ ⚠️ ] Tipe implant tidak valid. (optic/neural/dermal/motor)')
        
        const currentLv = u.implants[type] || 0
        if (currentLv >= 10) return replyText(conn, m, '[ ⚠️ ] Implant ini sudah mencapai batas aman (Level 10). Resiko Cyberpsycho tinggi.')
        
        const reqItem = validTypes[type].item
        const reqQty = (currentLv + 1) * 2
        const costGold = (currentLv + 1) * 15000
        
        if ((u.items[reqItem] || 0) < reqQty || u.gold < costGold) {
           return replyText(conn, m, `[ ⚠️ ] Bahan operasi kurang!\nButuh: ${reqQty} ${reqItem} & ${formatNum(costGold)} Gold.`)
        }
        
        u.items[reqItem] -= reqQty
        u.gold -= costGold
        u.implants[type] += 1
        
        // Terapin stat permanen langsung ke base stat u
        if (type === 'optic') u.luck += 3
        if (type === 'dermal') u.def += 10
        if (type === 'motor') u.atk += 15
        
        saveDb(db)
        await replyText(conn, m, `💉 *SURGERY SUCCESS*\nImplant [ ${validTypes[type].name} ] berhasil di-upgrade ke Level ${u.implants[type]}!\nStatus dasar tubuhmu meningkat permanen.`)
      }
      break
    }

    // ==========================================
    // 4. SYSTEM BOUNTY HUNTER
    // ==========================================
    case 'bounty': {
      const action = (args[0] || '').toLowerCase()
      if (action === 'list') {
        const list = Object.entries(db.bounties)
          .filter(([_, data]) => data.amount > 0)
          .sort((a, b) => b[1].amount - a[1].amount)
          .slice(0, 10)
          
        if (list.length === 0) return replyText(conn, m, '🕊️ Dark Web sepi. Tidak ada buronan saat ini.')
        
        const txtRows = list.map((v, i) => `${i+1}. @${v[0].split('@')[0]} - ☠️ Reward: ${formatNum(v[1].amount)} Gold`)
        await conn.sendMessage(m.chat, { text: `╔═══『 🎯 BOUNTY BOARD 』═══\n${txtRows.map(r => `╠ ⎔ ${r}`).join('\n')}\n╚══════════════════════`, mentions: list.map(v => v[0]) }, { quoted: m })
        
      } else if (action === 'set') {
        const target = m.mentionedJid?.[0] || args[1]
        const amount = Math.floor(Number(args[2]))
        
        if (!target?.includes('@')) return replyText(conn, m, `[ ⚠️ ] Tag targetnya. Format: ${usedPrefix}bounty set @user <harga>`)
        if (isNaN(amount) || amount < 5000) return replyText(conn, m, '[ ⚠️ ] Minimal harga kepala buronan adalah 5,000 Gold.')
        if (u.gold < amount) return replyText(conn, m, '[ ⚠️ ] Gold kamu nggak cukup buat masang bounty segitu.')
        if (target === m.sender) return replyText(conn, m, '[ ⚠️ ] Masang buronan buat diri sendiri? Sakit jiwa.')
        
        u.gold -= amount
        db.bounties[target] = db.bounties[target] || { amount: 0 }
        db.bounties[target].amount += amount
        
        saveDb(db)
        await replyText(conn, m, `🩸 *BOUNTY SET*\nHarga senilai ${formatNum(amount)} Gold telah ditaruh di kepala @${target.split('@')[0]}!`, { mentions: [target] })
      }
      break
    }

    case 'hitman':
    case 'assassinate': {
      const target = m.mentionedJid?.[0] || args[0]
      if (!target?.includes('@')) return replyText(conn, m, `[ ⚠️ ] Tag targetnya. Format: ${usedPrefix}hitman @user`)
      if (target === m.sender) return replyText(conn, m, '[ ⚠️ ] Jangan bundir cuy.')
      
      const bounty = db.bounties[target]
      if (!bounty || bounty.amount <= 0) return replyText(conn, m, '[ ⚠️ ] Target ini orang suci, tidak ada harga buronan di kepalanya.')
      
      if (u.energy < 50) return replyText(conn, m, '[ ⚠️ ] Jadi Hitman butuh fisik kuat. Energy minimal 50.')
      u.energy -= 50
      
      // Simulasi gacha pertarungan Hitman (High Risk High Reward)
      // Dipengaruhi Implant Motor (ATK) target vs pembunuh
      const enemy = ensureExpansionData(db, target)
      const myAtk = u.atk + (u.implants.motor * 10) + rand(1, 100)
      const enemyDef = enemy.def + (enemy.implants.dermal * 10) + rand(1, 100)
      
      if (myAtk > enemyDef) {
        // SUCCESS
        const reward = bounty.amount
        u.gold += reward
        db.bounties[target].amount = 0 // Reset bounty
        
        // Efek ke musuh
        enemy.hp = 1
        enemy.gold = Math.max(0, enemy.gold - Math.floor(reward * 0.1)) // Musuh ilang gold dikit buat biaya RS
        
        saveDb(db)
        await replyText(conn, m, `🔪 *ASSASSINATION SUCCESS*\nTarget @${target.split('@')[0]} berhasil dieksekusi!\nKamu mengklaim Bounty sebesar ${formatNum(reward)} Gold.`, { mentions: [target] })
      } else {
        // FAILED
        const fine = Math.floor(u.gold * 0.15)
        u.gold = Math.max(0, u.gold - fine)
        u.hp = 1
        saveDb(db)
        await replyText(conn, m, `🚑 *ASSASSINATION FAILED*\nTarget terlalu kuat! Kamu terluka parah (HP sisa 1) dan menjatuhkan ${formatNum(fine)} Gold saat kabur.`)
      }
      break
    }

    default:
      break
  }
}

handler.help = ['rpgex']
handler.tags = ['rpg']
handler.command = /^(rpgex|rpgexpansion|syndicate|synd|mining|harvest|implant|bounty|hitman|assassinate)$/i
handler.limit = false
handler.register = true

export default handler
