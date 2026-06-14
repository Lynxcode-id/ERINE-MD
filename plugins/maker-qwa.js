/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx Decode
 * 📞 WhatsApp  : +62 882-5804-1396
 * 📢 Channel   : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * ⚠️ Note      : Keep credit to respect the creator!
 * ─────────────────────────
 * 📝 Plugin: Quote WhatsApp (QWA) Maker
 */

import axios from 'axios';
import uploadImage from '../lib/uploadImage.js';

let handler = async (m, { conn, text, prefix, command }) => {
    let q = m.quoted ? m.quoted : m;
    let targetText = text || q.text;

    if (!targetText) {
        return m.reply(`⚠️ Masukkan teks atau balas pesan yang ingin dijadikan Quote WhatsApp.\n\n*Contoh:* ${prefix + command} Halo dunia!`);
    }

    await m.react('⚡');

    try {
        let ppUrlFallback = 'https://i.ibb.co/1s8T3sY/48f7ce63c7aa.jpg';
        let ppWaUrl = await conn.profilePictureUrl(q.sender, 'image').catch(() => ppUrlFallback);
        
        let ppBuffer = await axios.get(ppWaUrl, { responseType: 'arraybuffer' }).then(res => res.data).catch(() => null);
        let finalImageUrl = ppBuffer ? await uploadImage(ppBuffer) : ppUrlFallback;

        let username = q.name || m.pushName || 'User';
        let phone = '+' + q.sender.split('@')[0];
        
        let d = new Date(q.messageTimestamp ? q.messageTimestamp * 1000 : Date.now());
        let timestamp = `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;

        let apiUrl = `https://anabot.my.id/api/maker/qwa?image=${encodeURIComponent(finalImageUrl)}&text=${encodeURIComponent(targetText)}&username=${encodeURIComponent(username)}&phone=${encodeURIComponent(phone)}&timestamp=${encodeURIComponent(timestamp)}&apikey=freeApikey`;

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
            caption: `✨ *Quote WhatsApp berhasil dibuat!*`
        }, { quoted: m });

        await m.react('✅');

    } catch (err) {
        console.error("Error QWA Cuy:", err.message);
        await m.react('❌');
        m.reply(`❌ *Gagal memproses Quote WhatsApp.*\nError: ${err.message}`);
    }
};

handler.help = ['qwa <teks>'];
handler.tags = ['maker'];
handler.command = /^(qwa|qcwa)$/i;
handler.limit = true;

export default handler;