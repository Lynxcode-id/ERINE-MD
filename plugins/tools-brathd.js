/**
 * Fitur: Brat HD Canvas
 * Author: Lynx decode
 * Channel: https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 */

import axios from 'axios';
import uploadImage from '../lib/uploadImage.js';
import { bratGen } from 'brat-canvas';
import { Sticker } from 'wa-sticker-formatter';

let handler = async (m, { conn, text, command, prefix }) => {
    if (m.quoted && m.quoted.text) {
        text = m.quoted.text;
    } else if (!text && m.quoted && m.quoted.caption) {
        text = m.quoted.caption;
    }
    
    if (!text) return m.reply(`⚠️ Masukkan teks atau balas pesan dengan perintah *${prefix + command}*`);

    await m.react('⚡');

    try {
        const { buffer } = await bratGen(text);
        const bratBuffer = Buffer.from(buffer);

        let imageUrl = await uploadImage(bratBuffer);
        if (!imageUrl) throw new Error('Gagal mengupload gambar brat.');

        const apiUrl = `https://api-varhad.my.id/tools/hd?imageUrl=${encodeURIComponent(imageUrl)}`;
        let apiRes = await axios.get(apiUrl, { responseType: 'arraybuffer' });
        
        let hdBuffer;
        let contentType = apiRes.headers['content-type'];
        
        if (contentType && contentType.includes('application/json')) {
            let json = JSON.parse(apiRes.data.toString('utf-8'));
            let finalUrl = json.result || json.url || json.data; 
            
            if (!finalUrl) throw new Error('URL hasil HD tidak ditemukan di respon JSON API.');
            
            let imgRes = await axios.get(finalUrl, { responseType: 'arraybuffer' });
            hdBuffer = Buffer.from(imgRes.data);
        } else {
            hdBuffer = Buffer.from(apiRes.data);
        }

        let stiker = await new Sticker(hdBuffer, {
            type: 'crop', 
            pack: global.stickpack || 'Brat HD',
            author: global.stickauth || 'Kanoo',
            quality: 50 
        }).toBuffer();

        if (stiker) {
            await conn.sendFile(m.chat, stiker, 'brathd.webp', '', m);
            await m.react('✅');
        } else {
            throw new Error('Gagal mem-build stiker.');
        }

    } catch (err) {
        console.error("Error Brathd Cuy:", err.message);
        await m.react('❌');
        m.reply(`❌ *Gagal memproses Brat HD.*\nError: ${err.message}`);
    }
};

handler.help = ['brathd <teks>'];
handler.tags = ['sticker'];
handler.command = /^(brathd)$/i;
handler.limit = true;
handler.register = false;
handler.group = false;

export default handler;