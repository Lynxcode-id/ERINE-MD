/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx Decode
 * 📞 WhatsApp  : +62 882-5804-1396
 * 📢 Channel   : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * ⚠️ Note      : Keep credit to respect the creator!
 * ─────────────────────────
 */

import fetch from 'node-fetch';
import axios from 'axios';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        return m.reply(`❌ Kasih tau judul lagunya dong!\n\n*Contoh:* ${usedPrefix || '.'}${command} pesawat kertas 365 hari`);
    }

    await m.react('⏳');

    try {
        let apiUrl = `https://api.azbry.com/api/download/ytplay2?q=${encodeURIComponent(text)}`;
        let response = await fetch(apiUrl, { method: 'GET' });
        let json = await response.json();

        if (!json.status || !json.result) {
            throw new Error('Lagu tidak ditemukan atau API sedang bermasalah.');
        }

        let res = json.result;

        let caption = `╭───「 𝙴𝚁𝙸𝙽𝙴 𝙿𝙻𝙰𝚈 𝙴𝙽𝙶𝙸𝙽𝙴 」
│ 
│  🎤 𝐉𝐮𝐝𝐮𝐥   : ${res.title}
│  🌟 𝐂𝐡𝐚𝐧𝐧𝐞𝐥 : ${res.channel}
│  ⏱️ 𝐃𝐮𝐫𝐚𝐬𝐢  : ${res.duration}
│
╰──────────────────────────
🎧 _Sedang menyiapkan audionya, tunggu sebentar ya..._`.trim();

        let buttons = [
            { buttonId: `.ytmp4 ${res.url}`, buttonText: { displayText: '🎬 Lihat Performance (MP4)' }, type: 1 }
        ];

        await conn.sendMessage(m.chat, {
            image: { url: res.thumbnail },
            caption: caption,
            buttons: buttons,
            headerType: 4,
            contextInfo: {
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: "120363400612665352@newsletter",
                    newsletterName: "🌟 ᴇʀɪɴᴇ-ᴍᴅ ɪɴғᴏʀᴍᴀᴛɪᴏɴ",
                    serverMessageId: -1
                }
            }
        }, { quoted: m });

        if (!res.download) throw new Error('Link audio tidak ditemukan di respon JSON.');

        let audioRes = await axios.get(res.download, {
            responseType: 'arraybuffer',
            headers: { 
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });

        let audioBuffer = Buffer.from(audioRes.data);
        let sizeMB = audioBuffer.length / (1024 * 1024);

        if (sizeMB < 0.5) {
            throw new Error('Audio gagal diunduh atau file corrupt dari API server.');
        }

        let mimeType = audioRes.headers['content-type'] || 'audio/mpeg';
        let finalMime = mimeType.includes('mp4') || mimeType.includes('aac') ? 'audio/mp4' : 'audio/mpeg';
        let ext = finalMime === 'audio/mp4' ? 'm4a' : 'mp3';

        if (sizeMB > 50) {
            await conn.sendMessage(m.chat, {
                document: audioBuffer,
                mimetype: finalMime,
                fileName: `${res.title}.${ext}`
            }, { quoted: m });
        } else {
            await conn.sendMessage(m.chat, {
                audio: audioBuffer,
                mimetype: finalMime,
                fileName: `${res.title}.${ext}`
            }, { quoted: m });
        }

        await m.react('✅');

    } catch (e) {
        console.error(`[YT PLAY ERROR]`, e.message || e);
        await m.react('❌');
        m.reply(`⚠️ *System Error:*\n_${e.message || e}_`);
    }
};

handler.help = ['play <judul>'];
handler.tags = ['downloader'];
handler.command = /^play$/i;
handler.limit = true;

export default handler;
