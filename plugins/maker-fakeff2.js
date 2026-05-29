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
    if (!text) return m.reply(`Masukkan nickname Free Fire yang mau dibikin cuy!\n\n💡 *Contoh:* ${usedPrefix + command} Lynx`);

    await m.react('⏳');

    try {
        let url = `https://api-xemoz-official.my.id/api/maker/fake-epep.php?nickname=${encodeURIComponent(text)}`;
        
        let res = await fetch(url);
        if (!res.ok) throw new Error('API Error');
        
        let buffer = Buffer.from(await res.arrayBuffer());

        await conn.sendMessage(m.chat, {
            image: buffer,
            caption: `🎮 *FAKE EPEP MAKER*\n👤 *Nickname:* ${text}\n\n_© Erine-MD | INF PROJECT_`
        }, { quoted: m });

        await m.react('✅');
    } catch (e) {
        console.error(e);
        await m.react('❌');
        m.reply('❌ Gagal membuat gambar. Server API mungkin sedang down.');
    }
}

handler.help = ['fakeff2 <nickname>'];
handler.tags = ['maker', 'fun'];
handler.command = /^fakeff2$/i;
handler.limit = true;

export default handler;