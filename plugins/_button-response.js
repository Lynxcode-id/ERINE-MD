// © INF PROJECT - Jemima-MD (Erine Vibe)
// Developed by INF PROJECT

import chalk from 'chalk'

export async function before(m) {
  if (m.isBaileys) return false
  if (!m.message) return false

  let id = ''
  let msg = m.message

  if (msg.ephemeralMessage) msg = msg.ephemeralMessage.message
  if (msg.viewOnceMessage) msg = msg.viewOnceMessage.message
  if (msg.viewOnceMessageV2) msg = msg.viewOnceMessageV2.message

  if (msg.buttonsResponseMessage) {
    id = msg.buttonsResponseMessage.selectedButtonId
  } else if (msg.listResponseMessage) {
    id = msg.listResponseMessage.singleSelectReply?.selectedRowId
  } else if (msg.templateButtonReplyMessage) {
    id = msg.templateButtonReplyMessage.selectedId
  } else if (msg.interactiveResponseMessage) {
    try {
      const params = JSON.parse(msg.interactiveResponseMessage?.nativeFlowResponseMessage?.paramsJson || '{}')
      id = params.id || params.name || params.value || '' 
    } catch (e) {
      console.log('❌ NativeFlow parse error:', e)
    }
  }

  if (id) {
    m.text = id
    
    console.log(chalk.bgGreen.black(` 🔥 [BYPASS BUTTON] Payload berhasil ditangkep -> ${id} `))
  }
  
  return true 
}