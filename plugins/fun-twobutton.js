/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx Decode
 * 📞 WhatsApp  : +62 882-5804-1396
 * 📢 Channel   : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * ⚠️ Note      : Keep credit to respect the creator!
 * ─────────────────────────
 */

import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    let [text1, text2] = text.split('|');
    if (!text1 || !text2) return m.reply(`Format salah cuy!\n\n💡 *Contoh:* ${usedPrefix + command} text1 | text2`);

    await m.react('⏳');

    try {
        let url = `https://api.cuki.biz.id/api/canvas/meme/twobuttons?apikey=cuki-x&text1=${encodeURIComponent(text1.trim())}&text2=${encodeURIComponent(text2.trim())}`;
        let res = await fetch(url);
        let buffer = Buffer.from(await res.arrayBuffer());

        await conn.sendMessage(m.chat, {
            image: buffer,
            caption: `✅ *Meme Two Buttons Generated*\n\n_©ERINE PROJECT_`
        }, { quoted: m });

        await m.react('✅');
    } catch (e) {
        console.error(e);
        await m.react('❌');
        m.reply('❌ Gagal membuat meme, server API mungkin sedang error.');
    }
}

handler.help = ['twobuttons <text1> | <text2>'];
handler.tags = ['tools'];
handler.command = /^(twobuttons)$/i;
handler.limit = true;

export default handler;