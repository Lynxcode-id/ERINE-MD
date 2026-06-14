/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx Decode
 * 📞 WhatsApp  : +62 882-5804-1396
 * 📢 Channel   : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * ⚠️ Note      : Keep credit to respect the creator!
 * ─────────────────────────
 * 📝 Plugin: Image Enhancer (Azbry API)
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

        const apiUrl = `https://api.azbry.com/api/tools/ihancer?url=${encodeURIComponent(imageUrl)}`;
        
        let apiRes = await axios.get(apiUrl, { responseType: 'arraybuffer' });
        let resultBuffer;
        let contentType = apiRes.headers['content-type'];
        
        if (contentType && contentType.includes('application/json')) {
            let json = JSON.parse(apiRes.data.toString('utf-8'));
            let finalUrl = json.result || json.url || json.data; 
            
            if (!finalUrl) throw new Error('URL hasil HD tidak ditemukan di respon JSON');
            
            let imgRes = await axios.get(finalUrl, { responseType: 'arraybuffer' });
            resultBuffer = Buffer.from(imgRes.data);
        } else {
            resultBuffer = Buffer.from(apiRes.data);
        }
        
        await conn.sendMessage(m.chat, {
            image: resultBuffer,
            caption: `✨ *Proses Selesai!*\n\nGambar lu udah berhasil di-enhance jadi lebih jernih 😋`
        }, { quoted: m });

        await m.react('✅');

    } catch (err) {
        console.error("Error Ihancer Cuy:", err.message);
        await m.react('❌');
        m.reply(`❌ *Gagal memproses gambar.*\nError: ${err.message}`);
    }
};

handler.help = ['ihancer', 'remini'];
handler.tags = ['tools'];
handler.command = /^(remini|ihancer|hd5)$/i;
handler.limit = true;

export default handler;