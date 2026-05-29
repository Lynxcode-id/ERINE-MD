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
    if (!text) return m.reply(`Masukkan link Dramabox yang mau diambil cuy!\n\n💡 *Contoh:* ${usedPrefix + command} https://www.dramabox.com/...`);

    await m.react('⚡');

    try {
        let url = `https://api-xemoz-official.my.id/api/drachin/DRAMABOX/stream_and_download.php?url=${encodeURIComponent(text)}`;
        let res = await fetch(url);
        let json = await res.json();

        if (!json.status || !json.result || !json.result.episodes) {
            await m.react('❌');
            return m.reply('❌ Data tidak ditemukan cuy, pastikan linknya bener.');
        }

        let book = json.result.book;
        let episodes = json.result.episodes;
        
        let teks = `╭───「 🎬 *DRAMABOX INFO* 」───\n`;
        teks += `│ 📌 *Judul:* ${book.bookName}\n`;
        teks += `│ 🎬 *Total Eps:* ${json.result.totalEpisodes}\n`;
        teks += `│ 🔓 *Free Eps:* ${json.result.unlockedCount}\n`;
        teks += `│ 🔒 *Locked Eps:* ${json.result.lockedCount}\n`;
        teks += `│ 🏷️ *Tags:* ${book.tags.join(', ')}\n`;
        teks += `│ 🌐 *Bahasa:* ${book.language}\n`;
        teks += `╰─────────────────────────\n\n`;
        teks += `📖 *Sinopsis:*\n${book.introduction}\n\n`;
        
        teks += `📥 *Link Download (Unlocked Only):*\n`;

        // Filter episode yang unlocked dan punya link MP4
        let unlockedEps = episodes.filter(ep => ep.unlock && ep.mp4);
        
        if (unlockedEps.length > 0) {
            unlockedEps.forEach((ep) => {
                teks += `*Eps ${ep.indexStr}* (${Math.floor(ep.durationMs / 60000)}m ${Math.floor((ep.durationMs % 60000) / 1000)}s)\n`;
                teks += `🔗 ${ep.mp4}\n\n`;
            });
        } else {
            teks += `_Tidak ada link episode gratis yang tersedia._\n\n`;
        }

        teks += `⚠️ *Note:* ${json.result.note}\n`;
        teks += `> ©Erine-MD`;

        await conn.sendMessage(m.chat, {
            image: { url: book.cover },
            caption: teks.trim()
        }, { quoted: m });

        await m.react('✅');
    } catch (e) {
        console.error(e);
        await m.react('❌');
        m.reply('❌ Gagal mengambil data. Server API mungkin sedang error.');
    }
}

handler.help = ['dramaboxdl <link>', 'drachindl <link>'];
handler.tags = ['downloader'];
handler.command = /^(dramaboxdl|drachindl)$/i;
handler.limit = true;

export default handler;