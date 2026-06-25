/**
 * ╭───「 𝗙𝗘𝗔𝗧𝗨𝗥𝗘 𝗔𝗨𝗧𝗛𝗢𝗥 」───
 * │ 👤 Developer : INF Team's x Lynx Decode
 * ╰─────────────────────────
 * 📝 Plugin      : Random JKT48 Music (Fixed)
 */

import fetch from 'node-fetch';

const handler = async (m, { conn }) => {
    await m.react('⏳');

    try {
        // Fetch ke endpoint API
        const res = await fetch(`https://api.synoxcloud.biz.id/random/jkt48-Music`);
        
        // Kita cek responnya dulu. Kalau JSON, kita ambil URL-nya.
        // Tapi kalau langsung file, kita tangkap lewat response-nya.
        const contentType = res.headers.get('content-type');
        let audioUrl;

        if (contentType && contentType.includes('application/json')) {
            const json = await res.json();
            audioUrl = json.url;
        } else {
            // Kalau API-nya brengsek (langsung redirect ke blob/url file)
            audioUrl = res.url;
        }

        if (!audioUrl) throw new Error("Gagal mendapatkan URL audio.");

        await conn.sendMessage(m.chat, { 
            audio: { url: audioUrl }, 
            mimetype: 'audio/mpeg',
            ptt: true,
            contextInfo: {
                externalAdReply: {
                    title: 'JKT48 Music',
                    body: '© Erine-MD',
                    thumbnailUrl: 'https://i.ibb.co/1s8T3sY/48f7ce63c7aa.jpg',
                    sourceUrl: 'https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i',
                    mediaType: 1
                }
            }
        }, { quoted: m });

        await m.react('✅');

    } catch (error) {
        console.error('[JKT48 MUSIC ERROR]', error);
        await m.react('❌');
        m.reply(`┌˚₊ ๑│ s ʏ s ᴛ ᴇ ᴍ  ᴇ ʀ ʀ ᴏ ʀ │๑˚₊ ❌\n┇ Gagal mengambil lagu:\n┇ ${error.message}\n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`);
    }
};

handler.help = ['jkt48music'];
handler.tags = ['fun'];
handler.command = /^(jkt48music|jkt48song)$/i;
handler.limit = true;

export default handler;