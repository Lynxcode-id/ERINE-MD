import axios from 'axios';
import uploadImage from '../lib/uploadImage.js';
const handler = async (m, { conn, command, prefix }) => {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || '';
    
    if (!mime.includes('image')) {
        return m.reply(`⚠️ Kirim atau balas gambar dengan caption *${prefix + command}*`);
    }

    await conn.sendMessage(m.chat, { react: { text: '⚡', key: m.key } });

    try {
        let imageBuffer = await q.download();
        let imageUrl = await uploadImage(imageBuffer);
        
        if (!imageUrl) throw new Error('Gagal mengupload gambar.');

        const apiUrl = `https://api-varhad.my.id/tools/hd?imageUrl=${encodeURIComponent(imageUrl)}`;
        
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
            caption: `✨ *Proses Selesai!*\n\nGambar lu udah berhasil,Silahkan di simpan 😋`
        }, { quoted: m });

        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

    } catch (err) {
        console.error("Error Cuy:", err.message);
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
        m.reply(`❌ *Gagal memproses gambar.*\nError: ${err.message}`);
    }
};

handler.help = ['hd'];
handler.tags = ['tools'];
handler.command = /^(hd)$/i;

export default handler;