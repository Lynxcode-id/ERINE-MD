import fs from 'fs'
import path from 'path'

const DB_FILE = path.join(process.cwd(), 'rpgdatabase.json')

const DEFAULT_DB = {
  version: 3,
  users: {},
  world: {
    lastReset: 0,
    market: {},
    events: [],
    boss: {
      active: true,
      name: 'Abyss Hydra',
      hp: 15000,
      maxHp: 15000,
      rewardGold: 12000,
      rewardExp: 8000
    }
  },
  logs: []
}

const JOBS = [
  { id: 'hunter', name: 'Pemburu', pay: [180, 320], exp: [12, 22], energy: 12 },
  { id: 'miner', name: 'Penambang', pay: [200, 360], exp: [14, 24], energy: 14 },
  { id: 'fisher', name: 'Nelayan', pay: [160, 290], exp: [10, 18], energy: 10 },
  { id: 'lumberjack', name: 'Penebang', pay: [175, 305], exp: [11, 20], energy: 11 },
  { id: 'farmer', name: 'Petani', pay: [150, 260], exp: [10, 17], energy: 9 },
  { id: 'merchant', name: 'Pedagang', pay: [220, 390], exp: [14, 26], energy: 13 },
  { id: 'guard', name: 'Pengawal', pay: [240, 420], exp: [16, 28], energy: 14 },
  { id: 'smith', name: 'Pandai Besi', pay: [260, 440], exp: [18, 30], energy: 15 },
  { id: 'alchemist', name: 'Alkemis', pay: [280, 460], exp: [18, 31], energy: 15 },
  { id: 'scout', name: 'Pengintai', pay: [210, 360], exp: [13, 24], energy: 12 },
  { id: 'chef', name: 'Koki', pay: [170, 300], exp: [10, 20], energy: 10 },
  { id: 'scribe', name: 'Juru Tulis', pay: [190, 330], exp: [12, 22], energy: 10 },
  { id: 'treasure', name: 'Pemburu Harta', pay: [320, 520], exp: [20, 36], energy: 18 },
  { id: 'mage', name: 'Mage', pay: [300, 500], exp: [20, 34], energy: 16 },
  { id: 'knight', name: 'Ksatria', pay: [260, 470], exp: [18, 30], energy: 15 },
  { id: 'hacker', name: 'Netrunner', pay: [400, 700], exp: [25, 45], energy: 20 }
]

const BIOMES = [
  { id: 'forest', name: 'Hutan', lv: 1, loot: ['wood', 'herb', 'mushroom', 'berry'] },
  { id: 'river', name: 'Sungai', lv: 3, loot: ['fish', 'pearl', 'shell'] },
  { id: 'cave', name: 'Gua', lv: 5, loot: ['ore', 'stone', 'crystal'] },
  { id: 'desert', name: 'Padang Pasir', lv: 8, loot: ['sand', 'spice', 'amber'] },
  { id: 'snow', name: 'Salju', lv: 10, loot: ['ice', 'fur', 'snowflake'] },
  { id: 'swamp', name: 'Rawa', lv: 12, loot: ['muck', 'fungus', 'venom'] },
  { id: 'ruins', name: 'Reruntuhan', lv: 15, loot: ['relic', 'tablet', 'coin'] },
  { id: 'volcano', name: 'Gunung Api', lv: 20, loot: ['ember', 'lava', 'obsidian'] },
  { id: 'sky', name: 'Langit', lv: 25, loot: ['feather', 'cloudstone', 'lightshard'] },
  { id: 'void', name: 'Void', lv: 30, loot: ['voidcore', 'darkessence', 'fracture'] },
  { id: 'cyber', name: 'Cyber City', lv: 40, loot: ['neonshard', 'cybercore', 'plasma'] }
]

const WEAPON_TIERS = [
  { tier: 1, name: 'Kayu', min: 120, max: 200, atk: 4 },
  { tier: 2, name: 'Batu', min: 220, max: 320, atk: 7 },
  { tier: 3, name: 'Tembaga', min: 360, max: 480, atk: 10 },
  { tier: 4, name: 'Besi', min: 520, max: 760, atk: 14 },
  { tier: 5, name: 'Baja', min: 820, max: 1120, atk: 18 },
  { tier: 6, name: 'Perak', min: 1200, max: 1600, atk: 23 },
  { tier: 7, name: 'Emas', min: 1800, max: 2400, atk: 29 },
  { tier: 8, name: 'Mitos', min: 2600, max: 3400, atk: 36 },
  { tier: 9, name: 'Plasma', min: 4000, max: 6000, atk: 50 }
]

const ARMOR_TIERS = [
  { tier: 1, name: 'Pakaian', min: 100, max: 180, def: 3 },
  { tier: 2, name: 'Kulit', min: 200, max: 300, def: 5 },
  { tier: 3, name: 'Besi', min: 360, max: 500, def: 8 },
  { tier: 4, name: 'Rantai', min: 540, max: 760, def: 12 },
  { tier: 5, name: 'Pelat', min: 820, max: 1100, def: 16 },
  { tier: 6, name: 'Runik', min: 1200, max: 1550, def: 21 },
  { tier: 7, name: 'Suci', min: 1700, max: 2250, def: 27 },
  { tier: 8, name: 'Legenda', min: 2500, max: 3300, def: 34 },
  { tier: 9, name: 'Quantum', min: 4500, max: 6500, def: 45 }
]

const ACCESSORY_TIERS = [
  { tier: 1, name: 'Ring', min: 90, max: 160, luck: 1 },
  { tier: 2, name: 'Liontin', min: 180, max: 260, luck: 2 },
  { tier: 3, name: 'Jimat', min: 320, max: 430, luck: 3 },
  { tier: 4, name: 'Kartu', min: 500, max: 700, luck: 4 },
  { tier: 5, name: 'Relik', min: 780, max: 1050, luck: 5 },
  { tier: 6, name: 'Orb', min: 1150, max: 1450, luck: 6 },
  { tier: 7, name: 'Sigil', min: 1600, max: 2100, luck: 8 },
  { tier: 8, name: 'Crown', min: 2400, max: 3000, luck: 10 },
  { tier: 9, name: 'Holo-Band', min: 5000, max: 8000, luck: 15 }
]

const CONSUMABLES = [
  { id: 'potion', name: 'Potion', type: 'consumable', price: 120, desc: 'Memulihkan 60 HP', heal: 60 },
  { id: 'hi_potion', name: 'Hi-Potion', type: 'consumable', price: 280, desc: 'Memulihkan 150 HP', heal: 150 },
  { id: 'mega_potion', name: 'Mega Potion', type: 'consumable', price: 900, desc: 'Memulihkan 300 HP', heal: 300 },
  { id: 'elixir', name: 'Elixir', type: 'consumable', price: 1500, desc: 'Memulihkan full HP', heal: 'full' },
  { id: 'energy_drink', name: 'Energy Drink', type: 'consumable', price: 180, desc: 'Memulihkan 30 energy', energy: 30 },
  { id: 'mana_potion', name: 'Mana Potion', type: 'consumable', price: 200, desc: 'Memulihkan 40 energy', energy: 40 },
  { id: 'cyber_drink', name: 'Neon Cola', type: 'consumable', price: 500, desc: 'Memulihkan 100 energy', energy: 100 },
  { id: 'stamina_drink', name: 'Stamina Drink', type: 'consumable', price: 220, desc: 'Memulihkan 50 stamina', stamina: 50 },
  { id: 'antidote', name: 'Antidote', type: 'consumable', price: 150, desc: 'Menyembuhkan racun', cleanse: true },
  { id: 'repair_kit', name: 'Repair Kit', type: 'consumable', price: 250, desc: 'Memperbaiki gear', repair: 1 },
  { id: 'luck_tonic', name: 'Luck Tonic', type: 'consumable', price: 300, desc: 'Bonus luck sementara', buff: { luck: 2, turns: 5 } },
  { id: 'exp_scroll', name: 'EXP Scroll', type: 'consumable', price: 450, desc: 'EXP bonus quest berikutnya', buff: { exp: 1.2, turns: 3 } },
  { id: 'gold_ticket', name: 'Gold Ticket', type: 'consumable', price: 520, desc: 'Bonus reward event', buff: { gold: 1.3, turns: 3 } },
  { id: 'shield_scroll', name: 'Shield Scroll', type: 'consumable', price: 500, desc: 'Tambah def sementara', buff: { def: 5, turns: 4 } },
  { id: 'pet_food', name: 'Pet Food', type: 'consumable', price: 160, desc: 'Pakan pet standar', petFood: 25 },
  { id: 'premium_pet_food', name: 'Gourmet Pet Food', type: 'consumable', price: 600, desc: 'Pakan pet premium', petFood: 100 },
  { id: 'teleport', name: 'Teleport Scroll', type: 'consumable', price: 700, desc: 'Skip cooldown kecil', reduceCd: 0.35 }
]

