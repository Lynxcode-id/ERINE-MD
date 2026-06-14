/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx Decode
 * 📢 Channel   : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * ─────────────────────────
 * 📝 Plugin : Hoax Generator (Fake News Maker)
 */

import uploadImage from '../lib/uploadImage.js';

let handler = async (m, { conn, usedPrefix, command }) => {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || '';
    if (!mime.startsWith('image/')) {
        return m.reply(`┌˚₊ ๑│ ʜ ᴏ ᴀ x  ᴍ ᴀ ᴋ ᴇ ʀ │๑˚₊ ⚠️\n┇ \n│ ❌ Reply atau kirim gambar untuk dijadikan bahan hoax!\n│ \n│ *Cara Pakai:*\n│ ${usedPrefix + command} (sambil reply gambar)\n┇ \n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`);
    }

    await m.react('⏳');

    try {
        let media = await q.download();
        let linkImg = await uploadImage(media); 
        let apiUrl = `https://api-nanzz.my.id/docs/api/maker/hoax.php?url=${encodeURIComponent(linkImg)}`;

        let caption = `┌˚₊ ๑│ ʜ ᴏ ᴀ x  ᴍ ᴀ ᴋ ᴇ ʀ │๑˚₊ 📰\n┇ \n│ ⚠️ *Berita hoax berhasil dibuat!*\n│ 👤 *Req by:* @${m.sender.split('@')[0]}\n┇ \n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`;

        await conn.sendMessage(m.chat, { 
            image: { url: apiUrl }, 
            caption: caption.trim(),
            mentions: [m.sender]
        }, { quoted: m });

        await m.react('✅');

    } catch (e) {
        console.error('[HOAX MAKER ERROR]', e);
        await m.react('❌');
        m.reply(`┌˚₊ ๑│ s ʏ s ᴛ ᴇ ᴍ  ᴇ ʀ ʀ ᴏ ʀ │๑˚₊ ❌\n┇ Gagal memproses gambar:\n┇ Server API sedang bermasalah atau gambar terlalu besar.\n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`);
    }
}

handler.help = ['hoax'];
handler.tags = ['maker'];
handler.command = /^(hoax|beritahoax)$/i;
handler.limit = true;

export default handler;