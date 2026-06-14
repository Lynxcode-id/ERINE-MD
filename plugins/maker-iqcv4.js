/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx Decode
 * 📞 WhatsApp  : +62 882-5804-1396
 * 📢 Channel   : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * ⚠️ Note      : Keep credit to respect the creator!
 * ─────────────────────────
 * 📝 Plugin : Fake Chat Quote Image (IQC Gambar Fix)
 */

import uploadImage from '../lib/uploadImage.js';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || '';

    if (!mime.startsWith('image/')) {
        return m.reply(`❌ Kirim atau balas gambar dengan caption *${usedPrefix + command} <teks untuk dichat>*`);
    }

    let chatText = text || (m.quoted && m.quoted.text ? m.quoted.text : '');
    
    if (!chatText) {
        return m.reply(`❌ Teksnya mana cuy? Masukkan teks setelah command atau reply pesan teks.\n\n*Contoh:*\n${usedPrefix + command} Halo dunia!`);
    }

    await m.react('⏳');

    try {
        let media = await q.download();
        if (!media) throw new Error('Gagal mendownload gambar.');

        let imageUrl = await uploadImage(media);
        if (!imageUrl) throw new Error('Gagal mengupload gambar ke hoster.');

        let battery = Math.floor(Math.random() * 100) + 1;
        let signal = Math.floor(Math.random() * 4) + 1;
        let carriers = ['Telkomsel', 'XL', 'Indosat', 'Tri', 'Smartfren'];
        let carrier = carriers[Math.floor(Math.random() * carriers.length)];

        const apiUrl = `https://api-nanzz.my.id/docs/api/maker/iqc-gambar.php?text=${encodeURIComponent(chatText)}&url=${encodeURIComponent(imageUrl)}&carrier=${encodeURIComponent(carrier)}&battery=${battery}&signal=${signal}&sender=other&read=false`;

        await conn.sendMessage(m.chat, {
            image: { url: apiUrl },
            caption: `> © ERINE-MD`
        }, { quoted: m });

        await m.react('✅');
    } catch (error) {
        console.error('[IQC GAMBAR ERROR]', error);
        await m.react('❌');
        m.reply(`❌ Gagal membuat gambar IQC.\n> *Detail:* ${error.message || error}`);
    }
};

handler.help = ['iqcv4 <gambar & teks>'];
handler.tags = ['maker'];
handler.command = /^iqcv4$/i;
handler.limit = true;

export default handler;