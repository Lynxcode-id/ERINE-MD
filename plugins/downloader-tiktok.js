import axios from 'axios'

import { generateWAMessageFromContent, proto, prepareWAMessageMedia } from '@whiskeysockets/baileys'

async function searchTikTok(query) {
  const { data } = await axios.get(
    'https://tikwm.com/api/feed/search',
    {
      params: { keywords: query, count: 1 },
      timeout: 20000
    }
  )

  if (!data || data.code !== 0 || !data.data?.videos?.length) {
    throw 'Hasil tidak ditemukan'
  }

  const v = data.data.videos[0]
  return `https://www.tiktok.com/@${v.author.unique_id}/video/${v.video_id}`
}

async function getTikTok(url) {
  const { data } = await axios.get(
    'https://tikwm.com/api/',
    {
      params: { url, hd: 1 },
      timeout: 20000
    }
  )

  if (!data || data.code !== 0) {
    throw 'ɢᴀɢᴀʟ ᴍᴇɴɢᴀᴍʙɪʟ ᴅᴀᴛᴀ ᴠɪᴅɪᴏ ᴛɪᴋᴛᴏᴋ ᴛᴇʀsᴇʙᴜᴛ'
  }

  return data.data
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
  await m.react('🔥')

  const input = m.quoted ? m.quoted.text : text
  if (!input) {
    return m.reply(
      `ᴄᴏɴᴛᴏʜ:\n` +
      `${usedPrefix + command} https://vt.tiktok.com/xxxx\n` +
      `${usedPrefix + command} ᴇʀɪɴᴇ ᴊᴋᴛ48 ᴇᴅɪᴛ`
    )
  }

  try {
    let url = input

    if (!/^https?:\/\//i.test(input)) {
      url = await searchTikTok(input)
    }

    const res = await getTikTok(url)

    const title = res.title || '-'
    const uploader = res.author?.nickname || res.author?.unique_id || '-'
    const duration = formatDuration(res.duration)
    const views = formatNumber(res.play_count || res.play || res.views || 0)

    const caption = `ᐖ *ᴛɪᴋᴛᴏᴋ ᴠɪᴅᴇᴏ ɪɴғᴏʀᴍᴀᴛɪᴏɴ*\n\n> *ᴊᴜᴅᴜʟ ᴠɪᴅɪᴏ* :\n${title}\n> *ᴜᴘʟᴏᴀᴅᴇʀ - ᴘᴇᴍʙᴜᴀᴛ* :\n${uploader}\n> *ᴅᴜʀᴀsɪ ᴠɪᴅɪᴏ* :\n${duration}\n> *ᴠɪᴇᴡs* :\n${views}\n\n> *ᴅᴏᴡɴʟᴏᴀᴅ ʙʏ ᴇʀɪɴᴇ ᴍᴅ - ʙᴏᴛ ᴡʜᴀᴛsᴀᴘᴘ*`.trim()

    const buttons = [
      {
        name: "cta_url",
        buttonParamsJson: JSON.stringify({
          display_text: "⚡ Buka di TikTok",
          url: url,
          merchant_url: url
        })
      },
      {
        name: "quick_reply",
        buttonParamsJson: JSON.stringify({
          display_text: "🎵 Ambil Audio",
          id: `${usedPrefix}ttmp3 ${url}`
        })
      }
    ]

    if (Array.isArray(res.images) && res.images.length > 0) {
      let total = res.images.length
      let index = 1

      for (const img of res.images) {
        await conn.sendMessage(
          m.chat,
          {
            image: { url: img },
            caption: `${caption}\n\n> *Slide*: ${index} / ${total}`
          },
          { quoted: m }
        )
        index++
      }

      let msgSlide = generateWAMessageFromContent(m.chat, {
        viewOnceMessage: {
          message: {
            messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 },
            interactiveMessage: proto.Message.InteractiveMessage.create({
              body: proto.Message.InteractiveMessage.Body.create({ text: "Gunakan tombol di bawah untuk mengunduh audio atau membuka postingan asli." }),
              footer: proto.Message.InteractiveMessage.Footer.create({ text: "ᴇʀɪɴᴇ-ᴍᴅ" }),
              nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({ buttons: buttons })
            })
          }
        }
      }, { quoted: m })
      await conn.relayMessage(m.chat, msgSlide.message, { messageId: msgSlide.key.id })

      await m.react('😈')
      return
    }

    if (res.play) {
      let media = await prepareWAMessageMedia({ video: { url: res.play } }, { upload: conn.waUploadToServer })
      
      let msgVideo = generateWAMessageFromContent(m.chat, {
        viewOnceMessage: {
          message: {
            messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 },
            interactiveMessage: proto.Message.InteractiveMessage.create({
              body: proto.Message.InteractiveMessage.Body.create({ text: caption }),
              footer: proto.Message.InteractiveMessage.Footer.create({ text: "ᴊᴇᴍɪᴍᴀ ᴍᴅ" }),
              header: proto.Message.InteractiveMessage.Header.create({
                title: "",
                hasMediaAttachment: true,
                videoMessage: media.videoMessage
              }),
              nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({ buttons: buttons })
            })
          }
        }
      }, { quoted: m })
      
      await conn.relayMessage(m.chat, msgVideo.message, { messageId: msgVideo.key.id })
    }

    await m.react('😎')
  } catch (e) {
    await m.react('❌')
    throw String(e)
  }
}

handler.help = ['tt', 'tiktok', 'ttsearch']
handler.tags = ['downloader']
handler.command = /^(tt|tiktok|ttsearch)$/i
handler.limit = true
handler.register = true

export default handler

function formatNumber(num = 0) {
  return num.toLocaleString()
}

function formatDuration(sec = 0) {
  const m = Math.floor(sec / 60).toString().padStart(2, '0')
  const s = Math.floor(sec % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}