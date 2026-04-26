// lynx decode
// © INF PROJECT
// File: plugins/cekwibu.js

import fetch from 'node-fetch';

export const handler = async (m, { conn, text, usedPrefix, command }) => {
    // 1. Tentukan JID target (Mention > Reply > Sendiri)
    let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : (m.quoted ? m.quoted.sender : m.sender);
    
    // 2. Logika Nama Anti-Bug
    let manualName = text ? text.replace(/@\d+/g, '').trim() : '';
    let nameToScan;
    
    if (manualName) {
        nameToScan = manualName;
    } else {
        nameToScan = await conn.getName(who);
    }

    // Kalau getName zonk, ambil angka depan nomor WA-nya
    if (!nameToScan || nameToScan.includes('@')) {
        nameToScan = who.split('@')[0];
    }

    await conn.sendMessage(m.chat, { react: { text: '🌸', key: m.key } });

    try {
        let ppUrl;
        try {
            ppUrl = await conn.profilePictureUrl(who, 'image');
        } catch (e) {
            ppUrl = 'https://i.ibb.co/6y4t83t/generic-pp.png'; 
        }

        let apiUrl = 'https://api.skylow.web.id/api/fun/cekwibu?name=' + encodeURIComponent(nameToScan);
        let response = await fetch(apiUrl);
        
        if (!response.ok) throw new Error('API Error');
        let json = await response.json();

        if (!json.status) return m.reply('❌ Yah, API-nya lagi error cuy.');

        let match = json.result.match(/Tingkat Wibu:\s*(\d+)%/i);
        let pct = match ? parseInt(match[1]) : 0;

        let quotes = [];
        if (pct <= 20) {
            quotes = [
                "Aman bre, lu masih suka nonton sinetron azab kan? 👍",
                "Alhamdulillah, lu belum ketularan virus 2D.",
                "Masih normal lu lek, pertahankan napak bumi lu.",
                "Bukan wibu, cuma warga lokal biasa.",
                "Pikiran lu masih steril dari bau bawang."
            ];
        } else if (pct <= 50) {
            quotes = [
                "Mulai suka dengerin lagu jejepangan nih pasti 🗿",
                "Udah mulai sering pake PP anime ya lu?",
                "Nonton anime musiman doang sih, tapi awas bablas bre.",
                "Agak sus lu lek, mulai ketahuan aslinya.",
                "Setengah jalan menuju asrama wibu."
            ];
        } else if (pct <= 80) {
            quotes = [
                "Udah mulai manggil 'Oniichan' lu ya? 💀",
                "Bau bawangnya mulai kecium sampe grup ini.",
                "Fix lu pasti punya folder rahasia isinya waifu 😭",
                "Mending lu mandi deh, aura wibu nolep lu kenceng banget.",
                "Bentar lagi lu nikah sama guling anime nih fix."
            ];
        } else {
            quotes = [
                "SEPUH WIBU BAWANG TELAH TIBA! 🛐",
                "Mandi woi mandi! Bau bawang lu nembus dimensi layar 😭",
                "Udah ga bisa diselamatin, lu resmi jadi Lord Wibu 🗿",
                "Hentikan khayalanmu, waifumu itu cuma gambar 2D bre!",
                "Sangat membagongkan, wibu akut stadium akhir!"
            ];
        }

        let randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

        let cleanText = json.result.replace('_*CEK WIBU*_', '🌸 ⸺ *WIBU SCANNER* ⸺ 🌸');
        cleanText = cleanText.replace('Nama:', '👤 *Nama:*');
        cleanText = cleanText.replace('Tingkat Wibu:', '📊 *Persentase:*');
        cleanText = cleanText.replace('Status:', '💬 *Status:*');

        let simpleMessage = cleanText + '\n\n*Reaksi Bot:*\n_"' + randomQuote + '"_\n\n> © Erine • Takina • Jemima ✨';

        await conn.sendMessage(m.chat, { image: { url: ppUrl }, caption: simpleMessage }, { quoted: m });

    } catch (e) {
        console.error(e);
        m.reply('❌ Gagal memproses cuy: ' + (e.message || e));
    }
}
handler.help = ['cekwibu <nama|tag|reply>'];
handler.tags = ['fun'];
handler.command = /^(cekwibu|wibu)$/i;
export default handler;