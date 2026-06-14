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
    let [names, urls, sleepCall] = text.split('|').map(v => v?.trim())

    if (!names) {
        return m.reply(
            `⚠️ *Format Salah!*\n\n` +
            `Gunakan format:\n` +
            `*${usedPrefix + command} Nama1 & Nama2 | LinkPP1 & LinkPP2 | true/false*\n\n` +
            `💡 *Contoh (Input Manual Link):*\n` +
            `${usedPrefix + command} Zee & Marsha | https://i.imgur.com/p2hspVO.jpeg & https://i.imgur.com/p2hspVO.jpeg | true\n\n` +
            `💡 *Contoh (Via Reply/Kirim Gambar):*\n` +
            `_Reply gambar lalu ketik:_ *${usedPrefix + command} Zee & Marsha*\n` +
            `_(Otomatis pake foto profilmu sebagai PP1 dan gambar yang di-reply sebagai PP2)_`
        )
    }

    let [name1, name2] = names.split('&').map(v => v?.trim())
    if (!name2) name2 = 'User 2'
    if (!name1) name1 = m.name || conn.getName(m.sender) || 'User 1'

    let ppurl1 = ''
    let ppurl2 = ''
    
    let isSleepCall = 'false'
    if (sleepCall && (sleepCall.toLowerCase() === 'true' || sleepCall === '1')) {
        isSleepCall = 'true'
    } else if (!sleepCall && urls && (urls.toLowerCase() === 'true' || urls === '1')) {
        isSleepCall = 'true'
    }

    await m.react('⏳')

    try {
        let apikey = 'cuki-x'
        let q = m.quoted ? m.quoted : m
        let mime = (q.msg || q).mimetype || ''

        if (urls && urls.includes('http')) {
            let [url1, url2] = urls.split('&').map(v => v?.trim())
            ppurl1 = url1 || 'https://i.imgur.com/p2hspVO.jpeg'
            ppurl2 = url2 || 'https://i.imgur.com/p2hspVO.jpeg'
        } else if (/image/.test(mime)) {
            let media = await q.download()
            let uploadedUrl = await uploadImage(media)
            
            try {
                ppurl1 = await conn.profilePictureUrl(m.sender, 'image')
            } catch (e) {
                ppurl1 = 'https://i.imgur.com/p2hspVO.jpeg'
            }
            ppurl2 = uploadedUrl
        } else {
            return m.reply(`⚠️ *Silahkan masukkan link foto atau reply/kirim gambar!*`)
        }

        let encodedName1 = encodeURIComponent(name1)
        let encodedName2 = encodeURIComponent(name2)
        let encodedParam1 = encodeURIComponent(ppurl1)
        let encodedParam2 = encodeURIComponent(ppurl2)

        let apiUrl = `https://api.cuki.biz.id/api/maker/discordcall?apikey=${apikey}&avatar1=${encodedParam1}&avatar2=${encodedParam2}&name1=${encodedName1}&name2=${encodedName2}&sleepCall=${isSleepCall}`

        await conn.sendMessage(m.chat, { 
            image: { url: apiUrl }, 
            caption: `*Discord Call Generator* 💬\n\n> © INF PROJECT` 
        }, { quoted: m })

        await m.react('✅')
    } catch (e) {
        console.error(e)
        await m.react('❌')
        m.reply(`❌ *Terjadi Kesalahan:* Gagal memproses data atau menghubungi server API.`)
    }
}

handler.help = ['discordcall <name1 & name2|link1 & link2|true/false>']
handler.tags = ['maker']
handler.command = /^(discordcall|dcall)$/i
handler.limit = true

export default handler