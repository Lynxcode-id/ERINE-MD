/**
 * YouTube Play - JKT48 Edition 🌸
 * -----------------------------
 * Type    : Plugins ESM
 * Creator : Lynx 
 * System  : API Downloader
 */

import fetch from 'node-fetch'
import yts from 'yt-search'

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

    let caption = `🌸 *𝙴𝚁𝙸𝙽𝙴 𝙿𝙻𝙰𝚈 𝙴𝙽𝙶𝙸𝙽𝙴* 🌸\n\n`
    caption += `🎤 *Judul:* ${v.title}\n`
    caption += `🌟 *Artis:* ${v.author.name}\n`
    caption += `⏱️ *Durasi:* ${v.timestamp}\n`
    caption += `👀 *Penonton:* ${formatNumber(v.views)}\n`
    caption += `📅 *Rilis:* ${v.ago}\n\n`
    caption += `🎧 _Sedang menyiapkan audionya, tunggu sebentar ya..._\n`
    caption += `> © ERINE-MD`

    let buttons = [
      { buttonId: `.ytmp4 ${v.url}`, buttonText: { displayText: '🎬 Lihat Performance (MP4)' }, type: 1 }
    ]

    await conn.sendMessage(m.chat, {
        image: { url: v.thumbnail },
        caption: caption,
        buttons: buttons,
        headerType: 4 
    }, { quoted: m })

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

handler.help = ['play']
handler.tags = ['downloader']
handler.command = /^play4$/i
handler.limit = true

export default handler