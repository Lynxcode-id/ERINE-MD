/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx Decode
 * 📢 Channel   : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * ─────────────────────────
 * 📝 Plugin: Maker Sertifikat NASA
 */

import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        return m.reply(`Masukkan nama untuk sertifikatnya!\n\n*Contoh:*\n${usedPrefix + command} Lynx Decode`);
    }

    await m.react('⏳');

    try {
        const apiUrl = `https://api-nanzz.my.id/docs/api/maker/sertifikat-nasa.php?nama=${encodeURIComponent(text)}`;

        const res = await fetch(apiUrl);
        if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
        const buffer = Buffer.from(await res.arrayBuffer());

        let caption = `🚀 *NASA CERTIFICATE* 🚀\n\n`;
        caption += `👤 *Name:* ${text}\n\n`;
        caption += `> © ERINE-MD\n`;
        caption += `> inf project community`;

        await conn.sendMessage(m.chat, { 
            image: buffer, 
            caption: caption 
        }, { quoted: m });

        await m.react('✅');
    } catch (error) {
        console.error('[NASA CERTIFICATE ERROR]', error);
        await m.react('❌');
        m.reply(`❌ Gagal membuat sertifikat.\n> *Detail:* Server API mungkin sedang down atau sibuk.`);
    }
};

handler.help = ['sertinasa <nama>'];
handler.tags = ['maker'];
handler.command = /^(sertinasa|nasa)$/i;
handler.limit = true;

export default handler;