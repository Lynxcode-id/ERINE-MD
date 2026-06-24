/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : INF Team's x Lynx Decode
 * ─────────────────────────
 * 📝 Plugin : Lyrics Searcher (Erine-MD)
 */

import axios from 'axios';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        return m.reply(`┌˚₊ ๑│ ʟ ʏ ʀ ɪ ᴄ ꜱ  s ʏ s ᴛ ᴇ ᴍ │๑˚₊ 🎵\n┇ \n│ ❌ Masukkan judul lagu yang mau dicari cuy!\n│ \n│ *Contoh:*\n│ ${usedPrefix + command} multo\n┇ \n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`);
    }

    await m.react('⏳');
    m.reply('⏳ *Processing...*\nMenyambung ke database lirik, tunggu sebentar.');

    try {
        const { data } = await axios.get(`https://api.lexcode.biz.id/api/tools/lyrics?title=${encodeURIComponent(text)}`);

        if (!data.success || !data.results || data.results.length === 0) {
            throw new Error("Lirik lagu tidak ditemukan di database.");
        }

        // Mengambil hasil pertama yang paling relevan dari array
        const song = data.results[0];

        let cap = `┌˚₊ ๑│ ʟ ʏ ʀ ɪ ᴄ ꜱ  s ʏ s ᴛ ᴇ ᴍ │๑˚₊ 🎵\n┇ \n`;
        cap += `│ 💠 *Title:* ${song.name}\n`;
        cap += `│ 👤 *Artist:* ${song.artist}\n`;
        cap += `│ 💿 *Album:* ${song.album || 'Unknown'}\n`;
        cap += `│ ───────────────\n`;
        cap += `│ 📝 *Lyrics:*\n${song.songs.lyrics}\n┇ \n`;
        cap += `└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`;

        await conn.sendMessage(m.chat, { text: cap }, { quoted: m });
        await m.react('✅');

    } catch (e) {
        console.error('[LYRICS ERROR]', e);
        await m.react('❌');
        m.reply(`┌˚₊ ๑│ s ʏ s ᴛ ᴇ ᴍ  ᴇ ʀ ʀ ᴏ ʀ │๑˚₊ ❌\n┇ Gagal mencari lirik:\n┇ ${e.message || "Internal Server Error"}\n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`);
    }
}

handler.help = ['lirik', 'lyrics'];
handler.tags = ['tools'];
handler.command = /^(lirik|lyrics)$/i;
handler.limit = true;

export default handler;