/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx Decode
 * 📞 WhatsApp  : +62 882-5804-1396
 * 📢 Channel   : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * ⚠️ Note      : Keep credit to respect the creator!
 * ─────────────────────────
 */

import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return m.reply(`Masukkan judul lagu yang mau dicari cuy!\n\n💡 *Contoh:* ${usedPrefix + command} Duka Last Child`);

    await m.react('⏳');

    try {
        let url = `https://api-xemoz-official.my.id/api/search/spotify.php?q=${encodeURIComponent(text)}`;
        let res = await fetch(url);
        let json = await res.json();

        if (!json.status || !json.result || json.result.length === 0) {
            await m.react('❌');
            return m.reply('❌ Lagu tidak ditemukan cuy, coba judul lain.');
        }

        let data = json.result[0];
        
        let teks = `╭───「 🎧 *SPOTIFY SEARCH* 」───\n`;
        teks += `│ 🎵 *Title:* ${data.title}\n`;
        teks += `│ 👤 *Artist:* ${data.artist}\n`;
        teks += `│ 💿 *Album:* ${data.album}\n`;
        teks += `│ ⏱️ *Duration:* ${data.duration}\n`;
        teks += `│ 📅 *Released:* ${data.release_date}\n`;
        teks += `│ 📈 *Popularity:* ${data.popularity}%\n`;
        teks += `╰─────────────────────────\n\n`;
        teks += `🔗 *Link:* ${data.url}\n\n`;
        teks += `_© Erine-MD | INF PROJECT_`;

        await conn.sendMessage(m.chat, {
            image: { url: data.thumbnail },
            caption: teks
        }, { quoted: m });

        await m.react('✅');
    } catch (e) {
        console.error(e);
        await m.react('❌');
        m.reply('❌ Gagal mengambil data. Server API mungkin sedang error.');
    }
}

handler.help = ['spsearch <judul>', 'spotifysearch <judul>'];
handler.tags = ['search'];
handler.command = /^(spsearch|spotifysearch)$/i;
handler.limit = true;

export default handler;