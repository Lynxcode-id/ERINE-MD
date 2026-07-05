/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Author     : Lynx Decode
 * 📞 Contact    : +62 882-5804-1396
 * 📢 Channel    : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * ⚠️ Note       : Keep credit to respect the creator!
 * ─────────────────────────
 * 📝 Plugin     : AI Wink Effect (Full ESM + Uploader)
 */

import fetch from 'node-fetch'
import uploadImage from '../lib/uploadImage.js'

const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Mobile Safari/537.36',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.3 Mobile/15E148 Safari/604.1'
]

const getRandomAgent = () => USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)]

let handler = async (m, { conn, usedPrefix, command }) => {
  let q = m.quoted ? m.quoted : m
  let mime = (q.msg || q).mimetype || q.mediaType || ''
  
  if (!/image\/(jpe?g|png)/.test(mime)) {
    return m.reply(`┌˚₊ ๑│ AI WINK EFFECT │๑˚₊ ❌\n┇ \n│ ❌ *Reply/Kirim gambar dengan format JPG/PNG!*\n┇ \n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`)
  }

  await m.react('⏳')
  
  try {
    let media = await q.download()
    let url = await uploadImage(media)
    
    let res = await fetch(`https://api.cmnty.web.id/tools/wink?url=${encodeURIComponent(url)}&type=image`, {
      method: 'GET',
      headers: { 
        'Accept': 'application/json',
        'User-Agent': getRandomAgent()
      }
    })
    let json = await res.json()

    if (!json.status) throw new Error('Respon API Bermasalah.')
    
    let txt = `┌˚₊ ๑│ AI WINK EFFECT │๑˚₊ 🎨\n┇ \n│ ✅ *Berhasil diproses!*\n┇ \n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`
    await conn.sendFile(m.chat, json.result, 'wink.png', txt, m)
    await m.react('✨')
  } catch (e) {
    console.error(e)
    await m.react('❌')
    m.reply(`┌˚₊ ๑│ AI WINK EFFECT │๑˚₊ ❌\n┇ \n│ ❌ *Gagal memproses gambar:* ${e.message}\n┇ \n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`)
  }
}

handler.help = ['wink <reply gambar>']
handler.tags = ['tools']
handler.command = /^wink$/i
handler.limit = true

export default handler