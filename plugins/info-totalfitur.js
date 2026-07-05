/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Author     : Lynx Decode
 * 📞 Contact    : +62 882-5804-1396
 * 📢 Channel    : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * ⚠️ Note       : Keep credit to respect the creator!
 * ─────────────────────────
 * 📝 Plugin: Total Fitur + Audio Opus Convert (Anti-Corrupt)
 */

import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { spawn } from 'child_process';

let handler = async (m, { conn }) => {
  let tempInput, tempOutput;
  try {
    await m.react('⏳');

    let totalFitur = Object.values(global.plugins)
      .filter(v => v.help && v.tags && !v.disabled)
      .length;

    let totalCommand = Object.values(global.plugins)
      .map(v => v.command)
      .filter(v => v)
      .map(v => Array.isArray(v) ? v.length : 1)
      .reduce((a, b) => a + b, 0);

    let caption = `┌˚₊ ๑│ s ᴛ ᴀ ᴛ ɪ s ᴛ ɪ ᴋ  ʙ ᴏ ᴛ │๑˚₊ 📊\n┇ \n│ 🔧 *Total Fitur:* ${totalFitur}\n│ 📖 *Total Command:* ${totalCommand}\n┇ \n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI X LYNX DECODE`.trim();

    // 1. Kirim Teks Statistik
    await conn.sendMessage(
      m.chat,
      { text: caption },
      { quoted: global.fkontak || m }
    );

    // 2. Download audio dari Catbox ke Buffer
    const audioUrl = 'https://files.catbox.moe/a2546f.mp3';
    const res = await fetch(audioUrl);
    if (!res.ok) throw new Error('Gagal mengunduh audio dari Catbox.');
    const audioBuffer = await res.buffer();

    // 3. Setup lokasi file temporary (Menggunakan os.tmpdir dari plugin playch)
    tempInput = path.join(os.tmpdir(), `${Date.now()}_fitur_in.mp3`);
    tempOutput = path.join(os.tmpdir(), `${Date.now()}_fitur_out.opus`);
    fs.writeFileSync(tempInput, audioBuffer);

    // 4. Proses Convert ke Opus murni lewat Ffmpeg (Fix argumen bitrate '128k')
    await new Promise((resolve, reject) => {
        spawn('ffmpeg', ['-i', tempInput, '-vn', '-ac', '1', '-c:a', 'libopus', '-b:a', '128k', '-y', tempOutput])
            .on('close', code => code === 0 ? resolve() : reject(new Error('Ffmpeg conversion failed.')));
    });

    // 5. Kirim Audio VN asli Opus (Dijamin work, mengadopsi cara playch)
    await conn.sendMessage(
      m.chat,
      { 
        audio: fs.readFileSync(tempOutput), 
        mimetype: 'audio/ogg; codecs=opus', 
        ptt: true
      },
      { quoted: global.fkontak || m }
    );

    await m.react('✅');

  } catch (e) {
    console.error('[TOTAL FITUR ERROR]', e);
    await m.react('❌');
    m.reply(`┌˚₊ ๑│ s ʏ s ᴛ ᴇ ᴍ  ᴇ ʀ ʀ ᴏ ʀ │๑˚₊ ❌\n┇ Gagal mengirim audio: ${e.message}\n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI X LYNX DECODE`);
  } finally {
    // Bersihkan file sampah di panel biar gak penuh
    if (tempInput && fs.existsSync(tempInput)) fs.unlinkSync(tempInput);
    if (tempOutput && fs.existsSync(tempOutput)) fs.unlinkSync(tempOutput);
  }
}

handler.help = ['totalfitur']
handler.tags = ['info']
handler.command = ['totalfitur']
handler.limit = true

export default handler;