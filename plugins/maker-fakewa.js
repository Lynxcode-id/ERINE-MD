import fetch from 'node-fetch';
import FormData from 'form-data';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || '';

    if (!mime.includes('image')) return m.reply(`⚠️ Kirim atau balas gambar dengan caption: ${usedPrefix + command} Nama | Bio | Nomor`);
    if (!text) return m.reply(`⚠️ Masukkan formatnya!\n\n*Contoh:*\n${usedPrefix + command} Lynx Decode | nothing... | 6281362133135`);

    await m.react('⏳');

    try {
        let [nama, bio, nomor] = text.split('|').map(v => v?.trim());
        if (!nama || !bio || !nomor) throw new Error('Format kurang lengkap! Pastikan menggunakan pemisah |');

        let media = await q.download();

        let formData = new FormData();
        formData.append('apikey', 'x34J0');
        formData.append('nama', nama);
        formData.append('bio', bio);
        formData.append('nomor', nomor);
        formData.append('avatar', media, { filename: 'avatar.jpg', contentType: 'image/jpeg' });

        let api = `https://api.theresav.biz.id/canvas/fakewa`;
        let res = await fetch(api, {
            method: 'POST',
            body: formData
        });
        
        if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
        
        let buffer = Buffer.from(await res.arrayBuffer());

        await conn.sendMessage(m.chat, { 
            image: buffer, 
            caption: `✅ *FakeWA*: ${nama}` 
        }, { quoted: m });

        await m.react('✅');
    } catch (e) {
        console.error('[MAKER FAKEWA ERROR]', e);
        await m.react('❌');
        m.reply(`⚠️ *Sistem Error:*\n_${e.message}_`);
    }
};

handler.help = ['fakewa <nama | bio | nomor>'];
handler.tags = ['maker'];
handler.command = /^(fakewa)$/i;
handler.limit = true;

export default handler;