/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx Decode
 * 📞 WhatsApp  : +62 882-5804-1396
 * 📢 Channel   : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * ⚠️ Note      : Keep credit to respect the creator!
 * ─────────────────────────
 * 📝 Plugin : Random Anime Quotes
 */

import animequotes from '../scrape/animequotes.js';

let handler = async (m, { conn }) => {
    await m.react('⏳');

    try {
        const result = await animequotes.getRandomQuote();

        let caption = `┌˚₊ ๑│ ᴀ ɴ ɪ ᴍ ᴇ  ǫ ᴜ ᴏ ᴛ ᴇ s │๑˚₊ 🌸\n`;
        caption += `┇ 🎌 *Anime:* ${result.anime}\n`;
        caption += `┇ 👤 *Character:* ${result.character}\n`;
        caption += `├˚₊ ๑ ────────────── ๑˚₊\n`;
        caption += `\n💬 "${result.quote}"\n\n`;
        caption += `> © ERINE-MD`;

        await conn.sendMessage(m.chat, {
            text: caption.trim()
        }, { quoted: m });

        await m.react('✅');
    } catch (error) {
        console.error('[ANIME QUOTES ERROR]', error);
        await m.react('❌');
        m.reply(`❌ Gagal mengambil anime quotes.\n> *Detail:* ${error.message || error}`);
    }
};

handler.help = ['animequote'];
handler.tags = ['fun'];
handler.command = /^(animequote|quotesanime|kataanime)$/i;
handler.limit = true;

export default handler;