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

    // Ganti engine ke Ryzumi API
    const baseUrl = global.APIs?.ryzumi || 'https://api.ryzumi.net'
    const endpoint = `${baseUrl}/api/downloader/ytmp3` 

    const res = await axios.get(endpoint, {
        params: { url: v.url },
        headers: { 'accept': 'application/json' }
    })

    const yt = res.data

    if (!yt || !yt.url) throw 'Audio tidak ditemukan dari server Ryzumi'

    const audioRes = await axios.get(yt.url, { 
        responseType: 'arraybuffer',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
    })

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

    let infoLagu = `🎧 *${v.title}*\n👤 ${v.author.name}  |  ⏳ ${v.timestamp}\n🔗 ${v.url}`
    
    await conn.sendMessage(idsal, {
        image: { url: v.thumbnail },
        caption: infoLagu,
        contextInfo: {
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: idsal,
                newsletterName: "ᴇʀɪɴᴇ-ᴍᴅ",
                serverMessageId: -1
            }
        }
    })

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
            serverMessageId: -1
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
        text: `❌ Gagal memproses audio:\n> ${e.message || e}`,
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