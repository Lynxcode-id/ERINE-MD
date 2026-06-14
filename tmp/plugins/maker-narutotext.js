/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx Decode
 * 📞 WhatsApp  : +62 882-5804-1396
 * 📢 Channel   : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * ⚠️ Note      : Keep credit to respect the creator!
 * ─────────────────────────
 * 📝 Plugin: Naruto Text Maker (Xemoz API)
 */

import fetch from 'node-fetch';

let handler = async (m, { conn, text, prefix, command }) => {
    if (!text) {
        return m.reply(`⚠️ *Format Salah!*\n\n*Contoh:* ${prefix + command} INF Project`);
    }

    await m.react('⚡');

    try {
        let apiUrl = `https://api-xemoz-official.my.id/api/maker/narutotext.php?text=${encodeURIComponent(text)}`;
        
        let response = await fetch(apiUrl, {
            method: 'GET'
        });

        if (!response.ok) {
            throw new Error(`Server API Error: ${response.status} ${response.statusText}`);
        }

        let contentType = response.headers.get('content-type') || '';
        let imgBuffer;

        if (contentType.includes('image')) {
            imgBuffer = await response.buffer();
        } else if (contentType.includes('application/json')) {
            let json = await response.json();
            if (!json.status) throw new Error(`API Error: ${json.message || 'Status False'}`);
            
            let mediaData = json.result?.image || json.result?.url || json.url;
            
            if (!mediaData) {
                throw new Error(`Struktur JSON berubah!`);
            }
            
            if (mediaData.startsWith('http')) {
                let imgRes = await fetch(mediaData);
                imgBuffer = await imgRes.buffer();
            } else {
                let b64 = mediaData.replace(/^data:image\/\w+;base64,/, '');
                imgBuffer = Buffer.from(b64, 'base64');
            }
        } else {
            imgBuffer = await response.buffer();
        }

        await conn.sendMessage(m.chat, {
            image: imgBuffer,
            caption: `✨ *Selesai!*\n\nText: _${text}_`
        }, { quoted: m });

        await m.react('✅');

    } catch (err) {
        console.error(`Error ${command} Cuy:`, err.message);
        await m.react('❌');
        m.reply(`❌ *Gagal memproses gambar.*\n\n*Log:* ${err.message}`);
    }
};

handler.help = ['narutotext <teks>'];
handler.tags = ['maker'];
handler.command = /^(narutotext|textnaruto)$/i;
handler.limit = true;

export default handler;