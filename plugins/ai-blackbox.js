import blackboxChat from '../scrape/blackbox.js';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return m.reply(`⚠️ Masukkan pertanyaan!\n\n*Contoh:*\n${usedPrefix + command} buatkan code express js`);

    await m.react('⏳');

    try {
        const res = await blackboxChat(text);
        
        let msg = res.think ? `💭 _${res.think}_\n\n${res.text}` : res.text;
        
        await conn.sendMessage(m.chat, { text: msg }, { quoted: m });
        await m.react('✅');
    } catch (e) {
        console.error('[BLACKBOX AI ERROR]', e);
        await m.react('❌');
        m.reply(`⚠️ *Sistem Error:*\n_${e.message}_`);
    }
};

handler.help = ['blackbox <teks>'];
handler.tags = ['ai'];
handler.command = /^(blackbox|bb)$/i;
handler.limit = true;

export default handler;