const PETS = [
  { id: 'cat', name: 'Cat', bonus: { luck: 1, exp: 5 }, price: 500 },
  { id: 'dog', name: 'Dog', bonus: { atk: 1, gold: 5 }, price: 650 },
  { id: 'fox', name: 'Fox', bonus: { luck: 2, gold: 3 }, price: 900 },
  { id: 'wolf', name: 'Wolf', bonus: { atk: 2, def: 1 }, price: 1200 },
  { id: 'dragonling', name: 'Dragonling', bonus: { atk: 4, luck: 2 }, price: 2500 },
  { id: 'fairy', name: 'Fairy', bonus: { exp: 10, hp: 10 }, price: 1800 },
  { id: 'hawk', name: 'Hawk', bonus: { luck: 1, exp: 6 }, price: 700 },
  { id: 'slime', name: 'Slime', bonus: { def: 2, hp: 15 }, price: 600 },
  { id: 'tiger', name: 'Tiger', bonus: { atk: 3, gold: 4 }, price: 1600 },
  { id: 'golem', name: 'Golem', bonus: { def: 5, hp: 30 }, price: 2200 },
  { id: 'cyberdog', name: 'K-9 Unit', bonus: { atk: 5, luck: 5 }, price: 5000 },
  { id: 'mecha_dragon', name: 'Mecha Dragon', bonus: { atk: 8, def: 5, hp: 100 }, price: 15000 }
]

const CRATES = [
  { id: 'crate_wood', name: 'Wood Crate', price: 500, drops: ['wood', 'stone', 'potion', 'herb', 'coin'] },
  { id: 'crate_iron', name: 'Iron Crate', price: 2500, drops: ['ore', 'crystal', 'hi_potion', 'relic', 'pearl'] },
  { id: 'crate_gold', name: 'Gold Crate', price: 8000, drops: ['gem', 'amber', 'mega_potion', 'voidcore', 'obsidian'] },
  { id: 'crate_neon', name: 'Neon Crate', price: 20000, drops: ['cybercore', 'neonshard', 'plasma', 'elixir', 'premium_pet_food'] }
]

function clone(x) {
  return JSON.parse(JSON.stringify(x))
}

function rand(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
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

function levelNeed(level) {
  return 120 + level * 40
}

function tierTitle(level) {
  if (level < 5) return 'Novice'
  if (level < 10) return 'Scout'
  if (level < 20) return 'Adept'
  if (level < 35) return 'Elite'
  if (level < 50) return 'Hero'
  if (level < 70) return 'Mythic'
  return 'Cyber-Legend'
}

function makeUser() {
  return {
    gold: 0,
    bank: 0,
    energy: 100,
    stamina: 100,
    hp: 100,
    maxHp: 100,
    atk: 5,
    def: 2,
    luck: 0,
    level: 1,
    exp: 0,
    title: 'Novice',
    job: 'unemployed',
    partner: '', // Ditambah field bucin cuy
    xpBoost: 0,
    goldBoost: 0,
    cooldowns: {},
    resources: {},
    items: {},
    equipment: { weapon: null, armor: null, accessory: null },
    enchant: { weapon: 0, armor: 0 },
    pet: { owned: null, hunger: 100, mood: 100, exp: 0, level: 1 },
    stats: {
      dailyClaim: 0, weeklyClaim: 0, monthlyClaim: 0,
      work: 0, adventure: 0, hunt: 0, fish: 0, mine: 0, chop: 0, dig: 0, forage: 0,
      quest: 0, duelWin: 0, duelLose: 0, monsters: 0, crafted: 0, sold: 0, bought: 0,
      dungeon: 0, boss: 0, pet: 0, explore: 0, rob: 0
    }
  }
}

function loadDb() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(DEFAULT_DB, null, 2))
      return clone(DEFAULT_DB)
    }
    const raw = fs.readFileSync(DB_FILE, 'utf8')
    const data = JSON.parse(raw || '{}')
    return {
      ...clone(DEFAULT_DB),
      ...data,
      users: data.users || {},
      world: {
        ...clone(DEFAULT_DB.world),
        ...(data.world || {}),
        boss: {
          ...clone(DEFAULT_DB.world.boss),
          ...((data.world && data.world.boss) || {})
        }
      },
      logs: Array.isArray(data.logs) ? data.logs : []
    }
  } catch {
    return clone(DEFAULT_DB)
  }
}

function saveDb(db) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2))
}

function ensureUser(db, jid) {
  let isNew = false // Ini Fix bug biar kalo baru pertama main, langsung save!
  if (!db.users[jid]) {
    db.users[jid] = makeUser()
    isNew = true 
  }

  const u = db.users[jid]
  const def = makeUser()
  for (const [k, v] of Object.entries(def)) {
    if (u[k] === undefined) u[k] = clone(v)
  }
  
  u.resources = u.resources || {}
  u.items = u.items || {}
  u.cooldowns = u.cooldowns || {}
  u.equipment = u.equipment || { weapon: null, armor: null, accessory: null }
  u.enchant = u.enchant || { weapon: 0, armor: 0 }
  u.pet = u.pet || { owned: null, hunger: 100, mood: 100, exp: 0, level: 1 }
  u.partner = u.partner || ''
  u.stats = u.stats || clone(def.stats)
  
  if (!u.title) u.title = tierTitle(u.level || 1)
  if (!u.maxHp) u.maxHp = 100
  if (!u.hp) u.hp = u.maxHp

  // Kalau player baru aja di-create, paksa save ke database.json
  if (isNew) {
    saveDb(db)
  }

  return u
}

function addItem(u, id, qty = 1) {
  if (!id) return 0
  u.items[id] = (u.items[id] || 0) + qty
  if (u.items[id] <= 0) delete u.items[id]
  return u.items[id] || 0
}

function removeItem(u, id, qty = 1) {
  if (!u.items[id]) return 0
  u.items[id] -= qty
  if (u.items[id] <= 0) delete u.items[id]
  return u.items[id] || 0
}

function levelUp(u) {
  let ups = 0
  while (u.exp >= levelNeed(u.level)) {
    u.exp -= levelNeed(u.level)
    u.level += 1
    u.maxHp += 10
    u.atk += 2
    u.def += 1
    u.luck += 1
    u.hp = u.maxHp
    u.title = tierTitle(u.level)
    ups++
  }
  return ups
}

function gainExp(u, amount) {
  const mult = u.xpBoost > now() ? 1.2 : 1
  u.exp += Math.floor(amount * mult)
  return levelUp(u)
}

function activeBonus(u) {
  let atk = 0, def = 0, luck = 0, hp = 0
  for (const slot of ['weapon', 'armor', 'accessory']) {
    const id = u.equipment?.[slot]
    const item = id ? ITEM_CATALOG[id] : null
    if (!item) continue
    atk += Number(item.atk || 0)
    def += Number(item.def || 0)
    luck += Number(item.luck || 0)
  }
  
  // Apply Enchantment Bonuses
  atk += (u.enchant?.weapon || 0) * 5
  def += (u.enchant?.armor || 0) * 5

  const pet = PETS.find(p => p.id === u.pet?.owned)
  if (pet) {
    atk += Number(pet.bonus.atk || 0)
    def += Number(pet.bonus.def || 0)
    luck += Number(pet.bonus.luck || 0)
    hp += Number(pet.bonus.hp || 0)
  }
  return { atk, def, luck, hp }
}

function statsNow(u) {
  const b = activeBonus(u)
  return {
    atk: (u.atk || 0) + b.atk,
    def: (u.def || 0) + b.def,
    luck: (u.luck || 0) + b.luck,
    maxHp: (u.maxHp || 100) + b.hp,
    hp: u.hp || 0
  }
}

function cooldown(u, key, ms) {
  u.cooldowns[key] = now() + ms
}

function cdLeft(u, key) {
  return Math.max(0, (u.cooldowns?.[key] || 0) - now())
}

function ready(u, key) {
  return cdLeft(u, key) <= 0
}

function reduceCd(u, factor) {
  const t = now()
  for (const k of Object.keys(u.cooldowns || {})) {
    const left = (u.cooldowns[k] || 0) - t
    if (left > 0) u.cooldowns[k] = t + Math.floor(left * (1 - factor))
  }
}

function randomLoot(type, level) {
  const loot = { gold: rand(level * 35, level * 60), exp: rand(level * 12, level * 20), items: {} }
  if (type === 'hunt') {
    loot.items.meat = rand(1, 3)
    if (Math.random() > 0.5) loot.items.hide = rand(1, 2)
    if (Math.random() > 0.8) loot.items.bone = rand(1, 2)
  } else if (type === 'fish') {
    loot.items.fish = rand(1, 4)
    if (Math.random() > 0.7) loot.items.pearl = 1
  } else if (type === 'mine') {
    loot.items.ore = rand(1, 4)
    if (Math.random() > 0.65) loot.items.crystal = 1
    if (Math.random() > 0.84) loot.items.gem = 1
  } else if (type === 'chop') {
    loot.items.wood = rand(2, 5)
    if (Math.random() > 0.7) loot.items.herb = 1
  } else if (type === 'dig') {
    loot.items.stone = rand(2, 4)
    if (Math.random() > 0.6) loot.items.relic = 1
  } else if (type === 'forage') {
    loot.items.herb = rand(2, 4)
    if (Math.random() > 0.65) loot.items.mushroom = 1
  } else if (type === 'adventure') {
    loot.items[pick(['wood', 'stone', 'herb', 'ore', 'fish', 'hide'])] = 1
  }
  if (Math.random() > 0.9) loot.items[pick(['amber', 'tablet', 'coin', 'ember', 'feather', 'snowflake'])] = 1
  if (Math.random() > 0.95) loot.gold += rand(level * 90, level * 170)
  if (Math.random() > 0.95) loot.exp += rand(level * 35, level * 70)
  if (level > 30 && Math.random() > 0.95) loot.items[pick(['neonshard', 'cybercore'])] = 1
  return loot
}

