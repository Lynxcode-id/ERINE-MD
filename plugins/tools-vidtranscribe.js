import azbryTranscriber from '../scrape/azbry-transcriber.js';
import chatGpt from '../scrape/gpt.js';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text || !/^https?:\/\//i.test(text)) {
        return m.reply(`❌ Link videonya mana cuy?\n\n*Contoh:* ${usedPrefix + command} https://api.azbry.com/api/tools/transcriber?url=https%3A%2F%2Fyoutube.com%2Fshorts%2FkB4ajOjTfwg%3Fsi%3Dw1XFnWCpjoPMISJu&lang=id`);
    }

    await m.react('⏳');

    try {
        const res = await azbryTranscriber(text);
        
        if (!res.status || !res.result || !res.result.transcript) {
            throw new Error('Hasil transkripsi kosong atau gagal diproses.');
        }

        const data = res.result;
        const originalText = data.transcript;
        
        const gptPrompt = `Tolong terjemahkan teks transkripsi video berikut ini ke dalam Bahasa Indonesia dan Bahasa Inggris. Format balasannya seperti ini:\n\n[ 🇮🇩 INDONESIA ]\n(hasil terjemahan)\n\n[ 🇺🇸 ENGLISH ]\n(hasil terjemahan)\n\nTeks asli:\n"${originalText}"`;
        
        const translatedText = await chatGpt(gptPrompt);

        if (!translatedText) throw new Error('ChatGPT gagal merespon terjemahan.');

        let caption = `┌˚₊ ๑│ ᴠ ɪ ᴅ ᴇ ᴏ  ᴛ ʀ ᴀ ɴ s ᴄ ʀ ɪ ʙ ᴇ │๑˚₊ 📝
┇ 
│ 🎬 *Judul:* ${data.title || '-'}
│ 📊 *Total Segmen:* ${data.total_segments || 0}
┇ 
│ 💬 *Teks Asli:*
│ ${originalText}
┇ 
│ 🌐 *Terjemahan:*
│ ${translatedText}
┇ 
└˚₊ ๑ ────────────── ๑˚₊
> © ERINE-AI X INF-PROJECTS`;

        await conn.sendMessage(m.chat, {
            text: caption.trim(),
            contextInfo: {
                isForwarded: true,
                forwardingScore: 9999,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: "120363400612665352@newsletter",
                    newsletterName: "🌟 ᴇʀɪɴᴇ-ᴍᴅ ɪɴғᴏʀᴍᴀᴛɪᴏɴ",
                    serverMessageId: -1
                }
            }
        }, { quoted: m });

        await m.react('✅');

    } catch (e) {
        console.error('[VID TRANSCRIBE ERROR]', e);
        await m.react('❌');
        m.reply(`┌˚₊ ๑│ s ʏ s ᴛ ᴇ ᴍ  ᴇ ʀ ʀ ᴏ ʀ │๑˚₊ ❌\n┇ Gagal memproses transcribe:\n┇ ${e.message || e}\n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-MD`);
    }
}

handler.help = ['vidtranscribe <link>', 'vtxt <link>'];
handler.tags = ['tools'];
handler.command = /^(vidtranscribe|vtxt|videototext)$/i;
handler.limit = true;

export default handler;