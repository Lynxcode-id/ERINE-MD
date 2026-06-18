/**
 * YouTube Play - JKT48 Edition 🌸 (Ultra Stable Link Preview)
 * -----------------------------
 * Type    : Plugins ESM
 * Creator : Lynx 
 * System  : API Downloader + Jimp + lib/uploadImage
 */

import fetch from 'node-fetch'
import yts from 'yt-search'
import Jimp from 'jimp'
import uploadImage from '../lib/uploadImage.js'
import { generateWAMessageFromContent, generateWAMessageContent } from '@whiskeysockets/baileys'

function formatNumber(num) {
  return num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
}

async function getFileSizeMB(url) {
  try {
    const res = await fetch(url, {
      method: 'HEAD',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': '*/*'
      }
    })
    const bytes = parseInt(res.headers.get('content-length') || 0)
    return bytes / (1024 * 1024)
  } catch {
    return 0
  }
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return m.reply(`❌ Kasih tau judul lagunya dong!\n\nContoh: ${usedPrefix || '.'}${command} pesawat kertas 365 hari`)
  }

  await m.react('⏳')

  try {
    const search = await yts(text)
    const v = search.videos[0]
    if (!v) throw '❌ Wah, ngga nemu lagunya di setlist manapun.'

    const image = await Jimp.read(v.thumbnail)
    const buffer = await image
        .cover(1024, 576)
        .quality(70)
        .getBufferAsync(Jimp.MIME_JPEG)

    const stableThumbUrl = await uploadImage(buffer)
    let imageMsg = await generateWAMessageContent(
      { image: { url: stableThumbUrl } },
      { upload: conn.waUploadToServer }
    )
    let imgMeta = imageMsg.imageMessage 

    let msg = generateWAMessageFromContent(m.chat, {
      extendedTextMessage: {
        text: `🌸 _Sedang menyiapkan audio..._\n\n🔗 https://youtu.be/${v.videoId}`,
        matchedText: `https://youtu.be/${v.videoId}`,
        title: v.title,
        description: `👤 ${v.author.name} • ⏱️ ${v.timestamp} • 👀 ${formatNumber(v.views)} views`,
        previewType: 2,
        jpegThumbnail: imgMeta.jpegThumbnail, 
        thumbnailDirectPath: imgMeta.directPath, 
        thumbnailSha256: imgMeta.fileSha256,
        thumbnailEncSha256: imgMeta.fileEncSha256,
        mediaKey: imgMeta.mediaKey, 
        mediaKeyTimestamp: imgMeta.mediaKeyTimestamp,
        thumbnailHeight: 576, 
        thumbnailWidth: 1024, 
        inviteLinkGroupTypeV2: 0,
        contextInfo: { 
          mentionedJid: [] 
        }
      }
    }, { quoted: m })

    await conn.relayMessage(m.chat, msg.message, { 
      messageId: msg.key.id 
    })

    const apiUrl = `https://api.theresav.biz.id/download/ytmp3/v2?url=${encodeURIComponent(v.url)}&bitrate=128&apikey=x34J0`
    const apiRes = await fetch(apiUrl)
    const data = await apiRes.json()
    
    let audioUrl = data?.result?.download?.url || data?.result?.url || data?.url || data?.result
    
    if (!audioUrl || typeof audioUrl !== 'string') {
        throw new Error('Gagal mendapatkan link audio dari API.')
    }

    const filename = data?.result?.title ? `${data.result.title}.mp3` : `${v.title}.mp3`
    const sizeMB = await getFileSizeMB(audioUrl)
    if (sizeMB > 50) {
      await conn.sendMessage(m.chat, {
        document: { url: audioUrl },
        mimetype: 'audio/mpeg',
        fileName: filename
      }, { quoted: m })
    } else {
      await conn.sendMessage(m.chat, {
        audio: { url: audioUrl },
        mimetype: 'audio/mpeg',
        fileName: filename
      }, { quoted: m })
    }

    await m.react('✅')

  } catch(e) {
    console.error('[YT PLAY ERROR]', e)
    await m.react('❌')
    m.reply(`⚠️ *System Error:*\n_${e.message || e}_`)
  }
}

handler.help = ['play4']
handler.tags = ['downloader']
handler.command = /^play4$/i
handler.limit = true

export default handler