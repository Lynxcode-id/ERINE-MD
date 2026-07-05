/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Author     : Lynx Decode
 * 📞 Contact    : +62 882-5804-1396
 * 📢 Channel    : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * ⚠️ Note       : Keep credit to respect the creator!
 * ─────────────────────────
 * 📝 Plugin: Send Poll / Pertanyaan to Channel
 */

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text || !text.includes('|')) {
        return m.reply(`┌˚₊ ๑│ s ᴇ ɴ ᴅ  ᴘ ᴏ ʟ ʟ  ᴄ ʜ │๑˚₊ ⚠️\n┇ \n│ ❌ *Format salah!*\n│ \n│ 📌 *Cara pakai:*\n│ ${usedPrefix + command} idchannel|Pertanyaan|Opsi1|Opsi2\n│ \n│ 📌 *Contoh:*\n│ ${usedPrefix + command} 120363404569528126@newsletter|Waktunya bikin fitur?|Gas|Nanti aja\n┇ \n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`)
    }

    let [jid, name, ...values] = text.split('|').map(v => v.trim())
    
    if (!jid.endsWith('@newsletter')) {
        return m.reply(`┌˚₊ ๑│ s ʏ s ᴛ ᴇ ᴍ  ᴇ ʀ ʀ ᴏ ʀ │๑˚₊ ❌\n┇ ID Channel harus diakhiri dengan @newsletter!\n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`)
    }

    if (!name || values.length < 1) {
        return m.reply(`┌˚₊ ๑│ s ʏ s ᴛ ᴇ ᴍ  ᴇ ʀ ʀ ᴏ ʀ │๑˚₊ ❌\n┇ Pertanyaan dan minimal 1 opsi wajib diisi!\n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`)
    }

    await m.react('⏳')

    try {
        await conn.sendMessage(jid, {
            poll: {
                name: name,
                values: values,
                selectableCount: 1
            }
        })
        
        await m.reply(`┌˚₊ ๑│ s ᴜ ᴋ s ᴇ s │๑˚₊ ✅\n┇ Pesan pertanyaan (Poll) berhasil dikirim ke Channel!\n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`)
        await m.react('✅')
    } catch (error) {
        console.error('[POLL CH ERROR]', error)
        await m.react('❌')
        m.reply(`┌˚₊ ๑│ s ʏ s ᴛ ᴇ ᴍ  ᴇ ʀ ʀ ᴏ ʀ │๑˚₊ ❌\n┇ Gagal mengirim pesan ke Channel. Pastikan bot adalah admin di channel tersebut.\n┇ *Detail:* ${error.message || String(error)}\n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`)
    }
}

handler.help = ['chpoll <id|tanya|opsi>']
handler.tags = ['owner']
handler.command = /^(chpoll|sendpollch|pollch)$/i
handler.owner = true

export default handler