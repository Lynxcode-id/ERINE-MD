/** * ───「 PLUGIN KOMIKU
 * ────────────────────────✧
 */

import { komikuHomepage, komikuDetail, komikuChapter } from '../scrape/komiku.js';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    let [mode, ...queryArr] = text.trim().split('|');
    mode = mode?.trim().toLowerCase();
    let query = queryArr.join('|').trim();

    if (!mode || !['home', 'detail', 'read'].includes(mode)) {
        let help = `╭━━[ *KOMIKU SCRAPER* ]\n`;
        help += `┃ ❖ *${usedPrefix + command} home*\n`;
        help += `┃ ❖ *${usedPrefix + command} detail | <url_komik>*\n`;
        help += `┃ ❖ *${usedPrefix + command} read | <url_chapter>*\n`;
        help += `╰━━━━━━━━━━━━━━━`;
        return m.reply(help);
    }

    await m.react('⏳');

    try {
        if (mode === 'home') {
            let res = await komikuHomepage();
            let caption = `╭━━[ *KOMIKU POPULER* ]\n`;
            res.data.popular.forEach((v, i) => {
                caption += `┃ ${i + 1}. *${v.title}*\n`;
                caption += `┃ ❖ Type: ${v.type}\n`;
                caption += `┃ ❖ Chapter: ${v.chapter}\n`;
                caption += `┃ ❖ Link: ${v.url}\n┃\n`;
            });
            caption += `╰━━━━━━━━━━━━━━━\n\n`;
            caption += `> _Gunakan ${usedPrefix + command} detail | <link>_`;
            
            await conn.sendMessage(m.chat, { text: caption.trim() }, { quoted: m });
        } 
        
        else if (mode === 'detail') {
            if (!query) return m.reply(`Link komiknya mana cuy?\nContoh: *${usedPrefix + command} detail | https://komiku.org/...*`);
            
            let res = await komikuDetail(query);
            let d = res.data;
            
            let caption = `╭━━[ *KOMIKU DETAIL* ]\n`;
            caption += `┃ ❖ *Judul:* ${d.title}\n`;
            if (d.info.Tipe) caption += `┃ ❖ *Tipe:* ${d.info.Tipe}\n`;
            if (d.info.Status) caption += `┃ ❖ *Status:* ${d.info.Status}\n`;
            caption += `╰━━━━━━━━━━━━━━━\n\n`;
            caption += `*Sinopsis:*\n_${d.sinopsis}_\n\n`;
            caption += `*Daftar Chapter Teratas:*\n`;
            
            d.chapters.slice(0, 5).forEach((c, i) => {
                caption += `> ${i + 1}. ${c.chapter} (${c.date})\n> ${c.url}\n\n`;
            });
            
            caption += `> _Gunakan ${usedPrefix + command} read | <link_chapter>_`;

            await conn.sendMessage(m.chat, { image: { url: d.image }, caption: caption.trim() }, { quoted: m });
        }

        else if (mode === 'read') {
            if (!query) return m.reply(`Link chapternya mana cuy?\nContoh: *${usedPrefix + command} read | https://komiku.org/...*`);
            
            let res = await komikuChapter(query);
            let d = res.data;

            let caption = `╭━━[ *KOMIKU READER* ]\n`;
            caption += `┃ ❖ *Title:* ${d.title}\n`;
            caption += `┃ ❖ *Total Images:* ${d.images.length} pages\n`;
            if (d.next_chapter) caption += `┃ ❖ *Next:* ${d.next_chapter}\n`;
            caption += `╰━━━━━━━━━━━━━━━\n\n`;
            caption += `> _Note: Kami hanya menampilkan halaman pertama. Silakan baca selebihnya langsung melalui link web untuk menghindari spam chat._\n\n🔗 ${query}`;

            let img = d.images[0] ? { url: d.images[0] } : { url: 'https://i.ibb.co/L50H0w4/no-image.jpg' };
            await conn.sendMessage(m.chat, { image: img, caption: caption.trim() }, { quoted: m });
        }

        await m.react('✅');
    } catch (e) {
        await m.react('❌');
        m.reply(`❖ *ꜱʏꜱᴛᴇᴍ ᴇʀʀᴏʀ*\n\n> ${e.message}`);
    }
};

handler.help = ['komiku'];
handler.tags = ['anime'];
handler.command = /^(komiku)$/i;
handler.limit = true;

export default handler;