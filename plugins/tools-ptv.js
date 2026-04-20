// © INF PROJECT - Erine-MD
// Developed by INF PROJECT

import pkg from '@wishkeysocket/baileys'
const { generateWAMessageContent } = pkg

let handler = async (m, { conn, usedPrefix, command }) => {
  let q = m.quoted ? m.quoted : m
  let mime = (m.quoted ? m.quoted : m.msg).mimetype || ""

  if (!/webp|image|video|gif|viewOnce/g.test(mime)) {
    return m.reply(`*• Contoh :* ${usedPrefix + command} *[reply/send media]*`)
  }

  await m.react('⏳')

  try {
    let media = await q.download()
    if (!media) throw 'Gagal mendownload media.'
    let msg = await generateWAMessageContent(
      {
        video: media,
      },
      {
        upload: conn.waUploadToServer,
      }
    )

    await conn.relayMessage(
      m.chat,
      {
        ptvMessage: msg.videoMessage,
      },
      {
        quoted: m,
      }
    )

    await m.react('✅')

  } catch (e) {
    console.error(e)
    await m.react('❌')
    m.reply(`❌ *Gagal Konversi:* Pastikan media yang dikirim adalah video atau gambar yang valid.`)
  }
}

handler.help = ["toptv"]
handler.tags = ["tools"]
handler.command = ["toptv"]
handler.limit = true
handler.admin = true

export default handler
