import axios from 'axios'
import yts from 'yt-search'
import fs from 'fs'
import path from 'path'
import os from 'os'
import { spawn } from 'child_process'

function isYoutubeUrl(url) {
  return /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//i.test(url)
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
  let wm = global.wm || "Erine System"
  let senderNumber = m.sender.split('@')[0]
  
  let fkontak = {
      key: {
          fromMe: false,
          participant: `0@s.whatsapp.net`
      },
      message: {
          contactMessage: {
              displayName: wm,
              vcard: `BEGIN:VCARD\nVERSION:3.0\nN:XL;${wm},;;;\nFN:${wm}\nitem1.TEL;waid=${senderNumber}:${senderNumber}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
          }
      }
  }

  const contextErine = {
      forwardingScore: 999,
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
          newsletterName: `「 🐣 ᴇʀɪɴᴇ-ᴍᴅ ɪɴғᴏʀᴍᴀᴛɪᴏɴ 🐣 」`,
          newsletterJid: "120363400612665352@newsletter"
      }
  }

  if (!text) {
      return conn.sendMessage(m.chat, { 
          text: `Contoh:\n${usedPrefix + command} multo`,
          contextInfo: contextErine
      }, { quoted: fkontak })
  }

  const idsal = '120363400612665352@newsletter'
  let tempInput, tempOutput

  try {
    await m.react('⏳')

    let v

    if (isYoutubeUrl(text)) {
      const search = await yts({ videoId: text.split('v=')[1] || text.split('/').pop() })
      v = search
    } else {
      const search = await yts(text)
      v = search.videos[0]
    }

    if (!v) throw 'Lagu tidak ditemukan'

    let caption = `┌˚₊ ๑│ ᴇ ʀ ɪ ɴ ᴇ  ᴍ ᴅ │๑˚₊ 🎀
┇ 🎵 › ʏᴛ ᴛᴏ ᴄʜᴀɴɴᴇʟ
┇ 🌸 › sᴀꜰᴇ & ᴛʀᴜsᴛᴇᴅ ᴀssɪsᴛᴀɴᴛ
└˚₊ ๑ ᴛ ʀ ᴀ ᴄ ᴋ  ɪ ɴ ꜰ ᴏ ๑˚₊ 🍓

┌˚ · ๑୧ ᴅ ᴇ ᴛ ᴀ ɪ ʟ s
┇ 🎧 ⁞ ᴛɪᴛʟᴇ : ${v.title}
┇ 👤 ⁞ ᴄʜᴀɴɴᴇʟ : ${v.author.name}
┇ ⏳ ⁞ ᴅᴜʀᴀᴛɪᴏɴ : ${v.timestamp}
└˚₊ ๑୧

*Tunggu sebentar, audio sedang dikirim ke saluran...* ⏳
© ᴇʀɪɴᴇ ᴍᴅ x ᴊᴋᴛ𝟺𝟾 ᴠɪʙᴇ`.trim()

    await conn.sendMessage(m.chat, {
        text: caption,
        contextInfo: contextErine
    }, { quoted: fkontak })

    const api = `https://api.nexray.web.id/downloader/ytmp3?url=${encodeURIComponent(v.url)}`
    const { data } = await axios.get(api)

    if (!data.status) throw 'Audio tidak ditemukan'

    const audioUrl = data.result.url
    const audioRes = await axios.get(audioUrl, { responseType: 'arraybuffer' })

    tempInput = path.join(os.tmpdir(), `${Date.now()}_input.mp3`)
    tempOutput = path.join(os.tmpdir(), `${Date.now()}_output.opus`)

    fs.writeFileSync(tempInput, Buffer.from(audioRes.data))

    await new Promise((resolve, reject) => {
      const ffmpeg = spawn('ffmpeg', [
        '-i', tempInput,
        '-map_metadata', '-1',
        '-vn',
        '-ac', '1',
        '-ar', '48000',
        '-c:a', 'libopus',
        '-b:a', '128k',
        '-y',
        tempOutput
      ])

      let stderr = ''
      ffmpeg.stderr.on('data', d => stderr += d.toString())
      ffmpeg.on('close', code => {
        if (code === 0) resolve()
        else reject(new Error(stderr))
      })
    })

    const opusBuffer = fs.readFileSync(tempOutput)

    await conn.sendMessage(idsal, {
      audio: opusBuffer,
      mimetype: 'audio/ogg; codecs=opus',
      ptt: true,
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: idsal,
            newsletterName: "ᴇʀɪɴᴇ-ᴍᴅ",
            serverMessageId: 100
        }
      }
    })

    await conn.sendMessage(m.chat, {
        text: `✅ Berhasil mengirim *${v.title}* ke channel!`,
        contextInfo: contextErine
    }, { quoted: fkontak })

    await m.react('✅')

  } catch (e) {
    console.error(e)
    await m.react('❌')
    await conn.sendMessage(m.chat, {
        text: '❌ Gagal mengambil atau mengirim audio.',
        contextInfo: contextErine
    }, { quoted: fkontak })
  } finally {
    if (tempInput && fs.existsSync(tempInput)) fs.unlinkSync(tempInput)
    if (tempOutput && fs.existsSync(tempOutput)) fs.unlinkSync(tempOutput)
  }
}

handler.help = ['playch']
handler.tags = ['owner']
handler.command = /^playch$/i
handler.owner = true

export default handler
