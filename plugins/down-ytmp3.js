import fetch from "node-fetch"

let handler = async (m, { conn, args, usedPrefix, command }) => {
  await m.react('⏳')

  const url = args[0]
  if (!url) {
    return m.reply(`Mana linknya Lex?\n*Contoh:* ${usedPrefix + command} https://youtube.com/watch?v=JoMTMEA2WMY`)
  }

  if (!/^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\//.test(url)) {
    return m.reply('❌ Linknya harus dari YouTube yang valid.')
  }

  try {
    let baseApi = "https://api.zenzxz.my.id/download/youtube?url=https%3A%2F%2Fyoutube.com%2Fwatch%3Fv%3DpYrTbquWuCg"
    
    baseApi = baseApi.split('?')[0]
    
    const apiUrl = `${baseApi}?url=${encodeURIComponent(url)}&format=mp3`
    
    const res = await fetch(apiUrl)
    
    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
        const textError = await res.text();
        throw new Error(`API gak ngirim JSON cuy! Status: ${res.status}\nRespon: ${textError.substring(0, 150)}...`);
    }

    const json = await res.json()

    if (!json.status) {
        throw new Error(`Status false dari API! Pesan: ${JSON.stringify(json)}`);
    }
    
    const result = json.result
    if (!result?.download) {
        throw new Error("Data JSON sukses, tapi 'result.download' kosong / ga ketemu!");
    }

    let durationText = '-'
    if (result.duration) {
        let mnt = Math.floor(result.duration / 60)
        let dtk = (result.duration % 60).toString().padStart(2, '0')
        durationText = `${mnt}:${dtk}`
    }

    let info = `*乂  Y O U T U B E  -  A U D I O*\n\n`
    info += `  ∘ *Title:* ${result.title || 'Unknown'}\n`
    info += `  ∘ *Format:* MP3\n`
    info += `  ∘ *Duration:* ${durationText}\n`
    info += `\n*Sistem sedang mengirim file, tunggu sebentar...* 🚀`

    await m.reply(info)

    await conn.sendMessage(m.chat, {
      audio: { url: result.download },
      mimetype: 'audio/mpeg',
      fileName: `${result.title || 'audio'}.mp3`,
      ptt: false
    }, { quoted: m })

    await m.react('✅')

  } catch (err) {
    console.error('[YTMP3 DEBUG]', err)
    await m.react('❌')
    m.reply(`❌ *SYSTEM ERROR*\n\nGagal narik data dari API.\n\n*Diagnosa Log:*\n${err.message}`)
  }
}

handler.help = ['ytmp3 <url>']
handler.tags = ['downloader']
handler.command = /^(ytmp3|youtubemp3|ytaudio)$/i
handler.limit = true

export default handler