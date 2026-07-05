import axios from 'axios'

let handler = async (m, { conn, args }) => {
  const sadNumber = parseInt(args[0] || '', 10)

  if (isNaN(sadNumber) || sadNumber < 1 || sadNumber > 34)
    throw 'Masukkan nomor antara 1 dan 34\nContoh: .sad 2'

  const audioUrl = `https://github.com/Rangelofficial/Sad-Music/raw/main/audio-sad/sad${sadNumber}.mp3`

  m.reply('🍬 Mengirim audio...')

  const res = await fetch(audioUrl)
  if (!res.ok) throw 'Gagal mengunduh audio.'
  const audioBuffer = Buffer.from(await res.arrayBuffer())

  await conn.sendMessage(m.chat, {
    audio: audioBuffer,
    mimetype: 'audio/mpeg',
    ptt: false,
    contextInfo: {
      isForwarded: true,
      forwardingScore: 9999,
      forwardedNewsletterMessageInfo: {
        newsletterJid: "120363400612665352@newsletter",
        newsletterName: "🌟 ᴇʀɪɴᴇ-ᴍᴅ ɪɴғᴏʀᴍᴀᴛɪᴏɴ",
        serverMessageId: -1
      }
    }
  }, { quoted: m })
}

handler.help = ['sad <nomor>']
handler.tags = ['sound']
handler.command = /^sad$/i
handler.limit = true

export default handler
