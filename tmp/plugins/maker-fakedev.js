import fetch from 'node-fetch';
import uploadImage from '../lib/uploadImage.js';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || '';

    if (!mime.includes('image')) return m.reply(`⚠️ Kirim atau balas gambar dengan caption: ${usedPrefix + command} Nama | true/false`);
    if (!text) return m.reply(`⚠️ Masukkan formatnya!\n\n*Contoh:*\n${usedPrefix + command} Lynx Decode | true`);

    await m.react('⏳');

    try {
        let [name, isVerified] = text.split('|').map(v => v?.trim());
        let verified = (isVerified && isVerified.toLowerCase() === 'false') ? 'false' : 'true';

        let media = await q.download();
        let imageUrl = await uploadImage(media);

        let api = `https://api.theresav.biz.id/canvas/fakedev?name=${encodeURIComponent(name)}&imageUrl=${encodeURIComponent(imageUrl)}&verified=${verified}&apikey=x34J0`;
        let res = await fetch(api);
        
        if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
        
        let buffer = Buffer.from(await res.arrayBuffer());

        await conn.sendMessage(m.chat, { 
            image: buffer, 
            caption: `✅ *FakeDev*: ${name}` 
        }, { quoted: m });

        await m.react('✅');
    } catch (e) {
        console.error('[MAKER FAKEDEV ERROR]', e);
        await m.react('❌');
        m.reply(`⚠️ *Sistem Error:*\n_${e.message}_`);
    }
};

handler.help = ['fakedev <nama | true/false>'];
handler.tags = ['maker'];
handler.command = /^(fakedev)$/i;
handler.limit = true;

export default handler;