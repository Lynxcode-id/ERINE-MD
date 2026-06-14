/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx Decode
 * 📞 WhatsApp  : +62 882-5804-1396
 * 📢 Channel   : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * ⚠️ Note      : Keep credit to respect the creator!
 * ─────────────────────────
 * 📝 Plugin: Tourl (Athars Uploader)
 */

import axios from "axios";
import FormData from "form-data";

let handler = async (m, { conn, command, usedPrefix }) => {
    let q = m.quoted ? m.quoted : m;
    
    let msgContent = q.message || q;
    if (msgContent.documentWithCaptionMessage) msgContent = msgContent.documentWithCaptionMessage.message;
    if (msgContent.viewOnceMessageV2) msgContent = msgContent.viewOnceMessageV2.message;
    
    let targetMedia = msgContent.imageMessage || msgContent.videoMessage || msgContent.audioMessage || msgContent.stickerMessage || msgContent.documentMessage || null;
    let mime = targetMedia ? targetMedia.mimetype : (q.msg || q).mimetype || "";
    
    if (!mime) {
        return m.reply(`⚠️ *Format Salah!*\n\n*Contoh:* ${usedPrefix + command} *[kirim/balas media]*`);
    }
    
    await m.react('⚡');
    
    try {
        if (q.mediaType === null && targetMedia) {
            q.mediaType = Object.keys(msgContent).find(k => k.endsWith('Message'));
        }

        let mediaBuffer = await q.download();
        if (!mediaBuffer) throw new Error("Gagal mendownload media dari pesan");

        let extension = mime.split("/")[1] || "bin";
        let fileName = `upload_${Date.now()}.${extension}`;

        let link = await atharsUpload(mediaBuffer, fileName);

        let caption = `☁️ *U R L  U P L O A D E R*\n\n`;
        caption += `🔗 *Link:* ${link}\n`;
        caption += `📦 *Size:* ${(mediaBuffer.length / 1024).toFixed(2)} KB\n`;
        caption += `⏳ *Expired:* No Expired`;
        
        await m.reply(caption);
        await m.react('✅');

    } catch (e) {
        console.error("Error Tourl:", e.message);
        await m.react('❌');
        m.reply(`❌ *Terjadi error saat upload:*\n${e.message}`);
    }
};

handler.help = ["tourl1 <reply media>"];
handler.tags = ["tools"];
handler.command = /^tourl1$/i;
handler.limit = true;

export default handler;

async function atharsUpload(buffer, fileName) {
    const form = new FormData();
    form.append("file", buffer, fileName);

    const res = await axios.post("https://athars.space/upload.php", form, {
        headers: {
            ...form.getHeaders(),
            "User-Agent": "Mozilla/5.0",
            Accept: "*/*"
        },
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
        timeout: 30000
    });

    const output = res.data;
    if (typeof output === "string" && output.trim().startsWith("http")) {
        return output.trim();
    }
    if (typeof output === "string") {
        return `https://athars.space/${output.trim()}`;
    }
    throw new Error("Gagal generate URL dari server");
}