/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx Decode
 * ─────────────────────────
 * 📝 Plugin : Winbu Anime (Erine-MD)
 */

import axios from 'axios';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    const apikey = 'x34J0';
    const cmd = command.toLowerCase();

    const sendError = async (msg) => {
        await m.react('❌');
        return m.reply(`┌˚₊ ๑│ s ʏ s ᴛ ᴇ ᴍ  ᴇ ʀ ʀ ᴏ ʀ │๑˚₊ ❌\n┇ ${msg}\n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`);
    };

    try {
        // ==================== [ WINBU SEARCH ] ====================
        if (cmd === 'wbsearch') {
            if (!text) {
                return m.reply(`┌˚₊ ๑│ ᴡ ɪ ɴ ʙ ᴜ  ꜱ ᴇ ᴀ ʀ ᴄ ʜ │๑˚₊ 🔍\n┇ \n│ ❌ Masukkan judul anime yang mau dicari!\n│ \n│ *Contoh:*\n│ ${usedPrefix + command} attack on titan\n┇ \n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`);
            }

            await m.react('⏳');
            const { data } = await axios.get(`https://api.theresav.biz.id/anime/winbu/search?q=${encodeURIComponent(text)}&apikey=${apikey}`);
            
            if (!data.status || !data.result || data.result.length === 0) {
                return sendError("Anime tidak ditemukan.");
            }

            let cap = `┌˚₊ ๑│ ᴡ ɪ ɴ ʙ ᴜ  ꜱ ᴇ ᴀ ʀ ᴄ ʜ │๑˚₊ 🔍\n┇ \n`;
            const results = data.result.slice(0, 5); // Ambil top 5 biar ga spam
            
            results.forEach((v, i) => {
                cap += `│ 🎬 *Judul:* ${v.title}\n`;
                if (v.type || v.east_type) cap += `│ 📺 *Tipe:* ${v.type || v.east_type}\n`;
                if (v.genre) cap += `│ 🎭 *Genre:* ${v.genre}\n`;
                cap += `│ 🔗 *Link:* ${v.url}\n`;
                if (i !== results.length - 1) cap += `│ ───────────────\n`;
            });
            
            cap += `┇ \n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`;

            const thumb = results[0].thumbnail || results[0].featured_img_src;
            if (thumb) {
                await conn.sendMessage(m.chat, { image: { url: thumb }, caption: cap }, { quoted: m });
            } else {
                await m.reply(cap);
            }
            await m.react('✅');
        }

        // ==================== [ WINBU SCHEDULE ] ====================
        else if (cmd === 'wbschedule') {
            const validDays = ['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu', 'minggu'];
            const day = text?.toLowerCase()?.trim();

            if (!day || !validDays.includes(day)) {
                return m.reply(`┌˚₊ ๑│ ᴡ ɪ ɴ ʙ ᴜ  ꜱ ᴄ ʜ ᴇ ᴅ ᴜ ʟ ᴇ │๑˚₊ 📅\n┇ \n│ ❌ Masukkan hari yang valid! (senin - minggu)\n│ \n│ *Contoh:*\n│ ${usedPrefix + command} senin\n┇ \n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`);
            }

            await m.react('⏳');
            const { data } = await axios.get(`https://api.theresav.biz.id/anime/winbu/schedule?day=${day}&apikey=${apikey}`);
            
            if (!data.status || !data.result || data.result.length === 0) {
                return sendError(`Jadwal anime untuk hari ${day} kosong/tidak ditemukan.`);
            }

            let cap = `┌˚₊ ๑│ ᴡ ɪ ɴ ʙ ᴜ  ꜱ ᴄ ʜ ᴇ ᴅ ᴜ ʟ ᴇ │๑˚₊ 📅\n┇ \n│ 📌 *Hari:* ${day.toUpperCase()}\n│ 📊 *Total:* ${data.total || data.result.length} Anime\n│ ───────────────\n`;
            
            data.result.slice(0, 10).forEach((v) => { // Batasi 10 biar pesan ga kepanjangan
                cap += `│ 🎬 *Judul:* ${v.title}\n`;
                cap += `│ 🔖 *Episode:* ${v.episode}\n`;
                if (v.rating) cap += `│ ⭐ *Rating:* ${v.rating}\n`;
                cap += `│ 🔗 *Link:* ${v.url}\n│ ───────────────\n`;
            });
            
            cap += `┇ \n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`;
            await m.reply(cap);
            await m.react('✅');
        }

        // ==================== [ WINBU LATEST ] ====================
        else if (cmd === 'wblatest') {
            await m.react('⏳');
            const { data } = await axios.get(`https://api.theresav.biz.id/anime/winbu/latest?apikey=${apikey}`);
            
            if (!data.status || !data.result) {
                return sendError("Gagal mengambil data update anime terbaru.");
            }

            // Antisipasi struktur JSON array vs object
            const results = Array.isArray(data.result) ? data.result : [data.result];

            let cap = `┌˚₊ ๑│ ᴡ ɪ ɴ ʙ ᴜ  ʟ ᴀ ᴛ ᴇ ꜱ ᴛ │๑˚₊ 🆕\n┇ \n`;
            results.slice(0, 7).forEach((v, i) => {
                cap += `│ 🎬 *Judul:* ${v.title || v.judul}\n`;
                if (v.episode) cap += `│ 🔖 *Episode:* ${v.episode}\n`;
                if (v.url) cap += `│ 🔗 *Link:* ${v.url}\n`;
                if (i !== results.length - 1) cap += `│ ───────────────\n`;
            });
            
            cap += `┇ \n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`;
            await m.reply(cap);
            await m.react('✅');
        }

        // ==================== [ WINBU DETAIL ] ====================
        else if (cmd === 'wbdetail') {
            if (!text || !text.includes('winbu.net')) {
                return m.reply(`┌˚₊ ๑│ ᴡ ɪ ɴ ʙ ᴜ  ᴅ ᴇ ᴛ ᴀ ɪ ʟ │๑˚₊ ℹ️\n┇ \n│ ❌ Masukkan URL anime dari Winbu!\n│ \n│ *Contoh:*\n│ ${usedPrefix + command} https://winbu.net/film/...\n┇ \n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`);
            }

            await m.react('⏳');
            const { data } = await axios.get(`https://api.theresav.biz.id/anime/winbu/detail?url=${encodeURIComponent(text)}&apikey=${apikey}`);
            
            if (!data.status || !data.result) {
                return sendError("Gagal mengambil detail anime.");
            }

            const res = data.result;
            let cap = `┌˚₊ ๑│ ᴡ ɪ ɴ ʙ ᴜ  ᴅ ᴇ ᴛ ᴀ ɪ ʟ │๑˚₊ ℹ️\n┇ \n`;
            cap += `│ 🎬 *Judul:* ${res.judul}\n`;
            if (res.rating) cap += `│ ⭐ *Rating:* ${res.rating}\n`;
            if (res.tanggal) cap += `│ 📅 *Tanggal:* ${res.tanggal}\n`;
            if (res.negara) cap += `│ 🏳️ *Negara:* ${res.negara}\n`;
            if (res.genre && res.genre.length > 0) cap += `│ 🎭 *Genre:* ${res.genre.join(', ')}\n`;
            cap += `│ ───────────────\n`;
            cap += `│ 📝 *Sinopsis:*\n│ ${res.sinopsis || '-'}\n┇ \n`;
            cap += `└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`;

            if (res.poster) {
                await conn.sendMessage(m.chat, { image: { url: res.poster }, caption: cap }, { quoted: m });
            } else {
                await m.reply(cap);
            }
            await m.react('✅');
        }

        // ==================== [ WINBU DOWNLOAD ] ====================
        else if (cmd === 'wbdl') {
            if (!text || !text.includes('winbu.net')) {
                return m.reply(`┌˚₊ ๑│ ᴡ ɪ ɴ ʙ ᴜ  ᴅ ᴏ ᴡ ɴ ʟ ᴏ ᴀ ᴅ │๑˚₊ 📥\n┇ \n│ ❌ Masukkan URL anime dari Winbu!\n│ \n│ *Contoh:*\n│ ${usedPrefix + command} https://winbu.net/film/...\n┇ \n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`);
            }

            await m.react('⏳');
            const { data } = await axios.get(`https://api.theresav.biz.id/anime/winbu/download?url=${encodeURIComponent(text)}&apikey=${apikey}`);
            
            if (!data.status || !data.result || !data.result.downloads || data.result.downloads.length === 0) {
                return sendError("Gagal mengambil link download atau link tidak tersedia.");
            }

            const res = data.result;
            let cap = `┌˚₊ ๑│ ᴡ ɪ ɴ ʙ ᴜ  ᴅ ᴏ ᴡ ɴ ʟ ᴏ ᴀ ᴅ │๑˚₊ 📥\n┇ \n`;
            cap += `│ 🎬 *Judul:* ${res.judul}\n`;
            
            res.downloads.forEach((dl) => {
                cap += `│ ───────────────\n`;
                cap += `│ 📀 *Resolusi:* ${dl.resolusi}\n`;
                dl.links.forEach((l) => {
                    cap += `│ ⮑ [${l.server}] ${l.url}\n`;
                });
            });
            
            cap += `┇ \n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`;
            await m.reply(cap);
            await m.react('✅');
        }

    } catch (err) {
        console.error('[WINBU API ERROR]', err);
        sendError(err.message || "Internal Server Error");
    }
};

handler.help = ['wbsearch', 'wbschedule', 'wblatest', 'wbdetail', 'wbdl'];
handler.tags = ['anime'];
handler.command = /^(wbsearch|wbschedule|wblatest|wbdetail|wbdl)$/i;
handler.limit = true;

export default handler;