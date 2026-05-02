let handler = async (m, { conn }) => {
    let qris = 'https://c.termai.cc/i120/m9U.jpg'
    let caption = `🛒 *ORDER FORM — PREMIUM*

📦 Produk:
🔢 Jumlah:
📝 Catatan (opsional):

💳 *Metode Pembayaran:*
🧾 QRIS : https://c.termai.cc/i120/m9U.jpg
💙 DANA : 0813-6213-3135
🟢 GoPay : 0882-4222-3382
🌐 Saweria : https://saweria.co/LynxPreset

💰 *List Harga Sewa:*
1. Grup / 30 Hari : 10.000
2. Grup / 60 Hari : 15.000
3. Grup / Permanen : 25.000

📸 *Bukti Transfer:*
- Kirim setelah pembayaran
- Admin akan memberikan struk
- Jaga struk sebaik mungkin
- Struk hilang = garansi hangus!
- Kegunaan struk ialah untuk mengajukan klaim garansi apa bila terjadi kesalahan di database kami
- Kirim link grup kamu jika kamu sudah melakukan pembayaran
- Pastikan fitur grup yang [ Setujui Anggota Baru ] mati agar mempercepat proses..
- Jadikan Bot admin agar all fitur berjalan optimal

⚠️ *Notes:*
- Segala bentuk penyalagunaan bot akan kami tindak langsung!
- Data data kamu tersimpan di database server kami!
- Layanan kami sudah memakai server sendiri ( private ) mandiri
- Fitur bot ada yang error ketik .lapor atau lapor langsung ke owner

━━━━━━━━━━
⏳ Estimasi proses ±1–30 menit
🚫 Dilarang spam / double chat
✋ No telfon, Telfon langsung blok
❌ No refund kecuali kesalahan dari pihak kami
✔️ Order = setuju semua ketentuan

━━━━━━━━━━
> 🙏 Terima kasih atas kepercayaannya
> #LynxStore_ - INF PROJECT'S

*PENTING:* Balas pesan ini dengan mengetik *done* sambil melampirkan *Screenshot Bukti Transfer* asli agar pesananmu segera diteruskan ke Owner.`

    await conn.sendFile(m.chat, qris, 'payment.jpg', caption, m)
}

handler.before = async (m, { conn }) => {
    // Pastikan ada pesan yang di-reply
    if (!m.quoted) return !1

    // Ambil teks dari pesan yang di-reply (support berbagai base Baileys)
    let quotedText = m.quoted.text || m.quoted.caption || m.quoted.description || ''
    if (m.quoted.msg && m.quoted.msg.caption) quotedText = m.quoted.msg.caption

    // Cek apakah pesan yang di-reply adalah pesan payment bot
    if (!quotedText.includes('ORDER FORM — PREMIUM')) return !1

    // Ambil input dari user (bisa dari text biasa atau caption gambar)
    let userText = m.text || m.caption || (m.msg && m.msg.caption) || ''
    let isDone = /done/i.test(userText)
    
    // Cek apakah ada media gambar
    let mime = (m.msg || m).mimetype || ''
    let isImage = /image\/(jpe?g|png)/.test(mime)

    // Validasi ketat
    if (!isDone || !isImage) {
        if (!m.fromMe) {
            await m.reply('❌ *Format Salah!*\n\nPastikan kamu membalas pesan order dengan:\n1. Melampirkan *Gambar/Screenshot Bukti TF*\n2. Mengetik kata *done* pada caption gambar.')
        }
        return !1
    }

    try {
        // Ambil nomor owner dengan aman
        let ownerNum = typeof global.owner[0] === 'object' ? global.owner[0][0] : global.owner[0]
        let ownerJid = ownerNum.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
        
        // Download bukti TF
        let media = await m.download()
        let captionForward = `🚨 *NOTIFIKASI PEMBAYARAN BARU* 🚨\n\n👤 User: @${m.sender.split('@')[0]}\n📞 Nomor: wa.me/${m.sender.split('@')[0]}\n💬 Keterangan: ${userText}\n\nBuyer telah mengirimkan bukti transfer di atas. Silahkan dicek!`

        // Kirim ke owner
        await conn.sendFile(ownerJid, media, 'buktitf.jpg', captionForward, m, false, { mentions: [m.sender] })
        
        // Kasih feedback ke buyer
        await m.reply('✅ Bukti pembayaran telah diterima dan diteruskan ke Owner. Mohon tunggu proses konfirmasi, jangan spam ya!')
    } catch (e) {
        console.error(e)
        await m.reply('❌ Terjadi kesalahan saat meneruskan bukti pembayaran ke Owner.')
    }
    
    return !0
}

handler.help = ['sewabot', 'listsewabot', 'hargasewa', 'listsewa', 'qris', 'payment']
handler.tags = ['main']
handler.command = /^(sewabot|listsewabot|hargasewa|listsewa|qris|payment)$/i

export default handler