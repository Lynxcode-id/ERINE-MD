import fetch from 'node-fetch';

let handler = async (m, { conn, args, usedPrefix, command }) => {
    // Validasi input dari user
    if (!args[0]) throw `Kirim link Facebook yang mau di-download!\n\n💡 Contoh: *${usedPrefix + command} https://www.facebook.com/100044406976954/videos/1091456635297959/*`;
    
    if (!args[0].match(/(?:https?:\/\/)?(?:www\.)?(?:facebook\.com|fb\.watch|fb\.com|fb\.gg)/i)) {
        throw '⚠️ Link yang lu kirim bukan link Facebook yang valid cuy!';
    }

    await m.reply('⏳ *Sedang mengambil video dari Facebook...*');

    try {
        let apiUrl = `https://api.ryzumi.net/api/downloader/facebook?url=${encodeURIComponent(args[0])}`;
        
        // User Agent biar aman dari blokir API
        const fakeUserAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

        let response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'accept': 'application/json',
                'User-Agent': fakeUserAgent
            }
        });

        let json = await response.json();

        // Validasi response dari API Ryzumi
        if (!json.success || !json.result) throw 'Gagal mengambil data. Pastikan link tidak di-private atau coba lagi nanti.';

        let result = json.result;
        
        // Ambil array video dari respons JSON (biasanya yang pertama itu kualitas HD)
        let videoData = result.media?.videos?.[0] || result.media?.all?.[0];
        
        if (!videoData || !videoData.url) throw 'Video tidak ditemukan di dalam link tersebut.';

        // Bikin caption yang rapi
        let titleShort = result.title ? result.title.substring(0, 60) + '...' : 'Tidak ada judul';
        
        let captionMsg = `╭─⟡ *F A C E B O O K  D L* ⟡─╮\n`;
        captionMsg += `│ 🎬 *Title:* ${titleShort}\n`;
        captionMsg += `│ 🌟 *Quality:* ${videoData.quality || 'N/A'}\n`;
        captionMsg += `╰─────────────────────────⟡\n\n`;
        captionMsg += `> _Berhasil mendownload video._ 🚀`;

        // Kirim videonya ke chat
        await conn.sendMessage(m.chat, {
            video: { url: videoData.url },
            caption: captionMsg
        }, { quoted: m });

    } catch (e) {
        console.error(e);
        m.reply(`❌ *Terjadi kesalahan:* ${e.message || e}`);
    }
}

handler.help = ['facebook', 'fbdl'];
handler.tags = ['downloader'];
handler.command = /^(facebook|fbdl|fb)$/i;
handler.limit = true;

export default handler;