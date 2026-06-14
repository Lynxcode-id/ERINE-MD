// lynx decode
// © INF PROJECT
// File: plugins/cekimut.js

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

    if (!nameToScan || nameToScan.includes('@')) {
        nameToScan = who.split('@')[0];
    }

    await conn.sendMessage(m.chat, { react: { text: '✨', key: m.key } });

    try {
        let ppUrl;
        try {
            ppUrl = await conn.profilePictureUrl(who, 'image');
        } catch (e) {
            ppUrl = 'https://i.ibb.co/6y4t83t/generic-pp.png'; 
        }

        let apiUrl = 'https://api.skylow.web.id/api/fun/cekimut?name=' + encodeURIComponent(nameToScan);
        let response = await fetch(apiUrl);
        
        if (!response.ok) throw new Error('API Error');
        let json = await response.json();

        if (!json.status) return m.reply('❌ Yah, API-nya lagi error cuy.');

        let match = json.result.match(/Tingkat Keimutan:\s*(\d+)%/i);
        let pct = match ? parseInt(match[1]) : 0;

        let quotes = [];
        if (pct <= 20) {
            quotes = [
                "Imut kagak, amit-amit iya bre 😭",
                "Muka lu lebih ke arah kriminal daripada imut 🗿",
                "Kasihan kameranya pas nge-scan lu, langsung retak.",
                "Minimal mandi kembang biar aura imutnya keluar lek.",
                "Imut lu ditaro di mana? Di dengkul ya? 💀"
            ];
        } else if (pct <= 50) {
            quotes = [
                "Lumayan lah, walau masih banyakan jametnya 🗿",
                "Imut-imut bergizi, tapi bohong.",
                "Dikit lagi dapet gelar 'Pahlawan Keimutan'.",
                "Udah ada bibit-bibit imut, tapi ketutup dosa bre.",
                "Biasa aja, kayak warga lokal pada umumnya."
            ];
        } else if (pct <= 80) {
            quotes = [
                "Anjay mabar, mulai menggemaskan nih bos! 🌸",
                "Fix, cewek/cowok pada baper nih liat lu.",
                "Aura imut lu mulai terpancar, pertahankan bre!",
                "Boleh juga, udah pantes jadi idol JKT48 🗿",
                "Gemas banget sih, pengen gw tabok rasanya."
            ];
        } else {
            quotes = [
                "AMPUUUUN SEPUH IMUT! 🛐✨",
                "Terlalu kawaii, Takina aja minder liat lu bre 😭",
                "Lu makan apa sih? Imutnya sampe nembus layar!",
                "Valid no debat, lu emang jelmaan bayi kelinci 🐰",
                "Sangat membagongkan, keimutan lu sudah mencapai level dewa!"
            ];
        }

        let randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

        let cleanText = json.result.replace('_*CEK IMUT*_', '✨ ⸺ *KAWAII SCANNER* ⸺ ✨');
        cleanText = cleanText.replace('Nama:', '👤 *Nama:*');
        cleanText = cleanText.replace('Tingkat Keimutan:', '📊 *Persentase:*');
        cleanText = cleanText.replace('Status:', '💬 *Status:*');

        let simpleMessage = cleanText + '\n\n*Reaksi Bot:*\n_"' + randomQuote + '"_\n\n> © Erine • Takina • Jemima ✨';

        await conn.sendMessage(m.chat, { image: { url: ppUrl }, caption: simpleMessage }, { quoted: m });

    } catch (e) {
        console.error(e);
        m.reply('❌ Gagal memproses cuy: ' + (e.message || e));
    }
}

handler.help = ['cekimut <nama|tag|reply>'];
handler.tags = ['fun'];
handler.command = /^(cekimut|imut)$/i;

export default handler;