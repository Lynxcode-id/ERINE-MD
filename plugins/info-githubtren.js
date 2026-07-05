/**
 * ───「 FEATURE AUTHOR 」────
 * 👤 Author : Lynx Decode
 * 📞 Contact : +62 882-5804-1396
 * 📢 Channel : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * ⚠️ Note : Keep credit to respect the creator!
 * ─────────────────────────
 * 📦 Package - Module : axios
 * 📝 Plugin: GitHub Trending (Info)
 */

import axios from 'axios';

let handler = async (m, { conn, usedPrefix, command }) => {
    await m.react('⏳');
    try {
        const url = 'https://api.kaicloud.my.id/api/info/github-trending';
        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
                'Accept': 'application/json'
            },
            timeout: 15000 
        });

        if (data && data.status && data.result.length > 0) {
            let txt = `┌˚₊ ๑│ ɢ ɪ ᴛ ʜ ᴜ ʙ  ᴛ ʀ ᴇ ɴ ᴅ ɪ ɴ ɢ │๑˚₊ 🚀\n┇ \n`;
            const topTrending = data.result.slice(0, 10);
            
            topTrending.forEach((repo) => {
                txt += `│ 🏆 *Rank:* ${repo.rank}\n│ 📦 *Repo:* ${repo.title}\n│ 🌟 *Stars:* ${repo.stars} | 🍴 *Forks:* ${repo.forks}\n│ 💻 *Language:* ${repo.language || 'Tidak diketahui'}\n│ 📝 *Deskripsi:* ${repo.description ? repo.description : 'Tidak ada deskripsi.'}\n│ 🔗 *Link:* ${repo.link}\n┇ \n`;
            });
            
            txt += `└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`;
            await conn.sendMessage(m.chat, { text: txt }, { quoted: m });
            await m.react('✅');
        } else {
            throw new Error('Gagal mendapatkan data atau hasil kosong dari API.');
        }
    } catch (e) {
        console.error("ERROR GITHUB TRENDING:", e);
        await m.react('❌');
        m.reply(`┌˚₊ ๑│ s ʏ s ᴛ ᴇ ᴍ  ᴇ ʀ ʀ ᴏ ʀ │๑˚₊ ❌\n┇ Terjadi kesalahan:\n┇ ${e.message}\n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`);
    }
};

handler.help = ['githubtrending'];
handler.tags = ['info'];
handler.command = /^(githubtrending|ghtrend|trendinggh)$/i;
handler.limit = true;

export default handler;