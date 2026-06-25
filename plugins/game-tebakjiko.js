import axios from 'axios'

let handler = async (m, { conn, usedPrefix, command }) => {
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
        let caption = `┌˚₊ ๑│ ᴛ ᴇ ʙ ᴀ ᴋ  ᴊ ɪ ᴋ ᴏ 𝟒𝟖 │๑˚₊ 🎭\n` +
                      `┇ \n` +
                      `│ 📝 *Soal:* ${res.soal}\n` +
                      `┇ \n` +
                      `│ 💡 *Petunjuk:* Ketik jawaban kamu di chat.\n` +
                      `└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`

        // Simpan jawaban ke dalam session/cache jika sistem game memerlukan verifikasi
        conn.tebakjiko48 = conn.tebakjiko48 || {}
        conn.tebakjiko48[m.chat] = res.jawaban

        await conn.reply(m.chat, caption, m)
        await m.react('✅')

    } catch (e) {
        console.error('[TEBAK JIKO ERROR]', e)
        await m.react('❌')
        let errorText = e.message || 'Terjadi kesalahan'
        m.reply(`┌˚₊ ๑│ ᴛ ᴇ ʙ ᴀ ᴋ  ᴊ ɪ ᴋ ᴏ 𝟒𝟖 │๑˚₊ ❌\n┇ \n│ *Gagal Mengambil Soal!*\n│ 📡 *Respon:* ${errorText}\n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`)
    }
}

handler.help = ['tebakjiko48']
handler.tags = ['game']
handler.command = /^tebakjiko48$/i
handler.limit = true

export default handler