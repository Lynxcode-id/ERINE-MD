/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx Decode
 * 📞 WhatsApp  : +62 882-5804-1396
 * 📢 Channel   : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * ⚠️ Note      : Keep credit to respect the creator!
 * ─────────────────────────
 * 📝 Plugin: Instagram Downloader (Nanzz API)
 */

import fetch from 'node-fetch';

let handler = async (m, { conn, text, prefix, command }) => {
    if (!text) {
        return m.reply(`⚠️ *Format Salah!*\n\n*Contoh:* ${prefix + command} https://www.instagram.com/p/xxx/`);
    }

    if (!text.match(/(instagram.com)/gi)) {
        return m.reply(`⚠️ Link tidak valid! Pastikan itu link Instagram cuy.`);
    }

    await m.react('⚡');

    try {
        let apiUrl = `https://api-nanzz.my.id/docs/api/donwloader/Instagram.php?url=${encodeURIComponent(text)}`;
        
        let response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });

        if (!response.ok) {
            throw new Error(`Server API Error: ${response.status} ${response.statusText}`);
        }

        let json = await response.json();

        if (!json.status || !json.result || !json.result.result) {
            throw new Error(`API Error: Postingan tidak ditemukan, akun private, atau link tidak valid.`);
        }

        let data = json.result.result;
        let mediaArr = data.media;

        if (!mediaArr || mediaArr.length === 0) {
            throw new Error('Tidak ada media yang ditemukan pada link tersebut.');
        }

        let caption = `╭━━━ [ *I G  -  D O W N L O A D E R* ]
┣ 👤 *Author - Username:*
┣ @${data.username || 'unknown'}
╰━━━━━━━━━━━━━━━━━━━━━`;

        for (let item of mediaArr) {
            if (item.type === 'video') {
                await conn.sendMessage(m.chat, {
                    video: { url: item.url },
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
            } else if (item.type === 'image') {
                await conn.sendMessage(m.chat, {
                    image: { url: item.url },
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
            }
        }

        await m.react('✅');

    } catch (err) {
        console.error(`Error ${command} Cuy:`, err.message);
        await m.react('❌');
        m.reply(`❌ *Gagal memproses postingan.*\n\n*Log:* ${err.message}`);
    }
};

handler.help = ['ig <url>', 'igdl <url>'];
handler.tags = ['downloader'];
handler.command = /^(ig|igdl|instagram|igreels)$/i;
handler.limit = true;

export default handler;