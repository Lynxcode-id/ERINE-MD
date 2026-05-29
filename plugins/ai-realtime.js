/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx Decode
 * 📞 WhatsApp  : +62 882-5804-1396
 * 📢 Channel   : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * ⚠️ Note      : Keep credit to respect the creator!
 * ─────────────────────────
 * 📝 Plugin: AI - Realtime
 */

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        return m.reply(
            `⚠️ *Format Salah!*\n\n` +
            `Gunakan format: *${usedPrefix + command} <pertanyaan>*\n\n` +
            `💡 *Contoh:*\n` +
            `${usedPrefix + command} sekarang hari apa dan jam berapa?`
        )
    }

    await m.react('⏳')

    try {
        let apiUrl = `https://api-faa.my.id/faa/ai-realtime?text=${encodeURIComponent(text.trim())}`
        
        let res = await fetch(apiUrl)
        let json = await res.json()

        if (!json.status || !json.result) {
            throw new Error('Gagal mendapatkan respon dari AI.')
        }

        let caption = `🤖 *AI REALTIME*\n\n` +
            `${json.result}\n\n` +
            `> © INF PROJECT`

        await conn.sendMessage(m.chat, { 
            text: caption 
        }, { quoted: m })

        await m.react('✅')
    } catch (e) {
        console.error(e)
        await m.react('❌')
        m.reply(`❌ *Terjadi Kesalahan:* Gagal menghubungi server AI.`)
    }
}

handler.help = ['airealtime <pertanyaan>']
handler.tags = ['ai']
handler.command = /^(ai-realtime|airealtime)$/i
handler.limit = true

export default handler