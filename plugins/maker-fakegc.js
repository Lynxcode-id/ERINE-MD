/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx Decode
 * 📞 WhatsApp  : +62 882-5804-1396
 * 📢 Channel   : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * ⚠️ Note      : Keep credit to respect the creator!
 * ─────────────────────────
 * 📝 Plugin: Fake Group Maker
 */

import axios from 'axios';
import uploadImage from '../lib/uploadImage.js';

let handler = async (m, { conn, text, prefix, command }) => {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || '';
    
    if (!mime.includes('image')) {
        return m.reply(`⚠️ Kirim atau balas gambar dengan format:\n*${prefix + command} nama | member | deskripsi | pembuat | tanggal*\n\n*Contoh:* ${prefix + command} INF Project | 957 | Yattaaa | Lynx | 05/02/26 12:45\n\n_(Catatan: Parameter yang dikosongkan akan diisi otomatis)_`);
    }

    await m.react('⚡');

    try {
        let imageBuffer = await q.download();
        let imageUrl = await uploadImage(imageBuffer);
        
        if (!imageUrl) throw new Error('Gagal mengupload gambar ke server sementara.');

        let [name, members, desc, author, date] = text.split('|').map(v => v ? v.trim() : '');
        
        let d = new Date();
        let autoDate = `${d.getDate().toString().padStart(2,'0')}/${(d.getMonth()+1).toString().padStart(2,'0')}/${d.getFullYear().toString().slice(-2)} ${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}`;

        name = name || 'Group WhatsApp';
        members = members || '999';
        desc = desc || 'Deskripsi Grup';
        author = author || m.pushName || 'Lynx Decode';
        date = date || autoDate;

        const apiUrl = `https://api.zenzxz.my.id/maker/fakegroupv2?url=${encodeURIComponent(imageUrl)}&name=${encodeURIComponent(name)}&members=${encodeURIComponent(members)}&desc=${encodeURIComponent(desc)}&author=${encodeURIComponent(author)}&date=${encodeURIComponent(date)}`;
        
        let apiRes = await axios.get(apiUrl, { responseType: 'arraybuffer' });
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
        
        await conn.sendMessage(m.chat, {
            image: resultBuffer,
            caption: `✨ *Proses Selesai!*\n\nFake Group berhasil dibuat. 😋`
        }, { quoted: m });

        await m.react('✅');

    } catch (err) {
        console.error("Error FakeGroup Cuy:", err.message);
        await m.react('❌');
        m.reply(`❌ *Gagal memproses gambar.*\nError: ${err.message}`);
    }
};

handler.help = ['fakegc <nama|member|desc|author|date>'];
handler.tags = ['tools'];
handler.command = /^(fakegc)$/i;
handler.limit = true;

export default handler;