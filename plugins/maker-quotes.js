/** * ───「 SCRAPER & PLUGIN QUOTES MAKER 」───✧
 * 👤 Author  : LYNX DECODE { FEMULA + CARBEAT }
 * 🚀 Channel : https://whatsapp.com/channel/0029Vb1CcDWDp2Q5YT4FZn1k
 * 📝 Note    : Ambil boleh aja cr jangan di hapus hargai creator!!
 * ────────────────────────✧
 */

import axios from 'axios';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return m.reply(`Teksnya mana cuy?\n\nFormat: *${usedPrefix + command} teks | author*\nContoh:\n> *${usedPrefix + command} tetap menyerah dan jangan semangat | Anonymous*`);

    let [quote, author] = text.split('|');
    if (!quote) return m.reply('❌ Teks quotes tidak boleh kosong!');
    
    let namaAuthor = author ? author.trim() : m.pushName || 'Anonymous';

    await m.react('⏳');

    try {
        const url = `https://api.azbry.com/api/maker/quotesmaker?text=${encodeURIComponent(quote.trim())}&author=${encodeURIComponent(namaAuthor)}`;
        
        const { data } = await axios.get(url, {
            responseType: 'arraybuffer',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
                'Accept': 'image/jpeg, image/png, image/*, */*'
            }
        });

        let caption = `╭━━[ *QUOTES MAKER* ]\n`;
        caption += `┃ ❖ *Author:* ${namaAuthor}\n`;
        caption += `╰━━━━━━━━━━━━━━━\n\n`;
        caption += `> _Generated via Jemima-MD_`;

        await conn.sendMessage(m.chat, { 
            image: Buffer.from(data), 
            caption: caption 
        }, { quoted: m });
        
        await m.react('✅');

    } catch (e) {
        await m.react('❌');
        m.reply(`❖ *ꜱʏꜱᴛᴇᴍ ᴇʀʀᴏʀ*\n\n> Gagal memproses gambar:\n> ${e.message}`);
    }
};

handler.help = ['quotesmaker <teks | author>'];
handler.tags = ['maker'];
handler.command = /^(quotesmaker|qm)$/i;
handler.limit = true;

export default handler;