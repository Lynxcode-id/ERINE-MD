import { createHash } from 'crypto'
import moment from 'moment-timezone'
import pkg from '@whiskeysocket/baileys'
const { generateWAMessageFromContent, proto } = pkg

async function sendInteractive(conn, jid, title, text, footer, buttons, quoted) {
    let msg = generateWAMessageFromContent(jid, {
        viewOnceMessage: {
            message: {
                interactiveMessage: proto.Message.InteractiveMessage.fromObject({
                    body: { text },
                    footer: { text: footer },
                    header: { title: title, hasMediaAttachment: false },
                    nativeFlowMessage: {
                        buttons: buttons.map(b => ({
                            name: "quick_reply",
                            buttonParamsJson: JSON.stringify({ display_text: b.text, id: b.id })
                        }))
                    },
                    contextInfo: {
                        externalAdReply: {
                            title: "E R I N E - M D | NOTIFICATION",
                            body: "Registration System Success",
                            thumbnailUrl: "https://c.termai.cc/i169/zUVceq.jpg",
                            sourceUrl: "https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i",
                            mediaType: 1,
                            renderLargerThumbnail: true
                        }
                    }
                })
            }
        }
    }, { quoted });
    return await conn.relayMessage(jid, msg.message, { messageId: msg.key.id });
}

let handler = async function (m, { text, usedPrefix, command, conn }) {
    let user = global.db.data.users[m.sender]
    if (!user) {
        global.db.data.users[m.sender] = {}
        user = global.db.data.users[m.sender]
    }
    
    let sn = createHash('md5').update(m.sender).digest('hex')
    
    let name = m.name || m.pushName || conn.getName(m.sender) || 'User'

    // =========================================
    // 1. TANGKAP TOMBOL "SALIN SN"
    // =========================================
    if (command === 'copysn_luu') {
        return m.reply(text) // Text isinya adalah kode SN dari button
    }

    // =========================================
    // 2. LOGIC COMMAND: .sn
    // =========================================
    if (command === 'sn') {
        if (!user.registered) return m.reply(`⚠️ Daftar dulu cuy! Ketik: *${usedPrefix}daftar*`)
        let capSN = `╭───╼「 *SERIAL NUMBER* 」\n│\n│ 👤 *User:* ${user.name}\n│ 🔐 *SN:* \`${sn}\`\n│\n╰─────────────────────────╼`
        return await sendInteractive(conn, m.chat, "🔐 INFO SERIAL NUMBER", capSN, "» ᴇʀɪɴᴇ-ᴍᴅ ᴍᴀɴᴀɢᴇᴍᴇɴᴛ «", [
            { text: '📋 Salin SN', id: `${usedPrefix}copysn_luu ${sn}` },
            { text: '📂 Menu Utama', id: `.menu` }
        ], m)
    }

    // =========================================
    // 3. CEK SUDAH DAFTAR
    // =========================================
    if (user.registered) {
        let jokes = ["BPJS sekalian? 🏥", "Mau daftar nikah? 🙄", "Udah terdaftar bos, mau ngapain lagi? 😂"]
        return m.reply(`✅ Kamu sudah terdaftar sebagai *${user.name}*.\n\n${jokes[Math.floor(Math.random() * jokes.length)]}`)
    }

    if (!text && command !== 'daftar_anomali') {
        let capReg = `👋 Halo *${name}*!\n\nMAU AKSES E R I N E - M D?\nDaftar dulu cuy. Pilih jalur lu:\n\n` +
                     `1. *Jalur Normal (Yapping):*\nKetik: \`${usedPrefix}daftar Nama\`\n\n` +
                     `2. *Jalur Anomali (Cepat):*\nKlik tombol di bawah.`
        
        return await sendInteractive(conn, m.chat, "📝 REGISTRATION MENU", capReg, "» ᴇʀɪɴᴇ-ᴍᴅ ᴍᴀɴᴀɢᴇᴍᴇɴᴛ «", [
        
            { text: '🚀 Daftar Cepat (Anomali)', id: `${usedPrefix}daftar_anomali ${name.replace(/[^\w\s]/g, '')}` }
        ], m)
    }

    let inputName = (text || '').trim()
    if (!inputName) return m.reply("❌ Nama nggak valid cuy! Coba lagi.")

    user.name = inputName
    user.age = Math.floor(Math.random() * 5) + 20 
    user.registered = true
    user.regTime = +new Date()

    let successCap = `╭───╼「 *REGISTRATION* 」\n│\n` +
                     `│ ✅ *Status:* Terdaftar\n` +
                     `│ ✨ *Nama:* ${user.name}\n` +
                     `│ 🔐 *SN:* \`${sn}\`\n│\n` +
                     `│ _Pendaftaran sukses via Jalur_\n` +
                     `│ _Anomali malas ERINE-MD._\n│\n` +
                     `╰─────────────────────────╼`

    return await sendInteractive(
        conn, m.chat, "🎉 REGISTER SUCCESS", successCap, "Selamat datang di Erine MD System!", 
        [
            { text: '📂 Buka Menu Utama', id: `.menu` },
            { text: '🔐 Cek SN', id: `${usedPrefix}sn` }
        ], m
    )
}

handler.help = ['daftar', 'sn']
handler.tags = ['main']
handler.command = /^(daftar|verify|reg(ister)?|sn|daftar_anomali|copysn_luu)$/i

export default handler