import fetch from 'node-fetch'

let timeout = 60000
let poin = 500

let handler = async (m, { conn, usedPrefix }) => {
    conn.tebakwarna = conn.tebakwarna ? conn.tebakwarna : {}
    let id = m.chat

    if (id in conn.tebakwarna) return conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.tebakwarna[id][0])

    try {
        let res = await fetch('https://api.siputzx.my.id/api/games/tebakwarna')
        let json = await res.json()

        if (!json.status) return m.reply('❌ Gagal mengambil data game.')

        // Ambil image dan jawaban yang bener (correct)
        let { image, correct } = json.data

        let caption = `乂 *T E B A K   W A R N A*\n\n`
        caption += `Angka berapa yang tersembunyi di gambar ini?\n\n`
        caption += `Timeout : *${(timeout / 1000).toFixed(2)} detik*\n`
        caption += `Bonus : *${poin} XP*\n\n`
        caption += `_Balas pesan ini untuk menjawab!_`

        conn.tebakwarna[id] = [
            await conn.sendFile(m.chat, image, 'tebakwarna.jpg', caption, m),
            correct,
            poin,
            setTimeout(() => {
                if (conn.tebakwarna[id]) conn.reply(m.chat, `Waktu habis!\nJawabannya adalah: *${correct}*`, conn.tebakwarna[id][0])
                delete conn.tebakwarna[id]
            }, timeout)
        ]
    } catch (e) {
        console.error(e)
        m.reply('❌ Terjadi kesalahan sistem.')
    }
}

handler.help = ['tebakwarna']
handler.tags = ['game']
handler.command = /^(tebakwarna)$/i
handler.limit = true

export default handler