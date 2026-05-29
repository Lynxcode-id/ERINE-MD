/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx Decode
 * 📞 WhatsApp  : +62 882-5804-1396
 * 📢 Channel   : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * ⚠️ Note      : Keep credit to respect the creator!
 * ─────────────────────────
 */

import imgurUpload from '../scrape/imgur.js';

let handler = async (m, { conn, usedPrefix, command }) => {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || '';
    
    if (!mime) {
        return m.reply(`📸 Balas atau kirim gambar/video dengan caption *${usedPrefix + command}*`);
    }

    await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

    try {
        let mediaBuffer = await q.download?.() || await conn.downloadMediaMessage(q);
        if (!mediaBuffer) throw new Error('Gagal mendownload media.');

        let ext = mime.split('/')[1];
        if (ext === 'jpeg') ext = 'jpg';
        let filename = `upload.${ext}`;

        let result = await imgurUpload(mediaBuffer, filename);

        let teks = `╭───「 📤 *IMGUR UPLOADER* 」───\n`;
        teks += `│ 🔗 *Link:* ${result.link}\n`;
        teks += `│ 🗑️ *Delete:* https://imgur.com/delete/${result.deletehash}\n`;
        teks += `╰─────────────────────────`;

        await m.reply(teks);
        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

    } catch (e) {
        console.error(e);
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
        m.reply(`❌ *Terjadi kesalahan:* ${e.message}`);
    }
}

handler.help = ['imgur'];
handler.tags = ['tools'];
handler.command = /^(imgur)$/i;
handler.limit = true;

export default handler;