function enemyFight(enemy, u) {
  const p = statsNow(u)
  let php = p.maxHp
  let ehp = enemy.hp
  let turn = 0
  while (php > 0 && ehp > 0 && turn < 80) {
    turn++
    ehp -= Math.max(1, rand(p.atk, p.atk + 8) - Math.floor(enemy.def / 2))
    if (ehp <= 0) break
    php -= Math.max(1, rand(enemy.atk, enemy.atk + 6) - Math.floor(p.def / 2))
  }
  return { win: php > 0, php: Math.max(0, php), ehp: Math.max(0, ehp), turn }
}

function buildCatalog() {
  const catalog = {}

  for (const c of CONSUMABLES) catalog[c.id] = c
  for (const c of CRATES) catalog[c.id] = { ...c, type: 'crate', desc: 'Gacha item box' }

  const mats = [
    ['wood', 'Wood', 'material', 35], ['stone', 'Stone', 'material', 40], ['herb', 'Herb', 'material', 45], ['mushroom', 'Mushroom', 'material', 50],
    ['berry', 'Berry', 'material', 30], ['fish', 'Fish', 'material', 55], ['ore', 'Ore', 'material', 70], ['hide', 'Hide', 'material', 65],
    ['bone', 'Bone', 'material', 60], ['shell', 'Shell', 'material', 75], ['pearl', 'Pearl', 'rare', 180], ['crystal', 'Crystal', 'rare', 220],
    ['gem', 'Gem', 'rare', 260], ['amber', 'Amber', 'rare', 240], ['relic', 'Relic', 'rare', 300], ['sand', 'Sand', 'material', 32],
    ['spice', 'Spice', 'material', 58], ['ice', 'Ice', 'material', 42], ['fur', 'Fur', 'material', 68], ['venom', 'Venom', 'rare', 210],
    ['muck', 'Muck', 'material', 28], ['fungus', 'Fungus', 'material', 48], ['tablet', 'Tablet', 'rare', 250], ['coin', 'Coin', 'material', 80],
    ['ember', 'Ember', 'rare', 240], ['lava', 'Lava', 'rare', 280], ['obsidian', 'Obsidian', 'rare', 320], ['feather', 'Feather', 'material', 90],
    ['cloudstone', 'Cloudstone', 'rare', 350], ['lightshard', 'Light Shard', 'rare', 400], ['voidcore', 'Void Core', 'legendary', 500], ['darkessence', 'Dark Essence', 'legendary', 530],
    ['fracture', 'Fracture', 'legendary', 560], ['snowflake', 'Snowflake', 'rare', 120],
    ['neonshard', 'Neon Shard', 'cyber', 800], ['cybercore', 'Cyber Core', 'cyber', 1000], ['plasma', 'Plasma Energy', 'cyber', 1200]
  ]
  for (const [id, name, type, price] of mats) catalog[id] = { id, name, type, price, desc: `${name} bahan ${type}` }

  for (const tier of WEAPON_TIERS) {
    for (let i = 1; i <= 10; i++) {
      catalog[`weapon_${tier.tier}_${i}`] = {
        id: `weapon_${tier.tier}_${i}`,
        name: `${tier.name} Blade ${i}`,
        type: 'weapon',
        price: rand(tier.min, tier.max),
        atk: tier.atk + Math.floor(i / 3),
        desc: `Senjata tier ${tier.tier}`
      }
    }
  }

  for (const tier of ARMOR_TIERS) {
    for (let i = 1; i <= 10; i++) {
      catalog[`armor_${tier.tier}_${i}`] = {
        id: `armor_${tier.tier}_${i}`,
        name: `${tier.name} Armor ${i}`,
        type: 'armor',
        price: rand(tier.min, tier.max),
        def: tier.def + Math.floor(i / 3),
        desc: `Armor tier ${tier.tier}`
      }
    }
  }

  for (const tier of ACCESSORY_TIERS) {
    for (let i = 1; i <= 10; i++) {
      catalog[`acc_${tier.tier}_${i}`] = {
        id: `acc_${tier.tier}_${i}`,
        name: `${tier.name} ${i}`,
        type: 'accessory',
        price: rand(tier.min, tier.max),
        luck: tier.luck + Math.floor(i / 4),
        desc: `Aksesori tier ${tier.tier}`
      }
    }
  }

  for (let i = 1; i <= 80; i++) {
    catalog[`scroll_${i}`] = { id: `scroll_${i}`, name: `Ancient Scroll ${i}`, type: 'scroll', price: 100 + i * 10, desc: `Scroll kuno ${i}` }
  }

  for (let i = 1; i <= 50; i++) {
    catalog[`token_${i}`] = { id: `token_${i}`, name: `Quest Token ${i}`, type: 'quest', price: 70 + i * 6, desc: `Token quest ${i}` }
  }

  for (const pet of PETS) {
    catalog[`pet_${pet.id}`] = { id: `pet_${pet.id}`, name: `${pet.name} Egg`, type: 'pet', price: pet.price, desc: `Telur pet ${pet.name}` }
  }

  // Tambahan item cincin kawin buat Bucin System!
  catalog['wedding_ring'] = { id: 'wedding_ring', name: 'Wedding Ring', type: 'accessory', price: 100000, luck: 25, desc: 'Cincin suci penanda ikatan cinta (.propose)' }

  return catalog
}

function buildQuests() {
  const q = []
  for (let i = 1; i <= 120; i++) {
    const type = ['hunt', 'fish', 'mine', 'chop', 'dig', 'forage'][i % 6]
    const lvl = Math.max(1, Math.ceil(i / 4))
    q.push({
      id: `q${i}`,
      name: `Misi ${i}`,
      type,
      level: lvl,
      need: rand(2, 8) + Math.floor(i / 18),
      gold: 100 + lvl * 50 + i * 3,
      exp: 25 + lvl * 20 + i,
      item: i % 5 === 0 ? pick(['gem', 'pearl', 'crystal', 'amber', 'relic']) : null,
      desc: `Tugas ${type} untuk level ${lvl}`
    })
  }
  return q
}

function buildMonsters() {
  const list = []
  for (const biome of BIOMES) {
    for (let i = 1; i <= 12; i++) {
      list.push({
        id: `${biome.id}_${i}`,
        name: `${biome.name} Beast ${i}`,
        biome: biome.name,
        level: biome.lv + Math.floor(i / 2),
        hp: 60 + biome.lv * 18 + i * 8,
        atk: 8 + biome.lv * 2 + i,
        def: 3 + Math.floor(biome.lv / 2) + Math.floor(i / 3),
        gold: rand(biome.lv * 35, biome.lv * 70),
        exp: rand(biome.lv * 14, biome.lv * 24),
        drops: [pick(biome.loot), pick(biome.loot), i % 3 === 0 ? rareDrop(biome.lv) : null].filter(Boolean)
      })
    }
  }
  return list
}

function rareDrop(level) {
  const arr = ['gem', 'crystal', 'amber', 'obsidian', 'relic', 'pearl', 'shell', 'voidcore', 'neonshard']
  return arr[Math.min(arr.length - 1, Math.floor(level / 6))] || 'gem'
}

const ITEM_CATALOG = buildCatalog()
const QUESTS = buildQuests()
const MONSTERS = buildMonsters()

function getDb() {
  return loadDb()
}

function ensureWorld(db) {
  db.world = db.world || clone(DEFAULT_DB.world)
  db.world.boss = db.world.boss || clone(DEFAULT_DB.world.boss)
  return db.world
}

function refreshWorld(db) {
  const w = ensureWorld(db)
  const day = new Date().toDateString()
  if (w.lastReset !== day) {
    w.lastReset = day
    w.events = [
      'bonus_gold_10',
      'bonus_exp_10',
      'rare_drop_5',
      'shop_discount'
    ]
    w.market = {}
    for (const item of Object.values(ITEM_CATALOG)) {
      if (Math.random() < 0.12) w.market[item.id] = Math.max(1, Math.round(item.price * 0.8))
    }
    if (!w.boss || w.boss.hp <= 0) {
      w.boss = {
        active: true,
        name: pick(['Abyss Hydra', 'Crimson Titan', 'Void Emperor', 'Ancient Leviathan', 'Cyber Demon', 'Mecha Godzilla']),
        hp: 20000 + rand(0, 8000),
        maxHp: 20000 + rand(0, 8000),
        rewardGold: 15000 + rand(0, 5000),
        rewardExp: 10000 + rand(0, 4000)
      }
    }
    saveDb(db)
  }
}

function canUseCooldown(u, key) {
  return (u.cooldowns?.[key] || 0) <= now()
}

function setCooldown(u, key, ms) {
  u.cooldowns[key] = now() + ms
}

function giveRandomLoot(u, payload) {
  if (payload.gold) u.gold += payload.gold
  if (payload.exp) gainExp(u, payload.exp)
  if (payload.items) {
    for (const [id, qty] of Object.entries(payload.items)) addItem(u, id, qty)
  }
}

function requirementsMet(u, req) {
  for (const [id, qty] of Object.entries(req)) {
    if ((u.items[id] || 0) < qty) return false
  }
  return true
}

