// lynx decode
// © INF PROJECT
// File: plugins/cekhalu.js

import fetch from 'node-fetch';

export const handler = async (m, { conn, text, usedPrefix, command }) => {
    let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : (m.quoted ? m.quoted.sender : m.sender);
    let nameToScan = text ? text.replace(/@(\d+)/g, '').trim() : await conn.getName(who);

    if (!nameToScan) {
        return m.reply('Siapa yang mau di-scan tingkat halunya? 🌀\nContoh: *' + usedPrefix + command + ' Lynx decode*');
    }

    await conn.sendMessage(m.chat, { react: { text: '🌀', key: m.key } });

    try {
        let ppUrl;
        try {
            ppUrl = await conn.profilePictureUrl(who, 'image');
        } catch (e) {
            ppUrl = 'https://i.ibb.co/6y4t83t/generic-pp.png'; 
        }

        let apiUrl = 'https://api.skylow.web.id/api/fun/cekhalu?name=' + encodeURIComponent(nameToScan);
        let response = await fetch(apiUrl);
        
        if (!response.ok) throw new Error('API Error');
        let json = await response.json();

        if (!json.status) {
            return m.reply('❌ Yah, API-nya lagi error cuy.');
        }

        let match = json.result.match(/Tingkat Halu:\s*(\d+)%/i);
        let pct = match ? parseInt(match[1]) : 0;

        let quotes = [];
        if (pct <= 20) {
            quotes = [
                "Masih sadar realita, bagus deh bre. 👍",
                "Alhamdulillah, belum ketularan virus anime. 🙏",
                "Masih napak bumi lu lek.",
                "Hampir nggak ada halu-halunya, kurang seru lu.",
                "Pikiran lu masih lurus kek penggaris."
            ];
        } else if (pct <= 50) {
            quotes = [
                "Mulai menghayal dikit, sering liat fyp ya? 🗿",
                "Masih tahap normal, tapi jangan kebablasan bre.",
                "Dikit lagi dapet gelar 'Wibu Akut'.",
                "Hati-hati, khayalan lu mulai nggak masuk akal.",
                "Setengah sadar, setengah di awang-awang."
            ];
        } else if (pct <= 80) {
            quotes = [
                "Waduh, mending lu buruan cuci muka pake air selokan bre. 😭",
                "Udah mulai nikahin waifu di pikiran ya lu?",
                "Fix, realita lu udah mulai geser 💀",
                "Butuh asupan rumput ini mah, halunya kebangetan.",
                "Aura-aura pasien RSJ mulai tercium nih."
            ];
        } else {
            quotes = [
                "SEPUH HALU TELAH TIBA! 🛐 Fix udah gila.",
                "Udah nggak bisa ketolong, dunianya udah beda 🗿😭",
                "Lu makan apa sih? Halunya sampe nembus dimensi lain lek.",
                "Mending lu buruan ruqyah, sebelum nikah sama tiang listrik.",
                "Realita 0%, Halu 100%. Selamat, lu resmi jadi beban khayalan!"
            ];
        }

        let randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

        let cleanText = json.result.replace('_*CEK HALU*_', '🌀 ⸺ *HALU SCANNER* ⸺ 🌀');
        cleanText = cleanText.replace('Nama:', '👤 *Nama:*');
        cleanText = cleanText.replace('Tingkat Halu:', '📊 *Persentase:*');
        cleanText = cleanText.replace('Status:', '💬 *Status:*');

        let simpleMessage = cleanText + '\n\n*Reaksi Bot:*\n_"' + randomQuote + '"_\n\n> © Erine • Takina • Jemima ✨';

        await conn.sendMessage(m.chat, { 
            image: { url: ppUrl }, 
            caption: simpleMessage 
        }, { quoted: m });

    } catch (e) {
        console.error(e);
        m.reply('❌ Gagal memproses cuy: ' + (e.message || e));
    }
}

handler.help = ['cekhalu <nama|tag|reply>'];
handler.tags = ['fun'];
handler.command = /^(cekhalu)$/i;

export default handler;