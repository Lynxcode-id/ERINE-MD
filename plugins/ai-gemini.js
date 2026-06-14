/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx
 * ─────────────────────────
 * 📝 Plugin: AI Gemini
 */

import { GeminiClient } from '../scrape/gemini.js';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return m.reply(`⚠️ Mau nanya apa cuy?\n\n*Contoh:*\n${usedPrefix + command} buatin code Node.js sederhana`);

    await m.react('⏳');

    try {
        const gemini = new GeminiClient();
        const res = await gemini.chat(text);

        if (!res || !res.text) throw new Error('Gagal mendapatkan respons dari Gemini.');

        await conn.sendMessage(m.chat, { text: res.text }, { quoted: m });
        await m.react('✅');
    } catch (e) {
        console.error('[GEMINI AI ERROR]', e);
        await m.react('❌');
        m.reply(`⚠️ *Sistem Error:*\n_${e.message}_`);
    }
};

handler.help = ['gemini <teks>'];
handler.tags = ['ai'];
handler.command = /^(gemini|gem)$/i;
handler.limit = true;

export default handler;