/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx Decode
 * ─────────────────────────
 * 📝 Plugin : NPM Package Search
 */

import npmSearch from '../scrape/npmSearch.js';

let handler = async (m, { text, usedPrefix, command }) => {
    if (!text) {
        return m.reply(`┌˚₊ ๑│ ɴ ᴘ ᴍ  s ᴇ ᴀ ʀ ᴄ ʜ │๑˚₊ 📦\n┇ \n│ Masukkan nama package yang ingin dicari!\n│ *Contoh:* ${usedPrefix + command} express\n┇ \n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI X LYNX DECODE`);
    }

    await m.react('⏳');

    try {
        const data = await npmSearch.execute(text, 15);

        if (data.status !== "success" || !data.result || data.result.length === 0) {
            throw new Error("Package tidak ditemukan atau API sedang bermasalah.");
        }

        let txt = `┌˚₊ ๑│ ɴ ᴘ ᴍ  ʀ ᴇ s ᴜ ʟ ᴛ s │๑˚₊ 📊\n┇ \n`;
        txt += `│ 🔍 *Pencarian:* ${data.input}\n`;
        txt += `│ 📦 *Total Ditemukan:* ${data.total}\n┇ \n`;

        data.result.forEach((pkg, index) => {
            txt += `│ 🔹 *${index + 1}. ${pkg.name}* (v${pkg.version})\n`;
            txt += `│    📌 *Deskripsi:* ${pkg.description || '-'}\n`;
            txt += `│    👤 *Author:* ${pkg.author || '-'}\n`;
            txt += `│    📄 *Lisensi:* ${pkg.license || '-'}\n`;
            if (pkg.links?.npm) txt += `│    🌐 *Link:* ${pkg.links.npm}\n`;
            txt += `│\n`;
        });

        txt += `└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI X LYNX DECODE`;
        
        await m.reply(txt);
        await m.react('✅');

    } catch (e) {
        console.error('[NPM PLUGIN ERROR]', e);
        await m.react('❌');
        m.reply(`┌˚₊ ๑│ s ʏ s ᴛ ᴇ ᴍ  ᴇ ʀ ʀ ᴏ ʀ │๑˚₊ ❌\n┇ Gagal mencari package:\n┇ ${e.message || "Internal Server Error"}\n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI X LYNX DECODE`);
    }
};

handler.help = ['npm <package>'];
handler.tags = ['tools'];
handler.command = /^(npmsearch|npm)$/i;

export default handler;