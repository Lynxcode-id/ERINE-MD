import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return m.reply(`Mau cari resep apa cuy?\n\n*Contoh Penggunaan:*\n${usedPrefix + command} nasi goreng`)

    m.reply('⏳ *Lagi nyari buku resep...*')

    try {
        let res = await fetch(`https://api.siputzx.my.id/api/s/resep?query=${encodeURIComponent(text)}`)
        let json = await res.json()

        // Handle kalau data gak ketemu atau error
        if (!json.status || !json.data || json.data.length === 0) {
            return m.reply('❌ Resep nggak ketemu cuy. Coba pakai nama makanan yang lain.')
        }

        // Ambil data array index ke-0 (pencarian teratas)
        let recipe = json.data[0]

        let caption = `乂 *R E S E P   M A K A N A N*\n\n`
        caption += `🍳 *Menu:* ${recipe.judul}\n`
        caption += `⏱️ *Waktu Masak:* ${recipe.waktu_masak}\n`
        caption += `🍽️ *Porsi:* ${recipe.hasil}\n`
        caption += `📊 *Tingkat Kesulitan:* ${recipe.tingkat_kesulitan}\n\n`
        
        caption += `🛒 *B A H A N :*\n`
        caption += `${recipe.bahan}\n\n`
        
        caption += `📝 *L A N G K A H - L A N G K A H :*\n`
        caption += `${recipe.langkah_langkah}\n\n`
        
        if (json.data.length > 1) {
            caption += `_(Menampilkan hasil teratas dari ${json.data.length} resep yang ditemukan untuk "${text}")_\n\n`
        }
        caption += `_Jemima Bot_`

        // Kirim gambar thumbnail beserta caption resepnya
        await conn.sendFile(m.chat, recipe.thumb, 'resep.jpg', caption, m)

    } catch (e) {
        console.error(e)
        m.reply('❌ Terjadi kesalahan sistem saat mencari resep.')
    }
}

handler.help = ['resep <pencarian>']
handler.tags = ['search']
handler.command = /^(resep|resepmakanan|cariresep)$/i
handler.limit = true

export default handler