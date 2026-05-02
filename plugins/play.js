/**
 * YouTube Play - Jemima JKT48 Edition 🌸
 * -----------------------------
 * Type    : Plugins ESM
 * Creator : Lynx (Refactored for Jemima)
 * System  : API Faa + Parameter "query" Fixed
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
    return m.reply(`❌ Kasih tau Jemima judul lagunya dong!\n\nContoh: ${usedPrefix || '.'}${command} pesawat kertas 365 hari`)
  }

  await m.react('⏳')

  try {
    // 1. Cari via YTS biar data metadata rapi & akurat di chat
    const search = await yts(text)
    const v = search.videos[0]
    if (!v) throw '❌ Wah, Jemima ngga nemu lagunya di setlist manapun.'

    // 2. UI Jemima x JKT48
    let caption = `
╭───「 𝙴𝚁𝙸𝙽𝙴 𝙿𝙻𝙰𝚈 𝙴𝙽𝙶𝙸𝙽𝙴 」───🎀
│ 
│  🎤 𝐉𝐮𝐝𝐮𝐥   : ${v.title}
│  🌟 𝐀𝐫𝐭𝐢𝐬   : ${v.author.name}
│  ⏱️ 𝐃𝐮𝐫𝐚𝐬𝐢  : ${v.timestamp}
│  👀 𝐏𝐞𝐧𝐨𝐧𝐭𝐨𝐧: ${formatNumber(v.views)}
│  📅 𝐑𝐢𝐥𝐢𝐬   : ${v.ago}
│
╰──────────────────────────✨
🎧 _Jemima sedang menyiapkan audionya, tunggu sebentar ya..._
`.trim()

    let buttons = [
      { buttonId: `.ytmp4 ${v.url}`, buttonText: { displayText: '🎬 Lihat Performance (MP4)' }, type: 1 }
    ]

    await conn.sendMessage(m.chat, {
        image: { url: v.thumbnail },
        caption: caption,
        buttons: buttons,
        headerType: 4 
    }, { quoted: m })

    const baseApi = "https://api-faa.my.id/faa/ytplay"
    const api = `${baseApi}?query=${encodeURIComponent(v.title + ' ' + v.author.name)}`
    
    const response = await fetch(api, {
      method: 'GET',
      headers: { 
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
      }
    })

    if (!response.ok) {
        let errDetails = ''
        try {
            const errJson = await response.json()
            errDetails = JSON.stringify(errJson)
        } catch {
            errDetails = await response.text()
        }
        throw new Error(`HTTP ${response.status}\nRespon Server: ${errDetails}`)
    }

    const data = await response.json()

    if (!data.status || !data.result) throw new Error('Jemima gagal mengambil buffer audio dari server Faa.')

    const audio = data.result.mp3
    if (!audio) throw new Error('Link MP3 tidak ditemukan dari API Faa.')

    const sizeMB = await getFileSizeMB(audio)

    if (sizeMB > 50) {
      await conn.sendMessage(m.chat, {
        document: { url: audio },
        mimetype: 'audio/mpeg',
        fileName: data.result.title + '.mp3'
      }, { quoted: m })
    } else {
      await conn.sendMessage(m.chat, {
        audio: { url: audio },
        mimetype: 'audio/mpeg',
        fileName: data.result.title + '.mp3'
      }, { quoted: m })
    }

    await m.react('✅')

  } catch(e) {
    console.error('[YT PLAY ERROR]', e)
    await m.react('❌')
    m.reply(`⚠️ *Jemima System Error:*\n_${e.message || e}_`)
  }
}

handler.help = ['play']
handler.tags = ['downloader']
handler.command = /^play$/i
handler.limit = true

export default handler