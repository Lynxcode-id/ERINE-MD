import fetch from 'node-fetch';
import yts from 'yt-search';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { spawn } from 'child_process';

const handler = async (m, { conn, text, usedPrefix, command }) => {
    const idsal = '120363400612665352@newsletter';  // idch lu
    
    if (!text) return m.reply(`❌ Masukkan judul lagu!\nContoh: ${usedPrefix + command} dandelions`);

    let tempInput, tempOutput;
    try {
        await m.react('⏳');
        const v = (await yts(text)).videos[0];
        if (!v) throw new Error('Lagu tidak ditemukan.');
        const thumb = await (await fetch(v.thumbnail)).buffer();
        const dataAPI = await (await fetch(`https://axlyapi.qzz.io/download/ytmp3?url=${encodeURIComponent(v.url)}`)).json();
        if (!dataAPI?.status || !dataAPI?.data?.download_url) throw new Error('Link download error atau API mati.');
        
        const audioBuffer = await (await fetch(dataAPI.data.download_url)).buffer();

        tempInput = path.join(os.tmpdir(), `${Date.now()}_in.mp3`);
        tempOutput = path.join(os.tmpdir(), `${Date.now()}_out.opus`);
        fs.writeFileSync(tempInput, audioBuffer);
        await new Promise((resolve, reject) => {
            spawn('ffmpeg', ['-i', tempInput, '-vn', '-ac', '1', '-c:a', 'libopus', '-b:a', '128k', '-y', tempOutput])
                .on('close', code => code === 0 ? resolve() : reject());
        });

        const caption = `🎧 *${v.title}*\n👤 *Author:* ${v.author.name}\n⏳ *Duration:* ${v.timestamp}\n🔗 ${v.url}\n\n*© ERINE-AI PlayCh*`;

        const imgMsg = await conn.sendMessage(idsal, {
            image: thumb,
            caption: caption
        });

        await conn.sendMessage(idsal, {
            audio: fs.readFileSync(tempOutput),
            mimetype: 'audio/ogg; codecs=opus',
            ptt: true
        }, { quoted: imgMsg });

        await m.react('✅');
    } catch (e) {
        console.error(e);
        await m.react('❌');
        m.reply(`❌ Gagal: ${e.message}`);
    } finally {
        if (tempInput && fs.existsSync(tempInput)) fs.unlinkSync(tempInput);
        if (tempOutput && fs.existsSync(tempOutput)) fs.unlinkSync(tempOutput);
    }
};

handler.help = ['playch <judul>'];
handler.tags = ['music'];
handler.command = /^playch$/i;
handler.owner = true;

export default handler;