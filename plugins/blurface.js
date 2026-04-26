// File: plugins/blurface.js

/**
 * Fungsi helper untuk upload buffer ke uguu.se
 * @param {Buffer} buffer - Buffer gambar
 * @param {String} filename - Nama file (opsional)
 * @returns {Promise<String>} URL gambar dari uguu
 */
async function uploadToUguu(buffer, filename = 'image.jpg') {
    const blob = new Blob([buffer], { type: 'image/jpeg' });
    const formData = new FormData();
    formData.append('files[]', blob, filename);

    const response = await fetch('https://uguu.se/upload.php', {
        method: 'POST',
        body: formData
    });

    const data = await response.json();
    if (data.success) {
        return data.files[0].url; // Mengambil URL dari respons Uguu
    } else {
        throw new Error('Gagal upload gambar ke Uguu.se');
    }
}

// Handler utama plugin
export const handler = async (m, { conn, usedPrefix, command }) => {
    // 1. Cek apakah ada gambar yang dikirim atau di-reply
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || '';

    if (!/image\/(jpe?g|png)/.test(mime)) {
        return m.reply(`Kirim atau reply gambar dengan caption *${usedPrefix + command}*`);
    }

    m.reply('⏳ Sedang memproses gambarnya, tunggu bentar cuy...');

    try {
        // 2. Download buffer gambar dari pesan WhatsApp
        let imgBuffer = await q.download();

        // 3. Upload gambar ke Uguu untuk mendapatkan URL
        let imageUrl = await uploadToUguu(imgBuffer, 'muka.jpg');

        // 4. Panggil API Skylow dengan URL Uguu
        let apiUrl = `https://api.skylow.web.id/api/tools/blurface?url=${encodeURIComponent(imageUrl)}`;
        let apiRes = await fetch(apiUrl);

        if (!apiRes.ok) {
            throw new Error(`API Error: ${apiRes.statusText}`);
        }

        // 5. Ubah respons API menjadi Buffer agar bisa dikirim oleh bot
        let arrayBuf = await apiRes.arrayBuffer();
        let resultBuffer = Buffer.from(arrayBuf);

        // 6. Kirim balik hasilnya ke user
        await conn.sendMessage(
            m.chat, 
            { image: resultBuffer, caption: '✅ Nih cuy hasil blur mukanya!' }, 
            { quoted: m }
        );

    } catch (e) {
        console.error(e);
        m.reply('❌ Waduh, gagal memproses gambar. Pastikan API-nya lagi aktif atau coba lagi nanti ya.');
    }
}

// Konfigurasi plugin
handler.help = ['blurface'];
handler.tags = ['tools'];
handler.command = /^(blurface)$/i;

export default handler;