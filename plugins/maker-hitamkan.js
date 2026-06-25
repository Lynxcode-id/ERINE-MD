import fetch from 'node-fetch';
import uploadImage from '../lib/uploadImage.js';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || '';

    if (!mime) throw `Kirim atau balas gambar dengan caption *${usedPrefix + command}*`;
    if (!/image\/(jpe?g|png)/.test(mime)) throw `Format ${mime} tidak didukung! Pastikan mengirim gambar.`;

    await m.reply('⏳ *Sedang memproses gambar...*');

    try {
        let media = await q.download();
        let url = await uploadImage(media);

        let apiUrl = `https://api.ikyyxd.my.id/edit/jadihitam?url=${encodeURIComponent(url)}`;
        let response = await fetch(apiUrl);
        let json = await response.json();

        if (!json.status) throw 'Gagal memproses gambar dari API.';

        let resultImage = json.result.image;

        // Mengirimkan hasilnya kembali ke chat tanpa watermark
        await conn.sendMessage(m.chat, {
            image: { url: resultImage },
            caption: `✅ *Berhasil bang fotonya udah di hitamin 😹*`
        }, { quoted: m });

    } catch (e) {
        console.error(e);
        m.reply(`❌ *Terjadi kesalahan:* ${e.message || e}`);
    }
}

handler.help = ['jadihitam'];
handler.tags = ['maker'];
// Udah gua tambahin 'hitamkan' sesuai di screenshot lu
handler.command = /^(jadihitam|hitam|hitamkan|tohitam)$/i; 
handler.limit = 10

export default handler;