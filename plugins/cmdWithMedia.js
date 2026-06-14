import { generateWAMessage, areJidsSameUser } from '@whiskeysockets/baileys'

export async function before(m, { conn }) {
    if (m.isBaileys || !m.msg || !m.msg.fileSha256) return false

    let rawSha = m.msg.fileSha256
    let hash = Buffer.isBuffer(rawSha) || rawSha instanceof Uint8Array 
        ? Buffer.from(rawSha).toString('hex') 
        : typeof rawSha === 'string' 
            ? Buffer.from(rawSha, 'base64').toString('hex') 
            : ''

    const DB = conn.db || global.db
    const stickerDb = DB?.data?.sticker || {}

    let activeHash = ''
    if (hash in stickerDb) activeHash = hash
    else {
        let hashB64 = Buffer.isBuffer(rawSha) || rawSha instanceof Uint8Array ? Buffer.from(rawSha).toString('base64') : rawSha
        let doubleB64 = Buffer.from(hashB64).toString('base64') 
        
        if (hashB64 in stickerDb) activeHash = hashB64
        else if (doubleB64 in stickerDb) activeHash = doubleB64
        else return false
    }

    let { text, mentionedJid } = stickerDb[activeHash]

    let messages = await generateWAMessage(
        m.chat,
        { text: text, mentions: mentionedJid || [] },
        {
            userJid: conn.user.id,
            quoted: m.quoted && m.quoted.fakeObj ? m.quoted.fakeObj : m
        }
    )

    messages.key.remoteJid = m.chat
    messages.key.fromMe = areJidsSameUser(m.sender, conn.user.id)
    messages.key.id = 'CMD_' + m.key.id.substring(0, 10) + Math.random().toString(36).substring(2, 6)
    messages.pushName = m.name || m.pushName || 'User'
    if (m.isGroup) messages.key.participant = m.sender

    setTimeout(() => {
        conn.ev.emit('messages.upsert', {
            messages: [messages],
            type: 'notify' 
        })
    }, 150)

    return false 
}