// lynx decode
// © INF PROJECT
// File: plugins/cekcool.js

import fetch from 'node-fetch';

export const handler = async (m, { conn, text, usedPrefix, command }) => {
    let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : (m.quoted ? m.quoted.sender : m.sender);
    let nameToScan = text ? text.replace(/@(\d+)/g, '').trim() : await conn.getName(who);

    if (!nameToScan) {
        return m.reply('Siapa yang mau di-scan tingkat cool-nya? 🥶\nContoh: *' + usedPrefix + command + ' Lynx decode*');
    }

    await conn.sendMessage(m.chat, { react: { text: '❄️', key: m.key } });

    try {
        let ppUrl;
        try {
            ppUrl = await conn.profilePictureUrl(who, 'image');
        } catch (e) {
            ppUrl = 'https://i.ibb.co/6y4t83t/generic-pp.png'; 
        }

        let apiUrl = 'https://api.skylow.web.id/api/fun/cekcool?name=' + encodeURIComponent(nameToScan);
        let response = await fetch(apiUrl);
        
        if (!response.ok) throw new Error('API Error');
        let json = await response.json();

        if (!json.status) {
            return m.reply('❌ Yah, API-nya lagi error cuy.');
        }

        let match = json.result.match(/Tingkat Cool:\s*(\d+)%/i);
        let pct = match ? parseInt(match[1]) : 0;

        let quotes = [];
        if (pct <= 20) {
            quotes = [
                "Cool apanya, lu mah lebih ke cringe bre 😭",
                "Suhu ruangan aja lebih cool dari lu 🗿",
                "Mandi dulu sana, aura lu masih jamet.",
                "Boro-boro cool, ngeliat lu aja pengen istighfar 🙏",
                "Mending lu pake jaket tebel dah, aura lu minus."
            ];
        } else if (pct <= 50) {
            quotes = [
                "Lumayan lah, walau kadang sok asik 🗿",
                "Masih tahap belajar cool, kurang-kurangin caper bre.",
                "Aura cool lu ketutup sama kelakuan jamet lu.",
                "Gaya elit, cool sulit 💀",
                "Biasa aja sih, nggak usah sok iye."
            ];
        } else if (pct <= 80) {
            quotes = [
                "Boleh juga nih, auranya udah mulai kerasa 😎",
                "Anjay mabar, lumayan cool lu bre 🔥",
                "Pertahankan gaya lu, udah dapet nih feel-nya.",
                "Cewek-cewek mulai ngelirik nih pasti 🗿",
                "Keren juga lu, minimal traktir kopi lah."
            ];
        } else {
            quotes = [
                "AMPUUUUN SEPUH COOL 🛐🥶",
                "Dingin banget bos! Kulkas 10 pintu kalah ini mah 🥶",
                "Buset, lu nafas aja cewek pada pingsan keknya bre 😭",
                "Terlalu cool sampai suhu grup ini ikutan beku ❄️",
                "Valid no debat, lu emang jelmaan Sasuke 🗿"
            ];
        }

        let randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

        let cleanText = json.result.replace('_*CEK COOL*_', '❄️ ⸺ *COOL SCANNER* ⸺ ❄️');
        cleanText = cleanText.replace('Nama:', '👤 *Nama:*');
        cleanText = cleanText.replace('Tingkat Cool:', '📊 *Persentase:*');
        cleanText = cleanText.replace('Status:', '💬 *Status:*');

        // 🔥 FIX: Menggunakan \n agar tidak error saat disave via chat
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

handler.help = ['cekcool <nama|tag|reply>'];
handler.tags = ['fun'];
handler.command = /^(cekcool)$/i;

export default handler;