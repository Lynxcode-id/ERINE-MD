/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx
 * ─────────────────────────
 * 📝 Plugin: Virtual Gacha Oshi JKT48 (Gen 7 - Newest)
 */

let handler = async (m, { conn }) => {
    let members = [
        // Gen 7
        "Freya", "Christy", "Muthe", "Olla",
        // Gen 8
        "Adel", "Fiony", "Flora", "Lulu", "Oniel",
        // Gen 9
        "Indah", "Kathrina", "Marsha",
        // Gen 10
        "Amanda", "Callie", "Ella", "Indira", "Jessi", "Lia", "Lyn", "Raisha",
        // Gen 11
        "Alya", "Anindya", "Cathy", "Chelsea", "Cynthia", "Danella", "Daisy", "Gendis", "Gracie", "Greesel", "Michie",
        // Gen 12
        "Aralie", "Delynn", "Fritzy", "Kimmy", "Lana", "Levi", "Nayla", "Oline", "Regie", "Ribka", "Shasa", "Trisha"
    ]
    
    let rarities = [
        { tier: '⬜ [C] COMMON', chance: 50 },
        { tier: '🟦 [R] RARE', chance: 30 },
        { tier: '🟪 [SR] SUPER RARE', chance: 15 },
        { tier: '🟨 [UR] SIBER-NEON ULTRA RARE ✨', chance: 5 }
    ]

    await m.react('🌀')

    let roll = Math.random() * 100
    let cumulative = 0
    let selectedRarity = rarities[0].tier
    
    for (let r of rarities) {
        cumulative += r.chance
        if (roll <= cumulative) {
            selectedRarity = r.tier
            break
        }
    }

    let gachaMember = members[Math.floor(Math.random() * members.length)]
    
    let caption = `🌐 *V I R T U A L   G A C H A* 🌐\n\n`
    caption += `⏳ _Mengakses database teater..._\n`
    caption += `📥 _Membuka photopack siber..._\n\n`
    caption += `🎉 *H A S I L   G A C H A:*\n`
    caption += `========================\n`
    caption += `👤 *Oshi:* ${gachaMember} JKT48\n`
    caption += `💠 *Tier:* ${selectedRarity}\n`
    caption += `========================\n\n`
    caption += `> © INF PROJECT`

    setTimeout(async () => {
        await conn.sendMessage(m.chat, { text: caption }, { quoted: m })
        await m.react('✅')
    }, 1500)
}

handler.help = ['gachaoshi']
handler.tags = ['game']
handler.command = /^(gachaoshi|gachajkt48|rolloshi|gacha)$/i
handler.limit = true
handler.group = true

export default handler