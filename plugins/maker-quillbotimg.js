/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx Decode
 * 📞 WhatsApp  : +62 882-5804-1396
 * 📢 Channel   : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * ⚠️ Note      : Keep credit to respect the creator!
 * ─────────────────────────
 * 📝 Plugin : AI Image Generator (QuillBot)
 */

import quillbot from '../scrape/quillbotimg.js';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        return m.reply(`❌ Masukkan prompt/deskripsi gambar!\n\n*Contoh:*\n${usedPrefix + command} cyberpunk cat in neon city`);
    }

    await m.react('⏳');

    try {
        const result = await quillbot.generate(text);

        if (!result.success || result.urls.length === 0) {
            throw new Error('Tidak ada gambar yang dihasilkan.');
        }

        let caption = `┌˚₊ ๑│ ᴀ ɪ  ɪ ᴍ ᴀ ɢ ᴇ │๑˚₊ 🎨\n`;
        caption += `┇ 📝 *Prompt:* ${text}\n`;
        caption += `└˚₊ ๑ ────────────── ๑˚₊\n\n`;
        caption += `> © ERINE-MD`;

        for (let url of result.urls) {
            await conn.sendMessage(m.chat, {
                image: { url: url },
                caption: caption
            }, { quoted: m });
        }

        await m.react('✅');
    } catch (error) {
        console.error('[QUILLBOT IMAGE ERROR]', error);
        await m.react('❌');
        m.reply(`❌ Gagal membuat gambar.\n> *Detail:* ${error.message || error}`);
    }
};

handler.help = ['quillbot <prompt>'];
handler.tags = ['maker', 'ai'];
handler.command = /^(quillbotimg|aiimage|txt2imgv2)$/i;
handler.limit = true;

export default handler;