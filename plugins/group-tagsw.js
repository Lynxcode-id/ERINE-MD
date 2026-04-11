// © INF PROJECT - Erine-MD
// Developed by INF PROJECT

import pkg from "@wishkeysocket/baileys";
const { generateWAMessageContent, generateWAMessageFromContent } = pkg;
import crypto from "node:crypto";
import { PassThrough } from 'node:stream';
import ffmpeg from 'fluent-ffmpeg';

let handler = async (m, { conn, text }) => {
  let [textInput, warna, url] = text ? text.split('|') : [];

  let id;
  if (url) {
    try {
      const inviteCode = url.split('/').pop().split('?')[0];
      let geti = await conn.groupGetInviteInfo(inviteCode);
      id = geti.id;
    } catch {
      return m.reply('⚠️ Link grup tidak valid atau bot tidak bisa akses.');
    }
  } else {
    id = m.chat;
  }

  if (!m.isGroup && !url) return m.reply('⚠️ Gunakan di dalam grup atau sertakan link grup target.');

  let quoted = m.quoted || m;
  let cap = textInput || quoted.text || quoted.caption || "";
  let mime = quoted?.mimetype || quoted?.msg?.mimetype || '';

  await m.react('⏳');

  try {
    // --- CASE: IMAGE ---
    if (/image/.test(mime)) {
      const buffer = await quoted.download();
      const sta = await sendGroupStatus(conn, id, {
        image: buffer,
        caption: cap
      });
      return m.reply('✅ Sukses Upload Status Gambar ke Grup!', null, { quoted: sta });
    } 
    
    // --- CASE: VIDEO ---
    else if (/video/.test(mime)) {
      const buffer = await quoted.download();
      const sta = await sendGroupStatus(conn, id, {
        video: buffer,
        caption: cap
      });
      return m.reply('✅ Sukses Upload Status Video ke Grup!', null, { quoted: sta });
    } 
    
    // --- CASE: AUDIO ---
    else if (/audio/.test(mime)) {
      const buffer = await quoted.download();
      const audioVn = await toVN(buffer);
      const audioWaveform = await generateWaveform(buffer);
      
      const sta = await sendGroupStatus(conn, id, {
        audio: audioVn,
        waveform: Buffer.from(audioWaveform, 'base64'),
        mimetype: "audio/ogg; codecs=opus",
        ptt: true
      });
      return m.reply('✅ Sukses Upload Status Audio ke Grup!', null, { quoted: sta });
    } 
    
    // --- CASE: TEXT BERWARNA ---
    else if (warna || textInput) {
      const warnaStatusWA = {
        'biru': '#34B7F1', 'hijau': '#25D366', 'kuning': '#FFD700',
        'jingga': '#FF8C00', 'merah': '#FF3B30', 'ungu': '#9C27B0',
        'abu': '#9E9E9E', 'hitam': '#000000', 'putih': '#FFFFFF', 'cyan': '#00BCD4'
      };

      let color = warnaStatusWA[warna?.toLowerCase()] || '#25D366'; // Default Hijau
      if (!cap) return m.reply('⚠️ Masukkan teks untuk status!');

      const sta = await sendGroupStatus(conn, id, {
        text: cap,
        backgroundColor: color,
        font: 1 // SANS_SERIF
      });
      return m.reply('✅ Sukses Upload Status Teks ke Grup!', null, { quoted: sta });
    } 
    
    else {
      return m.reply(`Contoh penggunaan:\n\n*${usedPrefix + command} Teks|Warna* (Reply media atau kirim teks)`);
    }

  } catch (e) {
    console.error(e);
    await m.react('❌');
    m.reply('❌ Gagal mengupload status. Pastikan fitur didukung oleh versi Baileys lu.');
  }
};

/**
 * Core Function Status Grup V2
 */
async function sendGroupStatus(conn, jid, content) {
  const { backgroundColor, font } = content;
  delete content.backgroundColor;
  delete content.font;

  const inside = await generateWAMessageContent(content, {
    upload: conn.waUploadToServer
  });

  const messageSecret = crypto.randomBytes(32);
  
  // Konstruksi Status V2
  const statusMsg = generateWAMessageFromContent(jid, {
    messageContextInfo: { messageSecret },
    groupStatusMessageV2: {
      message: {
        ...inside,
        ...(backgroundColor ? { 
            extendedTextMessage: { 
                text: content.text, 
                backgroundArgb: parseInt(backgroundColor.replace('#', 'ff'), 16),
                font
            } 
        } : {})
      }
    }
  }, {});

  await conn.relayMessage(jid, statusMsg.message, { messageId: statusMsg.key.id });
  return statusMsg;
}

// --- FFMPEG HELPERS ---

async function toVN(inputBuffer) {
  return new Promise((resolve, reject) => {
    const inStream = new PassThrough();
    const outStream = new PassThrough();
    const chunks = [];
    inStream.end(inputBuffer);

    ffmpeg(inStream)
      .noVideo()
      .audioCodec('libopus')
      .format('ogg')
      .outputOptions(['-application voip', '-map_metadata -1'])
      .on('error', reject)
      .on('end', () => resolve(Buffer.concat(chunks)))
      .pipe(outStream, { end: true });

    outStream.on('data', c => chunks.push(c));
  });
}

async function generateWaveform(inputBuffer) {
  return new Promise((resolve, reject) => {
    const inputStream = new PassThrough();
    inputStream.end(inputBuffer);
    const chunks = [];

    ffmpeg(inputStream)
      .audioChannels(1)
      .audioFrequency(16000)
      .format("s16le")
      .on("error", reject)
      .on("data", chunk => chunks.push(chunk))
      .on("end", () => {
        const rawData = Buffer.concat(chunks);
        const samples = rawData.length / 2;
        const amplitudes = [];
        for (let i = 0; i < samples; i++) {
          amplitudes.push(Math.abs(rawData.readInt16LE(i * 2)) / 32768);
        }

        const bars = 64;
        let blockSize = Math.floor(amplitudes.length / bars);
        let normalized = [];
        for (let i = 0; i < bars; i++) {
          let block = amplitudes.slice(i * blockSize, (i + 1) * blockSize);
          let sum = block.reduce((a, b) => a + b, 0);
          normalized.push(Math.floor((sum / block.length || 0) * 100));
        }
        resolve(Buffer.from(new Uint8Array(normalized)).toString("base64"));
      })
      .pipe(new PassThrough(), { end: true });
  });
}

handler.help = ["swgc", "upswgc"];
handler.command = ["swgc", "upswgc"];
handler.tags = ["tools"];
handler.admin = true;

export default handler;
