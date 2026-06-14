/**
 * ╭───「 𝗙𝗘𝗔𝗧𝗨𝗥𝗘 𝗔𝗨𝗧𝗛𝗢𝗥 」───
 * │ 👤 Developer : Lynx Decode
 * ╰─────────────────────────
 * 📝 Plugin      : Berita Metro TV (AIRich UI)
 */

import fetch from 'node-fetch';
import { AIRich } from '../lib/nixcode.js';

let handler = async (m, { conn, usedPrefix, command }) => {
    await m.react('⏳');

    try {
        let res = await fetch(`https://api.theresav.biz.id/berita/metrotv?apikey=x34J0`);
        let json = await res.json();

        if (!json.status || !json.items || json.items.length === 0) {
            throw new Error('Gagal mengambil data berita dari server.');
        }

        // Ambil 5 berita terbaru biar UI WA tetap clean dan ringan
        let topNews = json.items.slice(0, 5);

        let newsText = `# 📺 METRO TV NEWS\n\n`;
        
        topNews.forEach((v, i) => {
            newsText += `## ${i + 1}. ${v.title}\n`;
            newsText += `📅 *Rilis:* ${v.published_at || 'Baru saja'}\n`;
            newsText += `📝 *Ringkasan:* ${v.summary}\n`;
            newsText += `🔗 [Baca Selengkapnya] (${v.link})\n\n---\n\n`;
        });

        await new AIRich(conn)
            .setTitle('🚀 BERITA TERKINI')
            .setFooter('© INF PROJECT - Erine-MD')
            .addSuggest(['#MetroTV', '#Berita', '#Terkini'])
            .addTip(`Menampilkan ${topNews.length} berita terbaru dari Metro TV`)
            .addText(newsText.trim())
            .send(m.chat, { quoted: m });

        await m.react('✅');
    } catch (e) {
        console.error('[METRO TV ERROR]', e);
        await m.react('❌');
        m.reply(`⚠️ *Sistem Error:*\n_${e.message}_`);
    }
};

handler.help = ['metrotv'];
handler.tags = ['info', 'berita'];
handler.command = /^(metrotv|beritametro|newsmetro)$/i;
handler.limit = true;

export default handler;