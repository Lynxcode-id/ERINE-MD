/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx Decode
 * 📞 WhatsApp  : +62 882-5804-1396
 * 📢 Channel   : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * ⚠️ Note      : Keep credit to respect the creator!
 * ─────────────────────────
 */

import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text || !text.includes('|')) {
        return m.reply(`Teksnya mana cuy? Harus pakai pemisah *|* ya.\n\n💡 *Contoh:* ${usedPrefix + command} X di Matematika | X di Bahasa Inggris`);
    }

    let [text1, text2] = text.split('|').map(v => v.trim());

    if (!text1 || !text2) {
        return m.reply(`Harus diisi kedua teksnya cuy!\n\n💡 *Contoh:* ${usedPrefix + command} Kopi Hitam | Es Matcha Boba`);
    }

    await m.reply('⏳ *Processing Doge vs Cheems Meme...*');

    try {
        let apiUrl = `https://api.cuki.biz.id/api/canvas/meme/dogecheems?apikey=cuki-x&text1=${encodeURIComponent(text1)}&text2=${encodeURIComponent(text2)}`;
        
        await conn.sendMessage(m.chat, {
            image: { url: apiUrl },
            caption: `🐕 *Doge vs Cheems:* Done ya cuy!`
        }, { quoted: m });

    } catch (e) {
        console.error(e);
        m.reply(`❌ *Terjadi kesalahan:* API sedang down atau error.\n\n_Log: ${e.message}_`);
    }
}

handler.help = ['doge <teks1> | <teks2>'];
handler.tags = ['maker', 'fun'];
handler.command = /^(dogecheems|doge|cheems)$/i;
handler.limit = true;

export default handler;