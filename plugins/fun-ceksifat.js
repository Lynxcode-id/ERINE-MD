import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    let name = '';
    
    if (m.mentionedJid && m.mentionedJid[0]) {
        name = conn.getName(m.mentionedJid[0]) || m.mentionedJid[0].split('@')[0];
    } else if (text) {
        name = text;
    } else {
        name = conn.getName(m.sender) || m.pushName || 'User';
    }

    await m.reply('⏳ *Mendeteksi sifat...*');

    try {
        let apiUrl = `https://api.jagoanproject.biz.id/api/fun/ceksifat?name=${encodeURIComponent(name)}`;
        
        let response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer jg_9cTY7aSGLdqZErDysaLfO6Wn' 
            }
        });
        
        let json = await response.json();

        if (!json.status) throw 'Gagal mengecek dari API Jagoan Project.';

        let resultText = json.result;

        await conn.sendMessage(m.chat, {
            text: resultText,
            mentions: m.mentionedJid 
        }, { quoted: m });

    } catch (e) {
        console.error(e);
        m.reply(`❌ *Terjadi kesalahan:* ${e.message || e}`);
    }
}

handler.help = ['ceksifat <nama/tag>'];
handler.tags = ['fun'];
handler.command = /^(ceksifat|sifat)$/i; 
handler.limit = true;

export default handler;