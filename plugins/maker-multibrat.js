/**
 * 📝 Plugin: Maker Brat Anime Series
 * 👤 Developer: Lynx Decode
 */

let handler = async (m, { conn, text, command }) => {
    if (!text) return m.reply(`⚠️ Masukkan teks buat di-brat!\n\nContoh: .${command} halo saya lynx`);
    
    const endpointMap = {
        'bratanime2': 'bratanime2',
        'bratcewe': 'bratcewe',
        'bratchika': 'bratchika',
        'bratkobato': 'bratkobato',
        'bratnezuko': 'bratnezuko',
        'bratruromiya': 'bratruromiya'
    };

    let endpoint = endpointMap[command.toLowerCase()];
    await m.react('⏳');

    try {
        let api = `https://api.theresav.biz.id/maker/${endpoint}?text=${encodeURIComponent(text)}&apikey=x34J0`;
        await conn.sendMessage(m.chat, { 
            image: { url: api }, 
            caption: `✅ Brat Sticker: ${command}` 
        }, { quoted: m });
        await m.react('✅');
    } catch (e) {
        await m.react('❌');
        m.reply(`❌ Gagal membuat gambar brat: ${e.message}`);
    }
};

handler.help = ['bratanime2', 'bratcewe', 'bratchika', 'bratkobato', 'bratnezuko', 'bratruromiya'];
handler.tags = ['maker'];
handler.command = /^(bratanime2|bratcewe|bratchika|bratkobato|bratnezuko|bratruromiya)$/i;
handler.limit = true;

export default handler;