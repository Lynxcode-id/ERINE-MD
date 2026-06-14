import uploadImage from '../lib/uploadImage.js' 
import fetch from 'node-fetch' 

let handler = async (m, { conn, usedPrefix, command }) => {
  let q = m.quoted ? m.quoted : m
  let mime = (q.msg || q).mimetype || ''
  
  if (!/image/.test(mime)) return m.reply(`Kirim atau balas gambar dengan caption *${usedPrefix + command}* cuy.`)
  
  m.reply('⏳ *Processing...* Upload gambar ke server dulu...')
  
  try {
    let media = await q.download()
    
    // 1. Upload gambar
    let url = await uploadImage(media) 
    
    // 🔥 KITA JEBAK DISINI 🔥
    // Kalau link-nya kosong, bukan string, atau nggak diawali "http", langsung stop!
    if (!url || typeof url !== 'string' || !url.startsWith('http')) {
        return m.reply(`❌ *Pantesan Invalid URL!*\n\nSistem \`uploadImage.js\` di bot lu lagi error cuy. Dia gagal bikin link gambar. Hasilnya malah gini:\n\n\`\`\`json\n${JSON.stringify(url, null, 2)}\n\`\`\``)
    }

    // Kalau berhasil jadi link, kita kasih liat bentar (bisa dihapus nanti kalau udah aman)
    console.log('Link berhasil dibuat:', url)

    // 2. Tembak API (Gua coba lepas encodeURIComponent-nya, kadang ada API yg ga support encode)
    let apiUrl = `https://api-varhad.my.id/tools/removebg?imageUrl=${url}`
    
    // 3. Ambil response dari API
    let res = await fetch(apiUrl)
    let contentType = res.headers.get('content-type')
    
    // SKENARIO A: Kalo API ngebalikin langsung file gambar
    if (contentType && contentType.includes('image')) {
        await conn.sendMessage(m.chat, { 
            image: { url: apiUrl }, 
            caption: '✨ *Nih cuy hasilnya, udah transparan!*' 
        }, { quoted: m })
        return
    }
    
    // SKENARIO B: Kalo API ngebalikin JSON
    let json = await res.json()

    // Cari link gambar
    let resultImage = json.data || json.url || json.result || json.imageUrl || json.image 
    
    if (!resultImage || json.status === false) {
        return m.reply(`❌ *API Nolak Cuy!*\n\nLink yang dikirim: ${url}\nBalasan API:\n\n\`\`\`json\n${JSON.stringify(json, null, 2)}\n\`\`\``)
    }

    await conn.sendMessage(m.chat, { 
        image: { url: resultImage }, 
        caption: '✨ *Nih cuy hasilnya, udah transparan!*' 
    }, { quoted: m })
    
  } catch (e) {
    console.error('❌ ERROR RMBG:', e)
    m.reply(`❌ *Gagal total cuy!*\n\n*Log:* ${String(e)}`)
  }
}

handler.help = ['rmbg']
handler.tags = ['tools']
handler.command = /^(rmbg)$/i
handler.limit = true

export default handler