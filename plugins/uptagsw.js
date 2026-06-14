let handler = async (m, { conn, text, command, usedPrefix, isOwner }) => {
    if (!isOwner) return m.reply('Fitur ini khusus owner cuy!');

    let idgc;
    let finalCaption = text || ''; 

    // 1. Cek apakah dipake di dalem grup atau di private chat
    if (m.isGroup) {
        // Kalau di dalem grup, otomatis ambil ID grup ini
        idgc = m.chat;
    } else {
        // Kalau di PC, pastikan ada input teks buat ID
        if (!text) {
            let getGroups = await conn.groupFetchAllParticipating();
            let groups = Object.values(getGroups);
            
            // Pake teks manual aja biar anti error "null" (No Button)
            let list = `*🏷️ DAFTAR GRUP ERINE*\n\n`;
            groups.forEach((g, i) => {
                list += `*${i + 1}. ${g.subject}*\nID: \`${g.id}\`\n\n`;
            });
            list += `*Cara pakai di Private Chat:*\nReply media dengan:\n*${usedPrefix + command} <ID_GRUP>*\n\n_💡 Tips: Lu bisa langsung pake command ini di dalem grupnya biar otomatis tanpa masukin ID._`;
            
            return m.reply(list);
        }
        
        // Asumsi kata pertama adalah ID grup, sisanya caption
        idgc = text.trim().split(' ')[0]; 
        finalCaption = text.replace(idgc, '').trim(); 
    }

    if (!idgc.endsWith('@g.us')) {
        return m.reply('ID grup gak valid cuy, pastiin ujungnya ada @g.us nya!');
    }

    // Ambil data grup
    let groupMetadata = await conn.groupMetadata(idgc).catch(e => {});
    if (!groupMetadata) {
        return m.reply('Waduh, bot kayaknya gak dapet data grup itu deh.');
    }

    // Ambil ID semua member buat viewer SW
    let participants = groupMetadata.participants.map(v => v.id);

    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || '';
    let caption = q.text || finalCaption || ''; 

    if (!mime && !caption) {
        return m.reply(`Reply foto/video atau kirim teks yang mau di up cuy!`);
    }

    try {
        m.reply(`Lagi nge-up SW dan ngetag grup *${groupMetadata.subject}*... ⏳`);

        let messageOptions = {};
        let groupTag = [idgc]; // Mentions ID Grup biar muncul "@ Menyebut grup ini"

        if (/image/i.test(mime)) {
            let buffer = await q.download();
            messageOptions = { image: buffer, caption: caption, mentions: groupTag };
        } else if (/video/i.test(mime)) {
            let buffer = await q.download();
            messageOptions = { video: buffer, caption: caption, mentions: groupTag };
        } else if (/audio/i.test(mime)) {
            let buffer = await q.download();
            messageOptions = { audio: buffer, mimetype: 'audio/mp4', ptt: true, mentions: groupTag }; 
        } else {
            messageOptions = { text: caption, mentions: groupTag };
        }

        // Kirim ke SW
        await conn.sendMessage('status@broadcast', messageOptions, {
            backgroundColor: '#000000',
            font: 1,
            statusJidList: participants // Biar member bisa liat
        });

        m.reply(`Berhasil cuy! SW udah naik dengan tag grup *${groupMetadata.subject}* 🚀`);
    } catch (err) {
        console.error(err);
        m.reply('Gagal cuy, ada error: ' + err.message);
    }
};

handler.help = ['uptagsw'];
handler.tags = ['owner'];
handler.command = /^(uptagsw)$/i;
handler.owner = true;

export default handler;