let handler = async (m, { conn, text, usedPrefix, command }) => {
  let dosa = Math.floor(Math.random() * 101)
  let emoji = dosa > 80 ? '😈' : dosa > 50 ? '😨' : dosa > 20 ? '😅' : '😇'
  let caption = `*Cek Banyak Dosa*\n\nDosa kamu saat ini: *${dosa}%* ${emoji}\n${dosa > 80 ? 'Astaghfirullah, tobat bro!' : dosa > 50 ? 'Mulai perbaiki diri ya!' : dosa > 20 ? 'Masih dalam batas wajar.' : 'Alhamdulillah, suci banget!'}`
  conn.reply(m.chat, caption, m)
}
handler.help = ['cekdosa']
handler.tags = ['fun']
handler.command = /^(cekdosa|cekdos|banyakdosa)$/i
export default handler