/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx Decode
 * 📞 WhatsApp  : +62 882-5804-1396
 * 📢 Channel   : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * ⚠️ Note      : Keep credit to respect the creator!
 * ─────────────────────────
 * 📝 Plugin : Wikipedia Search
 */

import wikipedia from '../scrape/wikipedia.js';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        return m.reply(`❌ Masukkan kata kunci pencarian!\n\n*Contoh:*\n${usedPrefix + command} JKT48`);
    }

    await m.react('⏳');

    try {
        const res = await wikipedia.detail(text);
        const data = res.Result;

        let caption = `┌˚₊ ๑│ ᴡ ɪ ᴋ ɪ ᴘ ᴇ ᴅ ɪ ᴀ │๑˚₊ 📚\n`;
        caption += `┇ 📝 *Judul:* ${data.Title}\n`;
        if (data.Description) caption += `┇ 💡 *Info:* ${data.Description}\n`;
        caption += `├˚₊ ๑ ────────────── ๑˚₊\n`;
        
        let extract = data.Extract ? (data.Extract.length > 800 ? data.Extract.substring(0, 800) + '...' : data.Extract) : 'Tidak ada ringkasan.';
        
        caption += `\n${extract}\n\n`;
        caption += `🔗 *Baca selengkapnya:* ${data.Url}\n`;
        caption += `> © ERINE-MD`;

        let imageUrl = (data.Images && data.Images.length > 0) ? data.Images[0].Url : null;

        if (imageUrl) {
            await conn.sendMessage(m.chat, {
                image: { url: imageUrl },
                caption: caption
            }, { quoted: m });
        } else {
            await conn.sendMessage(m.chat, {
                text: caption
            }, { quoted: m });
        }

        await m.react('✅');
    } catch (error) {
        console.error('[WIKIPEDIA ERROR]', error);
        await m.react('❌');
        m.reply(`❌ Gagal mencari artikel di Wikipedia.\n> *Detail:* ${error.message || error}`);
    }
};

handler.help = ['wikipedia <query>'];
handler.tags = ['search'];
handler.command = /^(wiki|wikipedia)$/i;
handler.limit = true;

export default handler;