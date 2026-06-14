/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx Decode
 * 📞 WhatsApp  : +62 882-5804-1396
 * 📢 Channel   : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * ⚠️ Note      : Keep credit to respect the creator!
 * ─────────────────────────
 * 📝 Plugin : File Kiwi Uploader
 */

import kiwi from '../scrape/kiwi.js';
import fs from 'fs';
import path from 'path';
import { tmpdir } from 'os';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || '';
    
    if (!mime) {
        return m.reply(`❌ Kirim atau balas file/media dengan caption *${usedPrefix + command}* [judul opsional]`);
    }

    await m.react('⏳');

    let ext = mime.split('/')[1]?.split(';')[0] || 'bin';
    if (ext === 'jpeg') ext = 'jpg';
    
    let tmpFile = path.join(tmpdir(), `${Date.now()}_erine.${ext}`);
    
    try {
        let media = await q.download();
        await fs.promises.writeFile(tmpFile, media);

        let title = text ? text : "Erine-MD Upload";
        const result = await kiwi.upload(tmpFile, title);

        let caption = `┌˚₊ ๑│ ᴋ ɪ ᴡ ɪ  ᴜ ᴘ ʟ ᴏ ᴀ ᴅ ᴇ ʀ │๑˚₊ 📂\n`;
        caption += `┇ 📝 *Title:* ${title}\n`;
        caption += `┇ 🔗 *Link:* ${result.url}\n`;
        caption += `└˚₊ ๑ ────────────── ๑˚₊\n\n`;
        caption += `> © ERINE-MD`;

        await conn.sendMessage(m.chat, {
            text: caption.trim()
        }, { quoted: m });

        await m.react('✅');
    } catch (error) {
        console.error('[KIWI UPLOAD ERROR]', error);
        await m.react('❌');
        m.reply(`❌ Gagal mengunggah file ke File.kiwi.\n> *Detail:* ${error.message || error}`);
    } finally {
        if (fs.existsSync(tmpFile)) {
            await fs.promises.unlink(tmpFile).catch(() => {});
        }
    }
};

handler.help = ['kiwi <judul>'];
handler.tags = ['tools'];
handler.command = /^(kiwi|filekiwi|uploadkiwi)$/i;
handler.limit = true;

export default handler;