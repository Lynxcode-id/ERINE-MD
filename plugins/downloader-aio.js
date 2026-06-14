/**
 * ╭───「 𝗙𝗘𝗔𝗧𝗨𝗥𝗘 𝗔𝗨𝗧𝗛𝗢𝗥 」───
 * │ 👤 Developer : Lynx Decode
 * ╰─────────────────────────
 * 📝 Plugin      : All-In-One (AIO) Downloader
 */

import axios from 'axios';

let handler = async (m, { conn, args, text, usedPrefix, command }) => {
    let input = args[0] || text || m.quoted?.text || '';
    let urlMatch = input.match(/https?:\/\/[^\s]+/i);
    let targetUrl = urlMatch ? urlMatch[0] : null;

    if (!targetUrl) {
        return m.reply(`⚠️ Link tidak valid!\n\n*Contoh:*\n${usedPrefix + command} https://www.instagram.com/p/xxxxxx/`);
    }

    await m.react('⏳');

    try {
        let api = `https://api.theresav.biz.id/download/aio?url=${encodeURIComponent(targetUrl)}&apikey=x34J0`;
        let { data } = await axios.get(api);

        if (!data.status || !data.result) {
            throw new Error('Gagal mengambil data dari server.');
        }

        let res = data.result;
        let medias = res.medias || [];
        
        if (!medias.length) {
            throw new Error('Media tidak ditemukan atau link di-private.');
        }

        let images = medias.filter(m => m.type === 'image' || ['jpg', 'jpeg', 'png', 'webp'].includes(m.ext));
        let videos = medias.filter(m => m.type === 'video' || m.ext === 'mp4');
        let audios = medias.filter(m => m.type === 'audio' || m.ext === 'mp3');

        let title = res.title ? res.title.trim() : 'Tanpa Judul';
        let platform = res.platform ? res.platform.toUpperCase() : 'UNKNOWN';
        
        let introMsg = `*Erine AI - AIO Downloader*\n\n` +
                       `*Platform:* ${platform}\n` +
                       `*Title:* ${title}\n\n` +
                       `_Sedang memproses media..._`;

        await m.reply(introMsg);

        if (images.length > 0) {
            for (let i = 0; i < images.length; i++) {
                await conn.sendMessage(m.chat, { 
                    image: { url: images[i].url } 
                });
            }
            if (audios.length > 0 && platform === 'TIKTOK') {
                await conn.sendMessage(m.chat, { 
                    audio: { url: audios[0].url }, 
                    mimetype: 'audio/mpeg' 
                }, { quoted: m });
            }
        } else if (videos.length > 0) {
            let bestVideo = videos.find(v => v.quality?.includes('hd')) || videos.find(v => !v.quality?.includes('watermark')) || videos[0];
            await conn.sendMessage(m.chat, { 
                video: { url: bestVideo.url }, 
                caption: `Erine AI` 
            }, { quoted: m });
        } else if (audios.length > 0) {
            await conn.sendMessage(m.chat, { 
                audio: { url: audios[0].url }, 
                mimetype: 'audio/mpeg' 
            }, { quoted: m });
        }

        await m.react('✅');

    } catch (e) {
        console.error('[AIO DOWNLOADER ERROR]', e);
        await m.react('❌');
        m.reply(`❌ *Terjadi Kesalahan:*\n> ${e.message}`);
    }
};

handler.help = ['aio <url>', 'dl <url>'];
handler.tags = ['downloader'];
handler.command = /^(aio|dl|download|alldl)$/i;
handler.limit = true;

export default handler;