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
            `${usedPrefix + command} hai bang, aku di ajak gak? 🥺👉👈`
        )
    }

    await m.react('⏳')

    try {
        let apikey = 'cuki-x'
        let name = conn.getName(m.sender) || m.pushName || 'User'
        
        let ppurl;
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
        
        // Ambil waktu otomatis zona Asia/Makassar (WITA)
        let time = new Date().toLocaleTimeString('id-ID', {
            timeZone: 'Asia/Makassar',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        }).replace(':', '.')

        // Generate persentase baterai random (10% sampai 100%)
        let battery = Math.floor(Math.random() * 91) + 10

        let encodedName = encodeURIComponent(name)
        let encodedText = encodeURIComponent(text.trim())
        let encodedPp = encodeURIComponent(ppurl)

        let apiUrl = `https://api.cuki.biz.id/api/maker/iqc-group?apikey=${apikey}&text=${encodedText}&name=${encodedName}&avatar=${encodedPp}&battery=${battery}&time=${time}`

        await conn.sendMessage(m.chat, { 
            image: { url: apiUrl }, 
            caption: `*Fake iQC Group Chat Generator* 📱\n\n> © INF PROJECT` 
        }, { quoted: m })

        await m.react('✅')
    } catch (e) {
        console.error(e)
        await m.react('❌')
        m.reply(`❌ *Terjadi Kesalahan:* Gagal memproses gambar atau menghubungi server API.`)
    }
}

handler.help = ['iqcgroup <teks>']
handler.tags = ['maker']
handler.command = /^(iqcgroup|iqcgc)$/i
handler.limit = true

export default handler