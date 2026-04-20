/** * ───「 INFO OWNER & COMMUNITY 」───✧
 * 👤 Author  : LYNX DECODE { FEMULA + CARBEAT }
 * 🚀 Channel : https://whatsapp.com/channel/0029Vb1CcDWDp2Q5YT4FZn1k
 * 📝 Note  : Ambil boleh aja cr jangan di hapus hargai creator!!
 * ────────────────────────✧
 */

const handler = async (m, { conn, text, command, participants, isOwner }) => {
    // --- AMBIL DATA GRUP ---
    let prtps = participants;
    if (!prtps || prtps.length === 0) {
        const meta = await conn.groupMetadata(m.chat).catch(e => {}) || {};
        prtps = meta.participants || [];
    }

    // 🔥 FIX: Potong kode device dari nomor si pengirim (m.sender)
    const senderNumber = m.sender.split(':')[0].split('@')[0];

    // Cek admin dengan mencocokkan angka murninya saja!
    const isUserAdmin = prtps.some(p => p.id.includes(senderNumber) && (p.admin === 'admin' || p.admin === 'superadmin'));
    const isBotOwner = isOwner || (global.owner && global.owner.includes(senderNumber));

    // Kalau bukan admin dan bukan owner, tendang!
    if (!isUserAdmin && !isBotOwner) return m.reply('❌ HANYA ADMIN YANG DAPAT MENGAKSES FITUR INI');
    
    // -------------------------------------------

    const target = m.quoted ? m.quoted.sender : m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : text ? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : null;
    const cmdWithTarget = ['add', 'kick', 'promote', 'demote'];

    if (cmdWithTarget.includes(command) && !target) return m.reply('❌ Reply/tag siapa yang ingin di proses.');

    const inGc = prtps.some((v) => target && v.id.includes(target.split('@')[0]));
    
    let botJid = conn.user?.id?.split(':')[0] || conn.user?.jid?.split(':')[0] || conn.user?.id?.split('@')[0] || '';
    botJid = botJid.replace(/[^0-9]/g, '');

    // EKSEKUSI LANGSUNG (TRY-CATCH)
    try {
        switch (command) {
            case 'add':
                {
                    if (inGc) return m.reply('❌ User sudah ada didalam grup!');
                    const response = await conn.groupParticipantsUpdate(m.chat, [target], 'add');
                    const jpegThumbnail = await conn.profilePictureUrl(m.chat, 'image').catch(_ => null);

                    for (const participant of response) {
                        const jid = participant.content?.attrs?.phone_number || participant.content?.attrs?.jid || target;
                        const status = participant.status;

                        if (status === '408') {
                            m.reply(`❌ Tidak dapat menambahkan @${jid.split('@')[0]}!\nMungkin dia baru keluar dari grup ini atau dikick.`);
                        } else if (status === '403') {
                            const inviteCode = participant.content?.content?.[0]?.attrs?.code;
                            const inviteExp = participant.content?.content?.[0]?.attrs?.expiration;
                            if (inviteCode) {
                                await m.reply(`⏳ Mengundang @${jid.split('@')[0]} menggunakan link invite...`);
                                await conn.sendGroupV4Invite(m.chat, jid, inviteCode, inviteExp, 'Grup', 'Undangan untuk bergabung ke grup WhatsApp', jpegThumbnail);
                            }
                        } else {
                            m.reply(`✅ Berhasil menambahkan @${jid.split('@')[0]}`);
                        }
                    }
                }
                break;

            case 'kick':
                if (!inGc) return m.reply('❌ User tidak ada dalam grup.');
                if (target.includes(botJid)) return m.reply('❌ Gak bisa kick bot sendiri anjir!');
                await conn.groupParticipantsUpdate(m.chat, [target], 'remove');
                m.reply(`✅ Berhasil kick: @${target.split('@')[0]}`);
                break;

            case 'promote':
                if (!inGc) return m.reply('❌ User tidak berada dalam grup!');
                await conn.groupParticipantsUpdate(m.chat, [target], 'promote');
                m.reply(`✅ Promote: @${target.split('@')[0]}`);
                break;

            case 'demote':
                if (!inGc) return m.reply('❌ User tidak berada dalam grup!');
                await conn.groupParticipantsUpdate(m.chat, [target], 'demote');
                m.reply(`✅ Demote: @${target.split('@')[0]}`);
                break;

            case 'closegc':
            case 'mute':
                await conn.groupSettingUpdate(m.chat, 'announcement');
                m.reply('✅ Grup berhasil ditutup (hanya admin yang bisa chat).');
                break;

            case 'opengc':
            case 'unmute':
                await conn.groupSettingUpdate(m.chat, 'not_announcement');
                m.reply('✅ Grup berhasil dibuka (semua member bisa chat).');
                break;

            default:
                return m.reply('Perintah tidak dikenal.');
        }
    } catch (error) {
        console.error(error);
        m.reply('❌ Gagal mengeksekusi perintah!\n\n_Pastikan bot sudah diangkat menjadi Admin Grup._');
    }
};

handler.help = ['add', 'kick', 'promote', 'demote', 'closegc', 'opengc'];
handler.tags = ['group'];
handler.command = /^(add|kick|promote|demote|mute|unmute|closegc|opengc)$/i;
handler.group = true;

handler.admin = false;
handler.botAdmin = false;

export default handler;