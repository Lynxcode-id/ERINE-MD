/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Author     : Lynx Decode
 * 📞 Contact    : +62 882-5804-1396
 * 📢 Channel    : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * ⚠️ Note       : Keep credit to respect the creator!
 * ─────────────────────────
 * 📝 Plugin: Fake FF Duo Maker
 */

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text || !text.includes('|')) {
        return m.reply(`┌˚₊ ๑│ ғ ᴀ ᴋ ᴇ  ғ ғ  ᴅ ᴜ ᴏ │๑˚₊ ⚠️\n┇ \n│ ❌ *Format salah!*\n│ \n│ 📌 *Cara pakai:*\n│ ${usedPrefix + command} nama1|nama2\n│ \n│ 📌 *Contoh:*\n│ ${usedPrefix + command} Erine|Lynx\n┇ \n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`)
    }

    let [name1, name2] = text.split('|').map(v => v.trim())

    if (!name1 || !name2) {
        return m.reply(`┌˚₊ ๑│ s ʏ s ᴛ ᴇ ᴍ  ᴇ ʀ ʀ ᴏ ʀ │๑˚₊ ❌\n┇ Nama 1 dan Nama 2 wajib diisi!\n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`)
    }

    await m.react('⏳')

    try {
        const apiUrl = `https://restapi.jagoanproject.web.id/api/maker/fakeffduo?name1=${encodeURIComponent(name1)}&name2=${encodeURIComponent(name2)}`
        
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

        let caption = `┌˚₊ ๑│ ғ ᴀ ᴋ ᴇ  ғ ғ  ᴅ ᴜ ᴏ │๑˚₊ 🎮\n` +
                      `┇ \n` +
                      `│ 👤 *Player 1:* ${name1}\n` +
                      `│ 👤 *Player 2:* ${name2}\n` +
                      `┇ \n` +
                      `└˚₊ ๑ ────────────── ๑˚₊\n` +
                      `> © ERINE-AI`

        await conn.sendMessage(m.chat, {
            image: mediaPayload,
            caption: caption
        }, { quoted: m })

        await m.react('✅')

    } catch (error) {
        console.error('[FAKE FF DUO ERROR]', error)
        await m.react('❌')
        m.reply(`┌˚₊ ๑│ s ʏ s ᴛ ᴇ ᴍ  ᴇ ʀ ʀ ᴏ ʀ │๑˚₊ ❌\n┇ Terjadi kesalahan sistem.\n┇ *Detail:* ${error.message || String(error)}\n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`)
    }
}

handler.help = ['fakeffduo <nama1|nama2>']
handler.tags = ['maker']
handler.command = /^(fakeffduo|ffduo)$/i
handler.limit = true

export default handler