function consumeRequirements(u, req) {
  for (const [id, qty] of Object.entries(req)) removeItem(u, id, qty)
}

function replyText(conn, m, text) {
  return conn.sendMessage(m.chat, { text }, { quoted: m })
}

function shopList(page = 1) {
  const arr = Object.values(ITEM_CATALOG)
  const per = 14
  const start = (page - 1) * per
  return arr.slice(start, start + per)
}

async function showList(conn, m, title, rows, footer = '') {
  const txt = [
    `╔═══『 ⚡ ${title} 』═══`,
    ...rows.map(r => `╠ ⎔ ${r}`),
    `╚══════════════════════`,
    footer ? `[🤖] ${footer}` : ''
  ].filter(Boolean).join('\n')
  await conn.sendMessage(m.chat, { text: txt }, { quoted: m })
}

function petBonusText(pet) {
  if (!pet) return '-'
  const bonus = PETS.find(p => p.id === pet.owned)
  if (!bonus) return '-'
  return Object.entries(bonus.bonus).map(([k, v]) => `${k}+${v}`).join(' | ')
}

const handler = async (m, { conn, usedPrefix, command, text }) => {
  const db = getDb()
  refreshWorld(db)
  if (!m.sender) return

  const u = ensureUser(db, m.sender)
  const args = String(text || '').trim().split(/\s+/).filter(Boolean)
  const sub = String(command || '').toLowerCase()

  const stats = statsNow(u)
  const menu = [
    `[ 👤 ] Level: ${u.level} | EXP: ${formatNum(u.exp)}/${formatNum(levelNeed(u.level))}`,
    `[ ❤️ ] HP: ${formatNum(u.hp)}/${formatNum(stats.maxHp)} | ⚡ EN: ${formatNum(u.energy)} | 🔋 ST: ${formatNum(u.stamina)}`,
    `[ 💰 ] Gold: ${formatNum(u.gold)} | 🏦 Bank: ${formatNum(u.bank)}`,
    `[ ⚔️ ] ATK: ${formatNum(stats.atk)} | 🛡️ DEF: ${formatNum(stats.def)} | 🍀 LUCK: ${formatNum(stats.luck)}`,
    '',
    `*▣ CORE COMMANDS ▣*`,
    `${usedPrefix}profile`,
    `${usedPrefix}daily | ${usedPrefix}weekly | ${usedPrefix}monthly`,
    `${usedPrefix}job <id> | ${usedPrefix}work`,
    `${usedPrefix}adventure | ${usedPrefix}explore`,
    `${usedPrefix}hunt | ${usedPrefix}fish | ${usedPrefix}mine | ${usedPrefix}chop | ${usedPrefix}dig | ${usedPrefix}forage`,
    `${usedPrefix}quest | ${usedPrefix}shop | ${usedPrefix}inventory`,
    `${usedPrefix}buy <id> <qty> | ${usedPrefix}sell <id> <qty>`,
    `${usedPrefix}use <id> <qty> | ${usedPrefix}open <crate_id>`,
    `${usedPrefix}craft | ${usedPrefix}upgrade <id> | ${usedPrefix}enchant <slot>`,
    `${usedPrefix}equip <id> | ${usedPrefix}unequip <slot>`,
    `${usedPrefix}heal | ${usedPrefix}train | ${usedPrefix}duel @user`,
    `${usedPrefix}rob @user | ${usedPrefix}pay @user <jumlah>`,
    `${usedPrefix}leaderboard`,
    `${usedPrefix}bank <jumlah> | ${usedPrefix}withdraw <jumlah>`,
    `${usedPrefix}dungeon | ${usedPrefix}boss`,
    `${usedPrefix}pet | ${usedPrefix}buypet <id> | ${usedPrefix}feedpet`,
    `${usedPrefix}settitle <judul>`,
    ``,
    `*▣ BUCIN / MARRIAGE ▣*`,
    `${usedPrefix}propose @user`,
    `${usedPrefix}date`,
    `${usedPrefix}divorce`
  ]

  switch (sub) {
    case 'rpg':
    case 'rpghelp':
    case 'help':
      await showList(conn, m, 'CYBER-RPG MENU', menu, 'Database: `rpgdatabase.json`')
      break

    case 'profile':
    case 'pf':
    case 'stats': {
      const eq = u.equipment || {}
      const pet = u.pet || {}
      const enc = u.enchant || { weapon: 0, armor: 0 }
      const partnerDisplay = u.partner ? `@${u.partner.split('@')[0]}` : 'Jomblo Ngenes'
      
      const eqText = [
        `⚔️ Weapon: ${eq.weapon ? (ITEM_CATALOG[eq.weapon]?.name || eq.weapon) : '-'} [+${enc.weapon}]`,
        `🛡️ Armor: ${eq.armor ? (ITEM_CATALOG[eq.armor]?.name || eq.armor) : '-'} [+${enc.armor}]`,
        `💍 Accessory: ${eq.accessory ? (ITEM_CATALOG[eq.accessory]?.name || eq.accessory) : '-'}`,
        `🐾 Pet: ${pet.owned ? (PETS.find(p => p.id === pet.owned)?.name || pet.owned) : '-'} (Lv.${pet.level || 1})`,
        `📈 Pet bonus: ${petBonusText(pet)}`
      ]
      
      const txt = [
        `╔═══『 ⚡ CYBER-PROFILE 』═══`,
        `╠ 👤 Nama: @${m.sender.split('@')[0]}`,
        `╠ 🎖️ Title: ${u.title}`,
        `╠ 💖 Pasangan: ${partnerDisplay}`,
        `╠ 🌐 Level: ${u.level}`,
        `╠ 💠 EXP: ${formatNum(u.exp)} / ${formatNum(levelNeed(u.level))}`,
        `╠ ❤️ HP: ${formatNum(u.hp)} / ${formatNum(stats.maxHp)}`,
        `╠ ⚔️ ATK: ${formatNum(stats.atk)} | 🛡️ DEF: ${formatNum(stats.def)} | 🍀 LUCK: ${formatNum(stats.luck)}`,
        `╠ 💰 Gold: ${formatNum(u.gold)} | 🏦 Bank: ${formatNum(u.bank)}`,
        `╠ ⚡ Energy: ${formatNum(u.energy)} | 🔋 Stamina: ${formatNum(u.stamina)}`,
        `╠ 💼 Job: ${u.job.toUpperCase()}`,
        `╠══════════════════════`,
        ...eqText.map(t => `╠ ${t}`),
        `╠══════════════════════`,
        `╠ 🎒 Total Jenis Item: ${Object.keys(u.items).length}`,
        `╚══════════════════════`
      ].join('\n')
      
      await conn.sendMessage(m.chat, { text: txt, mentions: u.partner ? [m.sender, u.partner] : [m.sender] }, { quoted: m })
      break
    }

    // ==========================================
    // SISTEM BUCIN / MARRIAGE BARU
    // ==========================================
    case 'propose':
    case 'lamar': {
      const target = m.mentionedJid?.[0] || args[0]
      const jid = target?.includes('@') ? target : null
      
      if (!jid) return replyText(conn, m, `[ ⚠️ ] Tag orang yang mau dilamar! Contoh: ${usedPrefix}propose @user`)
      if (jid === m.sender) return replyText(conn, m, `[ ⚠️ ] Masa nikah sama diri sendiri? Bangun woi.`)
      if (u.partner) return replyText(conn, m, `[ ⚠️ ] Lu udah punya pasangan! Jangan maruk.`)
      
      const targetUser = ensureUser(db, jid)
      if (targetUser.partner) return replyText(conn, m, `[ ⚠️ ] Dia udah punya pasangan. Jangan jadi pebinor/pelakor!`)
      if ((u.items['wedding_ring'] || 0) < 1) return replyText(conn, m, `[ ⚠️ ] Lu butuh 1x Wedding Ring buat melamar. Beli dulu di shop seharga 100K Gold! (.buy wedding_ring 1)`)
      
      u.items['wedding_ring'] -= 1
      u.partner = jid
      targetUser.partner = m.sender
      
      saveDb(db)
      await conn.sendMessage(m.chat, { text: `💖 *SAH! PERNIKAHAN CYBER* 💖\nSelamat! @${m.sender.split('@')[0]} dan @${jid.split('@')[0]} kini resmi menjadi pasangan!\nKetik ${usedPrefix}date untuk nge-date bareng pasanganmu.`, mentions: [m.sender, jid] }, { quoted: m })
      break
    }

    case 'divorce':
    case 'cerai': {
      if (!u.partner) return replyText(conn, m, `[ ⚠️ ] Lu aja jomblo, mau cerai sama siapa?`)
      const ex = u.partner
      const penalty = 50000
      
      if (u.gold < penalty) return replyText(conn, m, `[ ⚠️ ] Biaya sidang cerai adalah ${formatNum(penalty)} Gold. Lu miskin, ga mampu bayar pengacara!`)
      
      u.gold -= penalty
      if (db.users[ex]) db.users[ex].partner = ''
      u.partner = ''
      
      saveDb(db)
      await conn.sendMessage(m.chat, { text: `💔 *PENGADILAN AGAMA CYBER* 💔\n@${m.sender.split('@')[0]} telah resmi bercerai dengan @${ex.split('@')[0]}.\nBiaya persidangan: -${formatNum(penalty)} Gold.`, mentions: [m.sender, ex] }, { quoted: m })
      break
    }

    case 'date':
    case 'kencan': {
      if (!u.partner) return replyText(conn, m, `[ ⚠️ ] Lu jomblo, mau nge-date sama sabun? Cari pasangan dulu pake .propose`)
      if (!canUseCooldown(u, 'date')) return replyText(conn, m, `[ ⚠️ ] Pasangan lu masih capek habis jalan-jalan. Bisa nge-date lagi dalam: ${msToClock(cdLeft(u, 'date'))}`)
      if (u.energy < 20) return replyText(conn, m, `[ ⚠️ ] Energy lu ga cukup buat jalan-jalan (Butuh 20).`)
      
      u.energy -= 20
      
      // Healing pasangan lu sampe full
      const partnerUser = db.users[u.partner]
      if (partnerUser) {
         partnerUser.energy = 100
         partnerUser.stamina = 100
         partnerUser.hp = partnerUser.maxHp || 100
      }
      
      const goldBonus = rand(5000, 15000)
      const expBonus = rand(1000, 3000)
      
      u.gold += goldBonus
      u.exp += expBonus
      
      cooldown(u, 'date', 12 * 60 * 60 * 1000) // Cooldown nge-date 12 Jam
      saveDb(db)
      
      await conn.sendMessage(m.chat, { text: `💕 *NGE-DATE ROMANTIS* 💕\nKamu dan @${u.partner.split('@')[0]} pergi jalan-jalan mengelilingi Cyber City!\n\nKekuatan cinta menghasilkan keajaiban:\n💰 +${formatNum(goldBonus)} Gold (Uang Saku Couple)\n💠 +${formatNum(expBonus)} EXP Manajer\n🔋 *Semua status pasanganmu (HP, Energy, Stamina) pulih 100%!*`, mentions: [u.partner] }, { quoted: m })
      break
    }

    // ==========================================
    // EXISTING RPG COMMANDS (UNALTERED)
    // ==========================================

    case 'daily': {
      if (!canUseCooldown(u, 'daily')) return replyText(conn, m, `[ ⚠️ ] Daily belum siap. Sisa: ${msToClock(cdLeft(u, 'daily'))}`)
      const gold = rand(1000, 2000) + u.level * 50
      const exp = rand(200, 400) + u.level * 20
      const item = Math.random() < 0.5 ? 'potion' : pick(['energy_drink', 'hi_potion', 'luck_tonic', 'pet_food'])
      u.gold += gold
      gainExp(u, exp)
      addItem(u, item, 1)
      addItem(u, 'crate_wood', 1) // Bonus crate
      u.stats.dailyClaim++
      setCooldown(u, 'daily', 24 * 60 * 60 * 1000)
      saveDb(db)
      await replyText(conn, m, `✅ *DAILY CLAIM*\n+${formatNum(gold)} Gold\n+${formatNum(exp)} EXP\n+1 ${ITEM_CATALOG[item].name}\n+1 Wood Crate 🎁`)
      break
    }

    case 'weekly': {
      if (!canUseCooldown(u, 'weekly')) return replyText(conn, m, `[ ⚠️ ] Weekly belum siap. Sisa: ${msToClock(cdLeft(u, 'weekly'))}`)
      const gold = rand(8000, 15000) + u.level * 150
      const exp = rand(1500, 3000) + u.level * 60
      const items = ['hi_potion', 'elixir', 'crate_iron', pick(['weapon_4_1', 'armor_4_1', 'acc_4_1'])]
      u.gold += gold
      gainExp(u, exp)
      for (const id of items) addItem(u, id, 1)
      u.stats.weeklyClaim++
      setCooldown(u, 'weekly', 7 * 24 * 60 * 60 * 1000)
      saveDb(db)
      await replyText(conn, m, `✅ *WEEKLY CLAIM*\n+${formatNum(gold)} Gold\n+${formatNum(exp)} EXP\n+Iron Crate & Random Gear 🎁`)
      break
    }

    case 'monthly': {
      if (!canUseCooldown(u, 'monthly')) return replyText(conn, m, `[ ⚠️ ] Monthly belum siap. Sisa: ${msToClock(cdLeft(u, 'monthly'))}`)
      const gold = rand(30000, 50000) + u.level * 400
      const exp = rand(5000, 10000) + u.level * 150
      const rewards = ['mega_potion', 'elixir', 'crate_gold', 'crate_neon', pick(['weapon_6_1', 'armor_6_1', 'cybercore'])]
      u.gold += gold
      gainExp(u, exp)
      for (const id of rewards) addItem(u, id, 1)
      u.stats.monthlyClaim++
      setCooldown(u, 'monthly', 30 * 24 * 60 * 60 * 1000)
      saveDb(db)
      await replyText(conn, m, `✅ *MONTHLY CLAIM*\n+${formatNum(gold)} Gold\n+${formatNum(exp)} EXP\n+Gold Crate, Neon Crate & Premium Items 🎁`)
      break
    }

    case 'job': {
      const wanted = (args[0] || '').toLowerCase()
      if (!wanted) return showList(conn, m, 'DAFTAR JOB', JOBS.map(v => `${v.id} — ${v.name}`), `Pilih: ${usedPrefix}job <id>`)
      const job = JOBS.find(v => v.id === wanted)
      if (!job) return replyText(conn, m, '[ ⚠️ ] Job tidak ditemukan.')
      u.job = job.id
      saveDb(db)
      await replyText(conn, m, `✅ Job diganti ke *${job.name}*`)
      break
    }

    case 'work': {
      if (!canUseCooldown(u, 'work')) return replyText(conn, m, `[ ⚠️ ] Kerja belum siap. Sisa: ${msToClock(cdLeft(u, 'work'))}`)
      if (u.energy < 10) return replyText(conn, m, '[ ⚠️ ] Energy kurang. Pakai item atau .rest')
      const job = JOBS.find(v => v.id === u.job) || pick(JOBS)
      u.energy -= 10
      const gold = rand(job.pay[0], job.pay[1]) + u.level * 20
      const exp = rand(job.exp[0], job.exp[1])
      u.gold += gold
      gainExp(u, exp)
      u.stats.work++
      cooldown(u, 'work', 30 * 60 * 1000)
      saveDb(db)
      await replyText(conn, m, `🧰 Kamu bekerja sebagai *${job.name}*\n+${formatNum(gold)} Gold\n+${formatNum(exp)} EXP`)
      break
    }

    case 'adventure':
    case 'adv':
    case 'explore': {
      if (!canUseCooldown(u, 'adventure')) return replyText(conn, m, `[ ⚠️ ] Adventure cooldown: ${msToClock(cdLeft(u, 'adventure'))}`)
      if (u.energy < 20) return replyText(conn, m, '[ ⚠️ ] Energy kurang.')
      const biome = pick(BIOMES)
      const monster = pick(MONSTERS.filter(v => v.biome === biome.name))
      const enemy = {
        name: monster.name,
        hp: monster.hp + rand(0, 30),
        atk: monster.atk + rand(0, 6),
        def: monster.def + rand(0, 4)
      }
      u.energy -= 20
      const result = enemyFight(enemy, u)
      if (result.win) {
        const loot = randomLoot('adventure', biome.lv)
        giveRandomLoot(u, loot)
        u.stats.monsters++
        u.stats.adventure++
        u.gold += rand(60, 180)
        await replyText(conn, m, `🗺️ *ADVENTURE SUCCESS* [${biome.name}]\nMusuh: ${monster.name} dibasmi!\n+${formatNum(loot.gold)} Gold\n+${formatNum(loot.exp)} EXP`)
      } else {
        u.hp = Math.max(1, Math.floor(u.hp * 0.55))
        u.stats.adventure++
        await replyText(conn, m, `☠️ *ADVENTURE FAILED* [${biome.name}]\nDikalahkan oleh: ${monster.name}\nSisa HP: ${formatNum(u.hp)}`)
      }
      cooldown(u, 'adventure', 20 * 60 * 1000)
      saveDb(db)
      break
    }

    case 'hunt':
    case 'fish':
    case 'mine':
    case 'chop':
    case 'dig':
    case 'forage': {
      const energyCost = { hunt: 14, fish: 10, mine: 14, chop: 12, dig: 13, forage: 9 }
      if (!canUseCooldown(u, sub)) return replyText(conn, m, `[ ⚠️ ] ${sub} cooldown: ${msToClock(cdLeft(u, sub))}`)
      if (u.energy < (energyCost[sub] || 10)) return replyText(conn, m, '[ ⚠️ ] Energy kurang.')
      u.energy -= energyCost[sub] || 10
      const loot = randomLoot(sub, Math.max(1, u.level))
      giveRandomLoot(u, loot)
      u.stats[sub]++
      cooldown(u, sub, 10 * 60 * 1000)
      saveDb(db)
      await replyText(conn, m, `✅ *${sub.toUpperCase()} SUCCESS*\n+${formatNum(loot.gold)} Gold\n+${formatNum(loot.exp)} EXP`)
      break
    }

    case 'quest':
    case 'quests': {
      if ((args[0] || '').toLowerCase() === 'claim') {
        const qid = args[1]
        const q = QUESTS.find(v => v.id === qid)
        if (!q) return replyText(conn, m, '[ ⚠️ ] Quest tidak ditemukan.')
        const ck = `quest_${qid}`
        if (!canUseCooldown(u, ck)) return replyText(conn, m, `[ ⚠️ ] Quest cooldown: ${msToClock(cdLeft(u, ck))}`)
        const gold = q.gold + rand(20, 60)
        const exp = q.exp + rand(10, 30)
        u.gold += gold
        gainExp(u, exp)
        if (q.item) addItem(u, q.item, 1)
        u.stats.quest++
        cooldown(u, ck, 12 * 60 * 60 * 1000)
        saveDb(db)
        await replyText(conn, m, `🎯 *QUEST CLEARED: ${q.name}*\n+${formatNum(gold)} Gold\n+${formatNum(exp)} EXP${q.item ? `\n+1 ${ITEM_CATALOG[q.item]?.name || q.item}` : ''}`)
        break
      }
      const list = QUESTS.filter(v => v.level <= u.level + 3).slice(0, 15).map(v => `${v.id} | Lv.${v.level} | ${v.name} | [${v.type} x${v.need}] | ${formatNum(v.gold)}g`)
      await showList(conn, m, 'QUEST AVAILABLE', list, `Claim: ${usedPrefix}quest claim <id>`)
      break
    }

    case 'inventory':
    case 'inv':
    case 'bag': {
      const itemLines = Object.entries(u.items)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .slice(0, 50)
        .map(([id, qty]) => `${ITEM_CATALOG[id]?.name || id} x${formatNum(qty)}`)
      await showList(conn, m, 'CYBER-INVENTORY', [
        `💰 Gold: ${formatNum(u.gold)}`,
        `🏦 Bank: ${formatNum(u.bank)}`,
        `⚡ Energy: ${formatNum(u.energy)}`,
        `🔋 Stamina: ${formatNum(u.stamina)}`,
        '-------------------------',
        ...(itemLines.length ? itemLines : ['[ Kosong ]'])
      ], `Total jenis item: ${Object.keys(u.items).length}`)
      break
    }

    case 'shop': {
      const page = Math.max(1, Number(args[0]) || 1)
      const items = shopList(page).map(v => `${v.id} | ${v.name} | ${formatNum(v.price)}g | [${v.type}]`)
      await showList(conn, m, `CYBER-SHOP [PAGE ${page}]`, items, `Beli: ${usedPrefix}buy <id> <qty>`)
      break
    }

    case 'buy': {
      const id = args[0]
      const qty = Math.max(1, Number(args[1]) || 1)
      const item = ITEM_CATALOG[id]
      if (!item) return replyText(conn, m, '[ ⚠️ ] Item tidak ditemukan.')
      const price = Math.max(1, Math.floor(item.price * qty))
      if (u.gold < price) return replyText(conn, m, `[ ⚠️ ] Gold kurang. Butuh ${formatNum(price)} Gold`)
      u.gold -= price
      addItem(u, id, qty)
      u.stats.bought += qty
      saveDb(db)
      await replyText(conn, m, `🛒 *PEMBELIAN SUKSES*\nBarang: ${qty}x ${item.name}\nBiaya: -${formatNum(price)} Gold`)
      break
    }

    case 'sell': {
      const id = args[0]
      const qty = Math.max(1, Number(args[1]) || 1)
      const item = ITEM_CATALOG[id]
      if (!item) return replyText(conn, m, '[ ⚠️ ] Item tidak ditemukan.')
      if ((u.items[id] || 0) < qty) return replyText(conn, m, '[ ⚠️ ] Item tidak cukup di inventory.')
      const gain = Math.max(1, Math.floor(item.price * 0.55 * qty))
      removeItem(u, id, qty)
      u.gold += gain
      u.stats.sold += qty
      saveDb(db)
      await replyText(conn, m, `💵 *PENJUALAN SUKSES*\nBarang: ${qty}x ${item.name}\nUntung: +${formatNum(gain)} Gold`)
      break
    }

    case 'use': {
      const id = args[0]
      const qty = Math.max(1, Number(args[1]) || 1)
      const item = ITEM_CATALOG[id]
      if (!item) return replyText(conn, m, '[ ⚠️ ] Item tidak ditemukan.')
      if ((u.items[id] || 0) < qty) return replyText(conn, m, '[ ⚠️ ] Item tidak cukup.')
      if (item.type === 'crate') return replyText(conn, m, `[ ⚠️ ] Gunakan command *${usedPrefix}open ${id}* untuk buka crate.`)
      
      for (let i = 0; i < qty; i++) {
        if (item.heal === 'full') u.hp = stats.maxHp
        else if (item.heal) u.hp = Math.min(stats.maxHp, u.hp + item.heal)
        if (item.energy) u.energy = Math.min(100, u.energy + item.energy)
        if (item.stamina) u.stamina = Math.min(100, u.stamina + item.stamina)
        if (item.petFood) {
          u.pet.hunger = Math.min(100, (u.pet.hunger || 0) + item.petFood)
          u.pet.mood = Math.min(100, (u.pet.mood || 0) + 5)
        }
        if (item.buff?.luck) u.luck += item.buff.luck
        if (item.buff?.def) u.def += item.buff.def
        if (item.buff?.exp) u.xpBoost = now() + (item.buff.turns || 1) * 60 * 60 * 1000
        if (item.buff?.gold) u.goldBoost = now() + (item.buff.turns || 1) * 60 * 60 * 1000
        if (item.reduceCd) reduceCd(u, item.reduceCd)
      }
      removeItem(u, id, qty)
      saveDb(db)
      await replyText(conn, m, `💊 *MENGGUNAKAN ITEM*\nMemakai ${qty}x ${item.name}`)
      break
    }

    case 'open':
    case 'gacha': {
      const id = args[0]
      const item = ITEM_CATALOG[id]
      if (!item || item.type !== 'crate') return replyText(conn, m, '[ ⚠️ ] Crate tidak valid. Cek id di inventory.')
      if ((u.items[id] || 0) < 1) return replyText(conn, m, `[ ⚠️ ] Kamu tidak memiliki ${item.name}. Beli di shop!`)
      
      removeItem(u, id, 1)
      const drops = []
      const pulls = rand(2, 5)
      for(let i=0; i<pulls; i++) {
         const dropId = pick(item.drops)
         const qty = rand(1, 3)
         addItem(u, dropId, qty)
         drops.push(`${ITEM_CATALOG[dropId]?.name || dropId} x${qty}`)
      }
      saveDb(db)
      await replyText(conn, m, `🎁 *MEMBUKA ${item.name.toUpperCase()}*\n\nMendapatkan:\n${drops.map(d => `• ${d}`).join('\n')}`)
      break
    }

    case 'enchant': {
      const slot = args[0]
      if (!['weapon', 'armor'].includes(slot)) return replyText(conn, m, '[ ⚠️ ] Format: .enchant weapon atau .enchant armor')
      const targetEq = u.equipment[slot]
      if (!targetEq) return replyText(conn, m, `[ ⚠️ ] Kamu tidak memakai ${slot} apapun. Equip dulu!`)
      
      const currentEnchant = u.enchant[slot] || 0
      if (currentEnchant >= 15) return replyText(conn, m, '[ ⚠️ ] Item ini sudah mencapai level MAX ENCHANT (+15).')
      
      const costCrystal = (currentEnchant + 1) * 2
      const costGem = Math.floor(currentEnchant / 2)
      const costGold = (currentEnchant + 1) * 2000

      if ((u.items['crystal'] || 0) < costCrystal || (u.items['gem'] || 0) < costGem || u.gold < costGold) {
        return replyText(conn, m, `[ ⚠️ ] Bahan kurang!\nButuh: ${costCrystal} Crystal, ${costGem} Gem, ${formatNum(costGold)} Gold.`)
      }

      removeItem(u, 'crystal', costCrystal)
      if (costGem > 0) removeItem(u, 'gem', costGem)
      u.gold -= costGold

      const successRate = Math.max(20, 100 - (currentEnchant * 5))
      const roll = rand(1, 100)

      if (roll <= successRate) {
        u.enchant[slot] += 1
        saveDb(db)
        await replyText(conn, m, `✨ *ENCHANT BERHASIL!* ✨\n${ITEM_CATALOG[targetEq].name} kamu naik menjadi +${u.enchant[slot]}\nStatus meningkat!`)
      } else {
        saveDb(db)
        await replyText(conn, m, `💥 *ENCHANT GAGAL!* 💥\nBahan hangus, level enchant tetap +${u.enchant[slot]}.`)
      }
      break
    }

    case 'craft': {
      const recipes = [
        { id: 'potion', need: { herb: 2, berry: 1 }, gold: 0, out: 1, desc: '2 herb + 1 berry' },
        { id: 'hi_potion', need: { herb: 4, crystal: 1 }, gold: 50, out: 1, desc: '4 herb + 1 crystal + 50 gold' },
        { id: 'energy_drink', need: { fish: 2, berry: 2 }, gold: 30, out: 1, desc: '2 fish + 2 berry + 30 gold' },
        { id: 'mega_potion', need: { herb: 6, crystal: 2, pearl: 1 }, gold: 150, out: 1, desc: '6 herb + 2 crystal + 1 pearl + 150 gold' },
        { id: 'weapon_1_1', need: { wood: 5, stone: 3 }, gold: 80, out: 1, desc: '5 wood + 3 stone + 80 gold' },
        { id: 'armor_1_1', need: { hide: 4, stone: 2 }, gold: 80, out: 1, desc: '4 hide + 2 stone + 80 gold' },
        { id: 'acc_1_1', need: { pearl: 1, shell: 2 }, gold: 120, out: 1, desc: '1 pearl + 2 shell + 120 gold' },
        { id: 'shield_scroll', need: { crystal: 2, tablet: 1 }, gold: 220, out: 1, desc: '2 crystal + 1 tablet + 220 gold' },
        { id: 'crate_wood', need: { wood: 10, stone: 5 }, gold: 100, out: 1, desc: '10 wood + 5 stone + 100 gold' },
        { id: 'cybercore', need: { obsidian: 2, voidcore: 1, neonshard: 2 }, gold: 5000, out: 1, desc: '2 obsidian + 1 voidcore + 2 neonshard + 5000 gold' }
      ]
      if (!args[0] || args[0] === 'list') {
        return showList(conn, m, 'CRAFT RECIPES', recipes.map(v => `${v.id} => [ ${v.desc} ]`), `Craft: ${usedPrefix}craft <id>`)
      }
      const recipe = recipes.find(v => v.id === args[0])
      if (!recipe) return replyText(conn, m, '[ ⚠️ ] Recipe tidak ditemukan.')
      if (!requirementsMet(u, recipe.need)) return replyText(conn, m, '[ ⚠️ ] Bahan crafting kurang.')
      if (u.gold < recipe.gold) return replyText(conn, m, `[ ⚠️ ] Gold kurang. Butuh ${formatNum(recipe.gold)} Gold`)
      consumeRequirements(u, recipe.need)
      u.gold -= recipe.gold
      addItem(u, recipe.id, recipe.out)
      u.stats.crafted += recipe.out
      saveDb(db)
      await replyText(conn, m, `🛠️ *CRAFT SUKSES*\nDibuat: ${ITEM_CATALOG[recipe.id]?.name || recipe.id} x${recipe.out}`)
      break
    }

    case 'upgrade': {
      const id = args[0]
      const item = ITEM_CATALOG[id]
      if (!item || !u.items[id]) return replyText(conn, m, '[ ⚠️ ] Item yang mau di-upgrade tidak ada di inventory.')
      const cost = 200 + (item.price || 100)
      if (u.gold < cost) return replyText(conn, m, `[ ⚠️ ] Gold kurang. Butuh ${formatNum(cost)} Gold`)
      u.gold -= cost
      if (item.atk) item.atk += 1
      if (item.def) item.def += 1
      if (item.luck) item.luck += 1
      saveDb(db)
      await replyText(conn, m, `⬆️ *UPGRADE SUKSES*\nItem: ${item.name}\nBiaya: -${formatNum(cost)} Gold`)
      break
    }

    case 'equip': {
      const id = args[0]
      const item = ITEM_CATALOG[id]
      if (!item || !u.items[id]) return replyText(conn, m, '[ ⚠️ ] Item tidak ada di inventory.')
      if (!['weapon', 'armor', 'accessory'].includes(item.type)) return replyText(conn, m, '[ ⚠️ ] Item ini bukan gear yang bisa di-equip.')
      u.equipment[item.type] = id
      saveDb(db)
      await replyText(conn, m, `🛡️ *EQUIPPED*\nMemakai ${item.name} pada slot ${item.type.toUpperCase()}`)
      break
    }

    case 'unequip': {
      const slot = args[0]
      if (!['weapon', 'armor', 'accessory'].includes(slot)) return replyText(conn, m, '[ ⚠️ ] Slot: weapon / armor / accessory')
      u.equipment[slot] = null
      saveDb(db)
      await replyText(conn, m, `🛡️ *UNEQUIPPED*\nSlot ${slot.toUpperCase()} berhasil dilepas.`)
      break
    }

    case 'heal':
    case 'rest': {
      const cost = 100
      if (u.gold < cost) return replyText(conn, m, `[ ⚠️ ] Butuh ${formatNum(cost)} Gold ke rumah sakit.`)
      u.gold -= cost
      u.hp = stats.maxHp
      u.energy = Math.min(100, u.energy + 25)
      u.stamina = Math.min(100, u.stamina + 25)
      saveDb(db)
      await replyText(conn, m, `🏥 *RECOVERY SUKSES*\nHP, Energy, Stamina pulih.\nBiaya: -${formatNum(cost)} Gold`)
      break
    }

    case 'train': {
      const cost = 500
      if (u.gold < cost) return replyText(conn, m, `[ ⚠️ ] Gold kurang. Butuh ${formatNum(cost)} Gold untuk masuk Gym.`)
      u.gold -= cost
      gainExp(u, rand(100, 250))
      u.atk += 1
      u.def += 1
      u.maxHp += 5
      u.hp = stats.maxHp
      saveDb(db)
      await replyText(conn, m, `🏋️ *TRAINING SELESAI*\nStat dasar meningkat permanen!`)
      break
    }

    case 'duel':
    case 'battle': {
      const target = m.mentionedJid?.[0] || args[0]
      const jid = target?.includes('@') ? target : null
      if (!jid) return replyText(conn, m, `[ ⚠️ ] Tag lawan. Contoh: ${usedPrefix}duel @user`)
      if (jid === m.sender) return replyText(conn, m, '[ ⚠️ ] Jangan duel sama diri sendiri.')
      const enemy = ensureUser(db, jid)
      const enemyStats = statsNow(enemy)
      const fight = enemyFight({ name: 'Player', hp: enemyStats.maxHp, atk: enemyStats.atk, def: enemyStats.def }, u)
      if (fight.win) {
        const steal = Math.min(enemy.gold || 0, rand(100, 500))
        enemy.gold -= steal
        u.gold += steal + rand(100, 300)
        u.stats.duelWin++
        enemy.stats.duelLose++
        gainExp(u, 150)
        await replyText(conn, m, `⚔️ *DUEL DIMENANGKAN!*\nKamu mengalahkan target dan merampas ${formatNum(steal)} Gold!`)
      } else {
        const loss = rand(50, 200)
        u.gold = Math.max(0, u.gold - loss)
        u.stats.duelLose++
        enemy.stats.duelWin++
        await replyText(conn, m, `💀 *DUEL KALAH!*\nKamu dihajar habis-habisan dan kehilangan ${formatNum(loss)} Gold.`)
      }
      saveDb(db)
      break
    }

    case 'rob':
    case 'begal': {
      if (!canUseCooldown(u, 'rob')) return replyText(conn, m, `🚨 Buronan polisi! Sembunyi dulu selama: ${msToClock(cdLeft(u, 'rob'))}`)
      const target = m.mentionedJid?.[0] || args[0]
      const jid = target?.includes('@') ? target : null
      if (!jid) return replyText(conn, m, `[ ⚠️ ] Tag target yang mau dibegal. Contoh: ${usedPrefix}rob @user`)
      if (jid === m.sender) return replyText(conn, m, '[ ⚠️ ] Gila ya ngerampok diri sendiri.')
      
      const enemy = ensureUser(db, jid)
      if (enemy.gold < 1000) return replyText(conn, m, '[ ⚠️ ] Target miskin, ga ada yang bisa dirampok.')

      const successRate = 40 + (u.luck * 0.5)
      const roll = rand(1, 100)

      if (roll <= successRate) {
        const stolen = Math.floor(enemy.gold * rand(5, 15) / 100)
        enemy.gold -= stolen
        u.gold += stolen
        u.stats.rob++
        cooldown(u, 'rob', 60 * 60 * 1000) // 1 Jam CD
        saveDb(db)
        await replyText(conn, m, `🥷 *BEGAL SUKSES!*\nKamu berhasil merampok ${formatNum(stolen)} Gold dari target!`)
      } else {
        const penalty = Math.floor(u.gold * 0.1)
        u.gold = Math.max(0, u.gold - penalty)
        cooldown(u, 'rob', 3 * 60 * 60 * 1000) // 3 Jam masuk penjara
        saveDb(db)
        await replyText(conn, m, `🚔 *BEGAL GAGAL!*\nKamu ditangkap Cyber-Police! Didenda ${formatNum(penalty)} Gold dan dipenjara 3 Jam.`)
      }
      break
    }

    case 'pay':
    case 'transfer': {
      const target = m.mentionedJid?.[0] || args[0]
      const jid = target?.includes('@') ? target : null
      const amount = Math.floor(Number(args[1]))
      
      if (!jid) return replyText(conn, m, `[ ⚠️ ] Tag penerima. Contoh: ${usedPrefix}pay @user 5000`)
      if (isNaN(amount) || amount <= 0) return replyText(conn, m, '[ ⚠️ ] Jumlah Gold tidak valid.')
      if (u.gold < amount) return replyText(conn, m, '[ ⚠️ ] Gold kamu tidak cukup untuk transfer.')
      if (jid === m.sender) return replyText(conn, m, '[ ⚠️ ] Tidak bisa transfer ke diri sendiri.')

      const enemy = ensureUser(db, jid)
      u.gold -= amount
      enemy.gold += amount
      saveDb(db)
      await replyText(conn, m, `💸 *TRANSFER SUKSES*\nMengirim ${formatNum(amount)} Gold ke @${jid.split('@')[0]}`, { mentions: [jid] })
      break
    }

    case 'leaderboard':
    case 'top': {
      const list = Object.entries(db.users)
        .map(([jid, x]) => ({ jid, level: x.level || 1, gold: x.gold || 0, exp: x.exp || 0 }))
        .sort((a, b) => (b.level - a.level) || (b.exp - a.exp))
        .slice(0, 10)
      
      const txt = [
        `╔═══『 🏆 CYBER-LEADERBOARD 』═══`,
        ...list.map((v, i) => `╠ ${i + 1}. @${v.jid.split('@')[0]}\n╠ ↳ Lv.${v.level} | 💰 ${formatNum(v.gold)} Gold`),
        `╚═════════════════════════`
      ].join('\n')

      await conn.sendMessage(m.chat, { text: txt, mentions: list.map(v => v.jid) }, { quoted: m })
      break
    }

    case 'bank':
    case 'deposit': {
      const amount = Number(args[0]) || 0
      if (amount <= 0) return replyText(conn, m, `[ ⚠️ ] Format: ${usedPrefix}bank <jumlah>`)
      if (u.gold < amount) return replyText(conn, m, '[ ⚠️ ] Gold kamu tidak cukup.')
      u.gold -= amount
      u.bank += amount
      saveDb(db)
      await replyText(conn, m, `🏦 *DEPOSIT SUKSES*\nMenyimpan ${formatNum(amount)} Gold ke bank.`)
      break
    }

    case 'withdraw': {
      const amount = Number(args[0]) || 0
      if (amount <= 0) return replyText(conn, m, `[ ⚠️ ] Format: ${usedPrefix}withdraw <jumlah>`)
      if (u.bank < amount) return replyText(conn, m, '[ ⚠️ ] Saldo bank tidak cukup.')
      u.bank -= amount
      u.gold += amount
      saveDb(db)
      await replyText(conn, m, `🏦 *WITHDRAW SUKSES*\nMenarik ${formatNum(amount)} Gold dari bank.`)
      break
    }

    case 'settitle': {
      const title = args.join(' ').trim()
      if (!title) return replyText(conn, m, `[ ⚠️ ] Format: ${usedPrefix}settitle <judul>`)
      u.title = title.slice(0, 24)
      saveDb(db)
      await replyText(conn, m, `✅ Title diubah jadi: *[ ${u.title} ]*`)
      break
    }

    case 'dungeon': {
      if (!canUseCooldown(u, 'dungeon')) return replyText(conn, m, `[ ⚠️ ] Dungeon cooldown: ${msToClock(cdLeft(u, 'dungeon'))}`)
      if (u.energy < 25) return replyText(conn, m, '[ ⚠️ ] Energy kurang.')
      u.energy -= 25
      const stage = rand(1, 10)
      const enemy = {
        name: `Cyber Guardian Stage ${stage}`,
        hp: 300 + stage * 100 + u.level * 15,
        atk: 25 + stage * 8 + u.level * 3,
        def: 10 + stage * 4 + Math.floor(u.level / 3)
      }
      const fight = enemyFight(enemy, u)
      if (fight.win) {
        const gold = rand(1000, 3000) + stage * 400
        const exp = rand(800, 1500) + stage * 200
        u.gold += gold
        gainExp(u, exp)
        addItem(u, pick(['crystal', 'gem', 'relic', 'cybercore', 'amber', 'tablet']), 1)
        if (stage >= 8) addItem(u, 'crate_gold', 1) 
        u.stats.dungeon++
        await replyText(conn, m, `🏰 *DUNGEON CLEARED!*\nStage: ${stage}\n+${formatNum(gold)} Gold\n+${formatNum(exp)} EXP\nItem ditambahkan ke inventory.`)
      } else {
        u.hp = Math.max(1, Math.floor(u.hp * 0.3))
        await replyText(conn, m, `💥 *DUNGEON FAILED!*\nStage: ${stage}\nSistem melemparmu keluar. Sisa HP: ${formatNum(u.hp)}`)
      }
      cooldown(u, 'dungeon', 45 * 60 * 1000)
      saveDb(db)
      break
    }

    case 'boss': {
      const boss = ensureWorld(db).boss
      if (!boss.active || boss.hp <= 0) return replyText(conn, m, '[ ⚠️ ] Boss World sedang tidak aktif. Tunggu reset harian.')
      if (u.energy < 30) return replyText(conn, m, '[ ⚠️ ] Energy kurang.')
      u.energy -= 30
      const dmg = rand(u.level * 30, u.level * 60) + stats.atk * 3
      boss.hp = Math.max(0, boss.hp - dmg)
      u.stats.boss++
      if (boss.hp <= 0) {
        const gold = boss.rewardGold
        const exp = boss.rewardExp
        u.gold += gold
        gainExp(u, exp)
        addItem(u, pick(['voidcore', 'darkessence', 'fracture', 'lightshard', 'plasma']), 2)
        addItem(u, 'crate_neon', 1)
        boss.active = false
        saveDb(db)
        return replyText(conn, m, `👑 *WORLD BOSS DEFEATED!*\nDamage Fatal: ${formatNum(dmg)}\nSemua pemain bisa bernafas lega.\nReward: +${formatNum(gold)} Gold, +Neon Crate 🎁`)
      }
      saveDb(db)
      await replyText(conn, m, `⚔️ *BOSS RAID*\nKamu menyerang bos!\nDamage: ${formatNum(dmg)}\nSisa HP Bos: ${formatNum(boss.hp)} / ${formatNum(boss.maxHp)}`)
      break
    }

    case 'pet': {
      const pet = u.pet || {}
      const owned = PETS.find(p => p.id === pet.owned)
      await showList(conn, m, 'PET SYSTEM', [
        `🐾 Pet: ${owned ? owned.name : '[ Belum Punya ]'}`,
        `📈 Level: ${pet.level || 1}`,
        `💠 EXP: ${formatNum(pet.exp || 0)} / 100`,
        `🍗 Hunger: ${formatNum(pet.hunger || 0)} / 100`,
        `🎭 Mood: ${formatNum(pet.mood || 0)} / 100`,
        `✨ Bonus Stat: ${petBonusText(pet)}`
      ], `Beli: ${usedPrefix}buypet <id> | Kasih makan: ${usedPrefix}feedpet`)
      break
    }

    case 'buypet': {
      const id = (args[0] || '').toLowerCase()
      if (!id) return showList(conn, m, 'PET SHOP', PETS.map(v => `${v.id} — ${v.name} | ${formatNum(v.price)}g`), `Beli: ${usedPrefix}buypet <id>`)
      const pet = PETS.find(p => p.id === id)
      if (!pet) return replyText(conn, m, '[ ⚠️ ] Pet tidak ditemukan.')
      if (u.pet?.owned) return replyText(conn, m, '[ ⚠️ ] Kamu sudah memiliki Pet. Jual yang lama jika ingin ganti.')
      if (u.gold < pet.price) return replyText(conn, m, `[ ⚠️ ] Gold kurang. Butuh ${formatNum(pet.price)} Gold`)
      u.gold -= pet.price
      u.pet = { owned: pet.id, hunger: 100, mood: 100, exp: 0, level: 1 }
      saveDb(db)
      await replyText(conn, m, `🐾 *PET ADOPTED!*\nKamu resmi mengadopsi ${pet.name}`)
      break
    }

    case 'feedpet': {
      if (!u.pet?.owned) return replyText(conn, m, '[ ⚠️ ] Kamu belum punya pet.')
      let foodType = 'pet_food'
      let feedVal = 25
      let moodVal = 15
      let expVal = 10

      if ((u.items['premium_pet_food'] || 0) > 0) {
         foodType = 'premium_pet_food'
         feedVal = 100
         moodVal = 50
         expVal = 30
      } else if ((u.items['pet_food'] || 0) < 1) {
         return replyText(conn, m, '[ ⚠️ ] Tidak ada makanan pet di inventory.')
      }

      removeItem(u, foodType, 1)
      u.pet.hunger = Math.min(100, (u.pet.hunger || 0) + feedVal)
      u.pet.mood = Math.min(100, (u.pet.mood || 0) + moodVal)
      u.pet.exp = (u.pet.exp || 0) + expVal
      
      let lvlUpTxt = ''
      if (u.pet.exp >= 100) {
        u.pet.exp -= 100
        u.pet.level = (u.pet.level || 1) + 1
        lvlUpTxt = `\n🎉 Pet kamu naik ke Level ${u.pet.level}!`
      }
      u.stats.pet++
      saveDb(db)
      await replyText(conn, m, `🍗 *PET FED*\nMemberi makan menggunakan ${ITEM_CATALOG[foodType].name}\nHunger: ${u.pet.hunger}/100 | Mood: ${u.pet.mood}/100${lvlUpTxt}`)
      break
    }

    default:
      break
  }
}

handler.help = ['rpg']
handler.tags = ['rpg']
handler.command = /^(rpg|rpghelp|help|profile|pf|stats|daily|weekly|monthly|work|job|adventure|adv|explore|hunt|fish|fishing|mine|chop|dig|forage|quest|quests|inventory|inv|bag|shop|buy|sell|use|open|gacha|craft|upgrade|enchant|equip|unequip|heal|rest|train|duel|battle|rob|begal|pay|transfer|leaderboard|top|bank|deposit|withdraw|settitle|dungeon|boss|pet|buypet|feedpet|propose|lamar|divorce|cerai|date|kencan)$/i
handler.limit = false
handler.register = false

export default handler
