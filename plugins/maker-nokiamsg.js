/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx Decode
 * 📞 WhatsApp  : +62 882-5804-1396
 * 📢 Channel   : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * ⚠️ Note      : Keep credit to respect the creator!
 * ─────────────────────────
 * 📝 Plugin: Nokia Message Maker
 */

import axios from 'axios';

let handler = async (m, { conn, text, prefix, command }) => {
    if (!text || !text.includes('|')) {
        return m.reply(`⚠️ *Format Salah!*\n\n*Contoh:* ${prefix + command} Halo apa kabar | Crush`);
    }

    let [pesan, pengirim] = text.split('|').map(v => v.trim());

    if (!pesan || !pengirim) {
        return m.reply(`⚠️ Pastikan teks dan pengirim sudah diisi dengan benar.\n\n*Contoh:* ${prefix + command} Halo apa kabar | Crush`);
    }

    await m.react('⚡');

    try {
        const apiUrl = `https://api-nanzz.my.id/docs/api/maker/nokia-msg.php?text=${encodeURIComponent(pesan)}&sender=${encodeURIComponent(pengirim)}`;
        
        let res = await axios.get(apiUrl, { responseType: 'arraybuffer' });
        let resultBuffer = Buffer.from(res.data);

        await conn.sendMessage(m.chat, {
            image: resultBuffer,
            caption: `📱 *N O K I A   M E S S A G E*\n\nPesan dari *${pengirim}* berhasil dibuat 😋`
        }, { quoted: m });

        await m.react('✅');

    } catch (err) {
        console.error("Error Nokia Msg:", err.message);
        await m.react('❌');
        m.reply(`❌ *Gagal memproses gambar.*\nError: ${err.message}`);
    }
};

handler.help = ['nokiamsg <teks|pengirim>'];
handler.tags = ['maker'];
handler.command = /^(nokiamsg|msgnokia)$/i;
handler.limit = true;

export default handler;