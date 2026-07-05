/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx Decode
 * ─────────────────────────
 * 📝 Plugin : ImgToPrompt AI (Nano Banana Pro)
 */

import imgToPrompt from '../scrape/imgtoprompt.js';

let handler = async (m, { conn, usedPrefix, command }) => {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || '';
    if (!mime.startsWith('image/')) {
        return m.reply(`┌˚₊ ๑│ ɪ ᴍ ɢ ᴛ ᴏ ᴘ ʀ ᴏ ᴍ ᴘ ᴛ │๑˚₊ 🤖\n┇ \n│ ❌ Kirim atau reply gambar cuy!\n│ \n│ *Cara Pakai:*\n│ ${usedPrefix + command} (sambil reply gambar)\n┇ \n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`);
    }

    await m.react('⏳');

    try {
        let media = await q.download();
        let res = await imgToPrompt(media, mime);

        if (!res.sukses || !res.prompt) throw new Error(res.pesan || "Gagal mendapatkan prompt dari AI.");

        let txt = `┌˚₊ ๑│ ᴀ ɪ  ᴘ ʀ ᴏ ᴍ ᴘ ᴛ │๑˚₊ ✨\n┇ \n│ 🍌 *Model:* Nano Banana Pro\n┇ \n│ 📝 *Prompt Result:*\n│ ${res.prompt}\n┇ \n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`;

        await m.reply(txt);
        await m.react('✅');

    } catch (e) {
        console.error('[IMGTOPROMPT ERROR]', e);
        await m.react('❌');
        m.reply(`┌˚₊ ๑│ s ʏ s ᴛ ᴇ ᴍ  ᴇ ʀ ʀ ᴏ ʀ │๑˚₊ ❌\n┇ Gagal memproses gambar:\n┇ ${e.message}\n└˚₊ ๑ ────────────── ๑˚₊`);
    }
}

handler.help = ['imgtoprompt', 'getprompt'];
handler.tags = ['tools', 'ai'];
handler.command = /^(imgtoprompt|getprompt)$/i;
handler.limit = true;

export default handler;