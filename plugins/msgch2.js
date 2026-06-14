let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw (`Contoh:\n${usedPrefix}${command} Halo?`);

    let who = m.sender;
    let idch = '120363404569528126@newsletter';

    let username = conn.getName(who);
    await conn.sendMessage(m.chat, { react: { text: "🌟", key: m.key } });

    let q = m.quoted ? m.quoted : m;
    let mime = q.mimetype || '';

    let content = { text };
    if (mime.includes('image')) {
        content = { image: await q.download(), caption: text };
    } else if (mime.includes('video')) {
        content = { video: await q.download(), caption: text };
    } else if (mime.includes('audio')) {
        content = { audio: await q.download(), mimetype: 'audio/mpeg', fileName: 'iyah.mp3', ptt: true };
    }

    content.contextInfo = {
        isForwarded: true,
        forwardingScore: 9999,
        forwardedNewsletterMessageInfo: {
            newsletterJid: "120363400612665352@newsletter",
            newsletterName: "🌟 ᴇʀɪɴᴇ-ᴍᴅ ɪɴғᴏʀᴍᴀᴛɪᴏɴ",
            serverMessageId: -1
        }
    };

    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
    m.reply('PESAN MU TELAH TERKIRIM SILAHKAN CEK CHANNEL ANDA');

    await conn.sendMessage(idch, content);
};

handler.command = /^(msgch2)$/i;
handler.help = ['msgch2'];
handler.tags = ['owner'];
handler.premium = true;
handler.mods = true

export default handler;