import pkg from '@whiskeysockets/baileys'
const { generateWAMessage, areJidsSameUser, proto } = pkg

export async function before(m, { conn, chatUpdate }) {
  if (!m || m.isBaileys) return false
  if (!m.message) return false

  if (!m.msg) return false
  if (!m.msg.fileSha256) return false

  const hashKey = Buffer
    .from(m.msg.fileSha256)
    .toString('base64')

  const DB = conn.db || global.db
  const stickerDb = DB?.data?.sticker || {}

  if (!(hashKey in stickerDb)) return false

  let hash = stickerDb[hashKey]
  let { text, mentionedJid } = hash

  let messages = await generateWAMessage(
    m.chat,
    { text, mentions: mentionedJid },
    {
      userJid: conn.user.id,
      quoted: m.quoted && m.quoted.fakeObj
    }
  )

  messages.key.remoteJid = m.chat
  messages.key.fromMe = areJidsSameUser(m.sender, conn.user.id)
  messages.key.id = m.key.id
  messages.pushName = m.name || m.pushName
  if (m.isGroup) messages.key.participant = m.sender

  const plainMsg = JSON.parse(JSON.stringify(messages))
  let msgData = {
    ...chatUpdate,
    messages: [proto.WebMessageInfo.fromObject(plainMsg)].map(v => ((v.conn = conn), v)),
    type: 'append'
  }

  conn.ev.emit('messages.upsert', msgData)

  return true 
}
