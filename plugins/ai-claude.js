import askClaude from '../scrape/claude.js';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        throw `Mau nanya apa lu cuy?\n\n*Contoh:* ${usedPrefix + command} buatin pantun buat JKT48 dong`;
    }

    try {
        await m.react('⏳');

        let response = await askClaude(text);

        if (!response) {
            throw 'Duh, Claude-nya lagi ngambek atau servernya penuh cuy. Coba lagi nanti ya.';
        }

        let wm = global.wm || "Erine System";
        let senderNumber = m.sender.split('@')[0];
        let fkontak = {
            key: {
                fromMe: false,
                participant: `0@s.whatsapp.net`
            },
            message: {
                contactMessage: {
                    displayName: wm,
                    vcard: `BEGIN:VCARD\nVERSION:3.0\nN:XL;${wm},;;;\nFN:${wm}\nitem1.TEL;waid=${senderNumber}:${senderNumber}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
                }
            }
        };

        await conn.sendMessage(m.chat, {
            text: response,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterName: `「 🐣 ᴇʀɪɴᴇ-ᴍᴅ ɪɴғᴏʀᴍᴀᴛɪᴏɴ 🐣 」`,
                    newsletterJid: "120363400612665352@newsletter"
                }
            }
        }, { quoted: fkontak });

        await m.react('✅');

    } catch (e) {
        console.error(e);
        await m.react('❌');
        m.reply(`Error jir: ${e.message}`);
    }
};

handler.help = ['claude <teks>'];
handler.tags = ['ai'];
handler.command = /^(claude|claudeai|ai-claude)$/i;
handler.limit = true;
handler.premium = false;

export default handler;
