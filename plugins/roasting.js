// lynx decode
// © INF PROJECT
// File: plugins/cekroasting.js

import fetch from 'node-fetch';

export const handler = async (m, { conn, text, usedPrefix, command }) => {
    // 1. Tentukan JID target (Mention > Reply > Sendiri)
    let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : (m.quoted ? m.quoted.sender : m.sender);
    
    // 2. Ambil Nama (Prioritas: Teks manual > Nama WA Target)
    let manualName = text ? text.replace(/@\d+/g, '').trim() : '';
    let nameToScan;
    
    if (manualName) {
        nameToScan = manualName;
    } else {
        nameToScan = await conn.getName(who);
    }

    // Kalau getName gagal, ambil angka depan nomor WA-nya
    if (!nameToScan || nameToScan.includes('@')) {
        nameToScan = who.split('@')[0];
    }

    await conn.sendMessage(m.chat, { react: { text: '🔥', key: m.key } });

    try {
        let ppUrl;
        try {
            ppUrl = await conn.profilePictureUrl(who, 'image');
        } catch (e) {
            ppUrl = 'https://i.ibb.co/6y4t83t/generic-pp.png'; 
        }

        let apiUrl = 'https://api.skylow.web.id/api/fun/roasting?name=' + encodeURIComponent(nameToScan);
        let response = await fetch(apiUrl);
        
        if (!response.ok) throw new Error('API Error');
        let json = await response.json();

        if (!json.status) return m.reply('❌ Yah, API-nya lagi error cuy.');

        let match = json.result.match(/Level Roast:\s*(\d+)%/i);
        let pct = match ? parseInt(match[1]) : 0;

        let quotes = [];
        if (pct <= 20) {
            quotes = ["Aman bre, lu terlalu suci buat dihujat. 🙏", "Gak nemu celah buat ngeroast lu, lu terlalu baik.", "Muka lu terlalu polos, ga tega gw ngeroastnya."];
        } else if (pct <= 50) {
            quotes = ["Aura-aura caper dan beban mulai kecium nih. 🗿", "Muka lu kek butuh donasi dah bre.", "Agak canggung ya idup lu?"];
        } else if (pct <= 80) {
            quotes = ["Kelakuan lu bener-bener definisi musibah cuy. 😭", "Udah burik, banyak tingkah lagi lu ah.", "Mending lu introspeksi diri di pojokan."];
        } else {
            quotes = ["AMPUUN PUH! Muka lu aja udah ngajak ribut 💀", "Buang aja diri lu ke laut, udah ga ada harganya lek!", "Definisi ampas masyarakat yang sesungguhnya!"];
        }

        let randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

        let cleanText = json.result.replace('_*CEK ROASTING*_', '🔥 ⸺ *ROASTING SCANNER* ⸺ 🔥');
        cleanText = cleanText.replace('Nama:', '👤 *Nama:*');
        cleanText = cleanText.replace('Level Roast:', '📊 *Persentase:*');
        cleanText = cleanText.replace('Status:', '💬 *Status:*');

        let simpleMessage = cleanText + '\n\n*Reaksi Bot:*\n_"' + randomQuote + '"_\n\n> © Erine • Takina • Jemima ✨';

        await conn.sendMessage(m.chat, { image: { url: ppUrl }, caption: simpleMessage }, { quoted: m });

    } catch (e) {
        console.error(e);
        m.reply('❌ Gagal memproses: ' + (e.message || e));
    }
}
handler.help = ['cekroasting <nama|tag|reply>'];
handler.tags = ['fun'];
handler.command = /^(cekroast(ing)?|roast(ing)?)$/i;
export default handler;