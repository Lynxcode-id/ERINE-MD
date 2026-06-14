// © INF PROJECT - Jemima-MD
// Developed by INF PROJECT

import axios from 'axios'
import fs from 'fs'
import path from 'path'
import os from 'os'
import FormData from 'form-data'

async function uploadTMP(filePath) {
  try {
    const form = new FormData()
    form.append("file", fs.createReadStream(filePath))
    const res = await axios.post("https://tmpfiles.org/api/v1/upload", form, { 
        headers: form.getHeaders() 
    })
    let url = res.data?.data?.url
    if (!url) throw new Error("Upload gagal")
    
    return url.replace("tmpfiles.org/", "tmpfiles.org/dl/")
  } catch (err) {
    throw new Error("Upload tmp gagal: " + err.message)
  }
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
  let [text1, text2] = text.split('|')
  if (!text) throw `⚠️ *Format Penggunaan :*\n\n📷 Kirim / reply gambar dengan caption :\n*${usedPrefix + command}* atas | bawah`

  let q = m.quoted ? m.quoted : m
  let mime = (q.msg || q).mimetype || ''
  
  if (!mime) throw `⚠️ Kirim atau reply gambar dengan caption *${usedPrefix + command}*`
  if (!/image\/(jpe?g|png)|webp/.test(mime)) throw `⚠️ Format tidak didukung! Pastikan itu gambar atau sticker.`

  await m.react('⏳')
  
  let mediaPath = path.join(os.tmpdir(), `smeme_${Date.now()}.png`)

  try {
    let media = await q.download()
    fs.writeFileSync(mediaPath, media)

    let imageUrl = await uploadTMP(mediaPath)

    const res = await axios.get("https://fybot-maker.vercel.app/api/smeme", {
      responseType: "arraybuffer",
      params: {
        url: imageUrl,
        text: `${text1 ? text1.trim() : ''}|${text2 ? text2.trim() : ''}`
      }
    })

    await conn.sendMessage(m.chat, { sticker: res.data }, { quoted: m })
    await m.react('✅')

  } catch (err) {
    console.error('smeme error:', err?.response?.data || err.message)
    await m.react('❌')
    m.reply(`❌ Gagal membuat sticker meme\n\n💡 Error :\n${err.message}`)
  } finally {
    if (fs.existsSync(mediaPath)) {
      fs.unlinkSync(mediaPath)
    }
  }
}

handler.help = ['smemevid <atas|bawah>']
handler.tags = ['sticker']
handler.command = /^(smemevid)$/i
handler.limit = true

export default handler