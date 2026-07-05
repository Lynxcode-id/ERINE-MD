// © INF PROJECT - Erine-MD
// Developed by INF PROJECT | Lynx

import util from 'util'

let handler = async (m, { conn, usedPrefix, command }) => {
    if (!m.quoted) return m.reply(`Reply pesan yang mau dibedah strukturnya cuy!\n\n💡 *Contoh:* ${usedPrefix + command} *[reply pesan]*`)

    await m.react('⏳')

    try {
        let q = m.quoted
        // Ambil fakeObj biar strukturnya full persis kayak aslinya di Baileys
        let obj = q.fakeObj ? q.fakeObj : q
        
        // Bedah object sampai kedalaman level 5 biar dapet semua detail
        let rawData = util.inspect(obj, { depth: 5 })

        // Trik Readmore biar chat ga spam panjang ke bawah
        const more = String.fromCharCode(8206)
        const readMore = more.repeat(4001)

        let teks = `╭───「 🔍 *MESSAGE INSPECTOR* 」───\n`
        teks += `│ 🏷️ *Type:* ${q.mtype || 'Unknown'}\n`
        teks += `│ 🆔 *Msg ID:* ${q.id}\n`
        teks += `│ 🤖 *From Bot:* ${q.fromMe ? 'Yes' : 'No'}\n`
        teks += `╰─────────────────────────\n\n`
        teks += `💻 *Raw Object (Baileys Structure):*${readMore}\n\n`
        teks += `\`\`\`javascript\n${rawData}\n\`\`\`\n\n`
        teks += `> ©ERINE PROJECT`

        await conn.sendMessage(m.chat, { text: teks }, { quoted: m })
        await m.react('✅')
    } catch (e) {
        console.error(e)
        await m.react('❌')
        m.reply(`❌ Gagal membaca struktur pesan: ${e.message}`)
    }
}

handler.help = ['getcode']
handler.tags = ['developer']
handler.command = /^(getcode|inspect|msginfo|rawmsg)$/i
handler.owner = true // Akses eksklusif buat lu doang cuy

export default handler