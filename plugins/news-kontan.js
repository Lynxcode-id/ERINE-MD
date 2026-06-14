/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx Decode
 * 📞 WhatsApp  : +62 882-5804-1396
 * 📢 Channel   : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * ⚠️ Note      : Keep credit to respect the creator!
 * ─────────────────────────
 * 📝 Plugin: Kontan News
 */

import axios from 'axios';

let handler = async (m, { conn, prefix, command }) => {
    await m.react('⚡');

    try {
        const apiUrl = `https://api.zenzxz.my.id/news/kontan`;
        let res = await axios.get(apiUrl);
        
        if (!res.data || !res.data.status || !res.data.result || res.data.result.length === 0) {
            throw new Error('Gagal mengambil data berita terbaru dari Kontan.');
        }

        let newsData = res.data.result.slice(0, 10);
        let firstThumb = newsData[0].thumbnail;
        
        let caption = `📰 *KONTAN NEWS LATEST*\n\n`;
        
        newsData.forEach((news, index) => {
            caption += `*${index + 1}. ${news.title}*\n`;
            caption += `🗞️ *Kategori:* ${news.category}\n`;
            caption += `🕒 *Waktu:* ${news.uploadedAt}\n`;
            caption += `🔗 *Link:* ${news.url}\n`;
            caption += `──────────────────\n\n`;
        });

        await conn.sendMessage(m.chat, {
            image: { url: firstThumb },
            caption: caption.trim()
        }, { quoted: m });

        await m.react('✅');

    } catch (err) {
        console.error("Error Kontan News Cuy:", err.message);
        await m.react('❌');
        m.reply(`❌ *Gagal memproses berita.*\nError: ${err.message}`);
    }
};

handler.help = ['kontan', 'beritakontan'];
handler.tags = ['news'];
handler.command = /^(kontan|beritakontan|news)$/i;
handler.limit = true;

export default handler;