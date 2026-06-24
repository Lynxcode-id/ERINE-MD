/**
 * ╭───「 𝗙𝗘𝗔𝗧𝗨𝗥𝗘 𝗔𝗨𝗧𝗛𝗢𝗥 」───
 * │ 👤 Developer : INF Team's x Lynx Decode
 * ╰─────────────────────────
 * 📝 Plugin      : Canvas Sudah Saatnya (Erine-MD)
 */

import fetch from 'node-fetch';

const handler = async (m, { conn, text, usedPrefix, command }) => {
    const input = text || m.quoted?.text || '';

    if (!input) {
        return m.reply(`┌˚₊ ๑│ S ᴜ ᴅ ᴀ ʜ  S ᴀ ᴀ ᴛ ɴ ʏ ᴀ │๑˚₊ 📝\n┇ \n│ ❌ Masukkan teks untuk quotes-nya!\n│ \n│ *Contoh:*\n│ ${usedPrefix + command} sudah saatnya aku berubah\n┇ \n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`);
    }

    await m.react('⏳');

    try {
        const apiUrl = `https://api.synoxcloud.biz.id/canvas/sudahsaatnya?text=${encodeURIComponent(input)}`;
        const res = await fetch(apiUrl);

        if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);

        const imageBuffer = await res.buffer();
        const caption = `┌˚₊ ๑│ S ᴜ ᴅ ᴀ ʜ  S ᴀ ᴀ ᴛ ɴ ʏ ᴀ │๑˚₊ 📝\n┇ \n│ ✨ *Status:* Success\n┇ \n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`;

        await conn.sendMessage(m.chat, { 
            image: imageBuffer, 
            caption 
        }, { quoted: m });

        await m.react('✅');

    } catch (error) {
        console.error('[SUDAH SAATNYA ERROR]', error);
        await m.react('❌');
        m.reply(`┌˚₊ ๑│ s ʏ s ᴛ ᴇ ᴍ  ᴇ ʀ ʀ ᴏ ʀ │๑˚₊ ❌\n┇ Gagal membuat gambar:\n┇ ${error.message || "Internal Server Error"}\n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`);
    }
};

handler.help = ['sudahsaatnya <text>'];
handler.tags = ['maker'];
handler.command = /^(sudahsaatnya)$/i;
handler.limit = true;

export default handler;