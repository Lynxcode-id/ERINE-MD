import { areJidsSameUser } from '@whiskeysockets/baileys'

const normalizeJid = (conn, jid = '') => {
  jid = String(jid || '').trim()
  if (!jid) return ''
  jid = typeof conn?.decodeJid === 'function' ? conn.decodeJid(jid) : jid
  if (jid.endsWith('@lid') && typeof conn?.getJid === 'function') {
    const resolved = conn.getJid(jid)
    if (resolved && !resolved.endsWith('@lid')) jid = resolved
  }
  if (/^\d+$/.test(jid)) jid = `${jid}@s.whatsapp.net`
  return jid
}

let handler = async (m, { conn, participants }) => {
  if (!m.mentionedJid || m.mentionedJid.length === 0) {
    return m.reply('❌ Tag user yang mau diturunkan jabatannya.\nContoh: .demote @user')
  }

  const botJid = normalizeJid(conn, conn.user?.jid || conn.user?.id || '')

  const users = [...new Set(
    m.mentionedJid
      .map(u => normalizeJid(conn, u))
      .filter(u => !areJidsSameUser(u, botJid))
  )]

  if (!users.length) return m.reply('❌ Target tidak valid.')

  const groupParticipants = (participants || []).map(v => ({
    raw: v?.id || v?.jid || v?.participant || v?.lid,
    norm: normalizeJid(conn, v?.id || v?.jid || v?.participant || v?.lid)
  }))

  for (const user of users) {
    try {
      const participant = groupParticipants.find(v => areJidsSameUser(v.norm, user))
      if (participant && (participant.raw || participant.norm)) {
        await conn.groupParticipantsUpdate(m.chat, [participant.raw || participant.norm], 'demote')
        await new Promise(resolve => setTimeout(resolve, 900))
      }
    } catch (e) {
      console.error(`Gagal demote ${user}:`, e)
    }
  }

  m.reply('✅ Success: jabatan admin sudah dicabut.')
}

handler.help = ['demote @tag']
handler.tags = ['group']
handler.command = /^(demote)$/i

handler.admin = true
handler.group = true
handler.botAdmin = true

export default handler
