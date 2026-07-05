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
    let [name, rank, flag] = text.split('|').map(v => v?.trim())

    if (!name || !rank) {
        return m.reply(
            `⚠️ *Format Salah!*\n\n` +
            `Gunakan format:\n` +
            `*${usedPrefix + command} Nama | Rank | Negara*\n\n` +
            `💡 *Contoh (Sambil reply/kirim gambar):*\n` +
            `${usedPrefix + command} Lynx | glory | Indonesia\n` +
            `${usedPrefix + command} Evos Rekt | immortal | Jepang\n\n` +
            `*Pilihan Rank:* epic, honor, glory, immortal\n` +
            `*Pilihan Negara:* Indonesia, Jepang, dll (jika dikosongkan otomatis Indonesia)`
        )
    }

    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''

    if (!/image/.test(mime)) return m.reply(`⚠️ *Silahkan reply atau kirim gambar untuk dijadikan avatar lobi!*`)

    await m.react('⏳')

    try {
        let apikey = 'cuki-x'
        
        let media = await q.download()
        let avatarUrl = await uploadImage(media)

        let countryFlag = flag ? flag : 'Indonesia'

        let encodedName = encodeURIComponent(name)
        let encodedRank = encodeURIComponent(rank.toLowerCase())
        let encodedFlag = encodeURIComponent(countryFlag)
        let encodedAvatar = encodeURIComponent(avatarUrl)

        let apiUrl = `https://api.cuki.biz.id/api/maker/lobyml?apikey=${apikey}&avatar=${encodedAvatar}&name=${encodedName}&rank=${encodedRank}&flag=${encodedFlag}`

        await conn.sendMessage(m.chat, { 
            image: { url: apiUrl }, 
            caption: `*MLBB Lobby Generator* 🎮\n\n- *Nama:* ${name}\n- *Rank:* ${rank}\n- *Negara:* ${countryFlag}\n\n> © INF PROJECT` 
        }, { quoted: m })

        await m.react('✅')
    } catch (e) {
        console.error(e)
        await m.react('❌')
        m.reply(`❌ *Terjadi Kesalahan:* Gagal memproses gambar atau menghubungi server API.`)
    }
}

handler.help = ['lobyml <name|rank|flag>']
handler.tags = ['maker']
handler.command = /^(lobyml|mllobby)$/i
handler.limit = true

export default handler