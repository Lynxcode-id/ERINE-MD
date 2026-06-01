let handler = async (m, { conn, text, participants }) => {
  const resolveJid = (jid = '') => {
    jid = String(jid || '')
    if (!jid) return ''
    jid = typeof conn?.decodeJid === 'function' ? conn.decodeJid(jid) : (jid.decodeJid?.() || jid)

    if (jid.endsWith('@lid') && typeof conn?.getJid === 'function') {
      const resolved = conn.getJid(jid)
      if (resolved && !resolved.endsWith('@lid')) jid = resolved
    }

    if (/^\d+$/.test(jid)) jid = `${jid}@s.whatsapp.net`
    return jid
  }

  const fallbackText = (
    m.quoted?.text ||
    m.quoted?.caption ||
    m.quoted?.message?.extendedTextMessage?.text ||
    m.quoted?.message?.conversation ||
    ''
  ).trim()

  const msgText = (text || '').trim() || fallbackText
  const botJid = resolveJid(conn.user?.jid || conn.user?.id || '')
  const users = [...new Set((participants || []).map(u => resolveJid(u.id || u.jid || u.lid)).filter(v => v && (!botJid || v !== botJid)))]

  const body = users.map(v => `│◦❒ @${v.replace(/@.+/, '')}`).join('\n')
  const content = `${msgText ? `${msgText}\n\n` : ''}${body}`.trim()

  await conn.reply(
    m.chat,
    content,
    m,
    { contextInfo: { mentionedJid: users } }
  )
}

handler.help = ['tagall']
handler.tags = ['group']
handler.command = /^(tagall)$/i
handler.admin = handler.group = true

export default handler