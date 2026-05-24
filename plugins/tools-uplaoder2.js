/** * ───「 PLUGIN SILENT UPLOADER 」───✧
 * 👤 Author  : LYNX DECODE { FEMULA + CARBEAT }
 * 🚀 Channel : https://whatsapp.com/channel/0029Vb1CcDWDp2Q5YT4FZn1k
 * 📝 Note    : Simpan di folder plugins dengan nama: tourl.js
 * ────────────────────────✧
 */

import silentUpload from '../scrape/tourl.js';

let handler = async (m, { conn, usedPrefix, command }) => {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || '';
    
    if (!mime) {
        return m.reply(`Balas media (gambar/video/dokumen) dengan perintah *${usedPrefix + command}*`);
    }

    await m.react('⏳');

    try {
        let media = await q.download();
        let ext = mime.split('/')[1] || 'bin';
        let filename = `Jemima_${Date.now()}.${ext}`;

        let res = await silentUpload(media, filename);
        
        if (!res.status) throw new Error(res.message || 'Upload gagal server merespon error.');

        let d = res.result;
        
        let caption = `╭━━[ *SILENT UPLOADER* ]\n`;
        caption += `┃ ❖ *URL:* ${d.url}\n`;
        caption += `┃ ❖ *Size:* ${d.sizeHuman}\n`;
        caption += `┃ ❖ *Type:* ${d.mimetype}\n`;
        caption += `┃ ❖ *Expired:* ${d.expiresAt}\n`;
        caption += `╰━━━━━━━━━━━━━━━\n\n`;
        caption += `> _Generated via Jemima-MD_`;

        await conn.sendMessage(m.chat, { text: caption }, { quoted: m });
        await m.react('✅');
    } catch (e) {
        await m.react('❌');
        m.reply(`❖ *ꜱʏꜱᴛᴇᴍ ᴇʀʀᴏʀ*\n\n> Gagal mengupload media:\n> ${e.message}`);
    }
};

handler.help = ['upload2 <reply media>'];
handler.tags = ['tools'];
handler.command = /^(upload2)$/i;
handler.limit = true;

export default handler;