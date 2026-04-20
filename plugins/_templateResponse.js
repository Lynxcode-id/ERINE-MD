// © INF PROJECT - Jemima-MD (ESM Version)
// Developed by INF PROJECT

import pkg from '@wishkeysocket/baileys'
const {
  proto,
  generateWAMessage,
  areJidsSameUser
} = pkg

export async function before(m, { conn, chatUpdate }) {
  if (m.isBaileys) return false
  if (!m.message) return false

  let id = ''
  let text = ''

  if (m.message.buttonsResponseMessage) {
    id = m.message.buttonsResponseMessage.selectedButtonId
    text = m.message.buttonsResponseMessage.selectedDisplayText

  } else if (m.message.listResponseMessage) {
    id = m.message.listResponseMessage.singleSelectReply?.selectedRowId
    text = m.message.listResponseMessage.title

  } else if (m.message.templateButtonReplyMessage) {
    id = m.message.templateButtonReplyMessage.selectedId
    text = m.message.templateButtonReplyMessage.selectedDisplayText

  } else if (m.message.interactiveResponseMessage) {
    try {
      const params = m.message.interactiveResponseMessage?.nativeFlowResponseMessage?.paramsJson
      if (params) {
        const data = JSON.parse(params)
        id = data.id || data.value || ''
        text = data.title || data.display_text || ''
      }
    } catch (e) {
      console.log('❌ NativeFlow parse error:', e)
    }
  }

  if (!id && !text) return false

  let isIdMessage = false
  let usedPrefix

  for (let name in global.plugins) {
    let plugin = global.plugins[name]
    if (!plugin || plugin.disabled || typeof plugin !== 'function') continue
    if (!plugin.command) continue
    if (!global.opts?.['restrict']) {
      if (plugin.tags && plugin.tags.includes('admin')) continue
    }

    const str2Regex = str => str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
    
    let _prefix = plugin.customPrefix
      ? plugin.customPrefix
      : conn.prefix || global.prefix

    let match = (
      _prefix instanceof RegExp
        ? [[_prefix.exec(id), _prefix]]
        : Array.isArray(_prefix)
          ? _prefix.map(p => {
              let re = p instanceof RegExp ? p : new RegExp(str2Regex(p))
              return [re.exec(id), re]
            })
          : typeof _prefix === 'string'
            ? [[new RegExp(str2Regex(_prefix)).exec(id), new RegExp(str2Regex(_prefix))]]
            : [[[], new RegExp]]
    ).find(p => p[1])

    if ((usedPrefix = (match?.[0] || [])[0])) {
      let noPrefix = id.replace(usedPrefix, '')
      let [command] = noPrefix.trim().split(/\s+/)
      command = (command || '').toLowerCase()

      let isId =
        plugin.command instanceof RegExp
          ? plugin.command.test(command)
          : Array.isArray(plugin.command)
            ? plugin.command.some(cmd =>
                cmd instanceof RegExp ? cmd.test(command) : cmd === command
              )
            : typeof plugin.command === 'string'
              ? plugin.command === command
              : false

      if (isId) {
        isIdMessage = true
        break
      }
    }
  }
 
  let messages = await generateWAMessage(
    m.chat,
    { text: isIdMessage ? id : text, mentions: m.mentionedJid },
    {
      userJid: conn.user.id,
      quoted: m.quoted && m.quoted.fakeObj
    }
  )

  messages.key.remoteJid = m.chat
  messages.key.fromMe = areJidsSameUser(m.sender, conn.user.id)
  messages.key.id = m.key.id
  messages.pushName = m.name
  if (m.isGroup) messages.key.participant = m.sender

  let msg = {
    ...chatUpdate,
    messages: [proto.WebMessageInfo.fromObject(messages)].map(v => ((v.conn = conn), v)),
    type: 'append'
  }

  conn.ev.emit('messages.upsert', msg)
  
  return true
}