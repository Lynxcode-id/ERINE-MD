/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Author     : Lynx Decode
 * 📞 Contact    : +62 882-5804-1396
 * 📢 Channel    : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * ⚠️ Note       : Keep credit to respect the creator!
 * ─────────────────────────
 * 📝 Plugin: Tebak Jiko 48 (Auto Answer/Listener)
 */

import axios from 'axios'

const timeout = 60000 // Batas waktu 60 detik
const poin = 4800

let handler = async (m, { conn, usedPrefix, command }) => {
    conn.tebakjiko48 = conn.tebakjiko48 ? conn.tebakjiko48 : {}
    let id = m.chat

    // Mencegah spam soal kalau yang lama belum kejawab
    if (id in conn.tebakjiko48) {
        return conn.reply(m.chat, '❌ *Masih ada soal Jiko yang belum terjawab di chat ini!*', conn.tebakjiko48[id][0])
    }

    await m.react('⏳')
    
    const apiUrl = `https://v2.api-varhad.my.id/game/tebakjiko48`

    try {
        const { data } = await axios.get(apiUrl, {
            headers: { 'Accept': 'application/json' }
        })

        if (!data.status || !data.result) {
            throw new Error("Gagal mengambil soal tebak Jiko.")
        }

        let res = data.result
        let caption = `┌˚₊ ๑│ ᴛ ᴇ ʙ ᴀ ᴋ  ᴊ ɪ ᴋ ᴏ  𝟒𝟖 │๑˚₊ 🎭\n` +
                      `┇ \n` +
                      `│ 📝 *Soal:* ${res.soal}\n` +
                      `┇ \n` +
                      `│ 💰 *Hadiah:* ${poin} XP\n` +
                      `│ ⏱️ *Waktu:* ${(timeout / 1000)} Detik\n` +
                      `│ 💡 *Petunjuk:* Balas (reply) pesan ini untuk menjawab!\n` +
                      `└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`

        // Susun session jadi format standar game Baileys (Pesan, JSON, Poin, Timer)
        conn.tebakjiko48[id] = [
            await conn.reply(m.chat, caption, m),
            res,
            poin,
            setTimeout(() => {
                if (conn.tebakjiko48[id]) {
                    conn.reply(m.chat, `┌˚₊ ๑│ ᴛ ᴇ ʙ ᴀ ᴋ  ᴊ ɪ ᴋ ᴏ  𝟒𝟖 │๑˚₊ ❌\n┇ \n│ ⏱️ *Waktu Habis!*\n│ 💡 *Jawaban:* ${res.jawaban}\n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`, conn.tebakjiko48[id][0])
                    delete conn.tebakjiko48[id]
                }
            }, timeout)
        ]

        await m.react('✅')
    } catch (e) {
        console.error('[TEBAK JIKO ERROR]', e)
        await m.react('❌')
        let errorText = e.message || 'Terjadi kesalahan'
        m.reply(`┌˚₊ ๑│ ᴛ ᴇ ʙ ᴀ ᴋ  ᴊ ɪ ᴋ ᴏ  𝟒𝟖 │๑˚₊ ❌\n┇ \n│ *Gagal Mengambil Soal!*\n│ 📡 *Respon:* ${errorText}\n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`)
    }
}

// Fitur auto-listener untuk ngecek jawaban member di grup
handler.before = async function (m, { conn }) {
    conn.tebakjiko48 = conn.tebakjiko48 ? conn.tebakjiko48 : {}
    let id = m.chat

    // Lewati kalau bukan reply bot, pesan sendiri, atau pesan tanpa teks
    if (!m.quoted || !m.quoted.fromMe || !m.quoted.isBaileys || !m.text) return !0
    if (!(id in conn.tebakjiko48)) return !0

    // Pastikan user mereply pesan soal yang benar
    if (m.quoted.id == conn.tebakjiko48[id][0].id) {
        let isSurrender = /^((me)?nyerah|surr?ender)$/i.test(m.text)
        
        if (isSurrender) {
            clearTimeout(conn.tebakjiko48[id][3])
            delete conn.tebakjiko48[id]
            return m.reply('❌ *Kamu Menyerah!*')
        }

        let json = JSON.parse(JSON.stringify(conn.tebakjiko48[id][1]))

        if (m.text.toLowerCase().trim() == json.jawaban.toLowerCase().trim()) {
            global.db.data.users[m.sender].exp += conn.tebakjiko48[id][2]
            
            await m.reply(`┌˚₊ ๑│ ᴛ ᴇ ʙ ᴀ ᴋ  ᴊ ɪ ᴋ ᴏ  𝟒𝟖 │๑˚₊ 🎉\n┇ \n│ ✅ *Tebakan Kamu Benar!*\n│ 💰 *Hadiah:* +${conn.tebakjiko48[id][2]} XP\n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`)
            
            clearTimeout(conn.tebakjiko48[id][3])
            delete conn.tebakjiko48[id]
        } else {
            await m.react('❌')
            m.reply('❌ *Salah! Coba tebak lagi.*')
        }
    }
    return !0
}

handler.help = ['tebakjiko48']
handler.tags = ['game']
handler.command = /^tebakjiko48$/i
handler.limit = true

export default handler