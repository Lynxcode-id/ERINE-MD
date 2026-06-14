/**
 * ╭───「 𝗙𝗘𝗔𝗧𝗨𝗥𝗘 𝗔𝗨𝗧𝗛𝗢𝗥 」───
 * │ 👤 Developer : Lynx Decode
 * ╰─────────────────────────
 * 📝 Plugin      : IG Downloader (Album System)
 */

import axios from 'axios';

let handler = async (m, { conn, args, text, usedPrefix, command }) => {
    let input = args[0] || text || m.quoted?.text || '';
    let urlMatch = input.match(/https?:\/\/(?:www\.)?instagram\.com\/[^\s]+/i);
    let igUrl = urlMatch ? urlMatch[0] : null;

    if (!igUrl) {
        return m.reply(`⚠️ Link tidak valid!\n\n📌 *Contoh Penggunaan:*\n${usedPrefix + command} https://www.instagram.com/p/xxxxxx/`);
    }

    await m.react('⏳');

    try {
        let api = `https://api.theresav.biz.id/download/ig?url=${encodeURIComponent(igUrl)}&apikey=x34J0`;
        let { data } = await axios.get(api);

        if (!data.status || !data.result?.success) {
            throw new Error('Gagal mengambil data dari server Instagram.');
        }

        let mediaList = data.result.media;
        if (!Array.isArray(mediaList) || !mediaList.length) {
            throw new Error('Media tidak ditemukan atau akun di-private.');
        }

        let caption = `╭───「 𝗜𝗚 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗𝗘𝗥 」
│ ∘ *Status:* Berhasil
│ ∘ *Total:* ${data.result.mediaCount} Media
│ ∘ *Source:* Instagram
╰─────────────────────────
> _Sedang mengirim media, mohon tunggu..._`;

        await m.reply(caption);

        for (let i = 0; i < mediaList.length; i++) {
            let media = mediaList[i];
            let isVideo = media.type === 'video';
            let downloadUrl = media.downloadUrl || media.url; 
            
            if (!downloadUrl) continue;

            // Dihilangkan parameter { quoted: m } agar WA otomatis menyatukannya menjadi Album
            await conn.sendMessage(m.chat, {
                [isVideo ? 'video' : 'image']: { url: downloadUrl },
                caption: i === 0 ? `Erine AI - Erine MD` : '' 
            });
        }

        await m.react('✅');

    } catch (e) {
        console.error('[IG DOWNLOADER ERROR]', e);
        await m.react('❌');
        m.reply(`❌ *Terjadi Kesalahan:*\n> ${e.message}`);
    }
};

handler.help = ['ig <url>', 'instagram <url>'];
handler.tags = ['downloader'];
handler.command = /^(ig|instagram|igdl)$/i;
handler.limit = true;

export default handler;