import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return m.reply(`⚠️ Masukkan teksnya!\n\n*Contoh:*\n${usedPrefix + command} Lynx Decode`);

    await m.react('⏳');

    try {
        let api = `https://api.theresav.biz.id/canvas/basket?text=${encodeURIComponent(text)}&apikey=x34J0`;
        let res = await fetch(api);
        
        if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
        
        let buffer = Buffer.from(await res.arrayBuffer());

        await conn.sendMessage(m.chat, { 
            image: buffer, 
            caption: `✅ *Canvas Basket*: ${text}` 
        }, { quoted: m });

        await m.react('✅');
    } catch (e) {
        console.error('[MAKER BASKET ERROR]', e);
        await m.react('❌');
        m.reply(`⚠️ *Sistem Error:*\n_${e.message}_`);
    }
};

handler.help = ['sertifikatbasket <teks>'];
handler.tags = ['maker'];
handler.command = /^(sertifikatbasket|canvasbasket)$/i;
handler.limit = true;

export default handler;