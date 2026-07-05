/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Author     : Lynx Decode
 * 📞 Contact    : +62 882-5804-1396
 * 📢 Channel    : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * ⚠️ Note       : Keep credit to respect the creator!
 * ─────────────────────────
 * 📝 Plugin: NPM Package Search (Direct API)
 */

import axios from 'axios';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        return m.reply(`┌˚₊ ๑│ ɴ ᴘ ᴍ  s ᴇ ᴀ ʀ ᴄ ʜ │๑˚₊ ⚠️\n┇ \n│ ❌ *Format salah!*\n│ \n│ 📌 *Cara pakai:*\n│ ${usedPrefix + command} <nama package>\n│ \n│ *Contoh:*\n│ ${usedPrefix + command} axios\n┇ \n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`);
    }

    await m.react('⏳');

    try {
        const response = await axios.get('https://api.pixxxry.eu.cc/search/npm', {
            params: {
                q: text,
                limit: 10,
                from: 0
            }
        });

        const data = response.data;

        if (!data?.status || !data?.result?.data) {
            await m.react('❌');
            return m.reply(`┌˚₊ ๑│ s ʏ s ᴛ ᴇ ᴍ  ᴇ ʀ ʀ ᴏ ʀ │๑˚₊ ❌\n┇ Format respons dari server tidak valid cuy.\n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`);
        }

        if (data.result.data.length === 0) {
            await m.react('❌');
            return m.reply(`┌˚₊ ๑│ ɴ ᴘ ᴍ  s ᴇ ᴀ ʀ ᴄ ʜ │๑˚₊ 🔍\n┇ \n│ ❌ Package *${text}* tidak ditemukan di database!\n┇ \n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`);
        }

        let caption = `┌˚₊ ๑│ ɴ ᴘ ᴍ  ʀ ᴇ s ᴜ ʟ ᴛ │๑˚₊ 📦\n┇ \n`;
        caption += `│ 🔍 *Pencarian:* ${text}\n`;
        caption += `│ 📊 *Total Ketemu:* ${data.result.total} packages\n┇ \n`;

        data.result.data.forEach((pkg, index) => {
            caption += `│ *${index + 1}. ${pkg.name}* (v${pkg.version})\n`;
            caption += `│ 📝 ${pkg.description || 'Tidak ada deskripsi'}\n`;
            caption += `│ 🔗 ${pkg.links.npm}\n`;
            caption += `┇ \n`;
        });

        caption += `└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`;

        await conn.sendMessage(m.chat, {
            text: caption,
            contextInfo: {
                isForwarded: true,
                forwardingScore: 9999,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: "120363400612665352@newsletter",
                    newsletterName: "🔥 𝙴𝚁𝙸𝙽𝙴-𝙰𝙸 𝙸𝙽𝙵𝙾𝚁𝙼𝙰𝚃𝙸𝙾𝙽",
                    serverMessageId: -1
                }
            }
        }, { quoted: m });

        await m.react('✅');

    } catch (error) {
        console.error('[NPM SEARCH ERROR]', error);
        await m.react('❌');
        m.reply(`┌˚₊ ๑│ s ʏ s ᴛ ᴇ ᴍ  ᴇ ʀ ʀ ᴏ ʀ │๑˚₊ ❌\n┇ Terjadi kesalahan sistem saat memproses API.\n┇ *Detail:* ${error.message || String(error)}\n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`);
    }
};

handler.help = ['npm <query>', 'npmsearch <query>'];
handler.tags = ['tools'];
handler.command = /^(npm|npmsearch|carinpm)$/i;

export default handler;