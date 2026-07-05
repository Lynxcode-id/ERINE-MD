/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx Decode
 * 📞 WhatsApp  : +62 882-5804-1396
 * 📢 Channel   : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * ⚠️ Note      : Keep credit to respect the creator!
 * ─────────────────────────
 * 📝 Plugin: Fake Saldo OVO
 */

import axios from 'axios';

let handler = async (m, { conn, text, prefix, command }) => {
    if (!text) {
        return m.reply(`⚠️ *Format Salah!*\n\n*Contoh:* ${prefix + command} 1.000.000`);
    }

    await m.react('⚡');

    try {
        const apiUrl = `https://api-nanzz.my.id/docs/api/maker/fake-ovo.php?amount=${encodeURIComponent(text)}`;
        
        let res = await axios.get(apiUrl, { responseType: 'arraybuffer' });
        let resultBuffer = Buffer.from(res.data);

        await conn.sendMessage(m.chat, {
            image: resultBuffer,
            caption: `✨ *S Y S T E M   O V O*\n\nBerhasil memanipulasi saldo menjadi *Rp ${text}* 😋`
        }, { quoted: m });

        await m.react('✅');

    } catch (err) {
        console.error("Error Fake OVO:", err.message);
        await m.react('❌');
        m.reply(`❌ *Gagal memproses gambar.*\nError: ${err.message}`);
    }
};

handler.help = ['fakeovo <jumlah>'];
handler.tags = ['maker'];
handler.command = /^(fakeovo|ovofake)$/i;
handler.limit = true;

export default handler;