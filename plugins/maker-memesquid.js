/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx Decode
 * 📞 WhatsApp  : +62 882-5804-1396
 * 📢 Channel   : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * ⚠️ Note      : Keep credit to respect the creator!
 * ─────────────────────────
 */

let handler = async (m, { conn, text, usedPrefix, command }) => {
    let [text1, text2] = text.split('|')

    if (!text1 || !text2) {
        return m.reply(
            `⚠️ *Format Salah!*\n\n` +
            `Gunakan format: *${usedPrefix + command} Teks 1 | Teks 2*\n\n` +
            `💡 *Contoh:*\n` +
            `${usedPrefix + command} Gua yang lagi error fixing | Temen gua lagi mabar`
        )
    }

    await m.react('⏳')

    try {
        let apikey = 'cuki-x'
        let t1 = encodeURIComponent(text1.trim())
        let t2 = encodeURIComponent(text2.trim())
        let apiUrl = `https://api.cuki.biz.id/api/canvas/meme/squidwindow?apikey=${apikey}&text1=${t1}&text2=${t2}`

        await conn.sendMessage(m.chat, { 
            image: { url: apiUrl }, 
            caption: `*Meme Squidward Generator* 🗿\n\n> © INF PROJECT` 
        }, { quoted: m })

        await m.react('✅')
    } catch (e) {
        console.error(e)
        await m.react('❌')
        m.reply(`❌ *Terjadi Kesalahan:* Gagal menghubungi server API.`)
    }
}

handler.help = ['squidwindow <teks1|teks2>']
handler.tags = ['maker']
handler.command = /^(squidwindow|squidmeme|memeindow)$/i
handler.limit = true

export default handler