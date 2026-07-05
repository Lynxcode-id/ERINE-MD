/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : INF Project x Lynx Decode
 * 📝 Plugin: Set Cover WhatsApp Business (Katalog Method)
 */

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

let handler = async (m, { conn, usedPrefix, command }) => {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || q.mediaType || '';
    
    if (!/image/g.test(mime)) {
        return m.reply(`📸 *Format Salah!*\nReply gambar yang mau dijadiin cover katalog dengan caption *${usedPrefix + command}*`);
    }

    await m.react('⏳');

    try {
        let media = await q.download();
        if (!media) throw new Error('Gagal mendownload gambar.');

        // 1. Inisialisasi Jimp
        const jimpModule = require('jimp');
        const J = jimpModule.Jimp || jimpModule.default || jimpModule;
        const image = await J.read(media);

        // 2. Resize ke 800x400 buat Standar Cover WA Business
        try {
            image.resize(800, 400); // Format Jimp v0.x
        } catch (err) {
            image.resize({ w: 800, h: 400 }); // Format Jimp v1.x
        }

        // 3. Konversi ke Buffer JPEG
        let imgBuffer;
        try {
            imgBuffer = await image.getBuffer('image/jpeg');
        } catch {
            imgBuffer = await image.getBufferAsync(J.MIME_JPEG || 'image/jpeg');
        }
        
        const coverBuffer = Buffer.from(imgBuffer);

        // Pastikan JID bot sesuai format
        const botJid = conn.user.id.split(':')[0] + '@s.whatsapp.net';

        // 4. Inject ke Produk Katalog
        await conn.sendMessage(botJid, {
            product: {
                productImage: coverBuffer,
                productImageCount: 1,
                title: 'ERINE-AI COVER',
                description: 'Cover Bot Official by INF Project',
                price: '1',
                currencyCode: 'IDR',
                retailerId: `cover_${Date.now()}` // ID unik biar gak bentrok
            },
            businessOwnerJid: botJid
        });

        await m.react('✅');
        m.reply('✅ *Cover Katalog Sukses Di-inject!*\n\nGambar udah berhasil masuk jadi produk katalog pertama. Tunggu 1-2 menit biar server Meta sinkronisasi dan nampilin *banner* di profil lu.');

    } catch (e) {
        console.error('[SETCOVER ERROR]', e);
        await m.react('❌');
        m.reply(`❌ *Gagal set cover:*\n> ${e.message}\n\n*Catatan:* Pastikan bot lu udah versi WA Business dan fitur Katalognya udah aktif!`);
    }
}

handler.help = ['setcover'];
handler.tags = ['owner'];
handler.command = /^(setcover|coverbot)$/i;
handler.owner = true;

export default handler;