/**
 * Fitur: Brat Canvas (Standard)
 * Author: Lynx decode
 * Channel: https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 */

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

        let stiker = await new Sticker(bratBuffer, {
            type: 'crop', 
            pack: global.stickpack || 'Brat',
            author: global.stickauth || 'Lynx Decode',
            quality: 50 
        }).toBuffer();

        if (stiker) {
            await conn.sendFile(m.chat, stiker, 'brat.webp', '', m);
            await m.react('✅');
        } else {
            throw new Error('Gagal mem-build stiker.');
        }

    } catch (err) {
        console.error("Error Brat Cuy:", err.message);
        await m.react('❌');
        m.reply(`❌ *Gagal memproses Brat.*\nError: ${err.message}`);
    }
};

handler.help = ['brat <teks>'];
handler.tags = ['sticker'];
handler.command = /^(brat)$/i;
handler.limit = true;
handler.register = false;
handler.group = false;

export default handler;