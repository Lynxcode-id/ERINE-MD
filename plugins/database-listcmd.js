let handler = async (m, { conn }) => {
    let sticker = global.db.data.sticker || {}
    if (Object.keys(sticker).length === 0) return m.reply('Tidak ada cmd yang tersimpan.')
    
    conn.reply(m.chat, `
*DAFTAR CMD*
\`\`\`
${Object.entries(sticker).map(([key, value], index) => `${index + 1}. ${value.locked ? `(Terkunci) ${key}` : key} : ${value.text}`).join('\n')}
\`\`\`
`.trim(), null, {
        mentions: Object.values(sticker).map(x => x.mentionedJid).reduce((a, b) => [...a, ...b], [])
    })
}

handler.help = ['listcmd']
handler.tags = ['database']
handler.command = ['listcmd']

export default handler