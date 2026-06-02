let handler = async (m, { conn, text, participants }) => {
  if (!m.isGroup)
    return m.reply('❌ Perintah ini hanya bisa digunakan di grup.')

  let target = m.mentionedJid?.[0] 
    ? m.mentionedJid[0] 
    : m.quoted 
      ? m.quoted.sender 
      : text 
        ? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net' 
        : false

  if (!target) {
    return m.reply(
      '❌ Tag, reply, atau ketik nomor orang yang ingin dikeluarkan.\n\n' +
      'Contoh:\n' +
      '.kick @user\n' +
      '.kick (reply pesan)\n' +
      '.kick 628xxx'
    )
  }

  let botJid = conn.decodeJid(conn.user.id)
  if (target === botJid)
    return m.reply('❌ Tidak bisa mengeluarkan bot.')

  let isTargetAdmin = participants.find(
    p => p.id === target && (p.admin === 'admin' || p.admin === 'superadmin')
  )

  if (isTargetAdmin)
    return m.reply('❌ Tidak bisa mengeluarkan admin grup.')

  try {
    await conn.groupParticipantsUpdate(
      m.chat,
      [target],
      'remove'
    )
    
    try {
      await conn.sendMessage(m.chat, {
        sticker: { url: 'https://files.catbox.moe/h4q4hq.webp' }
      }, { quoted: m })
    } catch (e) {
      m.reply('✅ Anggota berhasil dikeluarkan.')
    }

  } catch (err) {
    console.error('[KICK ERROR]', err)
    m.reply('❌ Gagal mengeluarkan anggota. Pastikan bot adalah admin.')
  }
}

handler.help = ['kick @user', 'kick (reply pesan)', 'kick <nomor>']
handler.tags = ['group']
handler.command = ['kick']

handler.admin = true
handler.botAdmin = true
handler.owner = false
handler.premium = false

export default handler