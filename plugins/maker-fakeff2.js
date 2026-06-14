/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx Decode
 * ─────────────────────────
 * 📝 Plugin: Fake Lobby Free Fire (Local File System)
 */

import generateFF from 'fake-ff';
import fs from 'fs';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        return m.reply(`❌ Masukkan username!\n\n*Format:* ${usedPrefix + command} username|id_lobby\n*Contoh Random :* ${usedPrefix + command} Lynx\n*Contoh Custom :* ${usedPrefix + command} Lynx|5`);
    }

    await m.react('⏳');

    try {
        let [username, lobbyId] = text.split('|');
        let options = { username: username.trim() };
        if (lobbyId && !isNaN(lobbyId.trim())) {
            let id = parseInt(lobbyId.trim());
            if (id >= 1 && id <= 30) {
                options.lobby = id;
            } else {
                return m.reply(`⚠️ ID Lobby harus antara 1 sampai 30!`);
            }
        }

        const res = await generateFF(options);
        if (!res || res.status !== 'success' || !res.result) {
            throw new Error('Gagal menggenerate Fake Lobby FF dari package.');
        }

        let caption = `
╭───「 𝐅𝐚𝐤𝐞 𝐋𝐨𝐛𝐛𝐲 𝐅𝐅 」───⚡
│ 
│  👤 𝐔𝐬𝐞𝐫𝐧𝐚𝐦𝐞 : ${res.username}
│  🏰 𝐋𝐨𝐛𝐛𝐲 𝐈𝐃 : ${res.lobby}
│
╰──────────────────────────✨
`.trim();

        const imageBuffer = fs.readFileSync(res.result);
        await conn.sendMessage(m.chat, { 
            image: imageBuffer, 
            caption: caption 
        }, { quoted: m });

        fs.unlinkSync(res.result);

        await m.react('✅');

    } catch (e) {
        console.error('[FAKE FF ERROR]', e);
        await m.react('❌');
        m.reply(`⚠️ *System Error:*\n_${e.message || e}_`);
    }
}

handler.help = ['fakeff2 <nama|lobby>'];
handler.tags = ['maker', 'fun'];
handler.command = /^(fakeff2|fflobby2|lobbyff2)$/i;
handler.limit = true;

export default handler;