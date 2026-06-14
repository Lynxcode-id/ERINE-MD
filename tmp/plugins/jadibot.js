/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx Decode
 * 📢 Channel   : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * ─────────────────────────
 * 📝 Plugin : Jadibot (Reguler & Premium)
 */

import { startJadibot, stopJadibot, isActive } from '../lib/jadibot.js'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (conn.isJadibot) {
        return m.reply('❌ Perintah ini tidak bisa digunakan di dalam sesi Jadibot.')
    }

    let user = global.db.data.users[m.sender]
    let jid = m.sender

    if (command === 'jadibot' || command === 'jadibotprem') {
        if (isActive(jid)) {
            return m.reply(`❌ Nomor ini sudah terdaftar sebagai Jadibot yang aktif.\n\nKetik *${usedPrefix}stopjadibot* jika ingin mematikan sesi.`)
        }

        let isPremiumReq = command === 'jadibotprem'

        if (isPremiumReq && user.premiumTime < 1) {
            return m.reply(`❌ Fitur Jadibot Premium khusus untuk user Premium Erine.\nSilakan hubungi owner untuk upgrade.`)
        }

        await m.react('⏳')
        m.reply(`⏳ Memproses jadibot ${isPremiumReq ? 'Premium' : 'Reguler'}...\nSilakan tunggu pairing code.`)

        try {
            await startJadibot(conn, m, jid, false, isPremiumReq)
        } catch (e) {
            await m.react('❌')
            m.reply(`❌ Gagal memulai jadibot: ${e.message || String(e)}`)
        }
    }

    if (command === 'stopjadibot') {
        if (!isActive(jid)) {
            return m.reply('❌ Anda tidak memiliki sesi Jadibot yang sedang aktif.')
        }

        await m.react('⏳')
        try {
            await stopJadibot(jid, true)
            await m.react('✅')
            m.reply('✅ Sesi jadibot Anda telah dihentikan dan dihapus dari server.')
        } catch (e) {
            await m.react('❌')
            m.reply(`❌ Gagal menghentikan jadibot: ${e.message || String(e)}`)
        }
    }
}

handler.help = ['jadibot', 'jadibotprem', 'stopjadibot']
handler.tags = ['main', 'jadibot']
handler.command = /^(jadibot|jadibotprem|stopjadibot)$/i

export default handler