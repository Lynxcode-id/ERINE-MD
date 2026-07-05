// ▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰
// ▻ FITUR   : FAKE XNXX CANVAS
// ▻ AUTHOR  : LYNX DECODE { FEMULA + CARBEAT }
// ▻ CHANNEL : https://whatsapp.com/channel/0029Vb1CcDWDp2Q5YT4FZn1k
// jangan maen hapus wm, hargai creator biji. 
// ▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰

import uploadImage from '../lib/uploadImage.js';

const handler = async (m, { conn, text, usedPrefix, command }) => {
    const q = m.quoted ? m.quoted : m;
    const mime = (q.msg || q).mimetype || '';
    if (!text) return m.reply(`Teksnya mana?\nContoh: *${usedPrefix + command} Lari ada wibu*`);
    if (!mime.includes('image')) return m.reply(`Balas gambar yang ingin diedit dengan caption *${usedPrefix + command} ${text}*`);

    m.reply('Memproses gambar, tunggu sebentar...');

    try {
        const media = await q.download();
        const imageUrl = await uploadImage(media);
        if (!imageUrl || imageUrl.includes('undefined')) {
            throw new Error('Link gambar tidak valid dari uploader. Semua server mungkin sedang down.');
        }
        
        const apiUrl = `https://api.siputzx.my.id/api/canvas/xnxx?title=${encodeURIComponent(text)}&image=${encodeURIComponent(imageUrl)}`;

        const now = new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });

        const captionMsg = `╭── [ *FAKE XNXX* ] ──✧
│ 📝 *Title:* ${text}
╰───────────────✧

👤 *Request by:* ${m.pushName}
🤖 *© ERINE-AI* • ${now}`;

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