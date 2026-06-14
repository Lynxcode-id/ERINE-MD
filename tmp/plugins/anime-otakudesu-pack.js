/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx Decode
 * ─────────────────────────
 * 📝 Plugin: Otakudesu All-in-One (Home, Search, Detail, Watch, dll)
 */

import axios from 'axios';

const API_BASE = 'https://api-nanzz.my.id/docs/api/nonton-&-baca/otakudesu';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    await m.react('⏳');

    try {
        // ==========================================
        // 1. COMMAND: otaku / otakuhome (Home Page)
        // ==========================================
        if (command === 'otaku' || command === 'otakuhome') {
            const { data } = await axios.get(`${API_BASE}/home.php`);
            if (!data.ok || !data.data) throw new Error('Gagal mengambil data Home Otakudesu.');

            let caption = `╭───「 𝐎𝐭𝐚𝐤𝐮𝐝𝐞𝐬𝐮 𝐇𝐨𝐦𝐞 」───⚡\n│\n│ 🌟 *ONGOING ANIME:*\n`;
            data.data.ongoing.animeList.slice(0, 15).forEach((v, i) => {
                caption += `│ ${i + 1}. *${v.title}* (${v.releaseDay})\n│ 📚 ${usedPrefix}otakudetail ${v.animeId}\n│\n`;
            });
            caption += `╰──────────────────────────✨\n_Gunakan *${usedPrefix}otakusearch <judul>* untuk mencari anime._`;

            let firstThumb = data.data.ongoing.animeList[0]?.poster;
            if (firstThumb && firstThumb.startsWith('http')) {
                await conn.sendMessage(m.chat, { image: { url: firstThumb }, caption: caption }, { quoted: m });
            } else {
                await conn.sendMessage(m.chat, { text: caption }, { quoted: m });
            }
        }

        // ==========================================
        // 2. COMMAND: otakusearch (Pencarian)
        // ==========================================
        else if (command === 'otakusearch') {
            if (!text) return m.reply(`❌ Masukkan judul!\n\n*Contoh:* ${usedPrefix + command} boruto`);
            
            const { data } = await axios.get(`${API_BASE}/search.php?query=${encodeURIComponent(text)}`);
            if (!data.ok || !data.data.animeList || data.data.animeList.length === 0) throw new Error('Anime tidak ditemukan.');

            let caption = `╭───「 𝐎𝐭𝐚𝐤𝐮𝐝𝐞𝐬𝐮 𝐒𝐞𝐚𝐫𝐜𝐡 」───⚡\n│ 🔎 Keyword: ${text}\n│\n`;
            data.data.animeList.forEach((v, i) => {
                caption += `│ ${i + 1}. *${v.title}* (${v.status})\n│ ⭐ Score: ${v.score || '-'}\n│ 📚 ${usedPrefix}otakudetail ${v.animeId}\n│\n`;
            });
            caption += `╰──────────────────────────✨`;

            let firstThumb = data.data.animeList[0]?.poster;
            if (firstThumb && firstThumb.startsWith('http')) {
                await conn.sendMessage(m.chat, { image: { url: firstThumb }, caption: caption }, { quoted: m });
            } else {
                await conn.sendMessage(m.chat, { text: caption }, { quoted: m });
            }
        }

        // ==========================================
        // 3. COMMAND: otakudetail (Info Anime)
        // ==========================================
        else if (command === 'otakudetail') {
            if (!text) return m.reply(`❌ Masukkan slug anime!\n\n*Contoh:* ${usedPrefix + command} borot-sub-indo`);
            
            const { data } = await axios.get(`${API_BASE}/detail.php?slug=${text.trim()}`);
            if (!data.ok || !data.data) throw new Error('Detail anime tidak ditemukan.');

            const res = data.data;
            const genres = res.genreList ? res.genreList.map(g => g.title).join(', ') : '-';
            let synopsis = res.synopsis.paragraphs.length > 0 ? res.synopsis.paragraphs[0] : 'Tidak ada sinopsis.';

            let caption = `╭───「 𝐎𝐭𝐚𝐤𝐮𝐝𝐞𝐬𝐮 𝐃𝐞𝐭𝐚𝐢𝐥 」───⚡\n│\n`;
            caption += `│ 🎬 *Judul* : ${res.title}\n`;
            caption += `│ 🇯🇵 *Jepang*: ${res.japanese || '-'}\n`;
            caption += `│ 🎭 *Genre* : ${genres}\n`;
            caption += `│ ⭐ *Score* : ${res.score || '-'}\n`;
            caption += `│ 📡 *Status*: ${res.status}\n│\n`;
            caption += `│ 📝 *Sinopsis* :\n│ _${synopsis}_\n│\n`;
            caption += `│ 🎞️ *List Episode* :\n`;

            if (res.episodeList && res.episodeList.length > 0) {
                res.episodeList.forEach((v) => {
                    caption += `│ ➔ Ep ${v.eps} | ${usedPrefix}otakuwatch ${v.episodeId}\n`;
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
        // 4. COMMAND: otakusched (Jadwal Rilis)
        // ==========================================
        else if (command === 'otakusched') {
            const { data } = await axios.get(`${API_BASE}/schedule.php`);
            if (!data.status || !data.data) throw new Error('Gagal mengambil jadwal anime.');

            let caption = `╭───「 𝐎𝐭𝐚𝐤𝐮𝐝𝐞𝐬𝐮 𝐒𝐜𝐡𝐞𝐝𝐮𝐥𝐞 」───⚡\n│\n`;
            data.data.forEach((hari) => {
                caption += `│ 📅 *${hari.day.toUpperCase()}*\n`;
                hari.anime_list.forEach((anime) => {
                    caption += `│ ➔ ${anime.title}\n│    ${usedPrefix}otakudetail ${anime.slug}\n`;
                });
                caption += `│\n`;
            });
            caption += `╰──────────────────────────✨`;

            await conn.sendMessage(m.chat, { text: caption }, { quoted: m });
        }

        // ==========================================
        // 5. COMMAND: otakumovie (List Anime Movie)
        // ==========================================
        else if (command === 'otakumovie') {
            const { data } = await axios.get(`${API_BASE}/movie.php`);
            if (!data.ok || !data.data) throw new Error('Gagal mengambil data Movie.');

            let caption = `╭───「 𝐎𝐭𝐚𝐤𝐮𝐝𝐞𝐬𝐮 𝐌𝐨𝐯𝐢𝐞 」───⚡\n│\n│ 🎬 *DAFTAR MOVIE BARU:*\n`;
            data.data.ongoing.animeList.slice(0, 20).forEach((v, i) => {
                caption += `│ ${i + 1}. *${v.title}*\n│ 📚 ${usedPrefix}otakudetail ${v.animeId}\n│\n`;
            });
            caption += `╰──────────────────────────✨`;

            let firstThumb = data.data.ongoing.animeList[0]?.poster;
            if (firstThumb && firstThumb.startsWith('http')) {
                await conn.sendMessage(m.chat, { image: { url: firstThumb }, caption: caption }, { quoted: m });
            } else {
                await conn.sendMessage(m.chat, { text: caption }, { quoted: m });
            }
        }

        // ==========================================
        // 6. COMMAND: otakugenre (Cari per Genre)
        // ==========================================
        else if (command === 'otakugenre') {
            if (!text) return m.reply(`❌ Masukkan genre!\n\n*Contoh:* ${usedPrefix + command} action`);
            
            const { data } = await axios.get(`${API_BASE}/genre.php?slug=${encodeURIComponent(text.toLowerCase())}&page=1`);
            if (!data.ok || !data.data.animeList) throw new Error('Data genre tidak ditemukan.');

            let caption = `╭───「 𝐎𝐭𝐚𝐤𝐮𝐝𝐞𝐬𝐮 𝐆𝐞𝐧𝐫𝐞 」───⚡\n│ 🎭 Genre: ${text.toUpperCase()}\n│\n`;
            data.data.animeList.slice(0, 15).forEach((v, i) => {
                caption += `│ ${i + 1}. *${v.title}*\n│ ⭐ Score: ${v.score || '-'}\n│ 📚 ${usedPrefix}otakudetail ${v.animeId}\n│\n`;
            });
            caption += `╰──────────────────────────✨`;

            let firstThumb = data.data.animeList[0]?.poster;
            if (firstThumb && firstThumb.startsWith('http')) {
                await conn.sendMessage(m.chat, { image: { url: firstThumb }, caption: caption }, { quoted: m });
            } else {
                await conn.sendMessage(m.chat, { text: caption }, { quoted: m });
            }
        }

        // ==========================================
        // 7. COMMAND: otakuwatch (Nonton/Download Eps)
        // ==========================================
        else if (command === 'otakuwatch' || command === 'otakueps') {
            if (!text) return m.reply(`❌ Masukkan slug episode!\n\n*Contoh:* ${usedPrefix + command} borot-episode-1-sub-indo`);
            
            const { data } = await axios.get(`${API_BASE}/episode.php?slug=${text.trim()}`);
            if (!data.ok || !data.data) throw new Error(data.message || 'Episode belum tersedia / Server Down (404).');

            const res = data.data;
            let caption = `╭───「 𝐎𝐭𝐚𝐤𝐮𝐝𝐞𝐬𝐮 𝐖𝐚𝐭𝐜𝐡 」───⚡\n│\n│ 🎬 *Target* : ${text}\n│\n`;
            
            // Auto-Parser dinamis jika struktur JSON dari episode.php berubah-ubah
            if (res.title) caption += `│ 📌 *Judul*: ${res.title}\n`;
            if (res.url) caption += `│ 🔗 *Link*: ${res.url}\n`;
            if (res.videoUrl || res.streamUrl) caption += `│ 🖥️ *Stream*: ${res.videoUrl || res.streamUrl}\n`;
            
            if (res.servers && res.servers.length > 0) {
                caption += `│\n│ 🖧 *List Server* :\n`;
                res.servers.forEach((s) => {
                    caption += `│ ➔ ${s.name}: ${usedPrefix}otakuserver ${s.id || s.serverId}\n`;
                });
            }

            // Dump data mentah jika API mereturn format tak terduga
            if (!res.title && !res.url && !res.servers) {
                caption += `│ ⚠️ *Data Ditemukan:*\n│ ${JSON.stringify(res).slice(0, 300)}...\n`;
            }

            caption += `│\n╰──────────────────────────✨`;
            await conn.sendMessage(m.chat, { text: caption }, { quoted: m });
        }

        // ==========================================
        // 8. COMMAND: otakuserver (Extract Server ID)
        // ==========================================
        else if (command === 'otakuserver') {
            if (!text) return m.reply(`❌ Masukkan ID Server!`);
            
            const { data } = await axios.get(`${API_BASE}/server.php?id=${text.trim()}`);
            if (!data.ok || !data.data) throw new Error('Server ID tidak valid.');

            let caption = `╭───「 𝐎𝐭𝐚𝐤𝐮𝐝𝐞𝐬𝐮 𝐒𝐞𝐫𝐯𝐞𝐫 」───⚡\n│\n`;
            caption += `│ 🖥️ *Stream URL* :\n│ ${data.data.url}\n│\n`;
            caption += `╰──────────────────────────✨\n_Salin link di atas ke browser untuk menonton._`;

            await conn.sendMessage(m.chat, { text: caption }, { quoted: m });
        }

        await m.react('✅');

    } catch (e) {
        console.error('[OTAKUDESU ERROR]', e);
        await m.react('❌');
        m.reply(`⚠️ *System Error:*\n_${e.message || 'Terjadi kesalahan pada scraper Otakudesu.'}_`);
    }
};

handler.help = [
    'otaku', 
    'otakusearch <judul>', 
    'otakudetail <slug>', 
    'otakusched', 
    'otakumovie', 
    'otakugenre <genre>', 
    'otakuwatch <slug_eps>'
];
handler.tags = ['anime', 'search'];
handler.command = /^(otaku|otakuhome|otakusearch|otakudetail|otakuwatch|otakueps|otakusched|otakumovie|otakugenre|otakuserver)$/i;
handler.limit = true;

export default handler;