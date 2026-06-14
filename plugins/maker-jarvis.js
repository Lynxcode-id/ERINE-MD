import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    let input = text ? text : (m.quoted && m.quoted.text ? m.quoted.text : '');
    
    if (!input) {
        return m.reply(`Teksnya mana cuy?\n\n💡 *Contoh:* ${usedPrefix + command} jarvis, tolong anu nya di anukan dulu terus di anuin\n\nAtau lu juga bisa *reply* pesan orang dengan command *${usedPrefix + command}*`);
    }

    await m.reply('⏳ *Processing Jarvis Meme...*');

    try {
        let apiUrl = `https://api.cuki.biz.id/api/canvas/meme/jarvis?apikey=cuki-x&text=${encodeURIComponent(input)}`;
        
        await conn.sendMessage(m.chat, {
            image: { url: apiUrl },
            caption: `🤖 *Jarvis:* Siap, dilaksanakan.`
        }, { quoted: m });

    } catch (e) {
        console.error(e);
        m.reply(`❌ *Terjadi kesalahan:* API sedang down atau error.\n\n_Log: ${e.message}_`);
    }
}

handler.help = ['jarvis <teks>'];
handler.tags = ['maker', 'fun'];
handler.command = /^(memejarvis|jarvis)$/i;
handler.limit = true;

export default handler;