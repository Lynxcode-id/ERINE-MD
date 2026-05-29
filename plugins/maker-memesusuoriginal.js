/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx Decode
 * 📞 WhatsApp  : +62 882-5804-1396
 * 📢 Channel   : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * ⚠️ Note      : Keep credit to respect the creator!
 * ─────────────────────────
 * 📝 Plugin: Maker - Susu Original
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

        let apiUrl = `https://api.cuki.biz.id/api/canvas/susu-original?apikey=${apikey}&image=${encodeURIComponent(imageUrl)}`

        await conn.sendMessage(m.chat, { 
            image: { url: apiUrl }, 
            caption: `*Susu Original* 🥛\n\n> © INF PROJECT` 
        }, { quoted: m })

        await m.react('✅')
    } catch (e) {
        console.error(e)
        await m.react('❌')
        m.reply(`❌ *Terjadi Kesalahan:* Gagal memproses gambar.`)
    }
}

handler.help = ['susuoriginal']
handler.tags = ['maker']
handler.command = /^(susuoriginal|susuori)$/i
handler.limit = true

export default handler