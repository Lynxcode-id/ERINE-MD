/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx Decode
 * 📞 WhatsApp  : +62 882-5804-1396
 * 📢 Channel   : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * ⚠️ Note      : Keep credit to respect the creator!
 * ─────────────────────────
 * 📝 Plugin: Spotify Play (Nanzz API)
 */

import axios from 'axios';

let handler = async (m, { conn, text, prefix, command }) => {
    if (!text) {
        return m.reply(`⚠️ *Format Salah!*\n\n*Contoh:* ${prefix + command} a thousand years jvke`);
    }

    await m.react('🎶');

    try {
        const apiUrl = `https://api-nanzz.my.id/docs/api/donwloader/spotify-play.php?q=${encodeURIComponent(text)}`;
        let res = await axios.get(apiUrl);
        
        if (!res.data || !res.data.status || !res.data.result || res.data.result.length === 0) {
            throw new Error('Lagu tidak ditemukan atau API sedang bermasalah.');
        }

        let track = res.data.result[0];
        let durationMin = Math.floor(track.duration_ms / 60000);
        let durationSec = Math.floor((track.duration_ms % 60000) / 1000).toString().padStart(2, '0');

        let caption = `╭━━━ [ *S P O T I F Y   P L A Y* ] ━━━💠
┣ 🎵 *Title:* ${track.title}
┣ 👤 *Artist:* ${track.artist}
┣ ⏱️ *Duration:* ${durationMin}:${durationSec}
┣ 💿 *Quality:* ${track.quality || '128kbps'}
╰━━━━━━━━━━━━━━━━━━━━━━💠

> ⚡ _System is extracting audio, please wait..._`;

        // Kirim Thumbnail + Detail Info
        await conn.sendMessage(m.chat, {
            image: { url: track.thumbnail },
            caption: caption,
            contextInfo: {
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: "120363400612665352@newsletter",
                    newsletterName: "🌟 ᴇʀɪɴᴇ-ᴍᴅ ɪɴғᴏʀᴍᴀᴛɪᴏɴ",
                    serverMessageId: -1
                }
            }
        }, { quoted: m });

        // Fetch buffer audio manual pake axios + User-Agent
        let audioRes = await axios.get(track.download_url, {
            responseType: 'arraybuffer',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });

        let audioBuffer = Buffer.from(audioRes.data);

        // Kirim Audio murni (Bukan Voice Note)
        await conn.sendMessage(m.chat, {
            audio: audioBuffer,
            mimetype: 'audio/mpeg',
            ptt: false,
            fileName: `${track.title} - ${track.artist}.mp3`
        }, { quoted: m });

        await m.react('✅');

    } catch (err) {
        console.error("Error Spotify Play Cuy:", err.message);
        await m.react('❌');
        m.reply(`❌ *Gagal memproses lagu.*\n\n*Log:* ${err.message}`);
    }
};

handler.help = ['spotifyplay <judul>'];
handler.tags = ['downloader'];
handler.command = /^(spotifyplay|playspotify|splay|spplay)$/i;
handler.limit = true;

export default handler;