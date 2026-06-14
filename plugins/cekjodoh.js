// lynx decode
// © INF PROJECT
// File: plugins/cekjodoh.js

import fetch from 'node-fetch';

export const handler = async (m, { conn, text, usedPrefix, command }) => {
    let nama1, nama2, who;
    let input = text ? text.split('&') : [];
    if (input.length < 2) input = text ? text.split(' ') : [];

    // Logika penentuan nama1 dan nama2
    if (m.mentionedJid && m.mentionedJid[0]) {
        who = m.mentionedJid[0];
        nama1 = await conn.getName(m.sender);
        nama2 = await conn.getName(who);
    } else if (m.quoted) {
        who = m.quoted.sender;
        nama1 = await conn.getName(m.sender);
        nama2 = await conn.getName(who);
    } else if (input.length >= 2) {
        nama1 = input[0].trim();
        nama2 = input[1].trim();
        who = m.sender;
    } else {
        return m.reply('Masukkan dua nama atau tag orangnya cuy!\nContoh: *' + usedPrefix + command + ' Lynx Oline* atau *' + usedPrefix + command + ' @tag*');
    }

    await conn.sendMessage(m.chat, { react: { text: '💖', key: m.key } });

    try {
        let ppUrl;
        try {
            ppUrl = await conn.profilePictureUrl(who, 'image');
        } catch (e) {
            ppUrl = 'https://i.ibb.co/6y4t83t/generic-pp.png'; 
        }

        let apiUrl = 'https://api.skylow.web.id/api/primbon/kecocokanpasangan?nama1=' + encodeURIComponent(nama1) + '&nama2=' + encodeURIComponent(nama2);
        let response = await fetch(apiUrl);
        if (!response.ok) throw new Error('API Error');
        let json = await response.json();

        if (!json.status) return m.reply('❌ Gagal mengecek kecocokan pasangan.');

        let res = json.result;
        // Memisahkan deskripsi panjang dari poin negatif jika ada
        let desc = res.negatif.replace('Tidak mudah berkomitmen, Boros', '').trim();

        let caption = '💞 ⸺ *LOVE COMPATIBILITY* ⸺ 💞\n\n' +
            '👤 *Pasangan:* ' + res.pasangan + '\n' +
            '✅ *Sisi Positif:* ' + res.positif + '\n' +
            '❌ *Sisi Negatif:* Tidak mudah berkomitmen, Boros\n\n' +
            '📝 *Ramalan:* \n_' + desc + '_\n\n' +
            '> © Erine • Takina • Jemima ✨';

        await conn.sendMessage(m.chat, { 
            image: { url: ppUrl }, 
            caption: caption 
        }, { quoted: m });

    } catch (e) {
        console.error(e);
        m.reply('❌ Gagal memproses data primbon.');
    }
}

handler.help = ['cekjodoh <nama1 nama2|tag>'];
handler.tags = ['primbon'];
handler.command = /^(cekjodoh|couple|kecocokan)$/i;

export default handler;