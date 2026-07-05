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
    throw new Error('Video tidak ditemukan.')
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
    throw new Error('Gagal mengambil data video TikTok tersebut.')
  }

  return data.data
}

function formatNumber(num = 0) {
  return num.toLocaleString()
}

function formatDuration(sec = 0) {
  const m = Math.floor(sec / 60).toString().padStart(2, '0')
  const s = Math.floor(sec % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
  const input = m.quoted ? m.quoted.text : text
  if (!input) {
    return m.reply(`❌ Link atau pencariannya mana cuy?\n\n*Contoh Penggunaan:*\n${usedPrefix + command} https://vt.tiktok.com/xxxx\n${usedPrefix + command} erine jkt48 edit`)
  }

  await m.react('⏳')

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

    const caption = `┌˚₊ ๑│ ᴛ ɪ ᴋ ᴛ ᴏ ᴋ  ᴅ ʟ │๑˚₊ 🎵
┇ 
│ 📝 *Judul:* ${title}
│ 👤 *Author:* ${uploader}
│ ⏱️ *Durasi:* ${duration}
│ 👁️ *Views:* ${views}
┇ 
└˚₊ ๑ ────────────── ๑˚₊
> © ERINE-MD`

    const buttons = [
      {
        name: "cta_url",
        buttonParamsJson: JSON.stringify({
          display_text: "🌐 ᴏᴘᴇɴ ɪɴ ᴛɪᴋᴛᴏᴋ",
          url: url,
          merchant_url: url
        })
      },
      {
        name: "quick_reply",
        buttonParamsJson: JSON.stringify({
          display_text: "🎵 ɢᴇᴛ ᴀᴜᴅɪᴏ",
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
            caption: `┌˚₊ ๑│ ᴛ ɪ ᴋ ᴛ ᴏ ᴋ  s ʟ ɪ ᴅ ᴇ │๑˚₊ 📸\n┇\n│ 🖼️ *Slide:* ${index} / ${total}\n┇\n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-MD`
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
              body: proto.Message.InteractiveMessage.Body.create({ text: caption }),
              footer: proto.Message.InteractiveMessage.Footer.create({ text: "© ERINE MD X INF PROJECT" }),
              nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({ buttons: buttons })
            })
          }
        }
      }, { quoted: m })
      await conn.relayMessage(m.chat, msgSlide.message, { messageId: msgSlide.key.id })

      return await m.react('✅')
    }

    if (res.play) {
      let media = await prepareWAMessageMedia({ video: { url: res.play } }, { upload: conn.waUploadToServer })
      
      let msgVideo = generateWAMessageFromContent(m.chat, {
        viewOnceMessage: {
          message: {
            messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 },
            interactiveMessage: proto.Message.InteractiveMessage.create({
              body: proto.Message.InteractiveMessage.Body.create({ text: caption }),
              footer: proto.Message.InteractiveMessage.Footer.create({ text: "© ERINE MD X INF PROJECT" }),
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

    await m.react('✅')
  } catch (e) {
    console.error('[TIKTOK DOWNLOAD ERROR]', e)
    await m.react('❌')
    m.reply(`┌˚₊ ๑│ s ʏ s ᴛ ᴇ ᴍ  ᴇ ʀ ʀ ᴏ ʀ │๑˚₊ ❌\n┇ Gagal memproses video TikTok:\n┇ ${e.message || e}\n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-MD`)
  }
}

handler.help = ['tt', 'tiktok', 'ttsearch']
handler.tags = ['downloader']
handler.command = /^(tt|tiktok|ttdl|tiktokdl|ttsearch)$/i
handler.limit = true

export default handler