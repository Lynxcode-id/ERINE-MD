import fs from 'fs'
import path from 'path'

let handler = async (m, { conn, text, command, usedPrefix, isAdmin, isOwner }) => {
  global.db.data.msgs = global.db.data.msgs || {}
  let msgs = global.db.data.msgs

  const dbDir = path.join(process.cwd(), 'database')
  if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true })

  let cmd = command.toLowerCase()

  if (cmd === 'addlist') {
    if (!isOwner) return m.reply(`┌˚₊ ๑│ ᴇ ʀ ɪ ɴ ᴇ  ᴍ ᴀ ɴ ᴀ ɢ ᴇ ᴍ ᴇ ɴ ᴛ │๑˚₊ ⚙️\n┇ \n│ ❌ *Akses Ditolak!*\n│ Fitur ini khusus Owner.\n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`)

    let [keyOri, harga, stok, ...noteArr] = text.split('|').map(v => v ? v.trim() : '')
    let key = keyOri?.toLowerCase()
    let note = noteArr.join('|').trim()

    if (!key || !harga || !stok || !note) {
      return m.reply(`┌˚₊ ๑│ ᴇ ʀ ɪ ɴ ᴇ  ᴍ ᴀ ɴ ᴀ ɢ ᴇ ᴍ ᴇ ɴ ᴛ │๑˚₊ ⚙️\n┇ \n│ ❌ *Format Penambahan Salah!*\n│ \n│ 📝 *Panduan Format:*\n│ ${usedPrefix + command} nama_produk | harga | stok | note\n│ \n│ 💡 *Contoh Penggunaan:*\n│ ${usedPrefix + command} Alight Motion | Rp 4.000 | Ready | Akun 1 tahun premium garansi.\n│ \n│ _*Note:* Bisa tambahkan foto dengan mengirim/membalas foto beserta caption format di atas._\n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`)
    }

    if (key in msgs) {
      return m.reply(`┌˚₊ ๑│ ᴇ ʀ ɪ ɴ ᴇ  ᴍ ᴀ ɴ ᴀ ɢ ᴇ ᴍ ᴇ ɴ ᴛ │๑˚₊ ⚙️\n┇ \n│ ⚠️ *Gagal!*\n│ Produk *"${keyOri}"* sudah ada di dalam List.\n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`)
    }

    await m.react('⏳')

    try {
      let q = m.quoted ? m.quoted : m
      let mime = (q.msg || q).mimetype || ''
      let dbData = { nama: keyOri, harga, stok, text: note }

      if (/image/.test(mime)) {
        let fileName = `${key.replace(/[^a-z0-9]/gi, '_')}.jpg`
        let filePath = path.join(dbDir, fileName)

        let media = await q.download()
        fs.writeFileSync(filePath, media)

        dbData.media = fileName
        msgs[key] = dbData
        
        await m.react('✅')
        return m.reply(`┌˚₊ ๑│ ᴇ ʀ ɪ ɴ ᴇ  ᴍ ᴀ ɴ ᴀ ɢ ᴇ ᴍ ᴇ ɴ ᴛ │๑˚₊ ✅\n┇ \n│ 🎉 *List Berhasil Ditambahkan!*\n│ 🏷️ *Produk:* ${keyOri}\n│ 📸 *Media:* Tersimpan\n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`)
      } else {
        msgs[key] = dbData
        await m.react('✅')
        return m.reply(`┌˚₊ ๑│ ᴇ ʀ ɪ ɴ ᴇ  ᴍ ᴀ ɴ ᴀ ɢ ᴇ ᴍ ᴇ ɴ ᴛ │๑˚₊ ✅\n┇ \n│ 🎉 *List Berhasil Ditambahkan!*\n│ 🏷️ *Produk:* ${keyOri}\n│ 📄 *Media:* Tanpa Foto\n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`)
      }
    } catch (e) {
      console.error('[ADDLIST ERROR]', e)
      await m.react('❌')
      return m.reply(`┌˚₊ ๑│ ᴇ ʀ ɪ ɴ ᴇ  ᴍ ᴀ ɴ ᴀ ɢ ᴇ ᴍ ᴇ ɴ ᴛ │๑˚₊ ❌\n┇ \n│ Gagal menyimpan data list ke sistem.\n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`)
    }
  }

  if (cmd === 'list') {
    let keys = Object.keys(msgs)

    if (!keys.length) {
      return m.reply(`┌˚₊ ๑│ ᴇ ʀ ɪ ɴ ᴇ  ᴍ ᴀ ɴ ᴀ ɢ ᴇ ᴍ ᴇ ɴ ᴛ │๑˚₊ 📋\n┇ \n│ ⚠️ Belum ada daftar produk/list.\n│ \n│ Ketik *${usedPrefix}addlist* untuk membuat list baru.\n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`)
    }

    let listItems = keys.map((v, i) => `│ ${i + 1}. ${msgs[v].nama || v}`).join('\n')

    let caption = `┌˚₊ ๑│ ᴅ ᴀ ғ ᴛ ᴀ ʀ  ᴘ ʀ ᴏ ᴅ ᴜ ᴋ │๑˚₊ 🛒\n┇ \n${listItems}\n┇ \n│ 🔍 *Cek detail:*\n│ ${usedPrefix}getlist <nama_produk>\n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`

    return conn.reply(m.chat, caption, m)
  }

  if (cmd === 'getlist' || cmd === 'getmsg') {
    if (!text) {
      return m.reply(`┌˚₊ ๑│ ᴇ ʀ ɪ ɴ ᴇ  ᴍ ᴀ ɴ ᴀ ɢ ᴇ ᴍ ᴇ ɴ ᴛ │๑˚₊ ⚙️\n┇ \n│ ❌ *Format Salah!*\n│ *Ketik:* ${usedPrefix}${cmd} <nama_produk>\n│ \n│ *Contoh:*\n│ ${usedPrefix}${cmd} alight motion\n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`)
    }

    let key = text.trim().toLowerCase()
    if (!(key in msgs)) {
      return m.reply(`┌˚₊ ๑│ ᴇ ʀ ɪ ɴ ᴇ  ᴍ ᴀ ɴ ᴀ ɢ ᴇ ᴍ ᴇ ɴ ᴛ │๑˚₊ ⚠️\n┇ \n│ ❌ Produk *"${text}"* tidak ditemukan!\n│ \n│ Ketik *${usedPrefix}list* untuk melihat daftar.\n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`)
    }

    try {
      let data = msgs[key]
      
      let captionInfo = `┌˚₊ ๑│ ᴘ ʀ ᴏ ᴅ ᴜ ᴄ ᴛ  ɪ ɴ ғ ᴏ │๑˚₊ 📦\n` +
                        `┇ \n` +
                        `│ 🏷️ *Produk:* ${data.nama || key}\n` +
                        `│ 💵 *Harga:* ${data.harga || '-'}\n` +
                        `│ 📦 *Stok:* ${data.stok || '-'}\n` +
                        `┇ \n` +
                        `│ 📝 *Catatan / Deskripsi:*\n` +
                        `│ ${data.text || '-'}\n` +
                        `└˚₊ ๑ ────────────── ๑˚₊\n` +
                        `> © ERINE-AI`

      if (data.media) {
        let filePath = path.join(dbDir, data.media)
        if (fs.existsSync(filePath)) {
          return await conn.sendMessage(m.chat, { 
            image: fs.readFileSync(filePath), 
            caption: captionInfo 
          }, { quoted: m })
        }
      }

      return m.reply(captionInfo)
      
    } catch (e) {
      console.error('[GETLIST ERROR]', e)
      return m.reply(`┌˚₊ ๑│ ᴇ ʀ ɪ ɴ ᴇ  ᴍ ᴀ ɴ ᴀ ɢ ᴇ ᴍ ᴇ ɴ ᴛ │๑˚₊ ❌\n┇ \n│ Gagal mengambil data list. Database mungkin corrupt.\n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`)
    }
  }

  if (cmd === 'dellist') {
    if (!(isAdmin || isOwner)) return m.reply(`┌˚₊ ๑│ ᴇ ʀ ɪ ɴ ᴇ  ᴍ ᴀ ɴ ᴀ ɢ ᴇ ᴍ ᴇ ɴ ᴛ │๑˚₊ ⚙️\n┇ \n│ ❌ *Akses Ditolak!*\n│ Fitur ini khusus Admin atau Owner.\n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`)

    if (!text) {
      return m.reply(`┌˚₊ ๑│ ᴇ ʀ ɪ ɴ ᴇ  ᴍ ᴀ ɴ ᴀ ɢ ᴇ ᴍ ᴇ ɴ ᴛ │๑˚₊ ⚙️\n┇ \n│ ❌ *Format Salah!*\n│ *Ketik:* ${usedPrefix}dellist <nama_produk>\n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`)
    }

    let key = text.trim().toLowerCase()
    if (!(key in msgs)) {
      return m.reply(`┌˚₊ ๑│ ᴇ ʀ ɪ ɴ ᴇ  ᴍ ᴀ ɴ ᴀ ɢ ᴇ ᴍ ᴇ ɴ ᴛ │๑˚₊ ⚠️\n┇ \n│ ❌ Produk *"${text}"* tidak terdaftar di List.\n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`)
    }

    let data = msgs[key]
    if (data.media) {
      let filePath = path.join(dbDir, data.media)
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
      }
    }

    delete msgs[key]
    await m.react('✅')
    return m.reply(`┌˚₊ ๑│ ᴇ ʀ ɪ ɴ ᴇ  ᴍ ᴀ ɴ ᴀ ɢ ᴇ ᴍ ᴇ ɴ ᴛ │๑˚₊ 🗑️\n┇ \n│ ✅ Produk *"${text}"* berhasil dihapus dari sistem.\n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`)
  }
}

handler.help = ['addlist', 'list', 'getlist', 'dellist']
handler.tags = ['group']
handler.command = /^(addlist|list|getlist|getmsg|dellist)$/i
handler.group = true

export default handler