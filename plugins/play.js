/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx Decode
 * ─────────────────────────
 * 📝 Plugin : YouTube Play (Erine-MD)
 * 🔄 Update : API diganti ke sistem Task ID (Anabot)
 */

import axios from 'axios';
import yts from 'yt-search';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

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

        const submitUrl = `https://anabot.my.id/api/download/ytmp3?url=${encodeURIComponent(v.url)}&apikey=freeApikey`;
        const submitRes = await axios.get(submitUrl, {
            headers: { 'accept': 'application/json' }
        });

        if (!submitRes.data?.success || !submitRes.data?.data?.taskId) {
            throw new Error('Gagal mendapatkan Task ID dari server.');
        }

        const taskId = submitRes.data.data.taskId;
        let audioUrl = null;
        let mimeTypeToUse = 'audio/mp4'; 
        
        let attempts = 0;
        const maxAttempts = 15;
        
        while (attempts < maxAttempts) {
            await delay(3000);
            
            const statusUrl = `https://anabot.my.id/api/download/status?id=${taskId}`;
            const statusRes = await axios.get(statusUrl, {
                headers: { 'accept': 'application/json' }
            });

            const statusData = statusRes.data;

            if (statusData.status === 'completed' && statusData.data?.urls) {
                audioUrl = statusData.data.urls;
                if (statusData.data.mimetype) mimeTypeToUse = statusData.data.mimetype;
                break;
            } else if (statusData.status === 'failed' || statusData.status === 'error') {
                throw new Error('Server gagal memproses konversi video ini.');
            }
            
            attempts++;
        }

        if (!audioUrl) {
            throw new Error('Waktu tunggu habis. Server terlalu sibuk memproses audio ini.');
        }

        const audioRes = await axios.get(audioUrl, {
            responseType: 'arraybuffer',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'audio/mpeg, audio/mp4, */*'
            }
        });

        const audioBuffer = Buffer.from(audioRes.data);
        const sizeMB = audioBuffer.length / (1024 * 1024);

        if (sizeMB > 50) {
            await conn.sendMessage(m.chat, {
                document: audioBuffer,
                mimetype: mimeTypeToUse,
                fileName: `${v.title}.mp3`
            }, { quoted: m });
        } else {
            await conn.sendMessage(m.chat, {
                audio: audioBuffer,
                mimetype: mimeTypeToUse,
                ptt: false
            }, { quoted: m });
        }

        await m.react('✅');

    } catch (e) {
        console.error('[YT PLAY ERROR]', e);
        await m.react('❌');
        m.reply(`┌˚₊ ๑│ s ʏ s ᴛ ᴇ ᴍ  ᴇ ʀ ʀ ᴏ ʀ │๑˚₊ ❌\n┇ Gagal memutar lagu:\n┇ ${e.message || "Internal Server Error"}\n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`);
    }
}

handler.help = ['play']
handler.tags = ['downloader']
handler.command = /^(play)$/i
handler.limit = true

export default handler