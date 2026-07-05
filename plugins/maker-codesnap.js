/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Author     : Lynx Decode
 * 📞 Contact    : +62 882-5804-1396
 * 📢 Channel    : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * ⚠️ Note       : Keep credit to respect the creator!
 * ─────────────────────────
 * 📝 Plugin: Code Snap Maker
 */

let handler = async (m, { conn, text, usedPrefix, command }) => {
    let codeText = text ? text : (m.quoted && m.quoted.text ? m.quoted.text : '')

    if (!codeText) {
        return m.reply(`┌˚₊ ๑│ ᴄ ᴏ ᴅ ᴇ  s ɴ ᴀ ᴘ │๑˚₊ ⚠️\n┇ \n│ ❌ *Format salah!*\n│ \n│ 📌 *Cara pakai:*\n│ ${usedPrefix + command} <code>\n│ _Atau reply/balas pesan yang berisi code._\n┇ \n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`)
    }

    await m.react('⏳')

    try {
        const apiUrl = `https://restapi.jagoanproject.web.id/api/maker/codesnap?code=${encodeURIComponent(codeText)}`
        
        const res = await fetch(apiUrl, {
            headers: {
                'Authorization': 'Bearer Lynxdecode'
            }
        })

        const contentType = res.headers.get('content-type')
        let mediaPayload

        if (contentType && contentType.includes('application/json')) {
            const json = await res.json()
            if (!json.status || !json.data || !json.data.result || !json.data.result.url) {
                throw new Error('Gagal mendapatkan URL dari respon JSON API.')
            }
            mediaPayload = { url: json.data.result.url }
        } else {
            const buffer = Buffer.from(await res.arrayBuffer())
            mediaPayload = buffer
        }

        let caption = `┌˚₊ ๑│ ᴄ ᴏ ᴅ ᴇ  s ɴ ᴀ ᴘ │๑˚₊ 💻\n` +
                      `┇ \n` +
                      `│ ✅ *Sukses membuat snapshot code!*\n` +
                      `┇ \n` +
                      `└˚₊ ๑ ────────────── ๑˚₊\n` +
                      `> © ERINE-AI`

        await conn.sendMessage(m.chat, {
            image: mediaPayload,
            caption: caption
        }, { quoted: m })

        await m.react('✅')

    } catch (error) {
        console.error('[CODESNAP ERROR]', error)
        await m.react('❌')
        m.reply(`┌˚₊ ๑│ s ʏ s ᴛ ᴇ ᴍ  ᴇ ʀ ʀ ᴏ ʀ │๑˚₊ ❌\n┇ Terjadi kesalahan sistem.\n┇ *Detail:* ${error.message || String(error)}\n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`)
    }
}

handler.help = ['codesnap <teks/reply>']
handler.tags = ['maker']
handler.command = /^(codesnap|csnap)$/i
handler.limit = true

export default handler