/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx Decode
 * 📞 WhatsApp  : +62 882-5804-1396
 * 📢 Channel   : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * ⚠️ Note      : Keep credit to respect the creator!
 * ─────────────────────────
 * 📝 Plugin: Maker - The Jansen
 */

import uploadImage from '../lib/uploadImage.js'

let handler = async (m, { conn, usedPrefix, command }) => {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''

    if (!/image/.test(mime)) {
        return m.reply(`⚠️ *Silahkan reply atau kirim gambar dengan caption ${usedPrefix + command}*`)
    }

    await m.react('⏳')

    try {
        let apikey = 'cuki-x'
        let media = await q.download()
        let imageUrl = await uploadImage(media)

        let apiUrl = `https://api.cuki.biz.id/api/maker/thejansen?apikey=${apikey}&image=${encodeURIComponent(imageUrl)}`

        await conn.sendMessage(m.chat, { 
            image: { url: apiUrl }, 
            caption: `*The Jansen Filter* 🎸\n\n> © INF PROJECT` 
        }, { quoted: m })

        await m.react('✅')
    } catch (e) {
        console.error(e)
        await m.react('❌')
        m.reply(`❌ *Terjadi Kesalahan:* Gagal memproses gambar.`)
    }
}

handler.help = ['thejansen']
handler.tags = ['maker']
handler.command = /^(thejansen|jansen)$/i
handler.limit = true

export default handler