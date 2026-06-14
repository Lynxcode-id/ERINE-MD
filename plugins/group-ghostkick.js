/**
 * ───「 FEATURE AUTHOR 」───
 * 📝 Plugin : Silent/Ghost Kick
 */

let handler = async (m, { conn, usedPrefix, command, isAdmin, isBotAdmin }) => {
    if (!isAdmin) return m.reply('❌ Khusus Admin grup!');
    if (!isBotAdmin) return m.reply('❌ Bot harus jadi Admin dulu!');

    let target = m.mentionedJid[0] || (m.quoted ? m.quoted.sender : null);

    if (!target) {
        return m.reply(`❌ Reply pesan atau tag orang yang mau di-kick senyap!\n\n*Contoh:*\n${usedPrefix + command} @user`);
    }

    if (target === conn.user.jid) return m.reply('❌ Masa bot disuruh nge-kick diri sendiri.');
    if (target === m.sender) return m.reply('❌ Lah, mau keluar mah left aja sendiri cuy.');

    await m.react('🤫');

    try {
        await conn.groupParticipantsUpdate(m.chat, [target], 'remove');
    } catch (e) {
        console.error('[GHOST KICK ERROR]', e);
        m.reply('❌ Gagal mengeksekusi ghost kick. Pastikan target valid.');
    }
}

handler.help = ['ghostkick @user', 'kicksenyap @user'];
handler.tags = ['group', 'admin'];
handler.command = /^(ghostkick|kicksenyap|skick)$/i;
handler.group = true;

export default handler;