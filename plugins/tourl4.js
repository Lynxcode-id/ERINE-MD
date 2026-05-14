/*
FITUR : TOURL MULTI UPLOADER (JEMIMA VERSION)
KANG KONVERT : LYNX
SALURAN : https://whatsapp.com/channel/0029Vb1CcDWDp2Q5YT4FZn1k
*/

import fs from 'fs'
import axios from 'axios'
import FormData from 'form-data'
import { fileTypeFromBuffer } from 'file-type'

// 🔑 USER HASH CATBOX KAMU
const USER_HASH = '01432e715cf28f18f7a61879b' 

let handler = async (m, { conn, args, usedPrefix, command, quoted, isOwner }) => {
  const q = quoted || m.quoted
  const action = args[0]?.toLowerCase()
  
  if (typeof global.FileType === 'undefined') {
    global.FileType = { fromBuffer: fileTypeFromBuffer }
  }

  const fakeUserAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'

  // ==========================================
  // FITUR DELETE FILE (Khusus Owner)
  // ==========================================
  if (action === 'delete') {
      if (!isOwner) return m.reply('❌ Maaf, fitur hapus file hanya bisa digunakan oleh Owner bot.')
      if (!USER_HASH) return m.reply('❌ Fitur hapus gagal: *USER_HASH* belum diisi!')
      if (!args[1]) return m.reply(`❓ Masukkan nama file yang mau dihapus.\nContoh: *${usedPrefix + command} delete abcdef.jpg*`)
      
      const fileName = args[1]
      try {
          const form = new FormData()
          form.append('reqtype', 'deletefiles')
          form.append('userhash', USER_HASH)
          form.append('files', fileName)

          const res = await axios.post('https://catbox.moe/user/api.php', form, {
              headers: { ...form.getHeaders(), 'User-Agent': fakeUserAgent }
          })

          if (res.data === '') {
              return m.reply(`✅ File *${fileName}* berhasil dihapus dari Catbox.`)
          } else {
              return m.reply(`❌ Gagal menghapus: ${res.data}`)
          }
      } catch (e) {
          return m.reply(`❌ Error saat menghapus: ${e.message}`)
      }
  }

  // Validasi awal
  if (!q) return m.reply(`Reply media yang mau diupload!\n\n*Opsi:*\n1. *${usedPrefix + command}* (Upload Publik)\n2. *${usedPrefix + command} temp 1h* (Upload Sementara/Litterbox)\n3. *${usedPrefix + command} delete <namafile>* (Hapus dari Catbox)`)

  if (!/image|video|audio|sticker|document/.test(q.mtype || q.msg?.mimetype)) 
    return m.reply('Media tidak didukung.')

  await m.reply('Sabar ya, lagi di-upload ke banyak server...')

  let mediaPath = ''
  try {
    const buffer = await q.download()
    const { ext, mime } = await conn.getFile(buffer)
    const fileName = `media_${Date.now()}.${ext}`
    mediaPath = `./tmp/${fileName}`
    
    if (!fs.existsSync('./tmp')) fs.mkdirSync('./tmp')
    fs.writeFileSync(mediaPath, buffer)

    // ==========================================
    // LITTERBOX (UPLOAD SEMENTARA)
    // ==========================================
    if (action === 'temp') {
        const validTimes = ['1h', '12h', '24h', '72h']
        const time = validTimes.includes(args[1]) ? args[1] : '1h'

        const form = new FormData()
        form.append('reqtype', 'fileupload')
        form.append('time', time)
        form.append('fileToUpload', fs.createReadStream(mediaPath))

        const res = await axios.post('https://litterbox.catbox.moe/api.php', form, {
            headers: { ...form.getHeaders(), 'User-Agent': fakeUserAgent }
        })
        
        const resultUrl = typeof res.data === 'string' ? res.data : null
        if (resultUrl) {
            return m.reply(`✅ *LITTERBOX UPLOAD*\n\n🌍 **Link:** ${resultUrl}\n⏳ **Expired:** ${time}`)
        } else throw 'Litterbox mengembalikan respon kosong.'
    }

    // ==========================================
    // FUNGSI UPLOAD BARENGAN (MULTI UPLOADER)
    // ==========================================
    const uploadTermai = async () => {
        try {
            const termaiKey = 'AIzaBj7z2z3xBjsk' 
            const form = new FormData()
            form.append('file', buffer, { filename: fileName, contentType: mime })
            const res = await axios.post(`https://c.termai.cc/api/upload?key=${termaiKey}`, form, { 
                headers: { ...form.getHeaders(), 'User-Agent': fakeUserAgent } 
            })
            return res.data?.path || null
        } catch { return null }
    }

    const uploadCatbox = async () => {
        try {
            const form = new FormData()
            form.append('reqtype', 'fileupload')
            if (USER_HASH) form.append('userhash', USER_HASH)
            form.append('fileToUpload', fs.createReadStream(mediaPath))
            const res = await axios.post('https://catbox.moe/user/api.php', form, { 
                headers: { ...form.getHeaders(), 'User-Agent': fakeUserAgent } 
            })
            return typeof res.data === 'string' && res.data.startsWith('http') ? res.data : null
        } catch { return null }
    }

    const uploadQuax = async () => {
        try {
            const form = new FormData()
            form.append('files[]', fs.createReadStream(mediaPath))
            const res = await axios.post('https://qu.ax/upload.php', form, { 
                headers: { ...form.getHeaders(), 'User-Agent': fakeUserAgent } 
            })
            return res.data?.files?.[0]?.url || null
        } catch { return null }
    }

    const uploadYpnk = async () => {
        try {
            const form = new FormData()
            form.append('files', buffer, { filename: fileName, contentType: mime })
            const res = await axios.post('https://cdn.ypnk.biz.id/upload', form, { 
                headers: { ...form.getHeaders(), 'User-Agent': fakeUserAgent } 
            })
            return res.data?.files?.[0] ? `https://cdn.ypnk.biz.id${res.data.files[0].url}` : null
        } catch { return null }
    }

    const uploadTmpfiles = async () => {
        try {
            const form = new FormData()
            form.append('file', fs.createReadStream(mediaPath))
            const res = await axios.post('https://tmpfiles.org/api/v1/upload', form, {
                headers: { ...form.getHeaders(), 'User-Agent': fakeUserAgent }
            })
            const match = res.data?.data?.url?.match(/tmpfiles\.org\/(.*)/)
            return match ? `https://tmpfiles.org/dl/${match[1]}` : null
        } catch { return null }
    }

    const uploadDeline = async () => {
        try {
            const fd = new FormData()
            fd.append("file", buffer, { filename: fileName, contentType: mime })
            const res = await axios.post("https://api.deline.web.id/uploader", fd, {
                headers: { ...fd.getHeaders(), 'User-Agent': fakeUserAgent },
                maxBodyLength: 50 * 1024 * 1024,
                maxContentLength: 50 * 1024 * 1024,
            })
            const data = res.data || {}
            return data?.result?.link || data?.url || data?.path || null
        } catch { return null }
    }

    const results = await Promise.allSettled([
      uploadCatbox(),
      uploadDeline(),
      uploadQuax(),
      uploadTmpfiles(),
      uploadYpnk(),
      uploadTermai()
    ])

    const [catbox, deline, quax, tmpfiles, ypnk, termai] = results.map(v => v.status === 'fulfilled' ? v.value : null)
    
    if (!catbox && !deline && !quax && !tmpfiles && !ypnk && !termai) {
        throw 'Semua uploader gagal! Server tujuan kemungkinan sedang down.'
    }

    const ok = (v) => v ? v : '❌ Gagal'

    const caption = `╭─ 「 **UPLOAD SUCCESS** 」
🌍 **Catbox:** ${ok(catbox)}
🌍 **Deline:** ${ok(deline)}
🌍 **Qu.ax:** ${ok(quax)}
🌍 **Tmpfiles:** ${ok(tmpfiles)}
🌍 **YPNK:** ${ok(ypnk)}
🌍 **Termai:** ${ok(termai)}
╰───────────────`

    await conn.sendMessage(m.chat, { 
        image: { url: 'https://files.catbox.moe/ee5dot.jpg' },
        caption: caption,
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

  } catch (err) {
    console.error(err)
    m.reply(`❌ *Error:* ${err.message || err}`)
  } finally {
    if (mediaPath && fs.existsSync(mediaPath)) fs.unlinkSync(mediaPath)
  }
}

handler.help = ['tourl4']
handler.tags = ['tools']
handler.command = /^tourl4$/i
handler.limit = true

export default handler
