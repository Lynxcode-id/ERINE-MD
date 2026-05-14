import didyoumean from 'didyoumean'
import similarity from 'similarity'
import fetch from 'node-fetch'
import fs from 'fs'
import sharp from 'sharp'

let handler = m => m

handler.before = async function (m, { match, usedPrefix }) {
  if (!m.text) return
  if ((usedPrefix = (match[0] || '')[0])) {
    let noPrefix = m.text.slice(1).trim()
    if (!noPrefix) return

    let alias = Object.values(global.plugins)
      .filter(v => v.help && !v.disabled)
      .flatMap(v => v.help)

    if (!alias.length) return

    let mean = didyoumean(noPrefix, alias)
    if (!mean) return

    let sim = similarity(noPrefix.toLowerCase(), mean.toLowerCase())
    let similarityPercentage = Math.round(sim * 100)

    if (mean && noPrefix.toLowerCase() !== mean.toLowerCase()) {

      let text = `❓ *Sepertinya kamu nyari command ini?*\n\n` +
                 `✨ commandnya - cmd : *${usedPrefix + mean}*\n` +
                 `📊 akurasi kemiripan : *${similarityPercentage}%*`

      // Membaca file gambar erine dari folder media
      let imgBuffer = fs.readFileSync('./media/erine.jpg')

      // Resize gambar menggunakan sharp
      let resizedThumb = await sharp(imgBuffer)
          .resize(300, 300, { fit: 'cover' })
          .jpeg({ quality: 80 })
          .toBuffer()

      // Set watermark dan info kontak
      let wm = global.wm || "Erine System"
      let senderNumber = m.sender.split('@')[0]

      // Membuat fake kontak
      let fkontak = {
          key: {
              fromMe: false,
              participant: `0@s.whatsapp.net`
          },
          message: {
              contactMessage: {
                  displayName: wm,
                  vcard: `BEGIN:VCARD\nVERSION:3.0\nN:XL;${wm},;;;\nFN:${wm}\nitem1.TEL;waid=${senderNumber}:${senderNumber}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`,
                  jpegThumbnail: resizedThumb
              }
          }
      }

      await this.sendMessage(
          m.chat,
          {
              document: imgBuffer,
              mimetype: 'image/png',
              fileLength: 9999,
              fileName: 'ᴇʀɪɴᴇ-ᴍᴅ ᴘʀᴏᴊᴇᴄᴛ',
              caption: text,
              jpegThumbnail: resizedThumb
          },
          {
              quoted: fkontak
          }
      )
    }
  }
}

export default handler
