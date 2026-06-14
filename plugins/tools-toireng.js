/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx Decode
 * 📞 WhatsApp  : +62 882-5804-1396
 * 📢 Channel   : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * ⚠️ Note      : Keep credit to respect the creator!
 * ─────────────────────────
 * 📝 Plugin: AI Toireng Filter
 */

import axios from 'axios';
import uploadImage from '../lib/uploadImage.js';

let handler = async (m, { conn, command, prefix }) => {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || '';
    
    if (!mime.includes('image')) {
        return m.reply(`⚠️ Kirim atau balas gambar dengan caption *${prefix + command}*`);
    }

    await m.react('⚡');

    try {
        let imageBuffer = await q.download();
        let imageUrl = await uploadImage(imageBuffer);
        
        if (!imageUrl) throw new Error('Gagal mengupload gambar ke server sementara.');

        const apiUrl = `https://v2.api-varhad.my.id/ai/toireng?imgUrl=${encodeURIComponent(imageUrl)}`;
        
        let res = await axios.get(apiUrl, { headers: { 'Accept': 'application/json' } });
        
        if (!res.data || !res.data.status || !res.data.result) {
            throw new Error('Gagal mendapatkan respon valid dari API.');
        }

        let finalUrl = res.data.result;
        
        await conn.sendMessage(m.chat, {
            image: { url: finalUrl },
            caption: `✨ *Proses Selesai!*\n\nFilter Toireng berhasil diterapkan 😋`
        }, { quoted: m });

        await m.react('✅');

    } catch (err) {
        console.error("Error Toireng Cuy:", err.message);
        await m.react('❌');
        m.reply(`❌ *Gagal memproses gambar.*\nError: ${err.message}`);
    }
};

handler.help = ['toireng'];
handler.tags = ['tools'];
handler.command = /^(toireng)$/i;
handler.limit = true;

export default handler;