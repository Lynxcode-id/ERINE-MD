/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Author     : Lynx Decode
 * 📞 Contact    : +62 882-5804-1396
 * 📢 Channel    : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * ⚠️ Note       : Keep credit to respect the creator!
 * ─────────────────────────
 * 📝 Plugin: Gacha OTP Checker (Fixed Number Debug)
 */

import axios from 'axios';

let handler = async (m, { conn, args, usedPrefix, command }) => {
    let type = args[0] ? args[0].toLowerCase() : '';

    if (!['number', 'get', 'debug'].includes(type)) {
        return m.reply(`┌˚₊ ๑│ ɢ ᴀ ᴄ ʜ ᴀ  ᴏ ᴛ ᴘ │๑˚₊ 📱\n┇ \n│ 📌 *Format:* \n│ ${usedPrefix + command} number\n│ ${usedPrefix + command} get <jumlah>\n│ ${usedPrefix + command} debug <number/get>\n┇ \n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`);
    }

    await m.react('⏳');

    try {
        let url = type === 'number' || (type === 'debug' && args[1] === 'number') 
            ? 'https://weak-deloris-nothing672434-fe85179d.koyeb.app/api/numbers' 
            : `https://weak-deloris-nothing672434-fe85179d.koyeb.app/api/otps?limit=${args[1] || 5}`;

        const { data } = await axios.get(url, { timeout: 20000 });

        // Debug mode: Kirim JSON mentah
        if (type === 'debug') {
            await conn.sendMessage(m.chat, { text: `DEBUG DATA:\n${JSON.stringify(data, null, 2)}` }, { quoted: m });
            return await m.react('✅');
        }

        if (type === 'number') {
            // Cek apakah data langsung array atau ada di dalam properti
            let list = Array.isArray(data) ? data : data.numbers;
            
            if (list && list.length > 0) {
                let txt = `┌˚₊ ๑│ ᴅ ᴀ ғ ᴛ ᴀ ʀ  ɴ ᴏ ᴍ ᴏ ʀ │๑˚₊ 📱\n┇ \n` + 
                          list.map((n, i) => `│ ${i+1}. ${n.flag || '🏳️'} ${n.country} (+${n.countryCode || '-'}) | 📞 ${n.number}`).join('\n') + 
                          `\n┇ \n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`;
                await conn.sendMessage(m.chat, { text: txt }, { quoted: m });
            } else {
                throw new Error("List nomor kosong (data: " + JSON.stringify(data) + ")");
            }
        } 
        
        else if (type === 'get') {
            if (Array.isArray(data.otps)) {
                let txt = `┌˚₊ ๑│ ᴏ ᴛ ᴘ  ʟ ɪ s ᴛ │๑˚₊ ✉️\n┇ \n` + 
                          data.otps.map(o => `│ 🕒 ${o.time}\n│ 👤 ${o.sender} | 🔑 *${o.otp || 'Link'}*\n│ 📞 +${o.number}\n│ 💬 ${o.message ? o.message.substring(0, 40) : '-'}...\n│ \n`).join('') + 
                          `└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`;
                await conn.sendMessage(m.chat, { text: txt }, { quoted: m });
            } else {
                throw new Error("Data OTP tidak ditemukan.");
            }
        }

        await m.react('✅');
    } catch (e) {
        await m.react('❌');
        m.reply(`❌ *Error:* ${e.message}`);
    }
};

handler.help = ['gachaotp <opsi>'];
handler.tags = ['tools'];
handler.command = /^(gachaotp|otp)$/i;
handler.limit = true;

export default handler;