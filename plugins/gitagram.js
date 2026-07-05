import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return m.reply(`Mau cari chord lagu apa cuy?\n\n*Contoh Penggunaan:*\n${usedPrefix + command} sekuat hatimu`)

    m.reply('⏳ *Mencari chord...*')

    try {
        let res = await fetch(`https://api.siputzx.my.id/api/s/gitagram?search=${encodeURIComponent(text)}`)
        let json = await res.json()

        if (!json.status || !json.data || json.data.length === 0) {
            return m.reply('❌ Chord nggak ketemu cuy. Coba pastiin lagi judul lagunya.')
        }

        // Ambil data pertama dari array hasil pencarian
        let song = json.data[0]

        let caption = `乂 *G I T A G R A M   C H O R D*\n\n`
        caption += `🎵 *Judul:* ${song.title}\n`
        // Ngebersihin karakter '‣ ' bawaan dari API artisnya biar lebih rapi
        caption += `🎤 *Artis:* ${song.artist.replace('‣ ', '').trim()}\n\n`
        
        caption += `*C H O R D :*\n`
        caption += `${song.detail}\n\n`
        
        caption += `_Jemima Bot_`

        await m.reply(caption)

    } catch (e) {
        console.error(e)
        m.reply('❌ Terjadi kesalahan sistem saat mencari chord.')
    }
}

handler.help = ['chord <judul lagu>']
handler.tags = ['search']
handler.command = /^(chord|kunci|kuncigitar|gitagram)$/i
handler.limit = true

export default handler