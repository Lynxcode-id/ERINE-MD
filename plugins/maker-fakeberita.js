/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx Decode
 * 📢 Channel   : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * ─────────────────────────
 * 📝 Plugin : Fake Berita Maker
 */

import uploadImage from '../lib/uploadImage.js';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || '';

    // Validasi input gambar
    if (!mime.startsWith('image/')) {
        return m.reply(`┌˚₊ ๑│ ꜰ ᴀ ᴋ ᴇ  ʙ ᴇ ʀ ɪ ᴛ ᴀ │๑˚₊ 📰\n┇ \n│ ❌ Kirim atau reply gambar!\n│ \n│ *Cara Pakai:*\n│ Kirim gambar dengan caption: \n│ ${usedPrefix + command} teks berita parodinya\n┇ \n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI X LYNX DECODE`);
    }

    // Validasi teks
    if (!text) {
        return m.reply(`❌ Teks beritanya mana cuy?\n\n*Contoh:*\n${usedPrefix + command} Kucing oren ditemukan sedang menguasai bumi`);
    }

    await m.react('⏳');

    try {
        // Download gambar dari WA dan upload ke server sementara (telegra.ph / pomf)
        let media = await q.download();
        let linkImg = await uploadImage(media); 

        // Encode teks dan URL biar aman saat ditembak ke API
        let encodedText = encodeURIComponent(text);
        let encodedUrl = encodeURIComponent(linkImg);

        let apiUrl = `https://api-nanzz.my.id/docs/api/maker/berita.php?text=${encodedText}&url=${encodedUrl}`;

        let caption = `┌˚₊ ๑│ ꜰ ᴀ ᴋ ᴇ  ʙ ᴇ ʀ ɪ ᴛ ᴀ │๑˚₊ 📰\n┇ \n│ 🗞️ *Breaking News!* \n│ 👤 *Req by:* @${m.sender.split('@')[0]}\n┇ \n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI X LYNX DECODE`;

        // Kirim hasil gambar
        await conn.sendMessage(m.chat, { 
            image: { url: apiUrl }, 
            caption: caption.trim(),
            mentions: [m.sender]
        }, { quoted: m });

        await m.react('✅');

    } catch (e) {
        console.error('[FAKE BERITA ERROR]', e);
        await m.react('❌');
        m.reply(`┌˚₊ ๑│ s ʏ s ᴛ ᴇ ᴍ  ᴇ ʀ ʀ ᴏ ʀ │๑˚₊ ❌\n┇ Gagal memproses gambar:\n┇ Pastikan bot memiliki fitur uploadImage atau server API sedang down.\n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI X LYNX DECODE`);
    }
}

handler.help = ['fakeberita <teks>'];
handler.tags = ['maker'];
handler.command = /^(fakeberita)$/i;
handler.limit = true;

export default handler;