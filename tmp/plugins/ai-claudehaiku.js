/**
 * ╭───「 𝗙𝗘𝗔𝗧𝗨𝗥𝗘 𝗔𝗨𝗧𝗛𝗢𝗥 」───
 * │ 👤 Developer : Lynx Decode
 * │ 📞 WhatsApp  : +62 882-5804-1396
 * │ 📢 Channel   : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * ╰─────────────────────────
 * 📝 Plugin      : Claude Haiku AI Interface
 */

import claudeHaiku from '../scrape/claudehaiku.js';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return m.reply(`⚠️ Format salah!\n\n📌 *Cara Pakai:*\n${usedPrefix + command} <pertanyaan lu>`);

    await m.react('⏳');

    try {
        // Tembak langsung ke fungsi scraper bawaan lu
        const result = await claudeHaiku(text);
        
        await m.react('✅');
        await conn.sendMessage(m.chat, { 
            text: result,
            contextInfo: { mentionedJid: [m.sender] }
        }, { quoted: m });

    } catch (e) {
        console.error('[CLAUDE PLUGIN ERROR]', e);
        await m.react('❌');
        m.reply(`❌ Gagal merespon Claude AI.\n> *Detail:* ${e.message}`);
    }
};

handler.help = ['claudehaiku <text>'];
handler.tags = ['ai'];
handler.command = /^(claudehaiku|haiku)$/i;
handler.limit = true;

export default handler;