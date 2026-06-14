import { generatePrompt } from '../scrape/generateprompt.js';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return m.reply(`⚠️ Masukkan ide prompt yang mau dibuat!\n\n*Contoh:*\n${usedPrefix + command} king biologi`);

    await m.react('⏳');

    try {
        const res = await generatePrompt(text);
        
        let msg = `*🤖 Generate Prompt AI*\n\n`;
        msg += `*🇮🇩 Indonesian:*\n${res.indonesian}\n\n`;
        msg += `*🇬🇧 English:*\n${res.english}`;
        
        await conn.sendMessage(m.chat, { text: msg }, { quoted: m });
        await m.react('✅');
    } catch (e) {
        console.error('[GENERATE PROMPT ERROR]', e);
        await m.react('❌');
        m.reply(`⚠️ *Sistem Error:*\n_${e.message}_`);
    }
};

handler.help = ['genprompt <teks>'];
handler.tags = ['ai'];
handler.command = /^(genprompt|generateprompt)$/i;
handler.limit = true;

export default handler;