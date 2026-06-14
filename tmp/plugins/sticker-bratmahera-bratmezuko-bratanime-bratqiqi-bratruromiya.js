/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx Decode
 * 📞 WhatsApp  : +62 882-5804-1396
 * 📢 Channel   : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * ⚠️ Note      : Keep credit to respect the creator!
 * ─────────────────────────
 * 📝 Plugin: Brat Maker (Jagoan Project API) - Smart Fetch
 */

import fetch from 'node-fetch';
import { Sticker } from 'wa-sticker-formatter';

let handler = async (m, { conn, text, prefix, command }) => {
    if (!text) {
        return m.reply(`⚠️ *Format Salah!*\n\n*Contoh:* ${prefix + command} Halo INF Project`);
    }

    await m.react('⚡');

    try {
        let cmd = command.toLowerCase();
        let apiKey = 'jg_9cTY7aSGLdqZErDysaLfO6Wn'; 
        
        let apiUrl = `https://api.jagoanproject.biz.id/api/maker/${cmd}?text=${encodeURIComponent(text)}`;
        
        let response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${apiKey}`
            }
        });

        if (!response.ok) {
            throw new Error(`Server API Error: ${response.status} ${response.statusText}`);
        }

        // Cek tipe konten yang dikasih sama API
        let contentType = response.headers.get('content-type') || '';
        let imgBuffer;

        if (contentType.includes('image')) {
            // Kalau API langsung ngasih mentahan gambar PNG/JPG
            imgBuffer = await response.buffer();
        } else if (contentType.includes('application/json')) {
            // Kalau API tetep ngasih JSON sesuai dugaan awal
            let json = await response.json();
            if (!json.status) throw new Error(`API Error: ${json.message || 'Status API False'}`);
            
            let imageUrl = json.data?.result?.url || json.result?.url || json.url;
            if (!imageUrl) throw new Error('URL gambar tidak ditemukan di respon JSON');
            
            let imgRes = await fetch(imageUrl);
            imgBuffer = await imgRes.buffer();
        } else {
            // Fallback: paksa ambil buffer
            imgBuffer = await response.buffer();
        }

        // Convert mentahan gambar tadi jadi stiker
        let stiker = await new Sticker(imgBuffer, {
            type: 'full', 
            pack: global.stickpack || `Brat ${cmd.replace('brat', '')}`,
            author: global.stickauth || 'Erine MD',
            quality: 50 
        }).toBuffer();

        if (stiker) {
            await conn.sendFile(m.chat, stiker, 'brat.webp', '', m);
            await m.react('✅');
        } else {
            throw new Error('Gagal memproses gambar menjadi stiker.');
        }

    } catch (err) {
        console.error(`Error ${command} Cuy:`, err.message);
        await m.react('❌');
        m.reply(`❌ *Gagal memproses Brat.*\n\n*Log:* ${err.message}`);
    }
};

handler.help = ['bratmenhera <teks>', 'bratnezuko <teks>', 'bratanime <teks>', 'bratqiqi <teks>', 'bratruromiya <teks>'];
handler.tags = ['maker'];
handler.command = /^(bratmenhera|bratnezuko|bratanime|bratqiqi|bratruromiya)$/i;
handler.limit = true;

export default handler;