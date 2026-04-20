// © INF PROJECT - Jemima-MD (Erine Vibe)
// Developed by INF PROJECT

import chalk from 'chalk'

// Pake export async function before(m) biar jalan otomatis sebelum command lain
export async function before(m) {
  // Abaikan kalau pesannya dari bot itu sendiri atau ga ada isi
  if (m.isBaileys) return false
  if (!m.message) return false

  let id = ''
  let msg = m.message

  // Buka bungkusan pesan WA (viewOnce / ephemeral) biar ga nyangkut
  if (msg.ephemeralMessage) msg = msg.ephemeralMessage.message
  if (msg.viewOnceMessage) msg = msg.viewOnceMessage.message
  if (msg.viewOnceMessageV2) msg = msg.viewOnceMessageV2.message

  // ===== TANGKEP SEMUA JENIS BUTTON WA =====
  if (msg.buttonsResponseMessage) {
    id = msg.buttonsResponseMessage.selectedButtonId
  } else if (msg.listResponseMessage) {
    id = msg.listResponseMessage.singleSelectReply?.selectedRowId
  } else if (msg.templateButtonReplyMessage) {
    id = msg.templateButtonReplyMessage.selectedId
  } else if (msg.interactiveResponseMessage) {
    try {
      const params = JSON.parse(msg.interactiveResponseMessage?.nativeFlowResponseMessage?.paramsJson || '{}')
      // Cover semua kemungkinan key ID dari Native Flow
      id = params.id || params.name || params.value || '' 
    } catch (e) {
      console.log('❌ NativeFlow parse error:', e)
    }
  }

  // 🔥 JURUS LICIK UNIVERSAL: Kalo dapet ID dari tombol manapun, langsung timpa m.text nya!
  if (id) {
    m.text = id
    
    // Biar lu puas ngeliat di console kalo payloadnya berhasil ditangkep
    console.log(chalk.bgGreen.black(` 🔥 [BYPASS BUTTON] Payload berhasil ditangkep -> ${id} `))
  }
  
  // Wajib return true/false buat file hook (before/after)
  return true 
}