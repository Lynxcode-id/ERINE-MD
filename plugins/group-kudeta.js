/**
 * ───「 FEATURE AUTHOR 」───
 * 📝 Plugin : Demote All Admins
 */

let handler = async (m, { conn, participants, isAdmin, isOwner, isBotAdmin }) => {
    // Cuma Owner Bot atau Admin Grup yang bisa pakai
    if (!isAdmin && !isOwner) return m.reply('❌ Khusus Admin/Owner!');
    if (!isBotAdmin) return m.reply('❌ Bot harus jadi Admin dulu cuy!');

    await m.react('🚨');

    // Cari tahu siapa owner grup
    let groupOwner = participants.find(p => p.isSuperAdmin)?.id || participants[0]?.id;

    // Filter semua admin selain bot, pembuat perintah, dan owner grup
    let adminsToDemote = participants
        .filter(v => v.admin !== null && v.id !== conn.user.jid && v.id !== m.sender && v.id !== groupOwner)
        .map(v => v.id);

    if (adminsToDemote.length === 0) {
        return m.reply('❌ Tidak ada admin yang bisa di-demote.');
    }

    m.reply(`🚨 *Mengeksekusi Kudeta Massal...*\nMenurunkan jabatan ${adminsToDemote.length} Admin.`);

    let success = 0;
    for (let target of adminsToDemote) {
        await new Promise(resolve => setTimeout(resolve, 1500)); // Delay aman
        try {
            await conn.groupParticipantsUpdate(m.chat, [target], 'demote');
            success++;
        } catch (e) {}
    }

    m.reply(`✅ *Kudeta Selesai!*\nBerhasil men-demote ${success}/${adminsToDemote.length} Admin.`);
}

handler.help = ['demoteall', 'kudetaall'];
handler.tags = ['group'];
handler.command = /^(demoteall|kudetaall|cleardmin)$/i;
handler.group = true;

export default handler;