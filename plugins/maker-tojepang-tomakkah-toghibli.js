/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx Decode
 * 📞 WhatsApp  : +62 882-5804-1396
 * ⚠️ Note      : Keep credit to respect the creator!
 * ─────────────────────────
 */

import axios from 'axios';
import FormData from 'form-data';

let handler = async (m, { conn, command, prefix }) => {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || '';
    
    if (!mime.includes('image')) {
        return m.reply(`⚠️ Kirim atau balas gambar dengan caption *${prefix + command}*`);
    }

    await m.react('⚡');

    try {
        let imageBuffer = await q.download();
        let form = new FormData();
        form.append('file', imageBuffer, 'image.jpg');

        let cmd = command.toLowerCase();
        let type = '';
        if (cmd.includes('makkah')) type = 'to-makkah';
        else if (cmd.includes('jepang')) type = 'to-jepang';
        else if (cmd.includes('ghibli')) type = 'to-ghibli';

        const apiUrl = `https://api-nanzz.my.id/docs/api/ai-image/${type}.php`;
        
        let apiRes = await axios.post(apiUrl, form, {
            headers: {
                ...form.getHeaders()
            },
            responseType: 'arraybuffer'
        });
        
        let resultBuffer;
        let contentType = apiRes.headers['content-type'];
        
        if (contentType && contentType.includes('application/json')) {
            let json = JSON.parse(apiRes.data.toString('utf-8'));
            let finalUrl = json.result || json.url || json.data; 
            
            if (!finalUrl) throw new Error('URL hasil gambar tidak ditemukan di respon JSON');
            
            let imgRes = await axios.get(finalUrl, { responseType: 'arraybuffer' });
            resultBuffer = Buffer.from(imgRes.data);
        } else {
            resultBuffer = Buffer.from(apiRes.data);
        }
        
        let styleName = type.split('-')[1].toUpperCase();

        await conn.sendMessage(m.chat, {
            image: resultBuffer,
            caption: `✨ *Proses Selesai!*\n\nStyle ${styleName} berhasil diterapkan 😋`
        }, { quoted: m });

        await m.react('✅');

    } catch (err) {
        console.error(`Error AI Image (${command}):`, err.message);
        await m.react('❌');
        m.reply(`❌ *Gagal memproses gambar.*\nError: ${err.message}`);
    }
};

handler.help = ['tomakkah', 'tojepang', 'toghibli'];
handler.tags = ['ai', 'tools'];
handler.command = /^(tomakkah|tojepang|toghibli)$/i;
handler.limit = true;

export default handler;