import {
  checkForUpdate,
  confirmAndApplyUpdate,
  getUpdateHelpText,
  canUseUpdateCommand
} from '../lib/update-manager.js'

let handler = async (m, { conn, text, command, usedPrefix }) => {
  const q = (text || '').trim().toLowerCase()
  const allowed = canUseUpdateCommand(m, conn)

  if (command === 'infupdate') {
    if (!allowed) {
      return conn.reply(m.chat, 'Perintah ini khusus owner update.', m)
    }

    const info = await checkForUpdate()

    const msg =
      `📦 *ERINE MD UPDATE INFO*\n\n` +
      `Judul         : ${info.title}\n` +
      `Versi sekarang : ${info.localVersion}\n` +
      `Versi terbaru   : ${info.remoteVersion}\n` +
      `Status          : ${info.updateAvailable ? 'Ada update baru' : 'Sudah paling baru'}\n\n` +
      (info.message ? `Catatan         : ${info.message}\n\n` : '') +
      `Perintah:\n` +
      `• ${usedPrefix}confirm update\n\n` +
      `Catatan:\n` +
      `• plugin baru akan ditarik otomatis\n` +
      `• plugin lama yang resmi diganti akan dibersihkan\n` +
      `• config tetap aman, tapi backup dulu tetap disarankan`

    await conn.reply(m.chat, msg, m)
    return
  }

  if (command === 'confirm' && q === 'update') {
    if (!allowed) {
      return conn.reply(m.chat, 'Perintah ini khusus owner update.', m)
    }

    const info = await checkForUpdate()
    if (!info.updateAvailable) {
      return conn.reply(m.chat, 'Erine MD sudah versi terbaru.', m)
    }

    await conn.reply(m.chat, '⏳ Lagi tarik update dari GitHub, tunggu sebentar...', m)
    await confirmAndApplyUpdate(conn)
    return
  }

  if (command === 'updatehelp') {
    if (!allowed) {
      return conn.reply(m.chat, 'Perintah ini khusus owner update.', m)
    }

    return conn.reply(m.chat, getUpdateHelpText(), m)
  }
}

handler.command = /^(infupdate|confirm|updatehelp)$/i
handler.owner = false

export default handler