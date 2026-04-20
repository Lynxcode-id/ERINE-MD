import fetch from 'node-fetch'

let handler = async (m, { conn, args, usedPrefix, command }) => {
    // Gabungin argumen
    let text = args.join(' ')
    
    // Validasi kalau user lupa masukin tanggal
    if (!text) return m.reply(`Masukin tanggal lahir lu cuy!\n\n*Contoh Penggunaan:*\n${usedPrefix + command} 23 5 2002\natau\n${usedPrefix + command} 23-05-2002`)
    
    // Pisahin tanggal, bulan, tahun (bisa pakai spasi atau strip)
    let [tgl, bln, thn] = text.split(/[- ]+/)

    if (!tgl || !bln || !thn) return m.reply(`Format tanggal, bulan, tahun nggak lengkap!\nContoh: ${usedPrefix + command} 23 5 2002`)

    m.reply('⏳ *Menerawang rejeki...*')

    try {
        let res = await fetch(`https://api.siputzx.my.id/api/primbon/rejeki_hoki_weton?tgl=${tgl}&bln=${bln}&thn=${thn}`)
        let json = await res.json()

        if (!json.status) return m.reply('❌ Gagal mengambil data primbon. Cek lagi tanggal yang dimasukkan.')

        let { hari_lahir, rejeki, catatan } = json.data

        // Bikin tampilan yang rapi buat dikirim ke user
        let caption = `乂 *P R I M B O N   R E J E K I*\n\n`
        caption += `📅 *Hari Lahir:* ${hari_lahir}\n\n`
        
        // Membersihkan kata 'Hover' yang ikut ke-scrape dari website sumbernya
        let bersihRejeki = rejeki.replace(/Hover$/i, '').trim()
        
        caption += `💰 *Ramalan Rejeki:*\n${bersihRejeki}\n\n`
        caption += `📌 *Catatan:*\n_${catatan}_\n\n`
        caption += `_Jemima Bot_`

        await conn.reply(m.chat, caption, m)

    } catch (e) {
        console.error(e)
        m.reply('❌ Terjadi kesalahan sistem saat mengambil data.')
    }
}

handler.help = ['ramalanrejeki <tgl bln thn>']
handler.tags = ['primbon']
handler.command = /^(ramalanrejeki|primbonrejeki|cekrejeki)$/i
handler.limit = true

export default handler