/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx Decode
 * ─────────────────────────
 * 📝 Plugin : TikTok Stalker
 */

import tiktokStalk from '../scrape/tiktok-stalk2.js';

let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) {
        return m.reply(`┌˚₊ ๑│ ᴛ ɪ ᴋ ᴛ ᴏ ᴋ  s ᴛ ᴀ ʟ ᴋ │๑˚₊ 🔍\n┇ \n│ ❌ Masukkan username TikTok yang mau di-stalk!\n│ \n│ *Contoh:*\n│ ${usedPrefix + command} jkt48.freya\n┇ \n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`);
    }

    let username = args[0].replace(/^@/, '');

    await m.react('⏳');

    try {
        let res = await tiktokStalk(username);
        
        if (!res.success || !res.data.username) {
            throw new Error(res.error || "User tidak ditemukan atau server sedang gangguan.");
        }

        let db = res.data;
        let txt = `┌˚₊ ๑│ ᴛ ɪ ᴋ ᴛ ᴏ ᴋ  ᴘ ʀ ᴏ ꜰ ɪ ʟ ᴇ │๑˚₊ 👤\n┇ \n`;
        txt += `│ 📛 *Nama:* ${db.fullname} \n`;
        txt += `│ 👤 *Username:* @${db.username}\n`;
        txt += `│ 🆔 *User ID:* ${db.user_id}\n`;
        txt += `│ 🌍 *Region:* ${db.region}\n┇ \n`;
        txt += `│ 👥 *Followers:* ${db.followers.toLocaleString()}\n`;
        txt += `│ 🫂 *Following:* ${db.following.toLocaleString()}\n`;
        txt += `│ ❤️ *Likes:* ${db.likes}\n`;
        txt += `│ 🎥 *Videos:* ${db.videos.toLocaleString()}\n┇ \n`;
        txt += `│ 📝 *Bio:* \n│ ${db.bio ? db.bio : 'Tidak ada bio.'}\n┇ \n`;
        txt += `└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`;

        if (db.profile_picture) {
            await conn.sendMessage(m.chat, { 
                image: { url: db.profile_picture }, 
                caption: txt 
            }, { quoted: m });
        } else {
            await m.reply(txt);
        }

        await m.react('✅');
    } catch (e) {
        console.error('[TIKTOK STALK ERROR]', e);
        await m.react('❌');
        m.reply(`┌˚₊ ๑│ s ʏ s ᴛ ᴇ ᴍ  ᴇ ʀ ʀ ᴏ ʀ │๑˚₊ ❌\n┇ \n│ ⚠️ Gagal mencari profil TikTok.\n│ 💬 Log: ${e.message}\n┇ \n└˚₊ ๑ ────────────── ๑˚₊`);
    }
}

handler.help = ['ttstalk2 <username>', 'tiktokstalk2'];
handler.tags = ['stalker'];
handler.command = /^(ttstalk2|tiktokstalk2)$/i;
handler.limit = true;

export default handler;