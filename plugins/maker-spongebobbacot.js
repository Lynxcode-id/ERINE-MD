/**
 * ╭───「 𝗙𝗘𝗔𝗧𝗨𝗥𝗘 𝗔𝗨𝗧𝗛𝗢𝗥 」───
 * │ 👤 Developer : INF Team's x Lynx Decode
 * ╰─────────────────────────
 * 📝 Plugin      : Spongebob Bacot Meme (Erine-MD)
 */

import fetch from 'node-fetch';

const handler = async (m, { conn, text, usedPrefix, command }) => {
    let [atas, bawah] = text.split('|');

    if (!atas || !bawah) {
        return m.reply(`┌˚₊ ๑│ S ᴘ ᴏ ɴ ɢ ᴇ ʙ ᴏ ʙ  ᴍ ᴇ ᴍ ᴇ │๑˚₊ 🍍\n┇ \n│ ❌ Format salah!\n│ \n│ *Contoh:*\n│ ${usedPrefix + command} bacot jir | emang gw peduli\n┇ \n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`);
    }

    await m.react('⏳');

    try {
        const apiUrl = `https://api.synoxcloud.xyz/canvas/spongebob-bacot-meme?atas=${encodeURIComponent(atas.trim())}&bawah=${encodeURIComponent(bawah.trim())}`;
        const res = await fetch(apiUrl);

        if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);

        const imageBuffer = await res.buffer();
        const caption = `┌˚₊ ๑│ S ᴘ ᴏ ɴ ɢ ᴇ ʙ ᴏ ʙ  ᴍ ᴇ ᴍ ᴇ │๑˚₊ 🍍\n┇ \n│ ✨ *Status:* Success\n┇ \n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`;

        await conn.sendMessage(m.chat, { 
            image: imageBuffer, 
            caption 
        }, { quoted: m });

        await m.react('✅');

    } catch (error) {
        console.error('[SPONGEBOB MEME ERROR]', error);
        await m.react('❌');
        m.reply(`┌˚₊ ๑│ s ʏ s ᴛ ᴇ ᴍ  ᴇ ʀ ʀ ᴏ ʀ │๑˚₊ ❌\n┇ Gagal membuat meme:\n┇ ${error.message || "Internal Server Error"}\n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`);
    }
};

handler.help = ['spongebob <atas> | <bawah>'];
handler.tags = ['maker'];
handler.command = /^(spongebob|bacotspongebob|spongebobmeme)$/i;
handler.limit = true;

export default handler;