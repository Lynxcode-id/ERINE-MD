/**
 * ╭───「 𝗙𝗘𝗔𝗧𝗨𝗥𝗘 𝗔𝗨𝗧𝗛𝗢𝗥 」───
 * │ 👤 Author code : Lynx Decode
 * │ 👤 Sumber original creator : Kyynzz
 * ╰─────────────────────────
 * 📝 Plugin      : Fake Notif WhatsApp (Canvas)
 */

import { createCanvas, loadImage, GlobalFonts } from '@napi-rs/canvas';
import fetch from 'node-fetch';

const TEMPLATE_URL = "https://d.tmpfile.link/public/2026-06-08/e92ce22a-404f-4a06-9c73-470743475f1f/IMG-20260608-WA0253(4).jpg";
const FONT_URL = "https://raw.githubusercontent.com/Ditzzx-vibecoder/Assets/main/Brat/Poppins.ttf";

async function downloadBuffer(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Gagal download dari URL: ${res.statusText}`);
    return Buffer.from(await res.arrayBuffer());
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text || !text.includes('|')) {
        return m.reply(`⚠️ formatnya salah!\n\n📌 *Cara pakai:*\n${usedPrefix + command} nama | pesan\n\n*Contoh:*\n${usedPrefix + command} temen asu | login woi -1 jungler ini`);
    }

    await m.react('🌟');

    try {
        let [name, message] = text.split('|').map(v => v.trim());
        if (!name || !message) throw new Error('Nama atau pesan ga boleh kosong!');
        if (!global.PoppinsNotifRegistered) {
            const fontBuffer = await downloadBuffer(FONT_URL);
            GlobalFonts.register(fontBuffer, "PoppinsNotif");
            global.PoppinsNotifRegistered = true;
        }

        const bgBuffer = await downloadBuffer(TEMPLATE_URL);
        const bg = await loadImage(bgBuffer);
        
        const canvas = createCanvas(bg.width, bg.height);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(bg, 0, 0, bg.width, bg.height);
        ctx.fillStyle = "#000000";
        ctx.font = `bold 20px "PoppinsNotif"`;
        ctx.textBaseline = "top";
        ctx.fillText(name, 35, 190);
        ctx.fillStyle = "#000000";
        ctx.font = `20px "PoppinsNotif"`;
        ctx.textBaseline = "top";
        ctx.fillText(message, 35, 220);

        const finalBuffer = await canvas.encode("png");
        await conn.sendMessage(m.chat, { 
            image: finalBuffer, 
            caption: `✅ *Nih bro fake notif lu!*\n\n👤 *Nama:* ${name}\n💬 *Pesan:* ${message}` 
        }, { quoted: m });

        await m.react('⚡');
    } catch (e) {
        console.error('error cuy', e);
        await m.react('❌');
        m.reply(`⚠️ *Sistem Error:*\n_${e.message || e}_`);
    }
};

handler.help = ['fakenotif <nama | pesan>'];
handler.tags = ['maker'];
handler.command = /^(fakenotif|notifwa|fakewa)$/i;
handler.limit = true;

export default handler;