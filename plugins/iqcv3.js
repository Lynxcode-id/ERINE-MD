import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        return m.reply(`Teksnya mana cuy?\n\n*Cara pake:*\n1. Waktu otomatis (Jam sekarang - Makassar/WITA) 🗿:\n\`${usedPrefix + command} ah ah\`\n\n2. Atur waktu custom (pakai pemisah | ):\n\`${usedPrefix + command} pesan lu | 19:00 | 12:00\`\n*(Format: teks | jam chat | jam status_bar)*`);
    }

    m.reply('⏳ *Tunggu bentar cuy, lagi diproses...*');

    try {
        let pesan, chatTime, statusBarTime;

        // Ambil jam sekarang di zona waktu Makassar (WITA / Asia/Makassar)
        // Format 'en-GB' dipake biar outputnya langsung format 24 jam (contoh: 17:04)
        let now = new Date();
        let waktuMakassar = new Intl.DateTimeFormat('en-GB', {
            timeZone: 'Asia/Makassar',
            hour: '2-digit',
            minute: '2-digit'
        }).format(now);

        // Cek apakah user pake pemisah "|"
        if (text.includes('|')) {
            let parts = text.split('|').map(v => v.trim());
            pesan = parts[0];
            // Kalau waktu dikosongin sebelahnya |, tetep fallback ke waktu Makassar
            chatTime = parts[1] || waktuMakassar; 
            statusBarTime = parts[2] || waktuMakassar; 
        } else {
            // Full otomatis waktu Makassar kalau gak ada "|"
            pesan = text;
            chatTime = waktuMakassar; 
            statusBarTime = waktuMakassar;
        }

        // Bikin URL API-nya
        let apiUrl = `https://api.deline.web.id/maker/iqc?text=${encodeURIComponent(pesan)}&chatTime=${encodeURIComponent(chatTime)}&statusBarTime=${encodeURIComponent(statusBarTime)}`;

        // Eksekusi kirim gambar
        await conn.sendMessage(m.chat, { 
            image: { url: apiUrl }, 
            caption: 'Nih cuy hasilnya! 🔥' 
        }, { quoted: m });

    } catch (e) {
        console.error(e);
        m.reply('❌ *Waduh error cuy!* Keknya API-nya lagi down atau ada masalah, coba lagi nanti ya.');
    }
}

// Bener-bener cuma command 'iqcv3' doang
handler.command = /^iqcv3$/i; 

handler.help = ['iqcv3 <teks> | <jam> | <jam>'];
handler.tags = ['maker'];
handler.limit = true; 

export default handler;