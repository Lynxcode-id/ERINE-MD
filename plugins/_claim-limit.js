const rewards = {
  limit: 10,
}
const cooldown = 86400000

let handler = async (m, { conn }) => {
  const DB = conn.db || global.db
  let user = DB.data.users[m.sender]

  if (!user) return
  if (user.role === 'Free user' && user.limit >= 25) {
    conn.reply(m.chat, '❌ Penuh! Free user hanya bisa menampung maksimal 25 Limit.', m)
    return
  }

  let time = user.lastclaim + cooldown
  if (new Date - user.lastclaim < cooldown) {
    throw `⏳ Kamu sudah claim limit hari ini!\nTunggu selama *${((time) - new Date()).toTimeString()}*`
  }

  let text = '✅ *CLAIM BERHASIL*\n\n'
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

export default handler
