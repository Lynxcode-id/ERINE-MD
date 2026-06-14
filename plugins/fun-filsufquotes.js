/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx Decode
 * 📞 WhatsApp  : +62 882-5804-1396
 * 📢 Channel   : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * ⚠️ Note      : Keep credit to respect the creator!
 * ─────────────────────────
 * 📝 Plugin : Random Filsuf Quotes
 */

import filsufquotes from '../scrape/filsufquotes.js';

let handler = async (m, { conn }) => {
    await m.react('⏳');

    try {
        const result = await filsufquotes.getRandomQuote();

        let caption = `┌˚₊ ๑│ ғ ɪ ʟ s ᴜ ғ  ǫ ᴜ ᴏ ᴛ ᴇ s │๑˚₊ 📜\n`;
        caption += `┇ 👤 *Philosopher:* ${result.philosopher}\n`;
        caption += `├˚₊ ๑ ────────────── ๑˚₊\n`;
        caption += `\n💬 "${result.quote}"\n\n`;
        caption += `> © ERINE-MD`;

        await conn.sendMessage(m.chat, {
            text: caption.trim()
        }, { quoted: m });

        await m.react('✅');
    } catch (error) {
        console.error('[FILSUF QUOTES ERROR]', error);
        await m.react('❌');
        m.reply(`❌ Gagal mengambil quotes filsuf.\n> *Detail:* ${error.message || error}`);
    }
};

handler.help = ['filsufquote'];
handler.tags = ['fun'];
handler.command = /^(filsufquote|quotesfilsuf|katafilsuf|filosofi)$/i;
handler.limit = true;

export default handler;