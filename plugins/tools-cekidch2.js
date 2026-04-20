// © INF PROJECT - Erine-MD
// Developed by INF PROJECT

import pkg from '@wishkeysocket/baileys'
const { proto } = pkg

let handler = async (m, { conn, text, command }) => {
  if (!text) return m.reply('❌ Masukkan link channel-nya, Bang!')
  if (!text.includes('https://whatsapp.com/channel/')) return m.reply('❌ Link tautan tidak valid.')

  await m.react('⏳')

  try {
    const id = text.split('https://whatsapp.com/channel/')[1]
    const res = await conn.newsletterMetadata("invite", id)

    const infoText = `乂  *C H A N N E L  I N F O*\n\n` +
                     `┌  ◦ *ID:* ${res.id}\n` +
                     `│  ◦ *Nama:* ${res.name}\n` +
                     `│  ◦ *Pengikut:* ${res.subscribers}\n` +
                     `│  ◦ *Status:* ${res.state}\n` +
                     `└  ◦ *Verified:* ${res.verification === "VERIFIED" ? "Terverifikasi ✅" : "Tidak"}`

    const msg = {
      viewOnceMessage: {
        message: {
          interactiveMessage: proto.Message.InteractiveMessage.create({
            body: proto.Message.InteractiveMessage.Body.create({
              text: infoText
            }),
            footer: proto.Message.InteractiveMessage.Footer.create({
              text: "© INF PROJECT | ERINE-MD"
            }),
            nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
              buttons: [
                {
                  name: "cta_copy",
                  buttonParamsJson: JSON.stringify({
                    display_text: "📋 Salin ID Channel",
                    copy_code: res.id
                  })
                }
              ]
            })
          })
        }
      }
    }

    await conn.relayMessage(m.chat, msg, { messageId: m.key.id })
    await m.react('✅')

  } catch (e) {
    console.error(e)
    await m.react('❌')
    m.reply("❌ Gagal mengambil data channel. Pastikan link benar dan channel bersifat publik.")
  }
}

handler.help = ['cekidch2 <link>', 'idch2 <link>']
handler.tags = ['tools']
handler.command = /^(cekidch2|idch2)$/i

export default handler
