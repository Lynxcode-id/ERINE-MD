import fs from 'fs';
import axios from 'axios';
import FormData from 'form-data';
import fetch from 'node-fetch';

const USER_HASH = '01432e715cf28f18f7a61879b';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || '';

    // Validasi input teks biar parameternya ga kosong
    if (!text || !text.includes('|')) {
        throw `Format salah cuy!\n\nKirim atau balas gambar dengan caption:\n*${usedPrefix + command} nama|waktu*\n\n💡 Contoh: *${usedPrefix + command} ayang ❤🙌|90:51:21*`;
    }

    if (!mime) throw `Kirim atau balas gambar dengan caption *${usedPrefix + command} nama|waktu*`;
    if (!/image\/(jpe?g|png)/.test(mime)) throw `Format ${mime} tidak didukung! Pastikan mengirim gambar.`;

    // Memisahkan nama dan waktu dari input user
    let [nama, waktu] = text.split('|');

    // Menghapus spasi berlebih di awal/akhir jika ada
    nama = nama.trim();
    waktu = waktu.trim();

    await m.reply(`⏳ *Sedang memproses Fake Call...*\n👤 Nama: ${nama}\n⏱️ Waktu: ${waktu}`);

    let mediaPath = '';
    try {
        let buffer = await q.download();
        
        let ext = mime.split('/')[1] || 'jpg';
        mediaPath = `./tmp/fakecall_${Date.now()}.${ext}`;

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

        // 2. Fetch ke API Jagoan Project (Dengan parameter nama & waktu)
        let apiUrl = `https://api.jagoanproject.biz.id/api/maker/fakecall2?nama=${encodeURIComponent(nama)}&waktu=${encodeURIComponent(waktu)}&image=${encodeURIComponent(catboxUrl)}&output=url`;
        
        let response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer jg_9cTY7aSGLdqZErDysaLfO6Wn'
            }
        });
        
        // 3. Auto-detect respons (JSON atau Buffer)
        const contentType = response.headers.get('content-type');
        
        if (contentType && contentType.includes('application/json')) {
            let json = await response.json();
            if (!json.status) throw json.message || 'Gagal memproses gambar dari API Jagoan Project.';
            
            let resultImage = json.data?.result?.url || json.result?.url;
            await conn.sendMessage(m.chat, {
                image: { url: resultImage },
                caption: `✅ *Berhasil membuat Fake Call!*`
            }, { quoted: m });
            
        } else {
            let imageBuffer = await response.buffer();
            await conn.sendMessage(m.chat, {
                image: imageBuffer,
                caption: `✅ *Berhasil membuat Fake Call!*`
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

handler.help = ['fakecall2'];
handler.tags = ['maker'];
handler.command = /^(fakecall2)$/i; 
handler.limit = true;

export default handler;