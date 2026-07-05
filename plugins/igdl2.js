import fetch from 'node-fetch'; 

let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) throw `Kirim perintah dengan link!\n*Contoh:* ${usedPrefix + command} https://www.instagram.com/p/xxx/`;
    if (!args[0].match(/instagram\.com/i)) throw `Linknya gak valid cuy! Pastikan itu link Instagram.`;

    m.reply('⏳ Tunggu sebentar ya cuy, lagi diproses...');

    try {
        // Trik Ampuh: Bersihin link IG dari parameter tracking (?igsh= dll)
        let linkIg = args[0].split('?')[0]; 
        
        // Fetch ke API pakai link yang udah bersih
        const apiUrl = `https://api-faa.my.id/faa/igdl?url=${linkIg}`;
        const response = await fetch(apiUrl);
        
        const textResponse = await response.text();
        let json;
        try {
            json = JSON.parse(textResponse);
        } catch (e) {
            console.error("❌ Response dari API bukan JSON:", textResponse.substring(0, 150));
            throw 'Waduh, API-nya masih nolak cuy (kena Cloudflare/HTML). Coba restart panel bentar.';
        }

        if (!json.status) throw 'Gagal mengambil data, mungkin link diprivate atau API lagi gangguan.';

        const { url, metadata } = json.result;
        
        let textCaption = `📱 *INSTAGRAM DOWNLOADER*\n\n` +
                          `👤 *Username:* ${metadata.username}\n` +
                          `❤️ *Likes:* ${metadata.like}\n` +
                          `💬 *Comments:* ${metadata.comment}\n` +
                          `📝 *Caption:* ${metadata.caption}`;

        for (let i = 0; i < url.length; i++) {
            let mediaUrl = url[i];
            let currentCaption = (i === 0) ? textCaption : '';

            if (metadata.isVideo) {
                await conn.sendMessage(m.chat, { video: { url: mediaUrl }, caption: currentCaption }, { quoted: m });
            } else {
                await conn.sendMessage(m.chat, { image: { url: mediaUrl }, caption: currentCaption }, { quoted: m });
            }
        }

    } catch (error) {
        console.error("Error IG Downloader:", error); 
        m.reply(typeof error === 'string' ? error : 'Waduh, terjadi kesalahan pada server cuy.');
    }
}

handler.help = ['igdl2', 'ig2'].map(v => v + ' <url>');
handler.tags = ['downloader'];
handler.command = /^(ig2|igdl2)$/i;

export default handler;