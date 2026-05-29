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
    if (!text) return m.reply(`Masukkan judul atau keyword drama yang mau dicari cuy!\n\n💡 *Contoh:* ${usedPrefix + command} ceo`);

    await m.react('⏳');

    try {
        let url = `https://api-xemoz-official.my.id/api/drachin/DRAMABOX/search.php?q=${encodeURIComponent(text)}&page=1&pages=1`;
        let res = await fetch(url);
        let json = await res.json();

        if (!json.status || !json.result || !json.result.items || json.result.items.length === 0) {
            await m.react('❌');
            return m.reply('❌ Drama tidak ditemukan cuy, coba keyword lain.');
        }

        let data = json.result.items.slice(0, 5); // Ambil top 5 aja biar teksnya ga kepanjangan
        
        let teks = `╭───「 🎬 *DRAMABOX SEARCH* 」───\n`;
        teks += `│ 🔍 *Keyword:* ${json.result.keyword}\n`;
        teks += `│ 📊 *Total:* ${json.result.totalResults} judul\n`;
        teks += `╰─────────────────────────\n\n`;

        data.forEach((v, i) => {
            teks += `*${i + 1}. ${v.bookName}*\n`;
            if (v.alias) teks += `🎭 *Alias:* ${v.alias}\n`;
            teks += `⭐ *Score:* ${v.score} | 🎬 *Eps:* ${v.episodes} (Free: ${v.freeEpisodes})\n`;
            teks += `🏷️ *Tags:* ${v.tags.join(', ')}\n`;
            teks += `📖 *Intro:* ${v.introduction}\n`;
            teks += `🔗 *Link:* ${v.url}\n\n`;
        });

        teks += `_© Erine-MD | INF PROJECT_`;

        // Ngirim pure text aja biar aman dan rapi, ga ada nyangkut adreply
        await conn.sendMessage(m.chat, {
            text: teks.trim()
        }, { quoted: m });

        await m.react('✅');
    } catch (e) {
        console.error(e);
        await m.react('❌');
        m.reply('❌ Gagal mengambil data. Server API mungkin sedang error.');
    }
}

handler.help = ['dramabox <judul>', 'drachin <judul>'];
handler.tags = ['search'];
handler.command = /^(dramabox|drachin)$/i;
handler.limit = true;

export default handler;