/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Author     : Lynx Decode
 * 📞 Contact    : +62 882-5804-1396
 * 📢 Channel    : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * ⚠️ Note       : Keep credit to respect the creator!
 * ─────────────────────────
 * 📝 Plugin: Fake Bank Jago Maker
 */

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        return m.reply(`┌˚₊ ๑│ ꜰ ᴀ ᴋ ᴇ  ʙ ᴀ ɴ ᴋ │๑˚₊ 💳\n┇ \n│ ❌ *Formatnya kurang cuy!*\n│ \n│ 📌 *Cara pakai:*\n│ ${usedPrefix + command} Nama | Saldo\n│ \n│ 💡 *Contoh:*\n│ ${usedPrefix + command} Firman | 100000\n┇ \n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`)
    }

    let [nama, saldo] = text.split('|').map(v => v.trim())

    if (!nama || !saldo) {
        return m.reply(`❌ *Pisahkan nama dan saldo dengan tanda | (garis lurus) cuy!*\n\nContoh: ${usedPrefix + command} Firman | 100000\n\n> © ERINE-AI`)
    }

    // Validasi biar saldonya beneran angka
    if (isNaN(saldo)) {
        return m.reply(`❌ *Saldonya harus berupa angka cuy, jangan pake titik/koma!*\n\n> © ERINE-AI`)
    }

    await m.react('⏳')

    try {
        const apiUrl = `https://api.nexray.eu.cc/maker/fakebank-jago?nama=${encodeURIComponent(nama)}&saldo=${encodeURIComponent(saldo)}`
        
        let caption = `┌˚₊ ๑│ ꜰ ᴀ ᴋ ᴇ  ʙ ᴀ ɴ ᴋ │๑˚₊ 💳\n┇ \n│ ✅ *Sukses membuat struk Bank Jago!*\n┇ \n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`

        // Nembak langsung URL-nya pakai image buffer dari Baileys
        await conn.sendMessage(m.chat, { image: { url: apiUrl }, caption }, { quoted: m })
        
        await m.react('✅')
    } catch (error) {
        console.error('[FAKEBANK ERROR]', error)
        await m.react('❌')
        m.reply(`┌˚₊ ๑│ ꜱ ʏ ꜱ ᴛ ᴇ ᴍ  ᴇ ʀ ʀ ᴏ ʀ │๑˚₊ ❌\n┇ Terjadi kesalahan sistem.\n┇ *Detail:* ${error.message || String(error)}\n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`)
    }
}

handler.help = ['fakebankjago <nama | saldo>']
handler.tags = ['maker']
handler.command = /^(fakebankjago)$/i
handler.limit = true

export default handler