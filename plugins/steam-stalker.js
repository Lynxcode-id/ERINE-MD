/**
 * ╭───「 𝗙𝗘𝗔𝗧𝗨𝗥𝗘 𝗔𝗨𝗧𝗛𝗢𝗥 」───
 * │ 👤 Developer : INF Team's x Lynx Decode
 * ╰─────────────────────────
 * 📝 Plugin      : Steam Stalker (Erine-MD)
 */

import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        return m.reply(`┌˚₊ ๑│ s ᴛ ᴇ ᴀ ᴍ  s ᴛ ᴀ ʟ ᴋ │๑˚₊ 🎮\n┇ \n│ ❌ Masukkan username Steam yang mau di-stalk!\n│ \n│ *Contoh:*\n│ ${usedPrefix + command} gaben\n┇ \n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`);
    }

    await m.react('⏳');

    try {
        let apiUrl = `https://api.synoxcloud.xyz/stalker/steam?username=${encodeURIComponent(text)}`;
        let res = await fetch(apiUrl);
        let json = await res.json();

        if (!json.status || !json.result) {
            throw new Error("Profil Steam tidak ditemukan atau gagal mengambil data dari API.");
        }

        let data = json.result;

        let cap = `┌˚₊ ๑│ s ᴛ ᴇ ᴀ ᴍ  s ᴛ ᴀ ʟ ᴋ │๑˚₊ 🎮\n┇ \n`;
        cap += `│ 👤 *Username:* ${data.username || '-'}\n`;
        cap += `│ 📛 *Display Name:* ${data.display_name || '-'}\n`;
        cap += `│ 📝 *Real Name:* ${data.real_name || '-'}\n`;
        cap += `│ 🌟 *Level:* ${data.level || '0'}\n`;
        cap += `│ 🏅 *Badges:* ${data.badges || '0'}\n`;
        cap += `│ 🕹️ *Games Owned:* ${data.games_owned || 'Private/None'}\n`;
        cap += `│ 📡 *Status:* ${data.status || '-'}\n`;
        cap += `│ 📍 *Location:* ${data.location || '-'}\n`;
        cap += `│ 📅 *Member Since:* ${data.member_since || '-'}\n│ \n`;
        cap += `│ 🔗 *Profile:* ${data.profile_url || '-'}\n┇ \n`;
        cap += `└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`;

        // Pakai foto default kalau avatar null/kosong
        let avatarUrl = data.avatar ? data.avatar : 'https://i.ibb.co/1s8T3sY/48f7ce63c7aa.jpg';

        await conn.sendMessage(m.chat, { 
            image: { url: avatarUrl }, 
            caption: cap 
        }, { quoted: m });

        await m.react('✅');

    } catch (e) {
        console.error('[STEAM STALK ERROR]', e);
        await m.react('❌');
        m.reply(`┌˚₊ ๑│ s ʏ s ᴛ ᴇ ᴍ  ᴇ ʀ ʀ ᴏ ʀ │๑˚₊ ❌\n┇ Gagal mencari profil Steam:\n┇ ${e.message || "Internal Server Error"}\n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`);
    }
};

handler.help = ['steamstalk <username>'];
handler.tags = ['stalking'];
handler.command = /^(steamstalk|stalksteam)$/i;
handler.limit = true;

export default handler;