/**
 * ╭───「 𝗙𝗘𝗔𝗧𝗨𝗥𝗘 𝗔𝗨𝗧𝗛𝗢𝗥 」───
 * │ 👤 Developer : Lynx Decode
 * ╰─────────────────────────
 * 📝 Plugin      : Sticker.ly (Native Pack Version)
 */

import axios from 'axios';
import { getSearchStickerLy, getStickerLyPack } from '../scrape/stickerly.js'; // Sesuaikan path scrape lu
import { sendNativeStickerPack } from '../lib/stickerpack.js'; // Import fungsi rakitan lu

const delay = ms => new Promise(res => setTimeout(res, ms));
const MAX_STICKERS = 25; 
const DOWNLOAD_DELAY = 700;

async function downloadBuffer(url) {
    const res = await axios.get(url, {
        responseType: "arraybuffer",
        timeout: 15000,
        headers: { 
            "User-Agent": "androidapp.stickerly/3.31.0",
            "Accept": "image/webp,image/apng,image/*,*/*;q=0.8"
        },
    });
    return Buffer.from(res.data);
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        return m.reply(`⚠️ Format salah!\n\n📌 *Cara Pakai:*\n${usedPrefix + command} <query/link>\n\n*Contoh:*\n${usedPrefix + command} pentol`);
    }

    await m.react('⏳');

    try {
        let packData;
        let packId = '';
        const isUrl = text.match(/sticker\.ly/i);

        if (isUrl) {
            packId = text.match(/sticker\.ly\/s\/([A-Z0-9]+)/i)?.[1] || text.match(/sticker\.ly\/([A-Z0-9]+)/i)?.[1] || '';
            const res = await getStickerLyPack(text);
            if (!res.status || !res.result) throw new Error(res.error || 'Gagal mengambil data pack.');
            packData = res.result.result || res.result.data || res.result;
        } else {
            const res = await getSearchStickerLy(text);
            if (!res.status || !res.result) throw new Error(res.error || 'Gagal mencari stiker.');
            
            let searchData = res.result.result || res.result.data || res.result;
            let packs = searchData.stickerPacks || searchData.packs || searchData.list || [];
            if (!packs.length) throw new Error(`Pencarian untuk *${text}* tidak ditemukan.`);

            let firstPack = packs[0];
            packId = firstPack.packId || firstPack.id || firstPack.pack_id;
            
            const detailRes = await getStickerLyPack(`https://sticker.ly/s/${packId}`);
            if (!detailRes.status || !detailRes.result) throw new Error('Gagal mengambil detail pack dari pencarian.');
            packData = detailRes.result.result || detailRes.result.data || detailRes.result;
        }

        let nameRaw = packData.name || packData.packName || packData.title || packData.pack_name;
        let packName = nameRaw ? nameRaw : 'Sticker.ly Pack';
        
        let authorRaw = packData.authorName || packData.author || packData.publisher;
        let author = authorRaw ? authorRaw : 'Lynx Decode';
        
        let stickers = packData.stickers || packData.stickerList || (packData.pack && packData.pack.stickers) || [];

        if (!stickers.length) throw new Error('Stiker tidak ditemukan di dalam pack ini.');

        let limitCount = Math.min(stickers.length, MAX_STICKERS);
        await m.reply(`📦 *Memproses Pack:* ${packName}\nTotal: ${limitCount} stiker\n\n_Erine sedang menyusun Native Sticker Pack..._`);

        const stickerBuffers = [];

        // DOWNLOAD BUFFER
        for (let i = 0; i < limitCount; i++) {
            let stikerData = stickers[i];
            let stikerUrl = '';

            if (stikerData.imageUrl) {
                stikerUrl = stikerData.imageUrl;
            } else if (stikerData.fileName && packId) {
                if (stikerData.stickerPack && stikerData.stickerPack.trayResourceUrl) {
                    let trayUrl = stikerData.stickerPack.trayResourceUrl;
                    stikerUrl = trayUrl.substring(0, trayUrl.lastIndexOf('/') + 1) + stikerData.fileName;
                } else {
                    stikerUrl = `https://stickerly.pstatic.net/sticker_pack/${packId}/${stikerData.fileName}`;
                }
            } else if (typeof stikerData === 'string') {
                stikerUrl = stikerData.startsWith('http') ? stikerData : `https://stickerly.pstatic.net/sticker_pack/${packId}/${stikerData}`;
            }

            if (!stikerUrl) continue;

            try {
                const buf = await downloadBuffer(stikerUrl);
                stickerBuffers.push(buf);
                await delay(DOWNLOAD_DELAY);
            } catch (e) {
                continue; 
            }
        }

        if (!stickerBuffers.length) {
            await m.react('❌');
            return m.reply(`❌ Gagal mendownload stiker dari server.`);
        }

        // EKSEKUSI PENGIRIMAN (NATIVE PACK SYSTEM)
        try {
            await sendNativeStickerPack(conn, m.chat, stickerBuffers, {
                packname: packName,
                author: author
            }, m);

            await m.react('✅');
            // Gak usah kirim pesan apa-apa lagi biar chatnya rapih dan estetik
        } catch (packErr) {
            console.error('[Native Pack Error]', packErr);
            await m.react('❌');
            await m.reply(`❌ Gagal memuat Native Pack.\n> *Detail:* ${packErr.message}`);
        }

    } catch (error) {
        console.error('[StickerLy Error]', error);
        await m.react('❌');
        m.reply(`❌ Terjadi kesalahan sistem.\n> *Detail:* ${error.message}`);
    }
};

handler.help = ['stickerly <query/link>'];
handler.tags = ['search', 'maker'];
handler.command = /^(stickerly2|stly2|stickerpack)$/i;
handler.limit = true;

export default handler;