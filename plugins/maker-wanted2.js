/**
 * ───「 FEATURE AUTHOR 」────
 * 👤 Author : Lynx Decode
 * 📞 Contact : +62 882-5804-1396
 * 📢 Channel : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * ⚠️ Note : Keep credit to respect the creator!
 * ─────────────────────────
 * 📦 Package - Module : axios, node-fetch, formdata-node
 * 📝 Plugin: Maker Wanted
 */

import fetch from 'node-fetch';
import { FormData, Blob } from 'formdata-node';

let uploadFile = async (buffer, mime) => {
    try {
        const uploadImage = (await import('../lib/uploadImage.js')).default;
        return await uploadImage(buffer);
    } catch (e) {
        let formData = new FormData();
        let blob = new Blob([buffer], { type: mime });
        formData.append('file', blob, 'upload_file');

        let res = await fetch('https://api.shinzu.web.id/api/upload/litterbox', {
            method: 'POST',
            body: formData
        });
        let json = await res.json();
        if (!json.status || !json.result) throw new Error('Gagal mengunggah media.');
        return json.result.url;
    }
};

let handler = async (m, { conn, text, usedPrefix, command }) => {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || '';
    
    if (!mime || !mime.includes('image')) {
        return m.reply(`Kirim atau balas gambar dengan caption *${usedPrefix + command} nama|bounty*\n\nContoh: *${usedPrefix + command} Lynx|60000*`);
    }
    
    let [nama, bounty] = text.split('|');
    if (!nama) nama = m.pushName || 'Unknown';
    if (!bounty) bounty = '999999999';

    await m.react('⏳');
    try {
        let media = await q.download();
        let imageUrl = await uploadFile(media, mime);

        let apiUrl = `https://api.kaicloud.my.id/maker/wanted?bounty=${encodeURIComponent(bounty)}&nama=${encodeURIComponent(nama)}&url=${encodeURIComponent(imageUrl)}`;
        
        let caption = `┌˚₊ ๑│ ᴡ ᴀ ɴ ᴛ ᴇ ᴅ │๑˚₊ 🏴‍☠️\n┇ \n│ 👤 *Nama:* ${nama}\n│ 💰 *Bounty:* ${bounty}\n┇ \n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`;
        
        await conn.sendMessage(m.chat, { image: { url: apiUrl }, caption: caption }, { quoted: m });
        await m.react('✅');
    } catch (e) {
        console.error("ERROR MAKER WANTED:", e);
        await m.react('❌');
        m.reply(`┌˚₊ ๑│ s ʏ s ᴛ ᴇ ᴍ  ᴇ ʀ ʀ ᴏ ʀ │๑˚₊ ❌\n┇ Terjadi kesalahan:\n┇ ${e.message}\n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`);
    }
};

handler.help = ['wanted2 <nama|bounty>'];
handler.tags = ['maker'];
handler.command = /^wanted2$/i;
handler.limit = true;

export default handler;