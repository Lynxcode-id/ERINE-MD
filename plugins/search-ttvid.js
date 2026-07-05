/**
 * ╭───「 𝗙𝗘𝗔𝗧𝗨𝗥𝗘 𝗔𝗨𝗧𝗛𝗢𝗥 」───
 * │ 👤 Developer : Lynx Decode
 * ╰─────────────────────────
 * 📝 Plugin      : TikTok Search (Erine-MD)
 */

import tikwmSearch from '../scrape/tikwms.js';

function formatNumber(num) {
  return num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        return m.reply(`┌˚₊ ๑│ ᴛ ᴛ  s ᴇ ᴀ ʀ ᴄ ʜ │๑˚₊ 🔍\n┇ \n│ ❌ *Format Salah!*\n│ *Ketik:* ${usedPrefix + command} <query>\n│ \n│ *Contoh:*\n│ ${usedPrefix + command} lamborghini\n┇ \n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`);
    }

    await m.react('⏳');

    try {
        let data = await tikwmSearch({ keywords: text, count: 12, cursor: 0, hd: 1 });
        
        if (!data.Status || data.Result.length === 0) {
             throw new Error("Video tidak ditemukan untuk kata kunci tersebut.");
        }

        // Mengambil hasil pertama dari pencarian
        let video = data.Result[0];

        let caption = `┌˚₊ ๑│ ᴛ ᴛ  s ᴇ ᴀ ʀ ᴄ ʜ │๑˚₊ 🎬\n` +
                      `┇ \n` +
                      `│ 📝 *Judul:* ${video.Title || '-'}\n` +
                      `│ 👤 *Author:* ${video.Author || '-'}\n` +
                      `│ ⏱️ *Durasi:* ${video.Duration} Detik\n` +
                      `┇ \n` +
                      `│ 📊 *STATISTIK:*\n` +
                      `│ 👁️ *Play:* ${formatNumber(video.Stats.Play)}\n` +
                      `│ ❤️ *Like:* ${formatNumber(video.Stats.Like)}\n` +
                      `│ 💬 *Comment:* ${formatNumber(video.Stats.Comment)}\n` +
                      `│ 🔄 *Share:* ${formatNumber(video.Stats.Share)}\n` +
                      `└˚₊ ๑ ────────────── ๑˚₊\n` +
                      `> © ERINE-AI X LYNX DECODE`;

        await conn.sendMessage(m.chat, { 
            video: { url: video.Play }, 
            caption: caption 
        }, { quoted: m });

        await m.react('✅');
    } catch (e) {
        console.error('[TT SEARCH ERROR]', e);
        await m.react('❌');
        m.reply(`┌˚₊ ๑│ s ʏ s ᴛ ᴇ ᴍ  ᴇ ʀ ʀ ᴏ ʀ │๑˚₊ ❌\n┇ \n│ Gagal melakukan pencarian:\n│ ${e.message}\n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`);
    }
};

handler.help = ['ttsearchvid', 'tiktoksearch'];
handler.tags = ['search', 'downloader'];
handler.command = /^(ttsearchvid|tiktoksearch|vtsearchvid)$/i;
handler.limit = true;

export default handler;