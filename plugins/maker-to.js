/**
 * ╭───「 𝗙𝗘𝗔𝗧𝗨𝗥𝗘 𝗔𝗨𝗧𝗛𝗢𝗥 」───
 * │ 👤 Developer : Lynx Decode
 * ╰─────────────────────────
 * 📝 Plugin      : Image Maker Filters (Theresa API)
 */

import fetch from 'node-fetch';
import FormData from 'form-data';

let handler = async (m, { conn, usedPrefix, command }) => {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || '';

    if (!mime.includes('image')) return m.reply(`⚠️ Kirim atau balas gambar dengan caption: *${usedPrefix + command}*`);

    await m.react('⏳');

    try {
        let media = await q.download();
        let cmd = command.toLowerCase(); // towhite, toreal, tozombie, dll
        let apiKey = 'x34J0'; 

        // Bikin Form Data buat dikirim ke API Theresa (sesuai docs lu)
        const formData = new FormData();
        formData.append('apikey', apiKey);
        formData.append('image', media, 'image.jpg');

        let endpoint = `https://api.theresav.biz.id/image/${cmd}`;

        let res = await fetch(endpoint, {
            method: 'POST',
            body: formData,
            headers: {
                ...formData.getHeaders()
            }
        });

        let contentType = res.headers.get('content-type');

        // Kalau gagal, biasanya dia balikin JSON
        if (contentType && contentType.includes('application/json')) {
            let json = await res.json();
            throw new Error(json.message || 'Gagal memproses gambar di server Theresa.');
        } 
        
        // Kalau sukses, dia langsung balikin gambar mentah (buffer)
        let buffer = await res.buffer();
        await conn.sendMessage(m.chat, { 
            image: buffer, 
            caption: `✅ *Berhasil [ ${cmd.toUpperCase()} ]*` 
        }, { quoted: m });

        await m.react('✅');
    } catch (e) {
        console.error(`[MAKER ${command.toUpperCase()} ERROR]`, e);
        await m.react('❌');
        m.reply(`⚠️ *Sistem Error:*\n_${e.message || e}_`);
    }
};

handler.help = ['towhite', 'toreal', 'tozombie', 'topixel', 'tomanwha', 'tochibi'];
handler.tags = ['maker'];
handler.command = /^(towhite|toreal|tozombie|topixel|tomanwha|tochibi)$/i; 
handler.limit = true;

export default handler;