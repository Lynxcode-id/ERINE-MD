/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Author     : Lynx Decode
 * 📞 Contact    : +62 882-5804-1396
 * 📢 Channel    : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * ⚠️ Note       : Keep credit to respect the creator!
 * ─────────────────────────
 * 📝 Plugin: Game Tebak One Piece
 */

import axios from 'axios'

let timeout = 60000
let poin = 500

let handler = async (m, { conn, usedPrefix, command }) => {
    conn.tebakonepiece = conn.tebakonepiece ? conn.tebakonepiece : {}
    let id = m.chat

    if (id in conn.tebakonepiece) {
        return m.reply('❌ Masih ada soal belum terjawab di grup ini.')
    }

    await m.react('⏳')

    try {
        const { data } = await axios.get('https://restapi.jagoanproject.web.id/api/game/tebakonepiece', {
            headers: {
                'Authorization': 'Bearer Lynxdecode'
            }
        })

        if (!data.status || !data.result) throw new Error('Gagal mengambil data dari server.')

        let json = data.result
        let caption = `┌˚₊ ๑│ ᴛ ᴇ ʙ ᴀ ᴋ  ᴏ ɴ ᴇ  ᴘ ɪ ᴇ ᴄ ᴇ │๑˚₊ 🏴‍☠️\n` +
                      `┇ \n` +
                      `│ ❓ *Tebak Siapa Karakter Ini!*\n` +
                      `│ ⏱️ *Waktu:* ${(timeout / 1000).toFixed(0)} Detik\n` +
                      `│ 🎁 *Hadiah:* ${poin} XP\n` +
                      `┇ \n` +
                      `│ 💬 *Balas pesan ini untuk menjawab*\n` +
                      `└˚₊ ๑ ────────────── ๑˚₊\n` +
                      `> © ERINE-AI x INF PROJECT`

        conn.tebakonepiece[id] = [
            await conn.sendMessage(m.chat, { image: { url: json.img }, caption: caption }, { quoted: m }),
            json,
            poin,
            setTimeout(async () => {
                if (conn.tebakonepiece[id]) {
                    let msg = `┌˚₊ ๑│ ᴛ ᴇ ʙ ᴀ ᴋ  ᴏ ɴ ᴇ  ᴘ ɪ ᴇ ᴄ ᴇ │๑˚₊ 🏴‍☠️\n` +
                              `┇ \n` +
                              `│ ❌ *Waktu Habis!*\n` +
                              `│ 💡 *Jawaban:* ${json.jawaban}\n` +
                              `┇ \n` +
                              `└˚₊ ๑ ────────────── ๑˚₊\n` +
                              `> © ERINE-AI`
                    await conn.sendMessage(m.chat, { text: msg }, { quoted: conn.tebakonepiece[id][0] })
                    delete conn.tebakonepiece[id]
                }
            }, timeout)
        ]

        await m.react('✅')
    } catch (e) {
        console.error('[TEBAK ONE PIECE ERROR]', e)
        await m.react('❌')
        m.reply(`┌˚₊ ๑│ ꜱ ʏ ꜱ ᴛ ᴇ ᴍ  ᴇ ʀ ʀ ᴏ ʀ │๑˚₊ ❌\n┇ Terjadi kesalahan.\n┇ *Detail:* ${e.message || String(e)}\n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`)
    }
}

handler.before = async (m, { conn }) => {
    conn.tebakonepiece = conn.tebakonepiece ? conn.tebakonepiece : {}
    let id = m.chat
    
    // PERBAIKAN: Gunakan return false agar pesan tidak ditelan oleh handler.before
    if (!m.quoted || !m.quoted.fromMe || !m.quoted.isBaileys || !m.text) return false
    if (!(id in conn.tebakonepiece)) return false
    
    if (m.quoted.id === conn.tebakonepiece[id][0].key.id) {
        let json = JSON.parse(JSON.stringify(conn.tebakonepiece[id][1]))
        let answer = json.jawaban.toLowerCase().trim()
        
        if (m.text.toLowerCase().trim() === answer) {
            // Berikan reward ke user
            global.db.data.users[m.sender].exp += conn.tebakonepiece[id][2]
            
            let msg = `┌˚₊ ๑│ ᴛ ᴇ ʙ ᴀ ᴋ  ᴏ ɴ ᴇ  ᴘ ɪ ᴇ ᴄ ᴇ │๑˚₊ 🏴‍☠️\n` +
                      `┇ \n` +
                      `│ 🎉 *BENAR!*\n` +
                      `│ 🎁 *Hadiah:* +${conn.tebakonepiece[id][2]} XP\n` +
                      `┇ \n` +
                      `└˚₊ ๑ ────────────── ๑˚₊\n` +
                      `> © ERINE-AI x INF PROJECT`
                      
            await conn.sendMessage(m.chat, { text: msg }, { quoted: m })
            
            clearTimeout(conn.tebakonepiece[id][3])
            delete conn.tebakonepiece[id]
            return true // Ini baru return true karena game-nya berhasil kejawab
        } else {
            await m.react('❌')
            return false
        }
    }
    return false
}

handler.help = ['tebakonepiece']
handler.tags = ['game']
handler.command = /^tebakonepiece$/i
handler.limit = true

export default handler