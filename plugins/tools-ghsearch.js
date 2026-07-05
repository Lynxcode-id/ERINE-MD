/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Original : Hilman
 * 👤 Adapted  : Erine-MD
 * ─────────────────────────
 * 📝 Plugin : GitHub Search Repo
 */

import fetch from 'node-fetch';

let handler = async (m, { text, usedPrefix, command }) => {
    if (!text) {
        return m.reply(`┌˚₊ ๑│ ɢ ɪ ᴛ ʜ ᴜ ʙ  ꜱ ᴇ ᴀ ʀ ᴄ ʜ │๑˚₊ 🔍\n┇ \n│ ❌ Masukkan nama repository yang mau dicari!\n│ \n│ *Contoh:*\n│ ${usedPrefix + command} baileys\n┇ \n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`);
    }

    await m.react('⏳');

    try {
        let res = await fetch(`https://api.github.com/search/repositories?q=${encodeURIComponent(text)}`);
        if (!res.ok) throw new Error('API request failed');
        let json = await res.json();

        if (!json.items || json.items.length === 0) {
            await m.react('❌');
            return m.reply(`┌˚₊ ๑│ ɢ ɪ ᴛ ʜ ᴜ ʙ  ꜱ ᴇ ᴀ ʀ ᴄ ʜ │๑˚₊ 🔍\n┇ \n│ ❌ Repository tidak ditemukan.\n┇ \n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`);
        }

        let txt = `┌˚₊ ๑│ ɢ ɪ ᴛ ʜ ᴜ ʙ  ꜱ ᴇ ᴀ ʀ ᴄ ʜ │๑˚₊ 🔍\n┇ \n`;
        
        let hasil = json.items.slice(0, 5);
        hasil.forEach((v, i) => {
            txt += `│ 📦 *Repo:* ${v.full_name}\n`;
            txt += `│ ⭐ *Stars:* ${v.stargazers_count}\n`;
            txt += `│ 🔗 *Link:* ${v.html_url}\n`;
            if (i !== hasil.length - 1) txt += `│ ───────────────\n`;
        });
        
        txt += `┇ \n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`;

        await m.reply(txt);
        await m.react('✅');

    } catch (e) {
        console.error('[GH SEARCH ERROR]', e);
        await m.react('❌');
        m.reply(`┌˚₊ ๑│ s ʏ s ᴛ ᴇ ᴍ  ᴇ ʀ ʀ ᴏ ʀ │๑˚₊ ❌\n┇ Gagal mencari repository:\n┇ ${e.message || "Internal Server Error"}\n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`);
    }
}

handler.help = ['ghsearch'];
handler.tags = ['tools'];
handler.command = /^ghsearch$/i;
handler.limit = true;

export default handler;