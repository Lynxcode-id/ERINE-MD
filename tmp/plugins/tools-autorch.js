/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx Decode
 * ─────────────────────────
 * 📝 Plugin : Asitha Channel Checker
 */

import { listChannels } from '../scrape/asitha.js';

let handler = async (m, { conn }) => {
    await m.react('⏳');

    try {
        const channels = await listChannels();

        if (channels.length === 0) {
            await m.reply(`┌˚₊ ๑│ ᴀ s ɪ ᴛ ʜ ᴀ │๑˚₊ 📢\n┇ \n│ 📭 Belum ada channel aktif di Asitha.\n┇ \n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`);
            return await m.react('✅');
        }

        let txt = `┌˚₊ ๑│ ᴀ s ɪ ᴛ ʜ ᴀ  ᴄ ʜ ᴀ ɴ ɴ ᴇ ʟ │๑˚₊ 📢\n┇ \n│ ✅ *${channels.length} Channel Aktif:*\n┇ \n`;

        channels.forEach((c, i) => {
            txt += `│ *[${i + 1}]* ${c.link}\n`;
            if (c.reactions) txt += `│ 💬 *Reaction:* ${c.reactions}\n`;
            if (c.expires) txt += `│ ⏳ *Expires:* ${c.expires}\n`;
            txt += `┇ \n`;
        });

        txt += `└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`;

        await m.reply(txt);
        await m.react('✅');

    } catch (e) {
        console.error('[ASITHA ERROR]', e);
        await m.react('❌');
        m.reply(`┌˚₊ ๑│ s ʏ s ᴛ ᴇ ᴍ  ᴇ ʀ ʀ ᴏ ʀ │๑˚₊ ❌\n┇ \n│ ⚠️ Gagal mengambil data Asitha.\n│ 💬 Log: ${e.message}\n┇ \n└˚₊ ๑ ────────────── ๑˚₊`);
    }
}

handler.help = ['asitha', 'listchannel'];
handler.tags = ['tools'];
handler.command = /^(asitha|listchannel)$/i;
handler.owner = true;

export default handler;