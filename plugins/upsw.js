let handler = async (m, { conn, text, command, usedPrefix, isOwner }) => {
    // Pastiin cuma owner yang bisa pake
    if (!isOwner) return m.reply('Fitur ini khusus owner cuy!');

    // Nangkap media atau teks yang di-reply/dikirim
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || '';
    let caption = text || q.text || ''; // Ngambil caption dari teks atau media

    if (!mime && !caption) {
        return m.reply(`Kirim atau reply teks/foto/video dengan caption *${usedPrefix + command}*`);
    }

    try {
        m.reply('Tunggu bentar cuy, lagi proses upload SW... 🚀');
        
        // Ambil semua kontak private chat bot buat jadi viewer SW-nya
        // (Biar SW-nya bisa diliat sama orang-orang yang pernah chat bot)
        let chats = Object.keys(conn.chats || {}).filter(v => v.endsWith('s.whatsapp.net'));
        let jids = chats.length > 0 ? chats : [m.sender]; // Kalau kosong, minimal lu doang yang bisa liat

        let messageOptions = {};

        // Cek tipe media-nya
        if (/image/i.test(mime)) {
            let buffer = await q.download();
            messageOptions = { image: buffer, caption: caption };
        } else if (/video/i.test(mime)) {
            let buffer = await q.download();
            messageOptions = { video: buffer, caption: caption };
        } else if (/audio/i.test(mime)) {
            let buffer = await q.download();
            // Kalo audio, dibikin kayak Voice Note (PTT)
            messageOptions = { audio: buffer, mimetype: 'audio/mp4', ptt: true }; 
        } else {
            messageOptions = { text: caption };
        }

        // Proses kirim ke status
        await conn.sendMessage('status@broadcast', messageOptions, {
            backgroundColor: '#000000', // Warna background kalau cuma teks
            font: 1, // Font standar
            statusJidList: jids // Target viewer
        });

        m.reply('Berhasil cuy! SW biasa udah naik 😎');
    } catch (err) {
        console.error(err);
        m.reply('Waduh gagal cuy, error: ' + err.message);
    }
};

handler.help = ['upsw'];
handler.tags = ['owner'];
handler.command = /^(upsw)$/i;

handler.owner = true;

export default handler;