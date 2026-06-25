/**
 * ───「 FEATURE AUTHOR 」───
 * 📝 Plugin : Kick Sider (Ghost Members)
 */

let handler = async (m, { conn, participants, isAdmin, isBotAdmin }) => {
    if (!isAdmin) return m.reply('❌ Khusus Admin grup cuy!');
    if (!isBotAdmin) return m.reply('❌ Bot harus jadi Admin dulu!');

    await m.react('⏳');

    let siderList = [];
    let chat = global.db.data.chats[m.chat] || {};
    let users = global.db.data.users || {};

    // Cek seluruh partisipan grup
    participants.forEach(x => {
        let jid = x.id;
        let isAdm = x.admin !== null;
        let isBot = jid === conn.user.jid;

        // Skip kalau dia admin atau bot
        if (isAdm || isBot) return;

        // Cek kapan terakhir kali dia chat dari database (asumsi lu nyimpen waktu chat di users)
        let lastChat = users[jid]?.lastChat || 0;
        let now = new Date() * 1;
        let daysInactive = (now - lastChat) / (1000 * 60 * 60 * 24);

        // Kalau lebih dari 14 hari gak ada riwayat chat, masuk blacklist sider
        if (daysInactive > 14 || !lastChat) {
            siderList.push(jid);
        }
    });

    if (siderList.length === 0) {
        await m.react('✅');
        return m.reply(`┌˚₊ ๑│ ᴀ ɴ ᴛ ɪ  s ɪ ᴅ ᴇ ʀ │๑˚₊ 👻\n┇ \n│ Mantap cuy! Grup ini aktif semua, gak ada sider/member hantu.\n┇ \n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI X LYNX DECODE`);
    }

    m.reply(`🧹 *Ditemukan ${siderList.length} Sider (Tidak aktif > 14 Hari)!*\nMengeksekusi pembersihan...`);

    let success = 0;
    for (let target of siderList) {
        await new Promise(resolve => setTimeout(resolve, 2000)); // Delay 2s biar aman
        try {
            await conn.groupParticipantsUpdate(m.chat, [target], 'remove');
            success++;
        } catch (e) {}
    }

    m.reply(`✅ *Pembersihan Selesai!*\nBerhasil menendang ${success}/${siderList.length} sider.`);
}

handler.help = ['kicksider', 'bersihsider'];
handler.tags = ['group'];
handler.command = /^(kicksider|bersihsider)$/i;
handler.group = true;

export default handler;