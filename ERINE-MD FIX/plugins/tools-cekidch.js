// © INF PROJECT - Erine-MD
// Developed by INF PROJECT

import pkg from '@wishkeysocket/baileys'
const { generateWAMessageFromContent, proto } = pkg

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return m.reply(`❌ Masukkan link channelnya, Bang!\nContoh: *${usedPrefix + command}* https://whatsapp.com/channel/xxxx`)
    if (!text.includes("https://whatsapp.com/channel/")) return m.reply("❌ Link tidak valid! Pastikan itu link Channel WhatsApp.")

    await m.react('⏳')

    try {
        // Ambil invite code dari link
        let result = text.split('https://whatsapp.com/channel/')[1]
        let res = await conn.newsletterMetadata("invite", result)

        const teks = `乂  *C H A N N E L  I N F O*\n\n` +
                     `┌  ◦ *ID :* ${res.id}\n` +
                     `│  ◦ *Nama :* ${res.name}\n` +
                     `│  ◦ *Pengikut :* ${res.subscribers}\n` +
                     `│  ◦ *Status :* ${res.state}\n` +
                     `└  ◦ *Verified :* ${res.verification === "VERIFIED" ? "Terverifikasi ✅" : "Tidak"}`

        const msg = generateWAMessageFromContent(m.chat, {
            viewOnceMessage: {
                message: {
                    interactiveMessage: proto.Message.InteractiveMessage.create({
                        body: proto.Message.InteractiveMessage.Body.create({
                            text: teks
                        }),
                        footer: proto.Message.InteractiveMessage.Footer.create({
                            text: "© INF PROJECT | Erine-MD"
                        }),
                        nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                            buttons: [
                                {
                                    name: "cta_copy",
                                    buttonParamsJson: JSON.stringify({
                                        display_text: "📋 Salin ID Channel",
                                        id: "copy_id",
                                        copy_code: res.id
                                    })
                                }
                            ]
                        })
                    })
                }
            }
        }, { quoted: m })

        await conn.relayMessage(m.chat, msg.message, { messageId: m.key.id })
        await m.react('✅')

    } catch (error) {
        console.error(error)
        await m.react('❌')
        return m.reply("❌ Gagal mendapatkan data channel. Pastikan link benar dan channel bersifat publik.")
    }
}

handler.help = ['cekidch <link>']
handler.tags = ['tools']
handler.command = /^(idch|cekidch)$/i

export default handler
