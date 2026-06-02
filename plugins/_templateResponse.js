import {
  proto,
  generateWAMessage,
  areJidsSameUser
} from '@whiskeysockets/baileys'

export async function before(m, { conn, chatUpdate }) {
  if (m.isBaileys) return false
  if (!m.message) return false
  if (m.isBypassed) return false 

  const realMsg = m.message?.viewOnceMessage?.message || m.message?.viewOnceMessageV2?.message || m.message?.viewOnceMessageV2Extension?.message || m.message

  if (!(realMsg.buttonsResponseMessage || realMsg.templateButtonReplyMessage || realMsg.listResponseMessage || realMsg.interactiveResponseMessage)) return false

  let id = ''

  if (realMsg.buttonsResponseMessage) {
    id = realMsg.buttonsResponseMessage.selectedButtonId
  } else if (realMsg.listResponseMessage) {
    id = realMsg.listResponseMessage.singleSelectReply?.selectedRowId
  } else if (realMsg.templateButtonReplyMessage) {
    id = realMsg.templateButtonReplyMessage.selectedId
  } else if (realMsg.interactiveResponseMessage) {
    let nativeFlow = realMsg.interactiveResponseMessage.nativeFlowResponseMessage
    try {
      let parsed = JSON.parse(nativeFlow.paramsJson)
      id = parsed.id || parsed.value || nativeFlow.name || ''
    } catch (e) {
      id = nativeFlow?.name || ''
    }
  }

  if (!id) return false

  m.isBypassed = true

  let messages = await generateWAMessage(
    m.chat,
    { text: id, mentions: m.mentionedJid || [] },
    {
      userJid: conn.user.id,
      quoted: m.quoted && m.quoted.fakeObj ? m.quoted.fakeObj : m 
    }
  )

  messages.key.remoteJid = m.chat
  messages.key.fromMe = areJidsSameUser(m.sender, conn.user.id)
  messages.key.id = m.key.id
  messages.pushName = m.name || m.pushName || 'User'
  if (m.isGroup) messages.key.participant = m.sender
  
  const plainMsg = JSON.parse(JSON.stringify(messages))
  
  let msg = {
    ...chatUpdate,
    messages: [proto.WebMessageInfo.fromObject(plainMsg)].map(v => ((v.conn = conn), v)),
    type: 'append'
  }

  conn.ev.emit('messages.upsert', msg)
  
  return true
}