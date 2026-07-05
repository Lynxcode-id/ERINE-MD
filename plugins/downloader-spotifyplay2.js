/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx Decode
 * 📞 WhatsApp  : +62 882-5804-1396
 * 📢 Channel   : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * ⚠️ Note      : Keep credit to respect the creator!
 * ─────────────────────────
 * 📝 Plugin: Music Downloader (Azbry API)
 */

import fetch from 'node-fetch';

let handler = async (m, { conn, text, prefix, command }) => {
    if (!text) {
        return m.reply(`⚠️ *Format Salah!*\n\n*Contoh:* ${prefix + command} multo cup of joe`);
    }

    await m.react('⚡');

    try {
        let apiUrl = `https://api.azbry.com/api/download/spoplay?q=${encodeURIComponent(text)}`;
        
        let response = await fetch(apiUrl, { method: 'GET' });

        if (!response.ok) {
            throw new Error(`Server API Error: ${response.status} ${response.statusText}`);
        }

        let json = await response.json();
        
        if (!json.status || !json.result) {
            throw new Error(`API Error: Lagu tidak ditemukan atau limit.`);
        }

        let data = json.result;
        let audioUrl = data.rawLink || data.downloadLink;

        if (!audioUrl) throw new Error('Link audio tidak ditemukan di respon JSON.');

        let durationMin = Math.floor(data.duration / 60);
        let durationSec = (data.duration % 60).toString().padStart(2, '0');

        let caption = `╭━━━ [ *M U S I C  -  P L A Y* ] ━━━💠
┣ 🎵 *Judul:* ${data.title || '-'}
┣ 👤 *Artist:* ${data.artist || '-'}
┣ 💿 *Album:* ${data.album || '-'}
┣ ⏱️ *Durasi:* ${durationMin}:${durationSec}
╰━━━━━━━━━━━━━━━━━━━━━━💠

> ⚡ _Audio sedang dikirim, harap tunggu sebentar..._`;

        await conn.sendMessage(m.chat, { 
            image: { url: data.cover },
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

        let audioRes = await fetch(audioUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });
        
        if (!audioRes.ok) throw new Error(`Gagal download audio dari CDN: Status ${audioRes.status}`);
        
        let audioBuffer = await audioRes.buffer();

        await conn.sendMessage(m.chat, { 
            audio: audioBuffer, 
            mimetype: 'audio/mpeg', 
            ptt: false,
            fileName: `${data.title} - ${data.artist}.mp3`
        }, { quoted: m });

        await m.react('✅');

    } catch (err) {
        console.error(`Error ${command} Cuy:`, err.message);
        await m.react('❌');
        m.reply(`❌ *Gagal memproses lagu.*\n\n*Log:* ${err.message}`);
    }
};

handler.help = ['play <judul>'];
handler.tags = ['downloader'];
handler.command = /^(splay2|spotifyplay2)$/i;
handler.limit = true;

export default handler;