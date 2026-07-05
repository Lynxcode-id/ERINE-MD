let handler = async (m, { conn, text, usedPrefix, command }) => {
  let user = global.db.data.users[m.sender]
  if (!user.budeg) user.budeg = 0
  let budeg = user.budeg
  let level = budeg > 100 ? 'Parah' : budeg > 50 ? 'Lumayan' : budeg > 10 ? 'Sedikit' : 'Normal'
  let caption = `*Cek Level Budeg*\n\n👤 *User:* @${m.sender.split('@')[0]}\n📊 *Level:* ${level}\n🎯 *Skor:* ${budeg}\n\n${budeg > 100 ? 'Waduh parah banget budegnya!' : budeg > 50 ? 'Waduh mulai budeg nih!' : budeg > 10 ? 'Hati-hati mulai budeg!' : 'Masih normal, pertahankan!'}`
  conn.reply(m.chat, caption, m, { mentions: [m.sender] })
}
handler.help = ['cekbudeg']
handler.tags = ['fun']
handler.command = /^cekbudeg$/i
export default handler