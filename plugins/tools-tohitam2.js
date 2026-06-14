/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx Decode
 * 📞 WhatsApp  : +62 882-5804-1396
 * 📢 Channel   : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * ⚠️ Note      : Keep credit to respect the creator!
 * ─────────────────────────
 * 📝 Plugin: Tohitam Filter
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

        const apiUrl = `https://api-faa.my.id/faa/tohitam?url=${encodeURIComponent(imageUrl)}`;
        
        let apiRes = await axios.get(apiUrl, { responseType: 'arraybuffer' });
        let resultBuffer;
        let contentType = apiRes.headers['content-type'];
        
        // Handle jika API balikin JSON atau langsung buffer gambar
        if (contentType && contentType.includes('application/json')) {
            let json = JSON.parse(apiRes.data.toString('utf-8'));
            let finalUrl = json.result || json.url || json.data; 
            
            if (!finalUrl) throw new Error('URL hasil gambar tidak ditemukan di respon JSON');
            
            let imgRes = await axios.get(finalUrl, { responseType: 'arraybuffer' });
            resultBuffer = Buffer.from(imgRes.data);
        } else {
            resultBuffer = Buffer.from(apiRes.data);
        }
        
        await conn.sendMessage(m.chat, {
            image: resultBuffer,
            caption: `✨ *Proses Selesai!*\n\nFilter Tohitam berhasil diterapkan 😋`
        }, { quoted: m });

        await m.react('✅');

    } catch (err) {
        console.error("Error Tohitam Cuy:", err.message);
        await m.react('❌');
        m.reply(`❌ *Gagal memproses gambar.*\nError: ${err.message}`);
    }
};

handler.help = ['tohitam2'];
handler.tags = ['tools'];
handler.command = /^(tohitam2)$/i;
handler.limit = true;

export default handler;