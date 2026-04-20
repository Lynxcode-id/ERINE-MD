/*• Nama Fitur : Pinterest Search
• Type : Plugin ESM
• Developed for : Erine-MD | INF PROJECT
• Author : Agas (Converted by Lynx Decode)
*/

import axios from 'axios'
// Pakai alias sesuai package.json lu
import pkg from '@wishkeysocket/baileys'
const {
  proto,
  generateWAMessageFromContent,
  generateWAMessageContent
} = pkg

async function pinterestApi(query) {
  try {
    const { data } = await axios.get(
      `https://api.deline.web.id/search/pinterest?q=${encodeURIComponent(query)}`
    )
    const arr = Array.isArray(data?.data) ? data.data : []
    return arr.map((it, idx) => ({
      title: it.caption && it.caption.trim() ? it.caption : `Gambar - ${idx + 1}`,
      url: it.image,
      source: it.source || ''
    }))
  } catch (e) {
    return []
  }
}

async function createImage(url, conn) {
  const { imageMessage } = await generateWAMessageContent(
    { image: { url } },
    { upload: conn.waUploadToServer }
  )
  return imageMessage
}

let handler = async (m, { conn, text }) => {
  if (!text) return m.reply('Mau cari apa, Bang?')
  
  await m.react('🔍')
  // Hapus m.reply pencarian biar chat nggak penuh, cukup react aja

  try {
    let results = await pinterestApi(text)
    if (results.length === 0) return m.reply('❌ Gambar tidak ditemukan.')
    
    let selected = results.slice(0, 10)
    let cards = []

    for (let item of selected) {
      cards.push({
        body: proto.Message.InteractiveMessage.Body.create({
          text: 'Hasil pencarian Pinterest'
        }),
        footer: proto.Message.InteractiveMessage.Footer.create({ 
          text: '© INF PROJECT | Erine-MD' 
        }),
        header: proto.Message.InteractiveMessage.Header.create({
          title: item.title,
          hasMediaAttachment: true,
          imageMessage: await createImage(item.url, conn)
        }),
        nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
          buttons: [
            {
              name: 'cta_url',
              buttonParamsJson: JSON.stringify({
                display_text: '🌐 Lihat di Pinterest',
                url: `https://www.pinterest.com/search/pins/?q=${encodeURIComponent(text)}`
              })
            },
            {
              name: 'cta_url',
              buttonParamsJson: JSON.stringify({
                display_text: '🖼️ Buka Sumber',
                url: item.source || item.url
              })
            }
          ]
        })
      })
    }

    const msg = generateWAMessageFromContent(m.chat, {
      viewOnceMessage: {
        message: {
          messageContextInfo: { 
            deviceListMetadata: {}, 
            deviceListMetadataVersion: 2 
          },
          interactiveMessage: proto.Message.InteractiveMessage.create({
            body: proto.Message.InteractiveMessage.Body.create({ 
              text: `🔍 *PINTEREST SEARCH*\n\nQuery: _${text}_` 
            }),
            footer: proto.Message.InteractiveMessage.Footer.create({ 
              text: 'Geser untuk melihat hasil lainnya ➡️' 
            }),
            header: proto.Message.InteractiveMessage.Header.create({ 
              hasMediaAttachment: false 
            }),
            carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.create({ 
              cards 
            })
          })
        }
      }
    }, { quoted: m })

    await conn.relayMessage(m.chat, msg.message, { messageId: m.key.id })
    await m.react('✅')

  } catch (e) {
    console.error(e)
    await m.react('❌')
    m.reply('❌ Gagal mengambil hasil Pinterest. Coba lagi nanti.')
  }
}

handler.command = ['pingeser', 'pinterest', 'pinges', 'pin']
handler.help = ['pinterest <query>']
handler.tags = ['internet']
handler.register = true
handler.limit = true

export default handler
