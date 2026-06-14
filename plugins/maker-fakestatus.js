/** * ───「 SCRAPER & PLUGIN WA STATUS MAKER 」───✧
 * 👤 Author  : LYNX DECODE { FEMULA + CARBEAT }
 * 🚀 Channel : https://whatsapp.com/channel/0029Vb1CcDWDp2Q5YT4FZn1k
 * 📝 Note    : Ambil boleh aja cr jangan di hapus hargai creator!!
 * ────────────────────────✧
 */

import axios from 'axios';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return m.reply(`Teksnya mana cuy?\n\nFormat: *${usedPrefix + command} teks | nama | waktu*\nContoh:\n> *${usedPrefix + command} entahlah | manx | Kemarin, 11:23*`);

    let [teks, nama, waktu] = text.split('|');
    if (!teks) return m.reply('❌ Teks status tidak boleh kosong!');
    
    let namaUser = nama ? nama.trim() : m.pushName || 'Anonymous';
    let waktuStatus = waktu ? waktu.trim() : 'Baru saja';

    await m.react('⏳');

    try {
        const url = `https://api.azbry.com/api/maker/wastatus?nama=${encodeURIComponent(namaUser)}&waktu=${encodeURIComponent(waktuStatus)}&teks=${encodeURIComponent(teks.trim())}`;
        
        const { data } = await axios.get(url, {
            responseType: 'arraybuffer',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
                'Accept': 'image/jpeg, image/png, image/*, */*'
            }
        });

        let caption = `╭━━[ *WA STATUS MAKER* ]\n`;
        caption += `┃ ❖ *Name:* ${namaUser}\n`;
        caption += `┃ ❖ *Time:* ${waktuStatus}\n`;
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

handler.help = ['wastatus <teks | nama | waktu>'];
handler.tags = ['maker'];
handler.command = /^(wastatus|swmaker)$/i;
handler.limit = true;

export default handler;