/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx Decode
 * ─────────────────────────
 * 📝 Plugin : YouTube Play (Erine-MD)
 */

import axios from 'axios';
import yts from 'yt-search';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        return m.reply(`┌˚₊ ๑│ ᴇ ʀ ɪ ɴ ᴇ  ᴘ ʟ ᴀ ʏ │๑˚₊ 🎵\n┇ \n│ ❌ Kasih tau judul lagunya cuy!\n│ \n│ *Contoh:*\n│ ${usedPrefix + command} pesawat kertas 365 hari\n┇ \n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI X LYNX DECODE`);
    }

    await m.react('⏳');

    try {
        const search = await yts(text);
        const v = search.videos[0];
        
        if (!v) {
            throw new Error('Video tidak ditemukan.');
        }

        let cap = `┌˚₊ ๑│ ᴇ ʀ ɪ ɴ ᴇ  ᴘ ʟ ᴀ ʏ │๑˚₊ 🎵\n┇ \n`;
        cap += `│ 🎬 *Judul:* ${v.title}\n`;
        cap += `│ 👤 *Channel:* ${v.author.name}\n`;
        cap += `│ ⏱️ *Durasi:* ${v.timestamp}\n`;
        cap += `│ 👀 *Views:* ${v.views.toLocaleString('id-ID')}\n`;
        cap += `│ 📅 *Rilis:* ${v.ago}\n┇ \n`;
        cap += `└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI X LYNX DECODE`;

        await conn.sendMessage(m.chat, { 
            image: { url: v.thumbnail },
            caption: cap
        }, { quoted: m });

        const apiUrl = `https://api.theresav.biz.id/download/ytmp3/v5?url=${encodeURIComponent(v.url)}&apikey=x34J0`;
        const { data } = await axios.get(apiUrl);

        let dlUrl = typeof data.result === 'string' ? data.result : data.result?.url;
        if (!dlUrl) {
            throw new Error('Gagal mendapatkan link download dari API server.');
        }

        const resAudio = await axios.get(dlUrl, {
            responseType: 'arraybuffer',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
                'Accept': 'audio/mpeg, audio/mp4, */*'
            }
        });

        const audioBuffer = Buffer.from(resAudio.data);
        const sizeMB = audioBuffer.length / (1024 * 1024);

        if (sizeMB > 50) {
            await conn.sendMessage(m.chat, {
                document: audioBuffer,
                mimetype: 'audio/mpeg',
                fileName: `${v.title}.mp3`
            }, { quoted: m });
        } else {
            await conn.sendMessage(m.chat, {
                audio: audioBuffer,
                mimetype: 'audio/mpeg',
                ptt: false
            }, { quoted: m });
        }

        await m.react('✅');

    } catch (e) {
        console.error('[YT PLAY ERROR]', e);
        await m.react('❌');
        m.reply(`┌˚₊ ๑│ s ʏ s ᴛ ᴇ ᴍ  ᴇ ʀ ʀ ᴏ ʀ │๑˚₊ ❌\n┇ Gagal memutar lagu:\n┇ ${e.message || "Internal Server Error"}\n└˚₊ ๑ ────────────── ๑˚₊`);
    }
}

handler.help = ['play'];
handler.tags = ['downloader'];
handler.command = /^(play)$/i;
handler.limit = true;

export default handler;