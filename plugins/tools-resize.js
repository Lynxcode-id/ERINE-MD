/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx Decode
 * ─────────────────────────
 */

import resizeImage from '../scrape/resize-image.js'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''

    if (!mime.includes('image')) {
        return m.reply(
            `⚠️ *Format Salah njir!*\n\n` +
            `Reply gambar yang mau lu resize dengan caption *${usedPrefix + command} <ukuran>*.\n\n` +
            `💡 *Contoh:* ${usedPrefix + command} 720`
        )
    }

    await m.react('⚡')

    try {
        let width = text ? text.replace(/[^0-9]/g, '') : "1080"
        if (!width) width = "1080"

        let imgBuffer = await q.download()
        if (!imgBuffer) throw new Error('Gagal ngedownload gambar dari chat.')

        let res = await resizeImage(imgBuffer, width)
        if (!res.success) throw new Error(res.error || 'Server iloveimg lagi down keknya.')

        let kbAwal = (res.size_awal / 1024).toFixed(2)
        let kbAkhir = (res.size_akhir / 1024).toFixed(2)

        let caption = `🖼️ *IMAGE RESIZER*\n\n` +
            `📏 *Target Lebar:* ${width} px\n` +
            `📦 *Size Awal:* ${kbAwal} KB\n` +
            `📦 *Size Akhir:* ${kbAkhir} KB\n\n` +
            `> © INF PROJECT`

        await conn.sendMessage(m.chat, {
            image: res.buffer,
            caption: caption
        }, { quoted: m })

        await m.react('✅')
    } catch (e) {
        console.error(e)
        await m.react('❌')
        m.reply(`❌ *Error njir:* ${e.message}`)
    }
}

handler.help = ['resize <ukuran>']
handler.tags = ['tools']
handler.command = /^(resize|resizeimg)$/i
handler.limit = true

export default handler