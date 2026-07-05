/**
 * ╭───「 𝗙𝗘𝗔𝗧𝗨𝗥𝗘 𝗔𝗨𝗧𝗛𝗢𝗥 」───
 * │ 👤 Developer : INF Team's x Lynx Decode
 * ╰─────────────────────────
 * 📝 Plugin      : Random Wallpaper Islam (Erine-MD)
 */

import fetch from 'node-fetch';

const handler = async (m, { conn, usedPrefix, command }) => {
    await m.react('⏳');

    try {
        const res = await fetch('https://api.synoxcloud.xyz/random/wallpaperislam');
        const contentType = res.headers.get('content-type');
        let imgUrl;

        if (contentType && contentType.includes('application/json')) {
            const json = await res.json();
            imgUrl = json.url || json.result;
        } else {
            imgUrl = res.url;
        }

        if (!imgUrl) throw new Error("Gagal mendapatkan URL wallpaper.");

        const caption = `┌˚₊ ๑│ W ᴀ ʟ ʟ ᴘ ᴀ ᴘ ᴇ ʀ  I s ʟ ᴀ ᴍ │๑˚₊ 🕌\n┇ \n│ ✨ *Status:* Success\n┇ \n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`;

        await conn.sendMessage(m.chat, { 
            image: { url: imgUrl }, 
            caption 
        }, { quoted: m });

        await m.react('✅');

    } catch (error) {
        console.error('[WALLPAPER ISLAM ERROR]', error);
        await m.react('❌');
        m.reply(`┌˚₊ ๑│ s ʏ s ᴛ ᴇ ᴍ  ᴇ ʀ ʀ ᴏ ʀ │๑˚₊ ❌\n┇ Gagal mengambil wallpaper:\n┇ ${error.message}\n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`);
    }
};

handler.help = ['wallpaperislam'];
handler.tags = ['random'];
handler.command = /^(wallpaperislam|islami)$/i;
handler.limit = true;

export default handler;