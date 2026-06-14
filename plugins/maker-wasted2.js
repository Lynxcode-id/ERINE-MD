/**
 * ╭───「 𝗙𝗘𝗔𝗧𝗨𝗥𝗘 𝗔𝗨𝗧𝗛𝗢𝗥 」───
 * │ 👤 Developer : Lynx Decode
 * │ 📞 WhatsApp  : +62 882-5804-1396
 * │ 📢 Channel   : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * │ ⚠️ Note      : Keep credit to respect the creator!
 * ╰─────────────────────────
 * 📝 Plugin      : Wasted Image Maker
 */

import fetch from 'node-fetch'
import uploadImage from '../lib/uploadImage.js'

let handler = async (m, { conn, usedPrefix, command }) => {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''

    if (!/image\/(jpe?g|png)/.test(mime)) {
        return m.reply(`⚠️ Kanjutlu, mana gambarnya pea, yang bener aja. kirim atau reply gambar kalo mau make *${usedPrefix + command}*`)
    }

    await m.react('⚡')

    try {
        const media = await q.download()
        const imgUrl = await uploadImage(media)

        const apiUrl = `https://api-nanzz.my.id/docs/api/maker/wasted.php?url=${encodeURIComponent(imgUrl)}`

        const res = await fetch(apiUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        })

        if (!res.ok) throw new Error(`Status ${res.status}: ${res.statusText}`)

        const buffer = Buffer.from(await res.arrayBuffer())

        await conn.sendMessage(m.chat, { 
            image: buffer, 
            caption: `🔥 Done nih hasilny .` 
        }, { quoted: m })

        await m.react('🔥')
    } catch (e) {
        console.error('error bg', e)
        await m.react('😜')
        m.reply(`😑 Anjim gagal edan.\n> *Detail:* ${e.message}`)
    }
}

handler.help = ['wasted2']
handler.tags = ['maker']
handler.command = /^(wasted2)$/i
handler.limit = true

export default handler