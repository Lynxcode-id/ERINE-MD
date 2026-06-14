let handler = async (m, { conn }) => {
  let stats = Object.entries(db.data.stats).map(([key, val]) => {
    let help = plugins[key]?.help
    let name = Array.isArray(help) ? help.join(', ') : help || key
    if (/exec/.test(name)) return null
    return { name, ...val }
  }).filter(v => v)

  stats = stats.sort((a, b) => b.total - a.total)

  let handlers = stats.slice(0, 100).map(({ name, total }) => {
    return `乂 *Command* : *${name}*\n• *Global HIT* : ${total}`
  }).join`\n\n` || 'Belum ada statistik penggunaan.'

  await conn.sendMessage(m.chat, {
    image: { url: 'https://telegra.ph/file/c43ee155efc11b774bee3.jpg' },
    caption: handlers,
    contextInfo: {
      mentionedJid: [m.sender],
      isForwarded: true,
      forwardingScore: 9999,
      forwardedNewsletterMessageInfo: {
        newsletterJid: "120363400612665352@newsletter",
        newsletterName: "🌟 ᴇʀɪɴᴇ-ᴍᴅ ɪɴғᴏʀᴍᴀᴛɪᴏɴ",
        serverMessageId: -1
      }
    }
  }, { quoted: m })
}

handler.help = ['dashboard']
handler.tags = ['main']
handler.command = /^(dashboard)$/i

export default handler
