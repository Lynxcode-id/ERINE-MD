/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx Decode
 * 📞 WhatsApp  : +62 882-5804-1396
 * 📢 Channel   : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * ⚠️ Note      : Keep credit to respect the creator!
 * ─────────────────────────
 * 📝 Plugin: Play Channel + Fake Group Invite Inject
 */

import axios from 'axios';
import yts from 'yt-search';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { spawn } from 'child_process';
import sharp from 'sharp';
import { prepareWAMessageMedia } from '@whiskeysockets/baileys';

const isYoutubeUrl = (url) => /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//i.test(url);

const handler = async (m, { conn, text, usedPrefix, command }) => {
    const wm = global.wm || "Erine System";
    const senderNumber = m.sender.split('@')[0];
    const idsal = '120363400612665352@newsletter';
    
    const fkontak = {
        key: { fromMe: false, participant: `0@s.whatsapp.net` },
        message: {
            contactMessage: {
                displayName: wm,
                vcard: `BEGIN:VCARD\nVERSION:3.0\nN:XL;${wm},;;;\nFN:${wm}\nitem1.TEL;waid=${senderNumber}:${senderNumber}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
            }
        }
    };

    const contextErine = {
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterName: `「 🐣 ᴇʀɪɴᴇ-ᴍᴅ ɪɴғᴏʀᴍᴀᴛɪᴏɴ 🐣 」`,
            newsletterJid: idsal
        }
    };

    if (!text) {
        return conn.sendMessage(m.chat, { 
            text: `Contoh:\n${usedPrefix + command} multo`,
            contextInfo: contextErine
        }, { quoted: fkontak });
    }

    let tempInput, tempOutput;

    try {
        await m.react('⏳');

        const v = isYoutubeUrl(text) 
            ? await yts({ videoId: text.split('v=')[1] || text.split('/').pop() }) 
            : (await yts(text)).videos[0];

        if (!v) throw new Error('Lagu tidak ditemukan');

        const caption = `┌˚₊ ๑│ ᴇ ʀ ɪ ɴ ᴇ  ᴍ ᴅ │๑˚₊ 🎀
┇ 🎵 › ʏᴛ ᴛᴏ ᴄʜᴀɴɴᴇʟ
┇ 🌸 › sᴀꜰᴇ & ᴛʀᴜsᴛᴇᴅ ᴀssɪsᴛᴀɴᴛ
└˚₊ ๑ ᴛ ʀ ᴀ ᴄ ᴋ  ɪ ɴ ꜰ ᴏ ๑˚₊ 🍓

┌˚ · ๑୧ ᴅ ᴇ ᴛ ᴀ ɪ ʟ s
┇ 🎧 ⁞ ᴛɪᴛʟᴇ : ${v.title}
┇ 👤 ⁞ ᴄʜᴀɴɴᴇʟ : ${v.author.name}
┇ ⏳ ⁞ ᴅᴜʀᴀᴛɪᴏɴ : ${v.timestamp}
└˚₊ ๑୧

*Tunggu sebentar, audio sedang dikirim ke saluran...* ⏳
© ᴇʀɪɴᴇ ᴍᴅ x ᴊᴋᴛ𝟺𝟾 ᴠɪʙᴇ`.trim();

        await conn.sendMessage(m.chat, { text: caption, contextInfo: contextErine }, { quoted: fkontak });

        const baseUrl = global.APIs?.ryzumi || 'https://api.ryzumi.net';
        const res = await axios.get(`${baseUrl}/api/downloader/ytmp3`, {
            params: { url: v.url },
            headers: { 'accept': 'application/json' }
        });

        if (!res.data?.url) throw new Error('Audio tidak ditemukan dari server API');

        const audioRes = await axios.get(res.data.url, { 
            responseType: 'arraybuffer',
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36' }
        });

        tempInput = path.join(os.tmpdir(), `${Date.now()}_input.mp3`);
        tempOutput = path.join(os.tmpdir(), `${Date.now()}_output.opus`);

        fs.writeFileSync(tempInput, Buffer.from(audioRes.data));

        await new Promise((resolve, reject) => {
            const ffmpeg = spawn('ffmpeg', [
                '-i', tempInput, '-map_metadata', '-1', '-vn', '-ac', '1', 
                '-ar', '48000', '-c:a', 'libopus', '-b:a', '128k', '-y', tempOutput
            ]);
            let stderr = '';
            ffmpeg.stderr.on('data', d => stderr += d.toString());
            ffmpeg.on('close', code => code === 0 ? resolve() : reject(new Error(stderr)));
        });

        const opusBuffer = fs.readFileSync(tempOutput);

        const thumbRes = await axios.get(v.thumbnail, { responseType: 'arraybuffer' });
        const thumbBuff = Buffer.from(thumbRes.data);

        const { width, height } = await sharp(thumbBuff).metadata();
        const thumbPlaceholder = await sharp(thumbBuff)
            .resize(200, 200, { fit: 'cover' })
            .jpeg({ quality: 60 })
            .toBuffer();

        const media = await prepareWAMessageMedia(
            { image: thumbBuff },
            { upload: conn.waUploadToServer, mediaTypeOverride: 'thumbnail-link' }
        );

        const infoLagu = `🎧 *${v.title}*\n👤 ${v.author.name}  |  ⏳ ${v.timestamp}\n\n*Join Base Official Erine-MD:*\nhttps://chat.whatsapp.com/EKDAFvn862n5vws5fc9Iow`;

        await conn.relayMessage(idsal, {
            extendedTextMessage: {
                text: infoLagu,
                matchedText: 'https://chat.whatsapp.com/EKDAFvn862n5vws5fc9Iow',
                title: '🌟 Erine-MD Official Base',
                description: '© Lynx Decode',
                previewType: 'NONE',
                jpegThumbnail: thumbPlaceholder.toString('base64'),
                thumbnailDirectPath: media.imageMessage.directPath,
                thumbnailSha256: media.imageMessage.fileSha256,
                thumbnailEncSha256: media.imageMessage.fileEncSha256,
                mediaKey: media.imageMessage.mediaKey,
                mediaKeyTimestamp: media.imageMessage.mediaKeyTimestamp,
                thumbnailHeight: height,
                thumbnailWidth: width,
                inviteLinkGroupTypeV2: 'DEFAULT',
                contextInfo: {
                    isForwarded: true,
                    forwardingScore: 999,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: idsal,
                        newsletterName: "ᴇʀɪɴᴇ-ᴍᴅ",
                        serverMessageId: -1
                    }
                }
            }
        }, {});

        await conn.sendMessage(idsal, {
            audio: opusBuffer,
            mimetype: 'audio/ogg; codecs=opus',
            ptt: true,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: idsal,
                    newsletterName: "ᴇʀɪɴᴇ-ᴍᴅ",
                    serverMessageId: -1
                }
            }
        });

        await conn.sendMessage(m.chat, {
            text: `✅ Berhasil mengirim *${v.title}* ke channel dengan layout Invite!`,
            contextInfo: contextErine
        }, { quoted: fkontak });

        await m.react('✅');

    } catch (e) {
        console.error(e);
        await m.react('❌');
        await conn.sendMessage(m.chat, {
            text: `❌ Gagal memproses audio:\n> ${e.message || e}`,
            contextInfo: contextErine
        }, { quoted: fkontak });
    } finally {
        if (tempInput && fs.existsSync(tempInput)) fs.unlinkSync(tempInput);
        if (tempOutput && fs.existsSync(tempOutput)) fs.unlinkSync(tempOutput);
    }
};

handler.help = ['playch'];
handler.tags = ['owner'];
handler.command = /^playch$/i;
handler.owner = true;

export default handler;