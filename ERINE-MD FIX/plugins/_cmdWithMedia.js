import { generateWAMessage, areJidsSameUser } from '@wishkeysocket/baileys'

export async function before(m, { conn, chatUpdate }) {
  if (!m || m.isBaileys) return false
  if (!m.message) return false

  const msg = m.msg || m.message?.conversation
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
      quoted: m.quoted?.fakeObj
    }
  )

  messages.key.fromMe = areJidsSameUser(m.sender, conn.user.id)
  messages.key.id = m.key.id
  messages.pushName = m.pushName
  if (m.isGroup) messages.participant = m.sender

  m.text = text
  chatUpdate.messages = [messages]

  return true 
}