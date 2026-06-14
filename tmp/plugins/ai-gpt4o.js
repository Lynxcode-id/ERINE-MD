/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx Decode
 * 📞 WhatsApp  : +62 882-5804-1396
 * 📢 Channel   : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * ⚠️ Note      : Keep credit to respect the creator!
 * ─────────────────────────
 * 📝 Plugin: GPT 4o Mini (LexCode API) Multimodal
 */

import axios from 'axios';
import uploadImage from '../lib/uploadImage.js';

let handler = async (m, { conn, text, prefix, command }) => {
    if (!text) {
        return m.reply(`⚠️ *Format Salah!*\n\n*Contoh:* ${prefix + command} halo\n_Bisa juga sambil reply/kirim gambar!_`);
    }

    await m.react('⚡');

    try {
        let q = m.quoted ? m.quoted : m;
        let mime = (q.msg || q).mimetype || '';
        let imgUrlParam = '';

        // Kalau user ngirim atau ngerespon gambar, upload dulu
        if (mime.includes('image')) {
            let imageBuffer = await q.download();
            let catboxUrl = await uploadImage(imageBuffer);
            
            if (!catboxUrl) throw new Error('Gagal mengupload gambar ke server.');
            
            imgUrlParam = `&imgUrl=${encodeURIComponent(catboxUrl)}`;
        }

        let apiUrl = `https://api.lexcode.biz.id/api/ai/gpt/4o-mini?text=${encodeURIComponent(text)}${imgUrlParam}`;
        
        let res = await axios.get(apiUrl);

        if (!res.data || !res.data.success) {
            throw new Error(`API Error: ${res.data?.message || 'Gagal merespon dari server LexCode'}`);
        }

        let answer = res.data.result?.answer;

        if (!answer) {
            throw new Error(`Struktur JSON berubah!`);
        }

        await m.reply(answer);
        await m.react('✅');

    } catch (err) {
        console.error(`Error ${command} Cuy:`, err.message);
        await m.react('❌');
        m.reply(`❌ *Gagal memproses AI.*\n\n*Log:* ${err.message}`);
    }
};

handler.help = ['gpt4omini <teks>'];
handler.tags = ['ai'];
handler.command = /^(gpt4omini|gpt4o|4omini|ai4o)$/i;
handler.limit = true;

export default handler;