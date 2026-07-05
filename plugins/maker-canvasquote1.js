/**
 * ╭───「 𝗙𝗘𝗔𝗧𝗨𝗥𝗘 𝗔𝗨𝗧𝗛𝗢𝗥 」───
 * │ 👤 Developer : INF Team's x Lynx Decode
 * ╰─────────────────────────
 * 📝 Plugin      : Canvas Quotes V1 (Erine-MD)
 */

import fetch from 'node-fetch';

const handler = async (m, { conn, text, usedPrefix, command }) => {
    let [quote, author] = text.split('|');

    if (!quote) {
        return m.reply(`┌˚₊ ๑│ Q ᴜ ᴏ ᴛ ᴇ s  ᴠ 𝟷 │๑˚₊ 📝\n┇ \n│ ❌ Format salah!\n│ \n│ *Contoh:*\n│ ${usedPrefix + command} Jangan pernah menyerah | Anonymous\n┇ \n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`);
    }

    author = author ? author.trim() : 'Anonymous';
    await m.react('⏳');

    try {
        const apiUrl = `https://api.synoxcloud.xyz/canvas/quotes-v1?quote=${encodeURIComponent(quote.trim())}&author=${encodeURIComponent(author)}`;
        const res = await fetch(apiUrl);

        if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);

        const imageBuffer = await res.buffer();
        const caption = `┌˚₊ ๑│ Q ᴜ ᴏ ᴛ ᴇ s  ᴠ 𝟷 │๑˚₊ 📝\n┇ \n│ ✨ *Status:* Success\n┇ \n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`;

        await conn.sendMessage(m.chat, { 
            image: imageBuffer, 
            caption 
        }, { quoted: m });

        await m.react('✅');

    } catch (error) {
        console.error('[QUOTES V1 ERROR]', error);
        await m.react('❌');
        m.reply(`┌˚₊ ๑│ s ʏ s ᴛ ᴇ ᴍ  ᴇ ʀ ʀ ᴏ ʀ │๑˚₊ ❌\n┇ Gagal membuat quotes:\n┇ ${error.message || "Internal Server Error"}\n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`);
    }
};

handler.help = ['quote1 <text> | <author>'];
handler.tags = ['maker'];
handler.command = /^(quote1|quotes1|qc1|quotemaker1)$/i;
handler.limit = true;

export default handler;