/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx Decode
 * 📞 WhatsApp  : +62 882-5804-1396
 * 📢 Channel   : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * ⚠️ Note      : Keep credit to respect the creator!
 * ─────────────────────────
 * 📝 Plugin: Search - Wattpad
 */

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        return m.reply(
            `⚠️ *Format Salah!*\n\n` +
            `Gunakan format: *${usedPrefix + command} <judul>*\n\n` +
            `💡 *Contoh:*\n` +
            `${usedPrefix + command} dilan`
        )
    }

    await m.react('⏳')

    try {
        let apikey = 'cuki-x'
        let apiUrl = `https://api.cuki.biz.id/api/search/wattpad?apikey=${apikey}&query=${encodeURIComponent(text.trim())}`
        
        let res = await fetch(apiUrl)
        let json = await res.json()

        if (!json.status || !json.data || !json.data.results || json.data.results.length === 0) {
            throw new Error('Gagal menemukan cerita atau data tidak tersedia.')
        }

        let results = json.data.results
        let caption = `📚 *WATTPAD SEARCH*\n\n`
        caption += `🔍 *Pencarian:* ${text}\n`
        caption += `📊 *Total hasil:* ${json.data.total}\n\n`
        caption += `━━━━━━━━━━━━━━━\n\n`
        
        let limit = results.length > 10 ? 10 : results.length
        for (let i = 0; i < limit; i++) {
            let v = results[i]
            caption += `*${i + 1}. ${v.title}*\n`
            caption += `👁️ *Reads:* ${v.reads} | ⭐ *Votes:* ${v.votes} | 📑 *Bab:* ${v.chapters}\n`
            caption += `🔗 *Link:* ${v.url}\n\n`
        }
        
        caption += `> © INF PROJECT`

        await conn.sendMessage(m.chat, { 
            image: { url: results[0].thumbnail }, 
            caption: caption.trim() 
        }, { quoted: m })

        await m.react('✅')
    } catch (e) {
        console.error(e)
        await m.react('❌')
        m.reply(`❌ *Terjadi Kesalahan:* Gagal memproses pencarian Wattpad.`)
    }
}

handler.help = ['wattpad <judul>']
handler.tags = ['search']
handler.command = /^(wattpad|wpsearch)$/i
handler.limit = true

export default handler