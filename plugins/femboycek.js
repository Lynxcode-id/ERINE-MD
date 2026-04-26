// File: plugins/cekfemboy.js
import fetch from 'node-fetch';

export const handler = async (m, { conn, text, usedPrefix, command }) => {
    let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : (m.quoted ? m.quoted.sender : m.sender);
    let nameToScan = text ? text.replace(/@(\d+)/g, '').trim() : await conn.getName(who);

    if (!nameToScan) {
        return m.reply(`Namanya siapa yang mau dicek cuy?\nContoh: *${usedPrefix + command} dinda*`);
    }

    await conn.sendMessage(m.chat, { react: { text: '🌸', key: m.key } });

    try {
        let ppUrl;
        try {
            ppUrl = await conn.profilePictureUrl(who, 'image');
        } catch (e) {
            ppUrl = 'https://i.ibb.co/6y4t83t/generic-pp.png'; 
        }

        let apiUrl = `https://api.skylow.web.id/api/fun/cekfemboy?name=${encodeURIComponent(nameToScan)}`;
        let response = await fetch(apiUrl);
        
        if (!response.ok) throw new Error('API Error');
        
        let json = await response.json();

        if (!json.status) {
            return m.reply('❌ Maaf cuy, API-nya lagi error.');
        }

        // --- MEROMBAK TAMPILAN MENJADI SIMPLE ---
        // 1. Ubah Header
        let cleanText = json.result.replace('_*CEK FEMBOY*_', '🌸 ⸺ *KAWAII SCANNER* ⸺ 🌸');
        
        // 2. Tambahkan icon kecil di setiap baris biar manis
        cleanText = cleanText.replace('Nama:', '👤 *Nama:*');
        cleanText = cleanText.replace('Tingkat Femboy:', '🎀 *Persentase:*');
        cleanText = cleanText.replace('Status:', '💬 *Status:*');

        // 3. Susun pesan dengan footer yang pendek dan rapi
        let simpleMessage = `
${cleanText}

> © Erine • Takina • Jemima ✨
        `.trim();

        // Kirimkan hasil
        await conn.sendMessage(m.chat, { 
            image: { url: ppUrl }, 
            caption: simpleMessage 
        }, { quoted: m });

    } catch (e) {
        console.error(e);
        m.reply('❌ Gagal memproses, coba lagi nanti ya.');
    }
}

handler.help = ['cekfemboy <nama|tag|reply>'];
handler.tags = ['fun'];
handler.command = /^(cekfemboy)$/i;

export default handler;