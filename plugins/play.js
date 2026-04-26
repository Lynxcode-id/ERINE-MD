/**
 * YouTube play 
 * -----------------------------
 * Type   : Plugins ESM
 * creator : Hilman (Refined for Guaranteed Elegant UI & Fixed API)
 * Channel : https://whatsapp.com/channel/0029VbAYjQgKrWQulDTYcg2K
 */
import axios from 'axios'
import yts from 'yt-search'

function formatNumber(num) {
  return num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
}

async function getFileSizeMB(url) {
  try {
    const res = await axios.head(url)
    const bytes = parseInt(res.headers['content-length'] || 0)
    return bytes / (1024 * 1024)
  } catch {
    return 0
  }
}

let handler = async (m, { conn, text, usedPrefix, command }) => {

  if (!text) throw `Contoh penggunaan:\n\n${usedPrefix + command} lagu teranyar`

  await m.react('⏳')

  try {

    const search = await yts(text)
    const v = search.videos[0]
    if (!v) throw 'Gagal menemukan lagu'

    let caption = `
🎧 **YouTube Play**
    
🎶 **Judul:** ${v.title}
🎙️ **Artis:** ${v.author.name}
    
-----------------------------
⏳ **Durasi:** ${v.timestamp}
👀 **Dilihat:** ${formatNumber(v.views)}
📅 **Rilis:** ${v.ago}
-----------------------------
`.trim()

    let buttons = [
      { buttonId: `.ytmp4 ${v.url}`, buttonText: { displayText: '🎬 Lihat Video' }, type: 1 }
    ]

    // Tetap menggunakan format pesan gambar + tombol sesuai struktur lama lu
    await conn.sendMessage(m.chat, {
        image: { url: v.thumbnail },
        caption: caption,
        buttons: buttons,
        headerType: 4 
    }, { quoted: m });

    let baseApi = "https://api.zenzxz.my.id/download/youtube?url=https%3A%2F%2Fyoutube.com%2Fwatch%3Fv%3DpYrTbquWuCg"
    baseApi = baseApi.split('?')[0]
    
    const api = `${baseApi}?url=${encodeURIComponent(v.url)}&format=mp3`
    
    const { data } = await axios.get(api)

    if (!data.status) throw `API Error: ${JSON.stringify(data)}`

    const audio = data.result.download
    if (!audio) throw 'Link download tidak ditemukan dari API'

    const sizeMB = await getFileSizeMB(audio)

    if (sizeMB > 50) {
      await conn.sendMessage(m.chat,{
        document: { url: audio },
        mimetype: 'audio/mpeg',
        fileName: data.result.title + '.mp3'
      },{ quoted:m })
    } else {
      await conn.sendMessage(m.chat,{
        audio: { url: audio },
        mimetype: 'audio/mpeg',
        fileName: data.result.title + '.mp3'
      },{ quoted:m })
    }

    await m.react('✅')

  } catch(e) {
    console.error('[YT PLAY ERROR]', e)
    await m.react('❌')
    m.reply(`❌ Maaf, gagal memproses.\n*Log:* ${e.message || e}`)
  }
}

handler.help = ['play2']
handler.tags = ['downloader']
handler.command = /^play2$/i
handler.limit = true

export default handler