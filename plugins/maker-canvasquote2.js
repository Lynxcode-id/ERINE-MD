/**
 * ╭───「 𝗙𝗘𝗔𝗧𝗨𝗥𝗘 𝗔𝗨𝗧𝗛𝗢𝗥 」───
 * │ 👤 Developer : INF Team's x Lynx Decode
 * ╰─────────────────────────
 * 📝 Plugin      : Canvas Quotes V2 (Erine-MD + UploadImage)
 */

import fetch from 'node-fetch';
import uploadImage from '../lib/uploadImage.js';

const handler = async (m, { conn, text, usedPrefix, command }) => {
    const q = m.quoted ? m.quoted : m;
    const mime = (q.msg || q).mimetype || '';
    
    let [textQuote, author] = text.split('|');
    if (!textQuote) return m.reply(`┌˚₊ ๑│ Q ᴜ ᴏ ᴛ ᴇ s  ᴠ 𝟸 │๑˚₊ 📝\n┇ \n│ ❌ Format salah!\n│ \n│ *Contoh:*\n│ ${usedPrefix + command} Jangan menyerah | Saurus\n│ (Reply foto untuk PP)\n┇ \n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`);

    author = author ? author.trim() : 'Anonymous';
    let pp = 'https://telegra.ph/file/24fa902ead26340f3df2c.png';

    await m.react('⏳');

    try {
        if (/image\/(jpe?g|png)/.test(mime)) {
            let media = await q.download();
            pp = await uploadImage(media);
        }

        const apiUrl = `https://api.synoxcloud.xyz/canvas/quotes-v2?pp=${encodeURIComponent(pp)}&author=${encodeURIComponent(author)}&text=${encodeURIComponent(textQuote.trim())}`;
        const res = await fetch(apiUrl);

        if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);

        const imageBuffer = await res.buffer();
        const caption = `┌˚₊ ๑│ Q ᴜ ᴏ ᴛ ᴇ s  ᴠ 𝟸 │๑˚₊ 📝\n┇ \n│ ✨ *Status:* Success\n┇ \n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`;

        await conn.sendMessage(m.chat, { 
            image: imageBuffer, 
            caption 
        }, { quoted: m });

        await m.react('✅');

    } catch (error) {
        console.error('[QUOTES V2 ERROR]', error);
        await m.react('❌');
        m.reply(`┌˚₊ ๑│ s ʏ s ᴛ ᴇ ᴍ  ᴇ ʀ ʀ ᴏ ʀ │๑˚₊ ❌\n┇ Gagal membuat quotes:\n┇ ${error.message || "Internal Server Error"}\n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`);
    }
};

handler.help = ['quote2 <text> | <author>'];
handler.tags = ['maker'];
handler.command = /^(quote2|quotes2|qc2|quotemaker2)$/i;
handler.limit = true;

export default handler;