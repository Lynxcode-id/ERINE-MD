import { createHash } from 'crypto'
import moment from 'moment-timezone'
import { generateWAMessageFromContent, prepareWAMessageMedia, proto } from '@whiskeysockets/baileys'

async function sendInteractive(conn, jid, title, text, footer, buttons, quoted) {
    const buttonsMap = buttons.map(b => ({
        name: "quick_reply",
        buttonParamsJson: JSON.stringify({ display_text: b.text, id: b.id })
    }));

    let msg = generateWAMessageFromContent(jid, {
        viewOnceMessage: {
            message: {
                messageContextInfo: {
                    deviceListMetadata: {},
                    deviceListMetadataVersion: 2
                },
                interactiveMessage: {
                    body: { text: text },
                    footer: { text: footer },
                    header: { title: title, hasMediaAttachment: false },
                    nativeFlowMessage: {
                        buttons: buttonsMap
                    }
                }
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
    let wm = global.wm || "Erine System"
    let senderNumber = m.sender.split('@')[0]
    
    let fkontak = {
        key: { fromMe: false, participant: `0@s.whatsapp.net` },
        message: {
            contactMessage: {
                displayName: wm,
                vcard: `BEGIN:VCARD\nVERSION:3.0\nN:XL;${wm},;;;\nFN:${wm}\nitem1.TEL;waid=${senderNumber}:${senderNumber}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
            }
        }
    }

    if (command === 'copysn_luu') return m.reply(text)

    if (command === 'sn') {
        if (!user.registered) return m.reply(`⚠️ Daftar dulu cuy! Ketik: *${usedPrefix}daftar*`)
        let capSN = `╭───╼「 *SERIAL NUMBER* 」\n│\n│ 👤 *User:* ${user.name}\n│ 🔐 *SN:* \`${sn}\`\n│\n╰─────────────────────────╼`
        return await sendInteractive(conn, m.chat, "🔐 INFO SERIAL NUMBER", capSN, "» ᴇʀɪɴᴇ-ᴍᴅ ᴍᴀɴᴀɢᴇᴍᴇɴᴛ «", [
            { text: '📋 Salin SN', id: `${usedPrefix}copysn_luu ${sn}` },
            { text: '📂 Menu Utama', id: `.menu` }
        ], fkontak)
    }

    if (user.registered) {
        let jokes = ["BPJS sekalian? 🏥", "Mau daftar nikah? 🙄", "Udah terdaftar bos, mau ngapain lagi? 😂"]
        return m.reply(`✅ Kamu sudah terdaftar sebagai *${user.name}*.\n\n${jokes[Math.floor(Math.random() * jokes.length)]}`)
    }

    if (!text && command !== 'daftar_anomali') {
        let capReg = `👋 Halo *${name}*!\n\nMAU AKSES E R I N E - M D?\nDaftar dulu cuy. Pilih jalur lu:\n\n` +
                     `1. *Jalur Normal (Yapping):*\nKetik: \`${usedPrefix}daftar Nama\`\n\n` +
                     `2. *Jalur Anomali (Cepat):*\nKlik tombol di bawah.`
        
        return await sendInteractive(conn, m.chat, "📝 REGISTRATION MENU", capReg, "» ᴇʀɪɴᴇ-ᴍᴅ ᴍᴀɴᴀɢᴇᴍᴇɴᴛ «", [
            { text: '🚀 Daftar Cepat', id: `${usedPrefix}daftar_anomali ${name.replace(/[^\w\s]/g, '')}` }
        ], fkontak)
    }

    let inputName = (text || '').trim()
    if (!inputName) return m.reply("❌ Nama nggak valid cuy! Coba lagi.")

    user.name = inputName
    user.age = Math.floor(Math.random() * 5) + 20 
    user.registered = true
    user.regTime = +new Date()

    let successCap = `╭───╼「 *REGISTRATION* 」\n│\n│ ✅ *Status:* Terdaftar\n│ ✨ *Nama:* ${user.name}\n│ 🔐 *SN:* \`${sn}\`\n│\n│ _Pendaftaran sukses via Jalur_\n│ _Cepat - Fast_\n│\n╰─────────────────────────╼`

    return await sendInteractive(conn, m.chat, "🎉 REGISTER SUCCESS", successCap, "Selamat datang di Erine MD System!", [
        { text: '📂 Buka Menu Utama', id: `.menu` },
        { text: '🔐 Cek SN', id: `${usedPrefix}sn` }
    ], fkontak)
}

handler.help = ['daftar', 'sn']
handler.tags = ['main']
handler.command = /^(daftar|verify|reg(ister)?|sn|daftar_anomali|copysn_luu)$/i

export default handler