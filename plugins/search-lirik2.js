/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : INF Team's x Lynx Decode
 * ─────────────────────────
 * 📝 Plugin : Lyrics Searcher V2 (Erine-MD)
 */

import axios from 'axios';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        return m.reply(`┌˚₊ ๑│ ʟ ʏ ʀ ɪ ᴄ ꜱ  s ʏ s ᴛ ᴇ ᴍ │๑˚₊ 🎵\n┇ \n│ ❌ Masukkan judul lagu yang mau dicari cuy!\n│ \n│ *Contoh:*\n│ ${usedPrefix + command} love story taylor swift\n┇ \n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`);
    }

    await m.react('⏳');
    m.reply('⏳ *Processing...*\nMenyambung ke database lirik, tunggu sebentar.');

    try {
        const { data } = await axios.get(`https://api.cuki.biz.id/api/tools/lirik?apikey=cuki-x&title=${encodeURIComponent(text)}`);

        if (data.statusCode !== 200 || !data.results || !data.results.lyrics) {
            throw new Error("Lirik lagu tidak ditemukan di database.");
        }

        const song = data.results;

        let cap = `┌˚₊ ๑│ ʟ ʏ ʀ ɪ ᴄ ꜱ  s ʏ s ᴛ ᴇ ᴍ │๑˚₊ 🎵\n┇ \n`;
        cap += `│ 💠 *Title:* ${song.title || '-'}\n`;
        cap += `│ 👤 *Artist:* ${song.artist || '-'}\n`;
        if (song.album) cap += `│ 💿 *Album:* ${song.album}\n`;
        if (song.duration) cap += `│ ⏱️ *Duration:* ${song.duration}\n`;
        cap += `│ ───────────────\n`;
        cap += `│ 📝 *Lyrics:*\n${song.lyrics}\n┇ \n`;
        cap += `└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`;

        await conn.sendMessage(m.chat, { text: cap }, { quoted: m });
        await m.react('✅');

    } catch (e) {
        console.error('[LYRICS2 ERROR]', e);
        await m.react('❌');
        m.reply(`┌˚₊ ๑│ s ʏ s ᴛ ᴇ ᴍ  ᴇ ʀ ʀ ᴏ ʀ │๑˚₊ ❌\n┇ Gagal mencari lirik:\n┇ ${e.message || "Internal Server Error"}\n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`);
    }
}

handler.help = ['lirik2'];
handler.tags = ['tools'];
handler.command = /^lirik2$/i;
handler.limit = true;

export default handler;