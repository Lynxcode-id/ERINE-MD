/**
 * ╭───「 𝗙𝗘𝗔𝗧𝗨𝗥𝗘 𝗔𝗨𝗧𝗛𝗢𝗥 」───
 * │ 👤 Developer : INF Team's x Lynx Decode
 * ╰─────────────────────────
 * 📝 Plugin      : Canvas Quotes V4 (Erine-MD)
 */

import fetch from 'node-fetch';

const handler = async (m, { conn, text, usedPrefix, command }) => {
    const input = text || m.quoted?.text || '';

    if (!input) {
        return m.reply(`┌˚₊ ๑│ Q ᴜ ᴏ ᴛ ᴇ s  ᴍ ᴀ ᴋ ᴇ ʀ │๑˚₊ 📝\n┇ \n│ ❌ Masukkan atau reply teks untuk quotes!\n│ \n│ *Contoh:*\n│ ${usedPrefix + command} Hidup adalah perjuangan.\n┇ \n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`);
    }

    await m.react('⏳');

    try {
        const apiUrl = `https://api.synoxcloud.biz.id/canvas/quotes-v4?text=${encodeURIComponent(input)}`;
        const res = await fetch(apiUrl);

        if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);

        const imageBuffer = await res.buffer();
        const caption = `┌˚₊ ๑│ Q ᴜ ᴏ ᴛ ᴇ s  ᴍ ᴀ ᴋ ᴇ ʀ │๑˚₊ 📝\n┇ \n│ ✨ *Status:* Success\n┇ \n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`;

        await conn.sendMessage(m.chat, { 
            image: imageBuffer, 
            caption 
        }, { quoted: m });

        await m.react('✅');

    } catch (error) {
        console.error('[QUOTES MAKER ERROR]', error);
        await m.react('❌');
        m.reply(`┌˚₊ ๑│ s ʏ s ᴛ ᴇ ᴍ  ᴇ ʀ ʀ ᴏ ʀ │๑˚₊ ❌\n┇ Gagal membuat quotes:\n┇ ${error.message || "Internal Server Error"}\n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`);
    }
};

handler.help = ['quote4 <text>', 'qc4 <text>'];
handler.tags = ['maker'];
handler.command = /^(quote4|quotes4|qc4|quotemaker4)$/i;
handler.limit = true;

export default handler;