import fetch from 'node-fetch'

let timeout = 60000
let poin = 500

let handler = async (m, { conn, usedPrefix }) => {
    conn.siapakahaku = conn.siapakahaku ? conn.siapakahaku : {}
    let id = m.chat

    if (id in conn.siapakahaku) return conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.siapakahaku[id][0])

    try {
        let res = await fetch('https://api.siputzx.my.id/api/games/siapakahaku')
        let json = await res.json()

        if (!json.status) return m.reply('❌ Gagal mengambil data game.')

        // Ambil soal dan jawaban dari json.data
        let { soal, jawaban } = json.data

        let caption = `乂 *S I A P A K A H   A K U*\n\n`
        caption += `Soal: *${soal}*\n\n`
        caption += `Timeout : *${(timeout / 1000).toFixed(2)} detik*\n`
        caption += `Bonus : *${poin} XP*\n\n`
        caption += `_Balas pesan ini untuk menjawab!_`

        conn.siapakahaku[id] = [
            await conn.reply(m.chat, caption, m),
            jawaban,
            poin,
            setTimeout(() => {
                if (conn.siapakahaku[id]) conn.reply(m.chat, `Waktu habis!\nJawabannya adalah: *${jawaban}*`, conn.siapakahaku[id][0])
                delete conn.siapakahaku[id]
            }, timeout)
        ]
    } catch (e) {
        console.error(e)
        m.reply('❌ Terjadi kesalahan sistem.')
    }
}

handler.help = ['siapakahaku']
handler.tags = ['game']
handler.command = /^(siapakahaku)$/i
handler.limit = true

export default handler