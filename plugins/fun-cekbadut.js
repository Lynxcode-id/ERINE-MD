import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    let name = '';
    
    // Cek apakah ada user yang di-tag
    if (m.mentionedJid && m.mentionedJid[0]) {
        name = conn.getName(m.mentionedJid[0]) || m.mentionedJid[0].split('@')[0];
    } else if (text) {
        // Jika tidak ada tag, tapi ada teks (nama)
        name = text;
    } else {
        // Jika tidak ada input sama sekali, pakai nama pengirim
        name = conn.getName(m.sender) || m.pushName || 'User';
    }

    await m.reply('⏳ *Mendeteksi tingkat kebadutan...*');

    try {
        let apiUrl = `https://api.jagoanproject.biz.id/api/fun/cekbadut?name=${encodeURIComponent(name)}`;
        
        let response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer jg_9cTY7aSGLdqZErDysaLfO6Wn' 
            }
        });
        
        let json = await response.json();

        if (!json.status) throw 'Gagal mengecek badut dari API Jagoan Project.';

        let resultText = json.result;

        await conn.sendMessage(m.chat, {
            text: resultText,
            mentions: m.mentionedJid // Mentions user yang di-tag di hasil chat
        }, { quoted: m });

    } catch (e) {
        console.error(e);
        m.reply(`❌ *Terjadi kesalahan:* ${e.message || e}`);
    }
}

handler.help = ['cekbadut <nama/tag>'];
handler.tags = ['fun'];
handler.command = /^(cekbadut|badut)$/i; 
handler.limit = true;

export default handler;