// © INF PROJECT - Erine-MD
// Developed by INF PROJECT

import axios from "axios"
import PDFDocument from "pdfkit"
import pkg from "@wishkeysocket/baileys"
const { extractImageThumb } = pkg
import fetch from "node-fetch"

let handler = async(m, { conn, args, usedPrefix }) => {
  // 1. Cek NSFW Group
  if (m.isGroup && !global.db.data.chats[m.chat]?.nsfw) {
    throw `🚫 Group ini tidak dihidupkan nsfw \n\n ketik \n*${usedPrefix}enable nsfw* untuk menghidupkan fitur ini`;
  }

  // 2. Cek Umur User
  let userAge = global.db.data.users[m.sender]?.age || 0;
  if (userAge < 17) return m.reply(`*Sepertinya umur kamu di bawah 18thn!*`);

  let code = (args[0] || '').replace(/\D/g, '')
  if (!code) throw `Contoh penggunaan:\n\n${usedPrefix}nhentaidl 123456` 
  
  await m.react('⏳')
  await m.reply('_In progress, generating PDF..._')
  
  try {
    let data = await nhentaiScraper(code)
    let pages = []
    let thumbUrl = `https://external-content.duckduckgo.com/iu/?u=https://t.nhentai.net/galleries/${data.media_id}/thumb.jpg`	
    
    data.images.pages.map((v, i) => {
      let ext = new URL(v.t).pathname.split('.')[1]
      // Proxy DuckDuckGo buat bypass blockir/ip-block
      pages.push(`https://external-content.duckduckgo.com/iu/?u=https://i7.nhentai.net/galleries/${data.media_id}/${i + 1}.${ext}`)
    })
    
    // Ambil Thumbnail
    const thumbRes = await fetch(thumbUrl)
    const thumbBuffer = Buffer.from(await thumbRes.arrayBuffer())
    let jpegThumbnail = await extractImageThumb(thumbBuffer)		
    
    // Proses Gambar ke PDF
    let imagepdf = await toPDF(pages)		
    
    await conn.sendMessage(m.chat, { 
        document: imagepdf, 
        jpegThumbnail, 
        fileName: `${data.title.english || data.title.japanese}.pdf`, 
        mimetype: 'application/pdf' 
    }, { quoted: m })
    
    await m.react('✅')

  } catch (e) {
    console.error(e)
    await m.react('❌')
    m.reply('❌ Gagal mengunduh data. Pastikan kode valid atau server scraper sedang tidak down.')
  }
} 

handler.command = /^nhentaidl$/i
handler.tags = ['nsfw']
handler.help = ['nhentaidl <code>']
handler.premium = true

export default handler 

async function nhentaiScraper(id) {
  let uri = id ? `https://cin.guru/v/${+id}/` : 'https://cin.guru/'
  let { data: html } = await axios.get(uri)
  return JSON.parse(html.split('<script id="__NEXT_DATA__" type="application/json">')[1].split('</script>')[0]).props.pageProps.data
}

function toPDF(images, opt = {}) {
  return new Promise(async (resolve, reject) => {
    if (!Array.isArray(images)) images = [images]
    let buffs = [], doc = new PDFDocument({ margin: 0, size: 'A4' })
    
    for (let x = 0; x < images.length; x++) {
      if (/.webp|.gif/.test(images[x])) continue
      try {
        const res = await axios.get(images[x], { responseType: 'arraybuffer', ...opt })
        const data = Buffer.from(res.data)
        
        // Fit gambar ke ukuran A4
        doc.image(data, 0, 0, { fit: [595.28, 841.89], align: 'center', valign: 'center' })
        if (images.length !== x + 1) doc.addPage()
      } catch (err) {
        console.error(`Gagal load gambar page ${x + 1}:`, err.message)
        continue 
      }
    }
    
    doc.on('data', (chunk) => buffs.push(chunk))
    doc.on('end', () => resolve(Buffer.concat(buffs)))
    doc.on('error', (err) => reject(err))
    doc.end()
  })
}
