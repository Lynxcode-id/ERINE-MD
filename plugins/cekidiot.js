// lynx decode
// © INF PROJECT
// File: plugins/cekidiot.js

import fetch from 'node-fetch';

export const handler = async (m, { conn, text, usedPrefix, command }) => {
    let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : (m.quoted ? m.quoted.sender : m.sender);
    let nameToScan = text ? text.replace(/@(\d+)/g, '').trim() : await conn.getName(who);

    if (!nameToScan) {
        return m.reply('Siapa yang mau di-scan tingkat kebodohannya? 🤪\nContoh: *' + usedPrefix + command + ' Farhan*');
    }

    await conn.sendMessage(m.chat, { react: { text: '🤪', key: m.key } });

    try {
        let ppUrl;
        try {
            ppUrl = await conn.profilePictureUrl(who, 'image');
        } catch (e) {
            ppUrl = 'https://i.ibb.co/6y4t83t/generic-pp.png'; 
        }

        let apiUrl = 'https://api.skylow.web.id/api/fun/cekidiot?name=' + encodeURIComponent(nameToScan);
        let response = await fetch(apiUrl);
        
        if (!response.ok) throw new Error('API Error');
        let json = await response.json();

        if (!json.status) {
            return m.reply('❌ Yah, API-nya lagi error cuy.');
        }

        let match = json.result.match(/Tingkat Kebodohan:\s*(\d+)%/i);
        let pct = match ? parseInt(match[1]) : 0;

        let quotes = [];
        if (pct <= 20) {
            quotes = [
                "Wah ternyata lu pinter juga lek. 👍",
                "Einstein ketar-ketir melihat kecerdasanmu 🗿",
                "Aman, otak lu masih berfungsi normal.",
                "IQ lu pasti di atas rata-rata nih, asik dah.",
                "Jarang-jarang ada orang pinter nyasar ke sini."
            ];
        } else if (pct <= 50) {
            quotes = [
                "Agak telmi dikit, tapi masih aman lah. 🗿",
                "Kebanyakan begadang nih, otak lu agak ngelag.",
                "Biasa aja, standarnya warga +62 lah.",
                "Masih bisa mikir, walau loadingnya agak lama.",
                "Jangan kebanyakan makan micin bre."
            ];
        } else if (pct <= 80) {
            quotes = [
                "Otak lu kayaknya perlu di-restart bre. 😭",
                "Fix lu kalo ditanya 1+1 jawabnya jendela 💀",
                "Mending lu rajin-rajin makan ikan dah.",
                "Isi kepala lu keknya cuma game doang dah.",
                "Kebodohan yang hakiki mulai terlihat."
            ];
        } else {
            quotes = [
                "SEPUH IDIOT TELAH TIBA 🛐 Ampun puh!",
                "Otak lu ditaro di dengkul ya lek? 🗿",
                "Definisi beban keluarga sesungguhnya 😭",
                "Gak ketolong lagi tololnya, mending lu jadi batu aja bre.",
                "Realita yang pahit, lu resmi jadi ketua RT orang-orang idiot!"
            ];
        }

        let randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

        let cleanText = json.result.replace('_*CEK IDIOT*_', '🤪 ⸺ *IDIOT SCANNER* ⸺ 🤪');
        cleanText = cleanText.replace('Nama:', '👤 *Nama:*');
        cleanText = cleanText.replace('Tingkat Kebodohan:', '📊 *Persentase:*');
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

handler.help = ['cekidiot <nama|tag|reply>'];
handler.tags = ['fun'];
handler.command = /^(cekidiot)$/i;

export default handler;