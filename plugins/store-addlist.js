// © INF PROJECT - Erine-MD
// Developed by INF PROJECT

import pkg from "@wishkeysocket/baileys";
const { proto } = pkg;

let handler = async (m, { conn, text, command, usedPrefix, isAdmin, isOwner }) => {
  // Inisialisasi database store jika belum ada
  global.db.data.msgs = global.db.data.msgs || {}
  let msgs = global.db.data.msgs

  let cmd = command.toLowerCase()

  // ================= ADD STORE =================
  if (cmd === 'addstore') {
    if (!isOwner) return m.reply("❌ Fitur ini khusus Owner, Bang.")

    if (!text) {
      return m.reply(
        `Gunakan:\n*${usedPrefix + command} <nama>*\n\nContoh:\n${usedPrefix + command} pricelist`
      )
    }

    let key = text.trim().toLowerCase()
    if (key in msgs) {
      return m.reply(`❌ Nama *"${text}"* sudah ada di Store. Gunakan nama lain atau hapus dulu yang lama.`)
    }

    await m.react('⏳')

    if (m.quoted) {
      try {
        // Mengambil objek pesan yang di-reply
        const quoted = await m.getQuotedObj()
        if (!quoted) throw "Pesan yang direply tidak ditemukan."
        
        // Convert ke JSON untuk disimpan di database
        const msg = proto.WebMessageInfo.fromObject(quoted).toJSON()
        msgs[key] = msg
        
        await m.react('✅')
        return m.reply(`✅ Berhasil menambahkan *"${text}"* ke Store (Media/Reply).`)
      } catch (e) {
        console.error(e)
        await m.react('❌')
        return m.reply("❌ Gagal menyimpan pesan media.")
      }
    } else {
      // Jika tidak reply, simpan sebagai teks biasa
      msgs[key] = { text: text.trim() }
      await m.react('✅')
      return m.reply(`✅ Berhasil menambahkan *"${text}"* ke Store (Teks).`)
    }
  }

  // ================= LIST STORE =================
  if (cmd === 'liststore') {
    let keys = Object.keys(msgs)

    if (!keys.length) {
      return m.reply(
        `Belum ada daftar Store.\nKetik *${usedPrefix}addstore <nama>* untuk mulai jualan.`
      )
    }

    let list = keys.map((v, i) => `│ ${i + 1}. ${v}`).join('\n')

    let caption = `乂  *L I S T  S T O R E*\n\n`
    caption += `┌───\n${list}\n└───\n\n`
    caption += `Gunakan *${usedPrefix}getstore <nama>* untuk mengambil data.`

    return conn.reply(m.chat, caption.trim(), m)
  }

  // ================= GET STORE =================
  if (cmd === 'getstore' || cmd === 'getmsg') {
    if (!text) {
      return m.reply(
        `Gunakan:\n*${usedPrefix}${cmd} <nama>*\n\nContoh:\n${usedPrefix}${cmd} pricelist`
      )
    }

    let key = text.trim().toLowerCase()
    if (!(key in msgs)) {
      return m.reply(`❌ Data Store *"${text}"* tidak ditemukan. Cek daftar dengan *${usedPrefix}liststore*`)
    }

    try {
      let data = msgs[key]

      // Jika cuma teks (tanpa object message)
      if (data.text && !data.message) {
        return m.reply(data.text)
      }

      // Restore Buffer yang hilang karena penyimpanan JSON (Penting di Node 22)
      let messageData = JSON.parse(JSON.stringify(data), (_, v) => {
        if (
          v !== null &&
          typeof v === 'object' &&
          v.type === 'Buffer' &&
          Array.isArray(v.data)
        ) {
          return Buffer.from(v.data)
        }
        return v
      })

      // Kirim balik pesannya
      await conn.copyNForward(m.chat, conn.serializeM(messageData), false)
      
    } catch (e) {
      console.error(e)
      return m.reply("❌ Gagal mengambil data Store. Database mungkin corrupt.")
    }
  }

  // ================= DELETE STORE =================
  if (cmd === 'delstore') {
    if (!(isAdmin || isOwner)) return m.reply("❌ Khusus Admin atau Owner, Bang.")

    if (!text) {
      return m.reply(`Gunakan:\n*${usedPrefix}delstore <nama>*`)
    }

    let key = text.trim().toLowerCase()
    if (!(key in msgs)) {
      return m.reply(`❌ Nama *"${text}"* tidak terdaftar di Store.`)
    }

    delete msgs[key]
    await m.react('✅')
    return m.reply(`✅ Berhasil menghapus *"${text}"* dari daftar Store.`)
  }
}

handler.help = ['addstore', 'liststore', 'getstore', 'delstore']
handler.tags = ['store']
handler.command = /^(addstore|liststore|getstore|getmsg|delstore)$/i

export default handler
