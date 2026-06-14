/*
FITUR : TOURL PAKET LENGKAP ANJAY
KANG KONVERT : LYNX
SALURAN : https://whatsapp.com/channel/0029Vb1CcDWDp2Q5YT4FZn1k
*/

import fs from 'fs'
import axios from 'axios'
import FormData from 'form-data'
import { fileTypeFromBuffer } from 'file-type'

let handler = async (m, { conn, quoted }) => {
  const q = quoted || m.quoted
  if (!q) return m.reply('Reply media yang mau diupload, cuy.')
  
  // 1. INJEKSI GLOBAL (Agar simple.js tidak crash)
  if (typeof global.FileType === 'undefined') {
    global.FileType = { fromBuffer: fileTypeFromBuffer }
  }

  // Validasi tipe media
  if (!/image|video|audio|sticker|document/.test(q.mtype || q.msg?.mimetype)) 
    return m.reply('Media tidak didukung.')

  await m.reply('Sabar ya, lagi di-upload ke banyak server...')

  let mediaPath = ''
  try {
    const buffer = await q.download()
    const { ext, mime } = await conn.getFile(buffer)
    const fileName = `${Date.now()}.${ext}`
    mediaPath = `./tmp/${fileName}`
    
    if (!fs.existsSync('./tmp')) fs.mkdirSync('./tmp')
    fs.writeFileSync(mediaPath, buffer)

    const termaiKey = 'AIzaBj7z2z3xBjsk' 
    const termaiDomain = 'https://c.termai.cc'
    
    // Fake User-Agent agar tidak diblokir Cloudflare/Server uploader
    const fakeUserAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'

    // ========= UPLOAD FUNCTIONS ========= //
    const uploadTermai = async (buf) => {
        try {
            const form = new FormData()
            form.append('file', buf, { filename: fileName, contentType: mime })
            const res = await axios.post(`${termaiDomain}/api/upload?key=${termaiKey}`, form, { 
                headers: { ...form.getHeaders(), 'User-Agent': fakeUserAgent } 
            })
            return res.data?.path || null
        } catch (e) { 
            console.log('Termai Error:', e?.message)
            return null 
        }
    }

    const uploadCatbox = async (buf) => {
        try {
            const form = new FormData()
            form.append('fileToUpload', buf, { filename: fileName, contentType: mime })
            form.append('reqtype', 'fileupload')
            const res = await axios.post('https://catbox.moe/user/api.php', form, { 
                headers: { ...form.getHeaders(), 'User-Agent': fakeUserAgent } 
            })
            return typeof res.data === 'string' ? res.data : null
        } catch (e) { 
            console.log('Catbox Error:', e?.message)
            return null 
        }
    }

    const uploadQuax = async (p) => {
        try {
            const form = new FormData()
            form.append('files[]', fs.createReadStream(p))
            const res = await axios.post('https://qu.ax/upload.php', form, { 
                headers: { ...form.getHeaders(), 'User-Agent': fakeUserAgent } 
            })
            return res.data?.files?.[0]?.url || null
        } catch (e) { 
            console.log('Quax Error:', e?.message)
            return null 
        }
    }

    const uploadYpnk = async (buf) => {
        try {
            const form = new FormData()
            form.append('files', buf, { filename: fileName, contentType: mime })
            const res = await axios.post('https://cdn.ypnk.biz.id/upload', form, { 
                headers: { ...form.getHeaders(), 'User-Agent': fakeUserAgent } 
            })
            return res.data?.files?.[0] ? `https://cdn.ypnk.biz.id${res.data.files[0].url}` : null
        } catch (e) { 
            console.log('YPNK Error:', e?.message)
            return null 
        }
    }

    // Uploader Cadangan Super Stabil (Tmpfiles)
    const uploadTmpfiles = async (p) => {
        try {
            const form = new FormData()
            form.append('file', fs.createReadStream(p))
            const res = await axios.post('https://tmpfiles.org/api/v1/upload', form, {
                headers: { ...form.getHeaders(), 'User-Agent': fakeUserAgent }
            })
            const match = res.data?.data?.url?.match(/tmpfiles\.org\/(.*)/)
            return match ? `https://tmpfiles.org/dl/${match[1]}` : null
        } catch (e) {
            console.log('Tmpfiles Error:', e?.message)
            return null
        }
    }

    // ========= EXECUTION ========= //
    const results = await Promise.allSettled([
      uploadQuax(mediaPath),
      uploadCatbox(buffer),
      uploadYpnk(buffer),
      uploadTermai(buffer),
      uploadTmpfiles(mediaPath)
    ])

    const [quax, catbox, ypnk, termai, tmpfiles] = results.map(v => v.status === 'fulfilled' ? v.value : null)
    
    if (!quax && !catbox && !ypnk && !termai && !tmpfiles) {
        throw 'Semua uploader gagal! Cek log console/terminal panel bot kamu.'
    }

    const ok = (v) => v ? v : '❌ Gagal'

    // --- CAPTION AESTHETIC ERINE-MD ---
    const caption = `┌˚₊ ๑│ ᴇ ʀ ɪ ɴ ᴇ  ᴍ ᴅ │๑˚₊ 🎀
┇ 🚀 › ᴍᴜʟᴛɪ ᴜᴘʟᴏᴀᴅᴇʀ
┇ 🌸 › sᴀꜰᴇ & ᴛʀᴜsᴛᴇᴅ ᴀssɪsᴛᴀɴᴛ
└˚₊ ๑ ʟ ɪ ɴ ᴋ  ʀ ᴇ s ᴜ ʟ ᴛ ๑˚₊ 🍓

┌˚ · ๑୧ ᴅ ᴇ ᴛ ᴀ ɪ ʟ s
┇ 🌍 ⁞ ǫᴜ.ᴀx : ${ok(quax)}
┇ 🌍 ⁞ ᴄᴀᴛʙᴏx : ${ok(catbox)}
┇ 🌍 ⁞ ᴛᴍᴘꜰɪʟᴇs : ${ok(tmpfiles)}
┇ 🌍 ⁞ ʏᴘɴᴋ : ${ok(ypnk)}
┇ 🌍 ⁞ ᴛᴇʀᴍᴀɪ : ${ok(termai)}
└˚₊ ๑୧

© ᴇʀɪɴᴇ ᴍᴅ x ᴊᴋᴛ𝟺𝟾 ᴠɪʙᴇ`.trim()

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

    // 2. KIRIM RESPON DENGAN TAMPILAN KHAS ERINE-MD
    await conn.sendMessage(m.chat, { 
        text: caption,
        contextInfo: {
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterName: `「 🐣 ᴇʀɪɴᴇ-ᴍᴅ ɪɴғᴏʀᴍᴀᴛɪᴏɴ 🐣 」`,
                newsletterJid: "120363400612665352@newsletter"
            }
        }
    }, { quoted: fkontak })

  } catch (err) {
    console.error(err)
    m.reply(`❌ *Error:* ${err.message || err}`)
  } finally {
    if (mediaPath && fs.existsSync(mediaPath)) fs.unlinkSync(mediaPath)
  }
}

handler.help = ['tourl2']
handler.tags = ['tools']
handler.command = /^tourl2$/i

handler.limit = true

export default handler
