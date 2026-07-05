/** * ───「 PLUGIN SAMEHADAKU 」───✧
 * 👤 Author  : LYNX DECODE { FEMULA + CARBEAT }
 * 🚀 Channel : https://whatsapp.com/channel/0029Vb1CcDWDp2Q5YT4FZn1k
 * 📝 Note    : Simpan di folder plugins dengan nama: samehadaku.js
 * ────────────────────────✧
 */

import samehadakuSearch from '../scrape/samehadaku.js';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return m.reply(`Cari anime apa cuy?\n\nContoh:\n> *${usedPrefix + command} one piece*`);

    await m.react('⏳');

    try {
        let res = await samehadakuSearch(text);
        
        if (!res.status) throw new Error(res.message);
        if (!res.results || res.results.length === 0) throw new Error('Anime tidak ditemukan cuy.');

        let caption = `╭━━[ *SAMEHADAKU SEARCH* ]\n`;
        caption += `┃ ❖ *Query:* ${text}\n`;
        caption += `┃ ❖ *Total:* ${res.results.length}\n`;
        caption += `╰━━━━━━━━━━━━━━━\n\n`;

        res.results.slice(0, 10).forEach((v, i) => {
            caption += `*${i + 1}. ${v.title}*\n`;
            if (v.type !== '-') caption += `> ❖ *Type:* ${v.type}\n`;
            if (v.genre !== '-') caption += `> ❖ *Genre:* ${v.genre}\n`;
            if (v.score !== '-') caption += `> ❖ *Score:* ${v.score}\n`;
            caption += `> ❖ *Link:* ${v.url}\n\n`;
        });

        caption += `> _Generated via Jemima-MD_`;

        let thumb = res.results[0].image !== '-' ? res.results[0].image : 'https://i.ibb.co/L50H0w4/no-image.jpg';

        await conn.sendMessage(m.chat, { 
            image: { url: thumb }, 
            caption: caption.trim() 
        }, { quoted: m });

        await m.react('✅');
    } catch (e) {
        await m.react('❌');
        m.reply(`❖ *ꜱʏꜱᴛᴇᴍ ᴇʀʀᴏʀ*\n\n> ${e.message}`);
    }
};

handler.help = ['samehadaku <judul>'];
handler.tags = ['anime'];
handler.command = /^(samehadaku|smh)$/i;
handler.limit = true;

export default handler;