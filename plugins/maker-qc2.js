import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    let who = m.quoted ? m.quoted.sender : m.sender;
    let name = conn.getName(who) || m.pushName || 'User';
    let qText = m.quoted && m.quoted.text ? m.quoted.text : text;

    if (!qText) {
        throw `Kirim teks atau balas pesan orang dengan command *${usedPrefix + command}*\n\n💡 Contoh: *${usedPrefix + command} Halo Jagoan Project*`;
    }

    await m.reply('⏳ *Sedang memproses QC...*');

    try {
        let pfpUrl;
        try {
            pfpUrl = await conn.profilePictureUrl(who, 'image');
        } catch (e) {
            pfpUrl = 'https://i.ibb.co/3Fh9Q6M/empty-profile.png'; 
        }

        let color = 'white'; 
        let apiUrl = `https://api.jagoanproject.biz.id/api/maker/qc2?name=${encodeURIComponent(name)}&text=${encodeURIComponent(qText)}&color=${color}&url=${encodeURIComponent(pfpUrl)}&output=url`;
        
        let response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer jg_9cTY7aSGLdqZErDysaLfO6Wn' 
            }
        });
        
        const contentType = response.headers.get('content-type');
        
        if (contentType && contentType.includes('application/json')) {
            let json = await response.json();
            if (!json.status) throw json.message || 'Gagal memproses gambar dari API Jagoan Project.';
            
            let resultImage = json.data?.result?.url || json.result?.url;
            await conn.sendMessage(m.chat, {
                image: { url: resultImage },
                caption: `✅ *Berhasil membuat QC!*`
            }, { quoted: m });
            
        } else {
            let imageBuffer = await response.buffer();
            await conn.sendMessage(m.chat, {
                image: imageBuffer,
                caption: `✅ *Berhasil membuat QC!*`
            }, { quoted: m });
        }

    } catch (e) {
        console.error(e);
        m.reply(`❌ *Terjadi kesalahan:* ${e.message || e}`);
    }
}

handler.help = ['qc2'];
handler.tags = ['maker'];
handler.command = /^(qc2)$/i; 
handler.limit = true;

export default handler;