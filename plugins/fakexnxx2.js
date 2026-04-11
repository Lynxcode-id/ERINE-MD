// ▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰
// ▻ FITUR   : FAKE XNXX CANVAS
// ▻ AUTHOR  : LYNX DECODE { FEMULA + CARBEAT }
// ▻ CHANNEL : https://whatsapp.com/channel/0029Vb1CcDWDp2Q5YT4FZn1k
// jangan maen hapus wm, hargai creator biji. 
// ▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰

import fetch from 'node-fetch';
import FormData from 'form-data';

// Mengganti uploader dari Telegraph ke Catbox (Lebih aman untuk VPS)
async function uploadToCatbox(buffer) {
    try {
        const form = new FormData();
        form.append('reqtype', 'fileupload');
        form.append('fileToUpload', buffer, { filename: 'image.jpg', contentType: 'image/jpeg' });
        
        const res = await fetch('https://catbox.moe/user/api.php', {
            method: 'POST',
            body: form,
            headers: form.getHeaders()
        });
        
        const link = await res.text();
        // Catbox mengembalikan text berupa link (misal: https://files.catbox.moe/xxxx.jpg)
        if (!link.startsWith('https://')) throw new Error('Respon dari server uploader kosong atau diblokir.');
        
        return link;
    } catch (error) {
        throw new Error('Gagal upload ke server Catbox: ' + error.message);
    }
}

const handler = async (m, { conn, text, usedPrefix, command }) => {
    // Mengecek apakah ada pesan yang di-reply atau media yang dikirim langsung
    const q = m.quoted ? m.quoted : m;
    const mime = (q.msg || q).mimetype || '';

    // Validasi input teks dan media
    if (!text) return m.reply(`Teksnya mana?\nContoh: *${usedPrefix + command} Lari ada wibu*`);
    if (!mime.includes('image')) return m.reply(`Balas gambar yang ingin diedit dengan caption *${usedPrefix + command} ${text}*`);

    m.reply('Memproses gambar, tunggu sebentar...');

    try {
        // 1. Mengunduh gambar dari pesan WhatsApp
        const media = await q.download();
        
        // 2. Mengunggah gambar ke Catbox 
        const imageUrl = await uploadToCatbox(media);

        // Validasi ekstra agar tidak masuk undefined ke API
        if (!imageUrl || imageUrl.includes('undefined')) {
            throw new Error('Link gambar tidak valid dari uploader.');
        }

        // 3. Menyusun URL API Siputzx
        const apiUrl = `https://api.siputzx.my.id/api/canvas/xnxx?title=${encodeURIComponent(text)}&image=${encodeURIComponent(imageUrl)}`;

        const now = new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });

        // Tampilan caption ala Jemima-MD
        const captionMsg = `╭── [ *FAKE XNXX* ] ──✧
│ 📝 *Title:* ${text}
╰───────────────✧

👤 *Request by:* ${m.pushName}
🤖 *© ERINE-MD* • ${now}`;

        // Mengirim kembali gambar hasil dari API
        await conn.sendMessage(m.chat, { 
            image: { url: apiUrl }, 
            caption: captionMsg 
        }, { quoted: m });

    } catch (e) {
        console.error(e);
        m.reply(`Gagal memproses!\nError: ${e.message}`);
    }
};

handler.command = /^(fakexnxx|fakexnxxx)$/i;
handler.help = ['fakexnxx <teks>'];
handler.tags = ['canvas'];
handler.limit = true;
handler.register = true;

export default handler;