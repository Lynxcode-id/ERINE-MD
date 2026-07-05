let handler = async (m, { conn, text, usedPrefix, command }) => {
  let persen = Math.floor(Math.random() * 101)
  let kata = ''
  if (persen <= 30) {
    kata = 'Waduh, kamu lagi sedih ya? 😢'
  } else if (persen <= 60) {
    kata = 'Lumayan, tapi masih bisa ditingkatkan! 🙂'
  } else if (persen <= 80) {
    kata = 'Wah, kamu cukup bahagia nih! 😄'
  } else {
    kata = 'Mantap! Kamu sangat bahagia! 🥳'
  }
  let msg = `*Tingkat Kebahagiaan:* ${persen}%\n\n${kata}`
  conn.reply(m.chat, msg, m)
}

handler.help = ['cekbahagia']
handler.tags = ['fun']
handler.command = /^(cekbahagia|cekbahagiaan)$/i

export default handler