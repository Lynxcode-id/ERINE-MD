import { areJidsSameUser } from '@whiskeysockets/baileys'

let handler = async (m, { conn, text, participants }) => {
  if (!m.isGroup) return m.reply('❌ Perintah ini hanya bisa digunakan di grup.')

  const rawWho =
    m.quoted?.sender ||
    m.mentionedJid?.[0] ||
    (text ? `${text.replace(/\D/g, '')}@s.whatsapp.net` : '')

  if (!rawWho) return m.reply('❌ Reply, tag, atau ketik nomor target yang ingin di kick.')

  const who = typeof conn.getJid === 'function'
    ? conn.getJid(rawWho)
    : (conn.decodeJid?.(rawWho) || rawWho)

  const botJid = typeof conn.getJid === 'function'
    ? conn.getJid(conn.user?.jid || conn.user?.id || '')
    : (conn.decodeJid?.(conn.user?.jid || conn.user?.id || '') || '')

  if (areJidsSameUser(who, m.sender)) {
    return m.reply('❌ Tidak bisa mengeluarkan diri sendiri.')
  }

  if (botJid && areJidsSameUser(who, botJid)) {
    return m.reply('❌ Tidak bisa mengeluarkan bot.')
  }

  const parts = (participants || [])
    .map(p => p?.id || p?.jid || p?.participant || p?.lid)
    .filter(Boolean)
    .map(raw => ({
      raw,
      norm: typeof conn.getJid === 'function'
        ? conn.getJid(raw)
        : (conn.decodeJid?.(raw) || raw)
    }))

  const matched = parts.find(p => areJidsSameUser(p.norm, who))
  if (!matched) return m.reply('❌ Target tidak berada dalam grup.')

  const target = matched.norm || matched.raw

  try {
    await conn.groupParticipantsUpdate(m.chat, [target], 'remove')
    m.reply(`✅ Berhasil kick: @${target.split('@')[0]}`, null, { mentions: [target] })
  } catch (err) {
    console.error('[KICK ERROR]', err)
    m.reply('❌ Gagal mengeluarkan anggota. Pastikan bot adalah admin.')
  }
}

handler.help = ['kick @user', 'kick (reply pesan)', 'kick <nomor>']
handler.tags = ['group']
handler.command = /^(kick)$/i

handler.admin = true
handler.botAdmin = true
handler.owner = false
handler.premium = false

export default handler