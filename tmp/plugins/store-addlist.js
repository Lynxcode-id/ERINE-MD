import { generateWAMessageFromContent, prepareWAMessageMedia, proto } from '@whiskeysockets/baileys'

let handler = async (m, { conn, text, command, usedPrefix, isAdmin, isOwner }) => {
  global.db.data.msgs = global.db.data.msgs || {}
  let msgs = global.db.data.msgs

  let cmd = command.toLowerCase()
  if (cmd === 'addlist') {
    if (!isOwner) return m.reply(`\`ᴇʀɪɴᴇ ᴍᴀɴᴀɢᴇᴍᴇɴᴛ\`\n乂 *Status* : Ditolak, fitur ini khusus Owner.`)

    let [key, ...value] = text.split('|')
    key = key.trim().toLowerCase()
    value = value.join('|').trim()

    if (!key) {
      return m.reply(`\`ᴇʀɪɴᴇ ᴍᴀɴᴀɢᴇᴍᴇɴᴛ\`\n乂 *Gunakan Format:*\n*${usedPrefix + command} <nama>*\nAtau\n*${usedPrefix + command} <nama>|<isi teks>*\n\n*Contoh:*\n${usedPrefix + command} rules\n${usedPrefix + command} rules | Dilarang spam!`)
    }

    if (key in msgs) {
      return m.reply(`\`ᴇʀɪɴᴇ ᴍᴀɴᴀɢᴇᴍᴇɴᴛ\`\n乂 *Status* : Gagal, nama *"${key}"* sudah ada di List.`)
    }

    await m.react('⏳')

    if (m.quoted) {
      try {
        const quoted = await m.getQuotedObj()
        if (!quoted) throw "Pesan yang direply tidak ditemukan."
        
        const msg = JSON.parse(JSON.stringify(quoted.vM))
        msgs[key] = msg
        
        await m.react('✅')
        return m.reply(`\`ᴇʀɪɴᴇ ᴍᴀɴᴀɢᴇᴍᴇɴᴛ\`\n乂 *Status* : Berhasil menambahkan *"${key}"* ke List (Media/Reply).`)
      } catch (e) {
        console.error(e)
        await m.react('❌')
        return m.reply(`\`ᴇʀɪɴᴇ ᴍᴀɴᴀɢᴇᴍᴇɴᴛ\`\n乂 *Status* : Gagal menyimpan pesan media.`)
      }
    } else {
      if (!value) return m.reply(`\`ᴇʀɪɴᴇ ᴍᴀɴᴀɢᴇᴍᴇɴᴛ\`\n乂 *Status* : Gagal!\n\nHarap reply pesan atau gunakan pemisah '|' untuk menyimpan teks.\n*Contoh:* ${usedPrefix + command} infogrup | Ini adalah info...`)
      
      msgs[key] = { text: value }
      await m.react('✅')
      return m.reply(`\`ᴇʀɪɴᴇ ᴍᴀɴᴀɢᴇᴍᴇɴᴛ\`\n乂 *Status* : Berhasil menambahkan *"${key}"* ke List (Teks).`)
    }
  }

  if (cmd === 'list') {
    let keys = Object.keys(msgs)

    if (!keys.length) {
      return m.reply(`\`ᴇʀɪɴᴇ ᴍᴀɴᴀɢᴇᴍᴇɴᴛ\`\n乂 Belum ada daftar List.\n\nKetik *${usedPrefix}addlist <nama>* untuk membuat list baru.`)
    }

    let listItems = keys.map((v, i) => `│ ${i + 1}. ${v}`).join('\n')

    let caption = `╭─ ✦ *D A F T A R  L I S T* ✦\n`
    caption += `${listItems}\n`
    caption += `╰───────────⭓\n\n`
    caption += `Gunakan *${usedPrefix}getlist <nama>* untuk mengambil data.`

    return conn.reply(m.chat, caption.trim(), m)
  }

  if (cmd === 'getlist' || cmd === 'getmsg') {
    if (!text) {
      return m.reply(`\`ᴇʀɪɴᴇ ᴍᴀɴᴀɢᴇᴍᴇɴᴛ\`\n乂 *Gunakan Format:*\n*${usedPrefix}${cmd} <nama>*\n\n*Contoh:*\n${usedPrefix}${cmd} rules`)
    }

    let key = text.trim().toLowerCase()
    if (!(key in msgs)) {
      return m.reply(`\`ᴇʀɪɴᴇ ᴍᴀɴᴀɢᴇᴍᴇɴᴛ\`\n乂 *Status* : Gagal, list *"${text}"* tidak ditemukan.\n\nCek daftar dengan *${usedPrefix}list*`)
    }

    try {
      let data = msgs[key]

      if (data.text && !data.message) {
        return m.reply(data.text)
      }

      let messageData = JSON.parse(JSON.stringify(data), (_, v) => {
        if (v !== null && typeof v === 'object' && v.type === 'Buffer' && Array.isArray(v.data)) {
          return Buffer.from(v.data)
        }
        return v
      })

      await conn.copyNForward(m.chat, conn.serializeM(messageData), false)
      
    } catch (e) {
      console.error(e)
      return m.reply(`\`ᴇʀɪɴᴇ ᴍᴀɴᴀɢᴇᴍᴇɴᴛ\`\n乂 *Status* : Gagal mengambil data List. Database mungkin corrupt.`)
    }
  }

  if (cmd === 'dellist') {
    if (!(isAdmin || isOwner)) return m.reply(`\`ᴇʀɪɴᴇ ᴍᴀɴᴀɢᴇᴍᴇɴᴛ\`\n乂 *Status* : Ditolak, khusus Admin atau Owner.`)

    if (!text) {
      return m.reply(`\`ᴇʀɪɴᴇ ᴍᴀɴᴀɢᴇᴍᴇɴᴛ\`\n乂 *Gunakan Format:*\n*${usedPrefix}dellist <nama>*`)
    }

    let key = text.trim().toLowerCase()
    if (!(key in msgs)) {
      return m.reply(`\`ᴇʀɪɴᴇ ᴍᴀɴᴀɢᴇᴍᴇɴᴛ\`\n乂 *Status* : Gagal, nama *"${text}"* tidak terdaftar di List.`)
    }

    delete msgs[key]
    await m.react('✅')
    return m.reply(`\`ᴇʀɪɴᴇ ᴍᴀɴᴀɢᴇᴍᴇɴᴛ\`\n乂 *Status* : Berhasil menghapus *"${text}"* dari daftar List.`)
  }
}

handler.help = ['addlist', 'list', 'getlist', 'dellist']
handler.tags = ['group']
handler.command = /^(addlist|list|getlist|getmsg|dellist)$/i
handler.group = true

export default handler
