/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Integrator : Lynx Decode
 * 📞 Contact    : +62 882-5804-1396
 * 📢 Channel    : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * ⚠️ Note       : Keep credit to respect the creator!
 * ─────────────────────────
 * 📝 Plugin     : Genshin Impact Stalker
 * 🎨 UI         : ERINE-AI Custom Style
 */

import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    const header = (title, emoji) => `┌˚₊ ๑│ ${title} │๑˚₊ ${emoji}\n┇ \n`
    const footer = () => `\n┇ \n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`

    if (!text) {
        return m.reply(header('GENSHIN STALK', '🎮') + `│ ❌ *UID-nya mana cuy?*\n│ *Contoh:* ${usedPrefix + command} 856012067` + footer())
    }

    await m.react('⏳')

    try {
        let res = await fetch(`https://api.nexray.eu.cc/stalker/genshin?id=${encodeURIComponent(text)}`)
        let json = await res.json()

        if (!json.status || !json.result || !json.result.player_info) {
            throw new Error('Player tidak ditemukan atau server API sedang gangguan.')
        }

        let player = json.result.player_info
        let imageUrl = json.result.image_url || player.avatar

        let teks = header('GENSHIN STALK', '🎮')
        teks += `│ 👤 *Nickname  :* ${player.nickname || '-'}\n`
        teks += `│ 🆔 *UID       :* ${json.result.id || text}\n`
        teks += `│ 📊 *Level     :* ${player.level || '-'} (WL: ${player.world_level || '-'})\n`
        teks += `│ 🏆 *Achiev.   :* ${player.achievements || '-'}\n`
        teks += `│ 🌌 *Abyss     :* ${player.spiral_abyss || '-'}\n`
        teks += `│ 🎭 *Theater   :* ${player.theater || '-'}\n`
        if (player.stygian_onslaught) teks += `│ ⚔️ *Onslaught :* ${player.stygian_onslaught}\n`
        teks += `│ 📝 *Signature :* ${player.signature || '-'}\n`
        teks += footer()

        await conn.sendMessage(m.chat, {
            image: { url: imageUrl },
            caption: teks
        }, { quoted: m })

        await m.react('✨')

    } catch (e) {
        console.error(e)
        await m.react('❌')
        m.reply(header('STALK ERROR', '❌') + `│ ❌ *Terjadi kesalahan:*\n│ ${e.message}` + footer())
    }
}

handler.help = ['genshinstalk <uid>']
handler.tags = ['stalker']
handler.command = /^(genshinstalk|stalkgenshin|gistalk)$/i
handler.limit = true

export default handler