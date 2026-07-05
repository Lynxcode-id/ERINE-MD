/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Integrator : Lynx Decode
 * 📞 Contact    : +62 882-5804-1396
 * 📢 Channel    : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * ⚠️ Note       : Keep credit to respect the creator!
 * ─────────────────────────
 * 📝 Plugin     : Douyin Search
 * 🎨 UI         : ERINE-AI Custom Style
 */

import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    const header = (title, emoji) => `┌˚₊ ๑│ ${title} │๑˚₊ ${emoji}\n┇ \n`
    const footer = () => `\n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`

    if (!text) {
        return m.reply(header('DOUYIN SEARCH', '🔍') + `│ ❌ *Mau cari apa di Douyin?*\n│ *Contoh:* ${usedPrefix + command} funny` + footer())
    }

    await m.react('⏳')

    try {
        let res = await fetch(`https://api.nexray.eu.cc/search/douyin?q=${encodeURIComponent(text)}`)
        let json = await res.json()

        if (!json.status || !json.result || json.result.length === 0) {
            throw new Error('Video tidak ditemukan atau server sedang gangguan.')
        }

        let teks = header('DOUYIN SEARCH', '🎥')
        
        // Mengambil 5 hasil teratas
        let results = json.result.slice(0, 5)
        
        for (let i = 0; i < results.length; i++) {
            let v = results[i]
            // Memotong deskripsi jika terlalu panjang
            let desc = v.description.length > 50 ? v.description.substring(0, 50) + '...' : v.description
            // Konversi durasi dari ms ke detik
            let durationSec = (v.duration / 1000).toFixed(1)

            teks += `│ ${i + 1}. *${v.author.nickname}* (@${v.author.unique_id || '-'})\n`
            teks += `│ 📝 *Caption :* ${desc || '-'}\n`
            teks += `│ ⏱️ *Durasi  :* ${durationSec}s\n`
            teks += `│ 📅 *Dibuat  :* ${v.taken_at || '-'}\n`
            teks += `│ 🔗 *Link    :* ${v.url}\n`
            teks += i === results.length - 1 ? `┇ ` : `┇ \n`
        }
        
        teks += footer()

        await conn.sendMessage(m.chat, {
            image: { url: results[0].cover },
            caption: teks
        }, { quoted: m })

        await m.react('✨')

    } catch (e) {
        console.error(e)
        await m.react('❌')
        m.reply(header('SEARCH ERROR', '❌') + `│ ❌ *Terjadi kesalahan:*\n│ ${e.message}` + footer())
    }
}

handler.help = ['douyinsearch <pencarian>', 'dysearch <pencarian>']
handler.tags = ['search']
handler.command = /^(douyinsearch|dysearch|searchdouyin)$/i
handler.limit = true

export default handler