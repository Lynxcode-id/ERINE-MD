/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx Decode
 * 📞 WhatsApp  : +62 882-5804-1396
 * 📢 Channel   : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * ⚠️ Note      : Keep credit to respect the creator!
 * ─────────────────────────
 */

import uploadImage from '../lib/uploadImage.js'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        return m.reply(
            `⚠️ *Format Salah!*\n\n` +
            `Gunakan format: *${usedPrefix + command} <teks>*\n\n` +
            `💡 *Contoh:*\n` +
            `${usedPrefix + command} halah halah (sambil reply/kirim gambar)`
        )
    }

    await m.react('⏳')

    try {
        let apikey = 'cuki-x'
        let name = conn.getName(m.sender) || m.pushName || 'User'
        let ppurl = ''

        let q = m.quoted ? m.quoted : m
        let mime = (q.msg || q).mimetype || ''

        if (/image/.test(mime)) {
            let media = await q.download()
            ppurl = await uploadImage(media)
        } else {
            try {
                ppurl = await conn.profilePictureUrl(m.sender, 'image')
            } catch (e) {
                ppurl = 'https://i.imgur.com/p2hspVO.jpeg'
            }
        }
        
        let encodedName = encodeURIComponent(name)
        let encodedComment = encodeURIComponent(text.trim())
        let encodedPp = encodeURIComponent(ppurl)

        let apiUrl = `https://api.cuki.biz.id/api/canvas/fbcommand?apikey=${apikey}&name=${encodedName}&comment=${encodedComment}&ppurl=${encodedPp}`

        await conn.sendMessage(m.chat, { 
            image: { url: apiUrl }, 
            caption: `*FB Comment Generator* 🗿\n\n> © INF PROJECT` 
        }, { quoted: m })

        await m.react('✅')
    } catch (e) {
        console.error(e)
        await m.react('❌')
        m.reply(`❌ *Terjadi Kesalahan:* Gagal memproses gambar atau menghubungi server API.`)
    }
}

handler.help = ['fbcomment <teks>']
handler.tags = ['maker']
handler.command = /^(fbcomment|komenfb|fbcmd)$/i
handler.limit = true

export default handler