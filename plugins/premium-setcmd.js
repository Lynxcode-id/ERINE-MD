let handler = async (m, { conn, text, usedPrefix, command }) => {
    global.db.data.sticker = global.db.data.sticker || {}
    if (!m.quoted) throw `Balas stiker dengan perintah *${usedPrefix + command}*`
    if (!m.quoted.fileSha256) throw 'SHA256 Hash Missing'
    if (!text) throw `Penggunaan:\n${usedPrefix + command} <teks>\n\nContoh:\n${usedPrefix + command} tes`
    
    let rawSha = m.quoted.fileSha256
    let hash = Buffer.isBuffer(rawSha) || rawSha instanceof Uint8Array 
        ? Buffer.from(rawSha).toString('hex') 
        : typeof rawSha === 'string' 
            ? Buffer.from(rawSha, 'base64').toString('hex') 
            : ''
    
    let sticker = global.db.data.sticker
    if (sticker[hash] && sticker[hash].locked) throw 'Kamu tidak memiliki izin untuk mengubah perintah stiker ini'
    
    sticker[hash] = {
        text,
        mentionedJid: m.mentionedJid,
        creator: m.sender,
        at: + new Date,
        locked: false,
    }
    m.reply(`✅ Success! Cmd stiker tersimpan.`)
}

handler.help = ['cmd'].map(v => 'set' + v + ' <teks>')
handler.tags = ['database']
handler.command = ['setcmd']

export default handler