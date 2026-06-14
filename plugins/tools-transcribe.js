/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx Decode
 * 📢 Channel   : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * ─────────────────────────
 * 📝 Plugin : Audio Transcribe (Theresa API)
 */

import axios from 'axios';
import FormData from 'form-data';

let handler = async (m, { conn, usedPrefix, command }) => {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || q.mediaType || '';

    if (!/audio/g.test(mime)) {
        return m.reply(`⚠️ *Balas atau kirim audio/VN!*\n\nContoh: *${usedPrefix + command}* (sambil reply pesan audio)`);
    }

    await m.react('⏳');

    try {
        let mediaBuffer = await q.download();
        if (!mediaBuffer) throw new Error('Gagal mengunduh media audio dari pesan.');

        let form = new FormData();
        form.append('apikey', 'x34J0');
        form.append('audio', mediaBuffer, { filename: 'audio.mp3' });

        let res = await axios.post('https://api.theresav.biz.id/tools/transcribe', form, {
            headers: form.getHeaders(),
            timeout: 60000 
        });

        let data = res.data;
        if (!data.status || !data.result) throw new Error('Server gagal melakukan transkripsi atau hasil kosong.');

        let caption = `┌˚₊ ๑│ ᴛ ʀ ᴀ ɴ s ᴄ ʀ ɪ ʙ ᴇ │๑˚₊ 📝
┇ 
│ 💬 *Hasil Transkrip:*
│ ${data.result}
┇ 
└˚₊ ๑ ────────────── ๑˚₊
> © ERINE-MD`;

        await conn.sendMessage(m.chat, { text: caption.trim() }, { quoted: m });
        await m.react('✅');

    } catch (e) {
        console.error('[TRANSCRIBE ERROR]', e);
        await m.react('❌');
        let errMessage = e.response?.data?.message || e.message || String(e);
        m.reply(`┌˚₊ ๑│ s ʏ s ᴛ ᴇ ᴍ  ᴇ ʀ ʀ ᴏ ʀ │๑˚₊ ❌\n┇ Gagal memproses audio:\n┇ ${errMessage}\n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-MD`);
    }
}

handler.help = ['transcribe <reply audio>'];
handler.tags = ['tools'];
handler.command = /^(transcribe|totext)$/i;
handler.limit = true;

export default handler;