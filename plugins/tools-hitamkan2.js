/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx Decode
 * ─────────────────────────
 * 📝 Plugin : To Hitam Maker (Erine-MD)
 */

import axios from 'axios';
import FormData from 'form-data';

let handler = async (m, { conn, usedPrefix, command }) => {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || '';

    // Filter biar cuma nerima gambar
    if (!/image/.test(mime)) {
        return m.reply(`┌˚₊ ๑│ ɪ ᴍ ᴀ ɢ ᴇ  ᴍ ᴀ ᴋ ᴇ ʀ │๑˚₊ 🎨\n┇ \n│ ❌ Kirim atau reply foto dengan caption *${usedPrefix + command}*\n┇ \n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`);
    }

    await m.react('⏳');
    m.reply('⏳ *Processing...*\nSedang memproses gambar, tunggu sebentar.');

    try {
        // Download gambar langsung ke Buffer (Gak usah menuhin disk pake fs)
        let media = await q.download();
        
        // Upload gambar ke uguu.se
        const form = new FormData();
        form.append('files[]', media, 'image.jpg');

        const upload = await axios.post('https://uguu.se/upload.php', form, {
            headers: form.getHeaders()
        });

        const imageUrl = upload.data.files[0].url;
        
        // Tembak API tujuannya
        const api = `https://api.mifinfinity.my.id/api/maker/tohitam?url=${encodeURIComponent(imageUrl)}`;

        // Merakit Caption khas Erine-MD
        let cap = `┌˚₊ ๑│ ɪ ᴍ ᴀ ɢ ᴇ  ᴍ ᴀ ᴋ ᴇ ʀ │๑˚₊ 🎨\n┇ \n`;
        cap += `│ ✨ *Status:* Success\n┇ \n`;
        cap += `└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`;

        // Kirim hasil
        await conn.sendMessage(m.chat, { 
            image: { url: api }, 
            caption: cap 
        }, { quoted: m });

        await m.react('✅');

    } catch (e) {
        console.error('[TOHITAM ERROR]', e);
        await m.react('❌');
        m.reply(`┌˚₊ ๑│ s ʏ s ᴛ ᴇ ᴍ  ᴇ ʀ ʀ ᴏ ʀ │๑˚₊ ❌\n┇ Gagal memproses gambar:\n┇ ${e.message || "Internal Server Error"}\n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`);
    }
};

handler.help = ['tohitam', 'hitamkulit'];
handler.tags = ['maker'];
handler.command = /^(tohitam2|hytamkan)$/i;
handler.limit = true;

export default handler;