/**
 * ╭───「 𝗙𝗘𝗔𝗧𝗨𝗥𝗘 𝗔𝗨𝗧𝗛𝗢𝗥 」───
 * │ 👤 Developer : Lynx Decode
 * ╰─────────────────────────
 * 📝 Plugin      : Auto Culik Sticker
 */

const OFFICIAL_GC = '120363424957729073@g.us';

const handler = async (m, { text, command, usedPrefix, isOwner }) => {
    // Biar aman, cuma Owner (Lu) yang bisa ngatur fitur ini
    if (!isOwner) return m.reply('❌ Cuma Owner yang bisa ngatur intel penculik stiker.');

    const DB = conn.db || global.db;
    const chat = DB.data.chats[m.chat] || {};
    const action = text?.toLowerCase()?.trim();

    if (['on', 'enable', 'aktif'].includes(action)) {
        chat.culikSticker = true;
        return m.reply('🕵️‍♂️ *Operasi Culik Sticker AKTIF!*\n\nSemua stiker yang dikirim di grup ini bakal otomatis dikirim ke Markas (GC Official).');
    }

    if (['off', 'disable', 'mati'].includes(action)) {
        chat.culikSticker = false;
        return m.reply('🛑 *Operasi Culik Sticker DIMATIKAN.*');
    }

    return m.reply(`📌 *STATUS CULIK STICKER*\n\nStatus di grup ini: ${chat.culikSticker ? 'ON ✅' : 'OFF ❌'}\n\n*Cara pakai:*\n• ${usedPrefix + command} on\n• ${usedPrefix + command} off`);
};

handler.help = ['culiksticker <on/off>'];
handler.tags = ['owner', 'group'];
handler.command = /^(culiksticker|culik|autoculik)$/i;
handler.group = true;
handler.owner = true; // Kunci khusus Owner biar admin grup ga bisa nyalain/matiin sembarangan

// =========================================
// SISTEM MATA-MATA (Latar Belakang)
// =========================================
export async function before(m, { conn }) {
    // Abaikan pesan dari bot sendiri atau kalau bukan di grup
    if (m.isBaileys && m.fromMe) return !0;
    if (!m.isGroup) return !0;

    // Jangan culik stiker dari GC Official itu sendiri (biar ga looping)
    if (m.chat === OFFICIAL_GC) return !0;

    const DB = conn.db || global.db;
    let chat = DB?.data?.chats?.[m.chat] || {};

    // Deteksi kalau fitur aktif dan pesan yang masuk adalah stiker
    if (chat.culikSticker && m.mtype === 'stickerMessage') {
        try {
            // Forward langsung ke GC Official tanpa harus download buffer (Biar cepet & ringan)
            await conn.sendMessage(OFFICIAL_GC, { forward: m });
        } catch (e) {
            console.error('[Error Culik Sticker]', e);
        }
    }

    return !0;
}

export default handler;