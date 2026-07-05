/**
 * ╭───「 𝗙𝗘𝗔𝗧𝗨𝗥𝗘 𝗔𝗨𝗧𝗛𝗢𝗥 」───
 * │ 👤 Developer : INF Team's x Lynx Decode
 * ╰─────────────────────────
 * 📝 Plugin      : Carbon Code Image (Erine-MD)
 */

import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    let code = text || m.quoted?.text || '';

    if (!code) {
        return m.reply(`┌˚₊ ๑│ ᴄ ᴀ ʀ ʙ ᴏ ɴ  ᴄ ᴏ ᴅ ᴇ │๑˚₊ 💻\n┇ \n│ ❌ Masukkan atau reply kode yang mau dibikin gambar!\n│ \n│ *Contoh:*\n│ ${usedPrefix + command} console.log("Hello World");\n┇ \n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`);
    }

    await m.react('⏳');

    try {
        let apiUrl = `https://api.synoxcloud.xyz/tools/carbon-code?text=${encodeURIComponent(code)}`;
        let res = await fetch(apiUrl);
        
        if (!res.ok) {
            throw new Error(`HTTP Error: ${res.status} - Gagal mengambil gambar dari server API.`);
        }

        let imageBuffer = await res.buffer();

        let cap = `┌˚₊ ๑│ ᴄ ᴀ ʀ ʙ ᴏ ɴ  ᴄ ᴏ ᴅ ᴇ │๑˚₊ 💻\n┇ \n│ ✨ *Status:* Success\n┇ \n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`;

        await conn.sendMessage(m.chat, { 
            image: imageBuffer, 
            caption: cap 
        }, { quoted: m });

        await m.react('✅');

    } catch (e) {
        console.error('[CARBON CODE ERROR]', e);
        await m.react('❌');
        m.reply(`┌˚₊ ๑│ s ʏ s ᴛ ᴇ ᴍ  ᴇ ʀ ʀ ᴏ ʀ │๑˚₊ ❌\n┇ Gagal membuat gambar carbon:\n┇ ${e.message || "Internal Server Error"}\n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`);
    }
};

handler.help = ['carbon <code>', 'codeimg <code>'];
handler.tags = ['tools', 'maker'];
handler.command = /^(carbon|codeimg|carboncode)$/i;
handler.limit = true;

export default handler;*