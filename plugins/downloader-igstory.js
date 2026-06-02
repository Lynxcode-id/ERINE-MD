/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx Decode
 * 📞 WhatsApp  : +62 882-5804-1396
 * 📢 Channel   : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * ⚠️ Note      : Keep credit to respect the creator!
 * ─────────────────────────
 * 📝 Plugin: Instagram Story Downloader (Nanzz API)
 */

import fetch from 'node-fetch';

let handler = async (m, { conn, text, prefix, command }) => {
    if (!text) {
        return m.reply(`⚠️ *Format Salah!*\n\n*Contoh:* ${prefix + command} https://www.instagram.com/stories/jkt48.oline/3910587653142251289`);
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
            throw new Error(`API Error: Story tidak ditemukan, private, atau link tidak valid.`);
        }

        let data = json.result.result;
        let mediaArr = data.media;

        if (!mediaArr || mediaArr.length === 0) {
            throw new Error('Tidak ada media yang ditemukan pada story tersebut.');
        }

        let caption = `╭━━━ [ *I G  -  S T O R Y* ] ━━━💠
┣ 👤 *Username:* @${data.username || 'unknown'}
╰━━━━━━━━━━━━━━━━━━━━━━💠`;

        // Loop buat ngirim semua media kalau misalnya ada lebih dari 1 slide dalam 1 request
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
        m.reply(`❌ *Gagal memproses Story.*\n\n*Log:* ${err.message}`);
    }
};

handler.help = ['igstory <url>'];
handler.tags = ['downloader'];
handler.command = /^(igstory|storyig)$/i;
handler.limit = true;

export default handler;