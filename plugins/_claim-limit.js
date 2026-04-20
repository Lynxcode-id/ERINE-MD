const rewards = {
  limit: 10,
}
const cooldown = 86400000
let handler = async (m,{ conn} ) => {
  // 🔥 FIX 1: Deteksi otomatis pakai DB bot utama atau DB Jadibot
  const DB = conn.db || global.db
  let user = DB.data.users[m.sender]

  // 🔥 FIX 2: Mencegah crash kalau user belum terdaftar di database
  if (!user) return

  if (user.role === 'Free user' && user.limit >= 20) {
    conn.reply(m.chat, 'Free user only have 20 Limit max', m)
    return
  }

  if (new Date - user.lastclaim < cooldown) throw `You have already claimed this daily limit!, wait for *${((user.lastclaim + cooldown) - new Date()).toTimeString()}*`
  let text = ''
  for (let reward of Object.keys(rewards)) {
    if (!(reward in user)) continue
    user[reward] += rewards[reward]
    text += `*+${rewards[reward]}* ${reward}\n`
  }
  conn.reply(m.chat, text.trim(), m)
  user.lastclaim = new Date * 1
}
handler.help = ['claimlimit']
handler.command = /^(claimlimit)$/i

handler.cooldown = cooldown
handler.disable = true

export default handler
