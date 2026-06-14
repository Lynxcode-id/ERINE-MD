/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx Decode
 * ─────────────────────────
 * 📝 Plugin: Donghua Stream All-in-One (Home, Search, Detail, Watch)
 */

import axios from 'axios';

const API_BASE = 'https://api-nanzz.my.id/docs/api/nonton-&-baca/donghua-stream';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    await m.react('⏳');

    try {
        // ==========================================
        // 1. COMMAND: donghua (Home / Latest)
        // ==========================================
        if (command === 'donghua') {
            const { data } = await axios.get(`${API_BASE}/home.php`);
            if (!data.status || !data.result.latest_episodes) throw new Error('Gagal mengambil data Home Donghua.');

            let caption = `╭───「 𝐃𝐨𝐧𝐠𝐡𝐮𝐚 𝐋𝐚𝐭𝐞𝐬𝐭 𝐔𝐩𝐝𝐚𝐭𝐞 」───⚡\n│\n`;
            data.result.latest_episodes.slice(0, 15).forEach((v, i) => {
                let slug = v.url.split('.org/')[1]?.replace(/\//g, '') || '-';
                caption += `│ ${i + 1}. *${v.title}*\n│ 📥 ${usedPrefix}dhwatch ${slug}\n│\n`;
            });
            caption += `╰──────────────────────────✨\n_Ketik *${usedPrefix}dhsearch <judul>* untuk mencari anime lain._`;

            await conn.sendMessage(m.chat, { text: caption }, { quoted: m });
        }

        // ==========================================
        // 2. COMMAND: dhsearch (Pencarian)
        // ==========================================
        else if (command === 'dhsearch') {
            if (!text) return m.reply(`❌ Masukkan judul!\n\n*Contoh:* ${usedPrefix + command} renegade`);
            
            const { data } = await axios.get(`${API_BASE}/search.php?q=${encodeURIComponent(text)}`);
            if (!data.status || !data.result.results || data.result.results.length === 0) throw new Error('Anime tidak ditemukan.');

            let caption = `╭───「 𝐃𝐨𝐧𝐠𝐡𝐮𝐚 𝐒𝐞𝐚𝐫𝐜𝐡 」───⚡\n│ 🔎 Keyword: ${text}\n│\n`;
            data.result.results.forEach((v, i) => {
                let slug = v.url.split('/anime/')[1]?.replace(/\//g, '') || '-';
                caption += `│ ${i + 1}. *${v.title}*\n│ 📚 ${usedPrefix}dhdetail ${slug}\n│\n`;
            });
            caption += `╰──────────────────────────✨`;

            // Ambil thumbnail dari hasil pencarian pertama
            let firstThumb = data.result.results[0]?.thumbnail;

            // Pastikan thumbnail valid (link http) lalu kirim sebagai gambar
            if (firstThumb && firstThumb.startsWith('http')) {
                await conn.sendMessage(m.chat, { image: { url: firstThumb }, caption: caption }, { quoted: m });
            } else {
                await conn.sendMessage(m.chat, { text: caption }, { quoted: m });
            }
        }

        // ==========================================
        // 3. COMMAND: dhdetail (Info & List Episode)
        // ==========================================
        else if (command === 'dhdetail') {
            if (!text) return m.reply(`❌ Masukkan slug anime!\n\n*Contoh:* ${usedPrefix + command} renegade-immortal1`);
            
            const { data } = await axios.get(`${API_BASE}/detail.php?slug=${text.trim()}`);
            if (!data.status || !data.result) throw new Error('Detail anime tidak ditemukan.');

            const res = data.result;
            const genres = res.genres ? res.genres.join(', ') : '-';
            let synopsis = res.synopsis && res.synopsis.trim() !== '' ? res.synopsis : 'Tidak ada sinopsis.';

            let caption = `╭───「 𝐃𝐨𝐧𝐠𝐡𝐮𝐚 𝐃𝐞𝐭𝐚𝐢𝐥 」───⚡\n│\n`;
            caption += `│ 🎬 *Judul* : ${res.title}\n`;
            caption += `│ 🎭 *Genre* : ${genres}\n│\n`;
            caption += `│ 📝 *Sinopsis* :\n│ _${synopsis}_\n│\n`;
            caption += `│ 🎞️ *List Episode* :\n`;

            if (res.episodes && res.episodes.length > 0) {
                res.episodes.forEach((v) => {
                    let epSlug = v.url.split('.org/')[1]?.replace(/\//g, '') || '-';
                    caption += `│ ➔ Ep ${v.episode.padEnd(5)} | ${usedPrefix}dhwatch ${epSlug}\n`;
                });
            } else {
                caption += `│ Belum ada episode tersedia.\n`;
            }
            caption += `╰──────────────────────────✨`;

            if (res.poster && res.poster.startsWith('http')) {
                await conn.sendMessage(m.chat, { image: { url: res.poster }, caption: caption }, { quoted: m });
            } else {
                await conn.sendMessage(m.chat, { text: caption }, { quoted: m });
            }
        }

        // ==========================================
        // 4. COMMAND: dhwatch (Link Server Streaming)
        // ==========================================
        else if (command === 'dhwatch') {
            if (!text) return m.reply(`❌ Masukkan slug episode!\n\n*Contoh:* ${usedPrefix + command} renegade-immortal-episode-1-multiple-subtitles`);
            
            const { data } = await axios.get(`${API_BASE}/watch.php?slug=${text.trim()}`);
            if (!data.status || !data.result) throw new Error('Data streaming tidak ditemukan.');

            const res = data.result;
            let caption = `╭───「 𝐃𝐨𝐧𝐠𝐡𝐮𝐚 𝐒𝐭𝐫𝐞𝐚𝐦 」───⚡\n│\n`;
            caption += `│ 🎬 *Episode* : ${res.title}\n│\n`;
            caption += `│ 🖥️ *Server Tersedia* :\n`;

            if (res.servers && res.servers.length > 0) {
                res.servers.forEach((v, i) => {
                    caption += `│ ${i + 1}. *${v.name}*\n│ 🔗 ${v.url}\n│\n`;
                });
            } else {
                caption += `│ Server belum tersedia untuk saat ini.\n`;
            }
            caption += `╰──────────────────────────✨\n_Gunakan link di atas untuk menonton._`;

            await conn.sendMessage(m.chat, { text: caption }, { quoted: m });
        }

        await m.react('✅');

    } catch (e) {
        console.error('[DONGHUA ERROR]', e);
        await m.react('❌');
        m.reply(`⚠️ *System Error:*\n_${e.message || 'Terjadi kesalahan pada sistem scraper.'}_`);
    }
};

handler.help = ['donghua', 'dhsearch <judul>', 'dhdetail <slug>', 'dhwatch <slug>'];
handler.tags = ['movie'];
handler.command = /^(donghua|dhsearch|dhdetail|dhwatch)$/i;
handler.limit = true;

export default handler;