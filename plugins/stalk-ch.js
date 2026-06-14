/*
---------------------------------------------------------------

• Fitur Stalk Saluran WhatsApp
• Creator - Pembuat Code ini : @Lynx decode
• Saluran Saya : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
• Rilis : 26 April 2026
• Notes : Jangan hapus wm! - jangan hapus credit ini hargai pembuat - creator !!

---------------------------------------------------------------
*/

import axios from 'axios'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return m.reply(`❌ Masukkan Link Saluran WhatsApp nya cuy!\n*Contoh:* ${usedPrefix + command} https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i`)

    if (!text.includes('whatsapp.com/channel/')) return m.reply(`❌ Link tidak valid! Pastikan itu adalah link Saluran WhatsApp.`)

    m.reply('⏳ Sedang mengambil data saluran, tunggu sebentar cuy...')

    try {
        const url = `https://www.neoapis.xyz/api/stalk/whatsapp-channel?url=${text}`
        const response = await axios.get(url)
        const result = response.data

        if (!result.status) {
            return m.reply("❌ Gagal mendapatkan data. Pastikan link benar atau API sedang gangguan.")
        }

        const ch = result.data
        
        const hasilStalk = `
📢 *WHATSAPP CHANNEL STALK* 📢

📛 *Nama:* ${ch.name || 'Tidak diketahui'}
🔗 *Link:* ${ch.url || text}
👥 *Pengikut:* ${ch.followers ? ch.followers : 'Sembunyi / Cek di baris pertama deskripsi'}

📝 *Deskripsi:*
${ch.description || 'Tidak ada deskripsi'}
`.trim()

        if (ch.image) {
            await conn.sendFile(m.chat, ch.image, 'channel.jpg', hasilStalk, m)
        } else {
            await m.reply(hasilStalk)
        }

    } catch (error) {
        console.error("Error fetching data:", error.message)
        return m.reply("❌ Terjadi kesalahan pada server saat mengambil data stalk Channel.")
    }
}

handler.help = ['stalkch <link>']
handler.tags = ['search', 'tools']
handler.command = /^(stalkch|stalkchannel|chstalk)$/i

export default handler