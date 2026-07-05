/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx Decode
 * ─────────────────────────
 * 📝 Plugin : YouTube Audio Downloader (YTMP3)
 */

import axios from 'axios';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        return m.reply(`┌˚₊ ๑│ ʏ ᴛ  ᴍ ᴘ 𝟹 │๑˚₊ 🎵\n┇ \n│ ❌ Link YouTube-nya mana cuy?\n│ \n│ *Contoh:*\n│ ${usedPrefix + command} https://youtu.be/xxx \n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`);
    }

    let ytUrl = text.trim();
    const ytRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?/i;
    const match = ytUrl.match(ytRegex);
    
    if (!match || !match[1]) {
        return m.reply('❌ Link YouTube tidak valid!');
    }
    
    let cleanUrl = `https://youtu.be/${match[1]}`;

    await m.react('⏳');
    m.reply('⏳ *Processing...*\nSedang mengambil audio dari YouTube.');

    try {
        const apiUrl = `https://api.jerexd.my.id/downloader/ytmp3?apikey=Lynxdecode&url=${encodeURIComponent(cleanUrl)}`; 
        
        const reqHeaders = {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
                'Accept': 'application/json'
            }
        };

        const { data } = await axios.get(apiUrl, reqHeaders);

        if (!data.status) {
            throw new Error(data.message || "API merespon dengan status false.");
        }

        let downloadLink = data.downloadUrl || data.url || (data.result && data.result.downloadUrl);
        
        if (!downloadLink) {
            throw new Error(`Link download tidak ditemukan.\nResponse API: ${JSON.stringify(data)}`);
        }

        let title = data.title || (data.result && data.result.title) || '-';

        let cap = `┌˚₊ ๑│ ʏ ᴛ  ᴅ ᴏ ᴡ ɴ ʟ ᴏ ᴀ ᴅ ᴇ ʀ │๑˚₊ 📥\n┇ \n`;
        cap += `│ 🎬 *Judul:* ${title}\n`;
        cap += `│ 🎧 *Quality:* 128kbps\n┇ \n`;
        cap += `└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`;

        await m.reply(cap);

        await conn.sendMessage(m.chat, { 
            audio: { url: downloadLink }, 
            mimetype: 'audio/mpeg',
            ptt: false 
        }, { quoted: m });

        await m.react('✅');

    } catch (e) {
        console.error('[YTMP3 ERROR]', e);
        await m.react('❌');
        
        let errMsg = e.response?.data?.message || e.message || "Internal Server Error";
        
        m.reply(`┌˚₊ ๑│ s ʏ s ᴛ ᴇ ᴍ  ᴇ ʀ ʀ ᴏ ʀ │๑˚₊ ❌\n┇ Gagal mendownload lagu:\n┇ ${errMsg}\n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`);
    }
}

handler.help = ['ytmp3', 'ytaudio'];
handler.tags = ['downloader'];
handler.command = /^(ytmp3|ytaudio)$/i;
handler.limit = true;

export default handler;