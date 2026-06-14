/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx Decode
 * 📞 WhatsApp  : +62 882-5804-1396
 * 📢 Channel   : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * ⚠️ Note      : Keep credit to respect the creator!
 * ─────────────────────────
 * 📝 Plugin: Photo to Sketch Maker
 */

import { artydePhotoToSketch } from '../scrape/sketch.js'

let handler = async (m, { conn, usedPrefix, command }) => {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''

    if (!/image\/(jpe?g|png|webp)/.test(mime)) {
        return m.reply(`❌ Reply atau kirim gambar dengan caption *${usedPrefix + command}*`)
    }

    await m.react('⏳')

    try {
        let imgBuffer = await q.download()
        if (!imgBuffer) throw new Error('Gagal mengunduh gambar dari pesan.')

        let res = await artydePhotoToSketch(imgBuffer, {
            fileName: `image_${Date.now()}.jpg`,
            mimeType: mime
        })

        if (!res.status || !res.result_url) {
            throw new Error('Gagal memproses gambar di server Artyde.')
        }

        let caption = `╭─── [ *P H O T O - S K E T C H* ] ───💠
│ 
│  ✨ *Status:* Success
│  🎨 *Style:* Pencil Sketch
│
╰──────────────────────────💠`.trim()

        await conn.sendMessage(m.chat, {
            image: { url: res.result_url },
            caption: caption
        }, { quoted: m })

        await m.react('✅')

    } catch (e) {
        console.error('[SKETCH ERROR]', e)
        await m.react('❌')
        m.reply(`⚠️ *System Error:*\n_${e.message || e}_`)
    }
}

handler.help = ['sketch', 'sketsa']
handler.tags = ['tools']
handler.command = /^(sketch|tosketsa|)$/i
handler.limit = true

export default handler