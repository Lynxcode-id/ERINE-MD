/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Author     : Lynx Decode
 * 📞 Contact    : +62 882-5804-1396
 * 📢 Channel    : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * ⚠️ Note       : Keep credit to respect the creator!
 * ─────────────────────────
 * 📝 Plugin: SS Web (JereXD API)
 */

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        return m.reply(`┌˚₊ ๑│ ꜱ ꜱ  ᴡ ᴇ ʙ │๑˚₊ 📸\n┇ \n│ ❌ *Link atau URL-nya mana cuy?*\n│ \n│ 📌 *Cara pakai:*\n│ ${usedPrefix + command} https://github.com/LynxDecode\n┇ \n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI x INF PROJECT`)
    }

    let url = text.trim()
    
    // Validasi & Auto-fix http/https
    if (!/^https?:\/\//.test(url)) {
        url = 'https://' + url
    }

    await m.react('⏳')

    try {
        let targetUrl = encodeURIComponent(url)
        const apiUrl = `https://api.jerexd.my.id/api/tools/ssweb?apikey=Lynxdecode&url=${targetUrl}&device=desktop&fullPage=fullpage`

        let caption = `┌˚₊ ๑│ ꜱ ꜱ  ᴡ ᴇ ʙ │๑˚₊ 📸\n` +
                      `┇ \n` +
                      `│ ✅ *Sukses mengambil screenshot!*\n` +
                      `│ 🔗 *Target:* ${url}\n` +
                      `┇ \n` +
                      `└˚₊ ๑ ────────────── ๑˚₊\n` +
                      `> © ERINE-AI x INF PROJECT`

        await conn.sendMessage(m.chat, { 
            image: { url: apiUrl }, 
            caption: caption 
        }, { quoted: m })

        await m.react('✅')

    } catch (error) {
        console.error('[SSWEB ERROR]', error)
        await m.react('❌')
        
        let errMsg = error.message || String(error)
        m.reply(`┌˚₊ ๑│ ꜱ ʏ ꜱ ᴛ ᴇ ᴍ  ᴇ ʀ ʀ ᴏ ʀ │๑˚₊ ❌\n┇ Terjadi kesalahan sistem.\n┇ *Detail:* ${errMsg}\n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`)
    }
}

handler.help = ['ssweb1 <url>']
handler.tags = ['tools']
handler.command = /^ssweb1$/i
handler.limit = true

export default handler