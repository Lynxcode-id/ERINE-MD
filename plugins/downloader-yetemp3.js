/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx Decode
 * 📞 WhatsApp  : +62 882-5804-1396
 * 📢 Channel   : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * ⚠️ Note      : Keep credit to respect the creator!
 * ─────────────────────────
 */

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        return m.reply(
            `⚠️ *Format Salah!*\n\n` +
            `Gunakan format: *${usedPrefix + command} <url youtube>*\n\n` +
            `💡 *Contoh:*\n` +
            `${usedPrefix + command} https://www.youtube.com/watch?v=1-xGerv5FOk`
        )
    }

    await m.react('⚡')

    try {
        let apiUrl = `https://api.ikyyxd.my.id/download/ytmp3?url=${encodeURIComponent(text.trim())}`
        
        let res = await fetch(apiUrl)
        let json = await res.json()

        if (!json.status || !json.result || !json.result.audio?.url) {
            throw new Error('Gagal mengunduh audio atau lagu tidak ditemukan.')
        }

        let data = json.result

        await conn.sendMessage(m.chat, {
            image: { url: data.thumbnail },
            caption: `🎵 *YOUTUBE DOWNLOADER MP3*\n\n📌 *Judul:* ${data.title}\n⏱️ *Durasi:* ${data.duration} detik\n🎧 *Kualitas:* ${data.audio.quality}\n\n> © INF PROJECT`
        }, { quoted: m })

        await conn.sendMessage(m.chat, {
            audio: { url: data.audio.url },
            mimetype: 'audio/mpeg',
            fileName: `${data.title}.mp3`
        }, { quoted: m })

        await m.react('🌟')
    } catch (e) {
        console.error(e)
        await m.react('❌')
        m.reply(`❌ *Terjadi Kesalahan:* Gagal memproses permintaan Anda.`)
    }
}

handler.help = ['ytmp3 <url>']
handler.tags = ['downloader']
handler.command = /^(ytmp3|ytmp3dl)$/i
handler.limit = true

export default handler