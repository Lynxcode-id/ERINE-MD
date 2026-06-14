/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx Decode
 * 📞 WhatsApp  : +62 882-5804-1396
 * 📢 Channel   : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * ⚠️ Note      : Keep credit to respect the creator!
 * ─────────────────────────
 * 📝 Plugin: QRIS Payment Showcase
 */

let handler = async (m, { conn, usedPrefix, command }) => {
    await m.react('💸')

    try {
        let qrisUrl = 'https://files.catbox.moe/nr0e8p.jpg'
        
        let caption = `⚡ ＱＲＩＳ  ＰＡＹＭＥＮＴ ⚡

» Status : Active
» Method : All E-Wallet & Bank Transfer

> Silakan scan kode QR di atas untuk melakukan pembayaran atau donasi. Terima kasih cuy!
`.trim()

        await conn.sendMessage(m.chat, {
            image: { url: qrisUrl },
            caption: caption
        }, { quoted: m })

        await m.react('💰')

    } catch (e) {
        console.error('[QRIS ERROR]', e)
        await m.react('❌')
        m.reply(`⚠️ *System Error:*\n_${e.message || e}_`)
    }
}

handler.help = ['qris']
handler.tags = ['store']
handler.command = /^qris$/i

export default handler