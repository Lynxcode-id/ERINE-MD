let handler = async (m, { conn, usedPrefix, command }) => {
  let users = Object.entries(global.db.data.users)
    .map(([jid, data]) => ({ jid, limit: data.limit || 0 }))
    .sort((a, b) => b.limit - a.limit)
    .slice(0, 10) // top 10

  if (users.length === 0) return m.reply('*\`[ SYSTEM ERROR ]\`*\n❌ Data limit database masih kosong.')

  let teks = `*\`[ 🌐 GLOBAL LIMIT RANKING ]\`*\n`
  teks += `*SERVER :* JEMIMA-MD NETWORK\n`
  teks += `────────────────────────\n\n`

  users.forEach((user, i) => {
    let name = conn.getName(user.jid) || user.jid.split('@')[0]
    
    let rank = ''
    if (i === 0) rank = '🥇'
    else if (i === 1) rank = '🥈'
    else if (i === 2) rank = '🥉'
    else rank = `\`[${(i + 1).toString().padStart(2, '0')}]\`` // Hasilnya: [04], [05], dst

    let limitAmount = user.limit.toLocaleString('id-ID')

    teks += `${rank} *${name}*\n`
    teks += `   └ ⚡ ${limitAmount} Limit\n\n`
  })

  teks += `────────────────────────\n`
  teks += `*\`> _Keep active to rank up_\`*`

  m.reply(teks)
}

handler.help = ['toplimit']
handler.tags = ['info']
handler.command = /^toplimit$/i
handler.limit = true

export default handler