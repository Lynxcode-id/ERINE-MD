/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx Decode
 * 📞 WhatsApp  : +62 882-5804-1396
 * 📢 Channel   : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * ⚠️ Note      : Keep credit to respect the creator!
 * ─────────────────────────
 * 📝 Plugin: Downloader - Terabox
 */

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        return m.reply(
            `⚠️ *Format Salah!*\n\n` +
            `Gunakan format: *${usedPrefix + command} <url terabox>*\n\n` +
            `💡 *Contoh:*\n` +
            `${usedPrefix + command} https://www.terabox.com/indonesian/sharing/link?surl=...`
        )
    }

    await m.react('⏳')

    try {
        let apikey = 'cuki-x'
        let apiUrl = `https://api.cuki.biz.id/api/downloader/terabox?apikey=${apikey}&url=${encodeURIComponent(text.trim())}`
        
        let res = await fetch(apiUrl)
        let json = await res.json()

        if (!json.success || !json.results || !json.results.files || json.results.files.length === 0) {
            throw new Error('Gagal mengambil data atau file tidak ditemukan.')
        }

        let data = json.results
        let fileInfo = data.files[0]

        let caption = `📦 *TERABOX DOWNLOADER*\n\n` +
            `📄 *Nama File:* ${fileInfo.name}\n` +
            `🗂️ *Size:* ${fileInfo.size}\n` +
            `🔗 *Short Link:* ${data.shortLink}\n\n` +
            `> © INF PROJECT`

        await conn.sendMessage(m.chat, {
            document: { url: fileInfo.downloadLink },
            mimetype: 'application/octet-stream',
            fileName: fileInfo.name,
            caption: caption
        }, { quoted: m })

        await m.react('✅')
    } catch (e) {
        console.error(e)
        await m.react('❌')
        m.reply(`❌ *Terjadi Kesalahan:* Gagal memproses URL Terabox.`)
    }
}

handler.help = ['terabox <url>']
handler.tags = ['downloader']
handler.command = /^(terabox|teraboxdl)$/i
handler.limit = true

export default handler