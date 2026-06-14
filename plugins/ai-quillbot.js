/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx Decode
 * ─────────────────────────
 * 📝 Plugin: AI Quillbot Chat (Indonesian Edition)
 */

import { quillbotChat } from '../scrape/quillbot.js';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return m.reply(`⚠️ Mau nanya apa cuy?\n\n*Contoh:*\n${usedPrefix + command} Halo bro gimana kabar mu`);

    await m.react('⏳');

    try {
        // Suntik instruksi rahasia biar dia auto bindo
        let promptBindo = `Kamu adalah AI Assistant. Jawablah pertanyaan atau perintah berikut menggunakan bahasa Indonesia yang natural dan mudah dipahami:\n\n${text}`;

        const res = await quillbotChat(promptBindo);

        if (!res.status || !res.result) throw new Error(res.message || 'Gagal mendapatkan respons dari Quillbot.');

        let msg = `${res.result}`;
        
        await conn.sendMessage(m.chat, { text: msg }, { quoted: m });
        await m.react('✅');
    } catch (e) {
        console.error('[QUILLBOT AI ERROR]', e);
        await m.react('❌');
        m.reply(`⚠️ *Sistem Error:*\n_${e.message}_`);
    }
};

handler.help = ['quillbot <teks>'];
handler.tags = ['ai'];
handler.command = /^(quillbot|qb|qbchat)$/i;
handler.limit = true;

export default handler;