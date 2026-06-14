import fetch from 'node-fetch';
import { AIRich } from '../lib/nixcode.js';

async function shortUrl(url) {
    try {
        let res = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`);
        return await res.text();
    } catch (e) {
        return url;
    }
}

let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) return m.reply(`⚠️ Masukkan link TikTok!\n\n*Contoh:*\n${usedPrefix + command} https://vt.tiktok.com/ZSQ6M2naw/`);

    await m.react('⏳');

    try {
        let res = await fetch(`https://api.azbry.com/api/download/tiktokv2?url=${encodeURIComponent(args[0])}`);
        let json = await res.json();

        if (!json.status || !json.result) throw new Error('Gagal mengambil data dari API!');

        let { title, author, cover, downloads } = json.result;
        
        let hd = downloads.find(d => d.type === 'hd')?.url || downloads.find(d => d.type === 'mp4')?.url;
        let mp3 = downloads.find(d => d.type === 'mp3')?.url;

        let tagsMatch = title.match(/#[\w]+/g) || [];
        let tags = [...new Set(tagsMatch)].slice(0, 4);
        if (tags.length === 0) tags = ['#TikTok', '#FYP', '#Downloader'];

        let shortHd = await shortUrl(hd);
        let shortMp3 = await shortUrl(mp3);

        let cutTitle = title.length > 60 ? title.substring(0, 60) + '...' : title;

        await new AIRich(conn)
            .setTitle('🚀 TIKTOK DOWNLOADER')
            .setFooter('© INF PROJECT - Erine-MD') 
            .addSuggest(tags) 
            .addTip('✅ Berhasil mendapatkan data video!')
            .addVideo(hd)
            .addText(`📝 ${cutTitle}\n\n---\n\n👤 *Author:* @${author.username}`)
            .addProduct([
                {
                    title: '🎥 Simpan Video HD', 
                    brand: author.username, 
                    price: 'Rp 99.000', 
                    sale_price: 'Gratis', 
                    product_url: shortHd, 
                    icon_url: author.avatar, 
                    image_url: cover
                },
                {
                    title: '🎵 Simpan Audio (MP3)', 
                    brand: author.username, 
                    price: 'Rp 50.000', 
                    sale_price: 'Gratis', 
                    product_url: shortMp3, 
                    icon_url: author.avatar, 
                    image_url: cover
                }
            ]) 
            .send(m.chat, { quoted: m });

        await m.react('✅');
    } catch (e) {
        console.error('[TIKTOK AIRICH ERROR]', e);
        await m.react('❌');
        m.reply(`⚠️ *Error:*\n_${e.message || e}_`);
    }
};

handler.help = ['tiktok <url>'];
handler.tags = ['downloader'];
handler.command = /^(tiktok4|tt4|ttdl4)$/i; 
handler.limit = true;

export default handler;