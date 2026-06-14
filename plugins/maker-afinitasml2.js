import fs from 'fs';
import axios from 'axios';
import FormData from 'form-data';
import fetch from 'node-fetch';

const USER_HASH = '01432e715cf28f18f7a61879b';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || '';

    if (!mime) throw `Kirim atau balas gambar dengan caption *${usedPrefix + command}*`;
    if (!/image\/(jpe?g|png)/.test(mime)) throw `Format ${mime} tidak didukung! Pastikan mengirim gambar.`;

    await m.reply('⏳ *Sedang memproses gambar...*');

    let mediaPath = '';
    try {
        let buffer = await q.download();
        
        let ext = mime.split('/')[1] || 'jpg';
        mediaPath = `./tmp/maker_${Date.now()}.${ext}`;

        if (!fs.existsSync('./tmp')) fs.mkdirSync('./tmp');
        fs.writeFileSync(mediaPath, buffer);

        // 1. Upload ke Catbox
        const fakeUserAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
        const form = new FormData();
        form.append('reqtype', 'fileupload');
        form.append('userhash', USER_HASH);
        form.append('fileToUpload', fs.createReadStream(mediaPath));

        const catboxRes = await axios.post('https://catbox.moe/user/api.php', form, {
            headers: { ...form.getHeaders(), 'User-Agent': fakeUserAgent },
            timeout: 30000
        });

        let catboxUrl = catboxRes.data;
        if (typeof catboxUrl !== 'string' || !catboxUrl.startsWith('http')) {
            throw 'Gagal mengupload gambar ke server Catbox.';
        }

        // 2. Fetch ke API Jagoan Project
        let apiUrl = `https://api.jagoanproject.biz.id/api/maker/afinitasml2?image=${encodeURIComponent(catboxUrl)}`;
        let response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer jg_9cTY7aSGLdqZErDysaLfO6Wn'
            }
        });
        
        // 3. Pengecekan pintar: JSON atau Langsung Gambar (Buffer)?
        const contentType = response.headers.get('content-type');
        
        if (contentType && contentType.includes('application/json')) {
            // Jika dikasih JSON (biasanya pas error ngasih key/limit habis)
            let json = await response.json();
            if (!json.status) throw json.message || 'Gagal memproses gambar dari API Jagoan Project.';
            
            let resultImage = json.data?.result?.url || json.result?.url;
            await conn.sendMessage(m.chat, {
                image: { url: resultImage },
                caption: `✅ *Berhasil memproses Afinitas ML!*`
            }, { quoted: m });
            
        } else {
            // Jika dikasih langsung gambar (Ini yang terjadi di error lu)
            let imageBuffer = await response.buffer();
            await conn.sendMessage(m.chat, {
                image: imageBuffer,
                caption: `✅ *Berhasil memproses Afinitas ML!*`
            }, { quoted: m });
        }

    } catch (e) {
        console.error(e);
        m.reply(`❌ *Terjadi kesalahan:* ${e.message || e}`);
    } finally {
        if (mediaPath && fs.existsSync(mediaPath)) {
            try { fs.unlinkSync(mediaPath); } catch (err) {}
        }
    }
}

handler.help = ['afinitasml2'];
handler.tags = ['maker'];
handler.command = /^(afinitasml2?)$/i; 
handler.limit = true;

export default handler;