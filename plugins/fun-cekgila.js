let handler = async (m, { conn, text, usedPrefix, command }) => {
  let user = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : false
  if (!user) throw `Tag atau reply pesan seseorang untuk mengecek tingkat kegilaannya!`
  let gila = Math.floor(Math.random() * 100)
  let caption = `@${user.split('@')[0]} itu *${gila}%* gila 🥴`
  conn.reply(m.chat, caption, m, { mentions: [user] })
}
handler.help = ['cekgila']
handler.tags = ['fun']
handler.command = /^cekgila$/i
export default handler