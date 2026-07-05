/*
 * 📝 Plugin: Fake Call Generator (ESM Optimized)
 * 🛠 Fix: Buffer Handling & Argument Parsing
 */

import { generateWAMessageFromContent, proto } from '@whiskeysockets/baileys';
import uploadImage from '../lib/uploadImage.js';

let handler = async (m, { conn, args, usedPrefix, command }) => {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''
    
    // 1. Parsing Nama & Durasi dari args
    let input = args.join(' ').split('|');
    let name = input[0]?.trim() || "Erine-AI";
    let duration = input[1]?.trim() || "19.45";

    if (!mime || !mime.includes('image')) {
        return sendErineUI(conn, m, "INPUT ERROR", "❌ *Error:* Reply foto untuk avatar, contoh:\n.fakecall Nama | Durasi", true);
    }

    await m.react('⏳');

    try {
        let media = await q.download();
        let ppurl = await uploadImage(media);
        
        // 2. Fetch API sebagai Buffer (bukan JSON)
        let apiUrl = `https://apii.nexadev.my.id/fakecall?ppurl=${encodeURIComponent(ppurl)}&name=${encodeURIComponent(name)}&duration=${duration}`;
        
        let response = await fetch(apiUrl, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36' }
        });

        if (!response.ok) throw new Error('API Fakecall tidak merespon.');
        
        let buffer = Buffer.from(await response.arrayBuffer());

        // 3. Kirim hasil langsung sebagai gambar
        await conn.sendMessage(m.chat, { 
            image: buffer, 
            caption: `┌˚₊ ๑│ ꜰ ᴀ ᴋ ᴇ  ᴄ ᴀ ʟ ʟ │๑˚₊ 📞\n┇\n┇ 👤 *Name:* ${name}\n┇ ⏳ *Duration:* ${duration}\n┇\n└˚₊ ๑ ────────────── ๑˚₊` 
        }, { quoted: m });

        await m.react('✅');
    } catch (e) {
        await m.react('❌');
        await sendErineUI(conn, m, "SYSTEM ERROR", `Gagal memproses:\n${e.message}`, true);
    }
}

// Fungsi UI tetap sama menggunakan @whiskeysockets/baileys
async function sendErineUI(conn, m, title, bodyText, isError = false) {
    let msg = generateWAMessageFromContent(m.chat, {
        viewOnceMessage: {
            message: {
                interactiveMessage: proto.Message.InteractiveMessage.create({
                    header: proto.Message.InteractiveMessage.Header.create({
                        title: `┌˚₊ ๑│ ${title} │๑˚₊ 📞`,
                        subtitle: "ERINE-AI SYSTEM",
                        hasMediaAttachment: false
                    }),
                    body: proto.Message.InteractiveMessage.Body.create({ text: bodyText }),
                    footer: proto.Message.InteractiveMessage.Footer.create({ text: isError ? "╰┈➤ ❌ SYSTEM ALERT" : "╰┈➤ 👾 Erine-AI FakeCall Core" }),
                    nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({ buttons: [] })
                })
            }
        }
    }, { quoted: m });
    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
}

handler.help = ['fakecall <name> | <duration>'];
handler.tags = ['maker'];
handler.command = /^fakecall$/i;
handler.limit = true;

export default handler;