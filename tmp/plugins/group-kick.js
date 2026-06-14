let handler = async (m, { conn, text, participants }) => {
  if (!m.isGroup)
    return m.reply('❌ Perintah ini hanya bisa digunakan di grup.')

  // 🔥 Perbaikan 1: Bisa pakai tag, reply, ATAU ketik nomor manual
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

  // 🔥 Perbaikan 2: Pengecekan JID bot yang lebih valid
  let botJid = conn.decodeJid(conn.user.id)
  if (target === botJid)
    return m.reply('❌ Tidak bisa mengeluarkan bot.')

  // 🔥 Perbaikan 3: Pengecekan admin yang lebih akurat
  let isTargetAdmin = participants.find(
    p => p.id === target && (p.admin === 'admin' || p.admin === 'superadmin')
  )

  if (isTargetAdmin)
    return m.reply('❌ Tidak bisa mengeluarkan admin grup.')

  try {
    // Eksekusi kick
    await conn.groupParticipantsUpdate(
      m.chat,
      [target],
      'remove'
    )

    // 🔥 Perbaikan 4: Stiker dipisah biar kalau gagal load URL gak ngebatalin pesan sukses
    try {
      await conn.sendMessage(m.chat, {
        sticker: { url: 'https://files.catbox.moe/h4q4hq.webp' }
      }, { quoted: m })
    } catch (e) {
      m.reply('✅ Anggota berhasil dikeluarkan.') // Pesan cadangan kalau stiker gagal
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