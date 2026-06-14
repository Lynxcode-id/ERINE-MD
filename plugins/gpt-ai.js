import chatGpt from '../scrape/gpt.js';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        throw `Mau nanya apa lu cuy?\n\n*Contoh:* ${usedPrefix + command} tolong buatkan script HTML untuk web toko`;
    }

    try {
        await m.react('⏳');

        let response = await chatGpt(text);

        if (!response) {
            throw 'Waduh, ChatGPT-nya lagi error nih cuy. Coba lagi nanti ya.';
        }

        await conn.sendMessage(m.chat, {
            text: response,
            contextInfo: {
                isForwarded: true,
                forwardingScore: 9999,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: "120363400612665352@newsletter",
                    newsletterName: "🌟 ᴇʀɪɴᴇ-ᴍᴅ ɪɴғᴏʀᴍᴀᴛɪᴏɴ",
                    serverMessageId: -1
                }
            }
        }, { quoted: m });

        await m.react('✅');

    } catch (e) {
        console.error(e);
        await m.react('❌');
        m.reply(`Error jir: ${e.message}`);
    }
};

handler.help = ['gpt <teks>', 'ai <teks>'];
handler.tags = ['ai'];
handler.command = /^(gpt|chatgpt|ai)$/i;
handler.limit = true

export default handler;
