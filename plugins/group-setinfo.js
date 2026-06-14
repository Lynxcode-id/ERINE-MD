/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx Decode
 * 📢 Channel   : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * ─────────────────────────
 * 📝 Plugin : Set Group Info (Name & Description)
 */

let handler = async (m, { conn, text, usedPrefix, command, isAdmin, isBotAdmin }) => {
    if (!isAdmin) return m.reply('❌ Khusus Admin grup cuy!');
    if (!isBotAdmin) return m.reply('❌ Bot harus jadi Admin dulu!');
    if (!text) return m.reply(`❌ Masukkan teksnya!\n\n*Contoh:*\n${usedPrefix + command} INF Project Official`);

    await m.react('⏳');

    try {
        if (/^(setnamegc|setsubject)$/i.test(command)) {
            await conn.groupUpdateSubject(m.chat, text);
            m.reply(`✅ *Judul grup berhasil diubah menjadi:*\n${text}`);
        } 
        
        else if (/^(setdescgc|setdeskripsi)$/i.test(command)) {
            await conn.groupUpdateDescription(m.chat, text);
            m.reply(`✅ *Deskripsi grup berhasil diubah!*`);
        }
    } catch (e) {
        console.error('[SET INFO GC ERROR]', e);
        m.reply('❌ Gagal mengubah info grup. Pastikan nama/deskripsi tidak melanggar limit karakter WhatsApp.');
    }
}

handler.help = ['setnamegc <teks>', 'setdescgc <teks>'];
handler.tags = ['group'];
handler.command = /^(setnamegc|setsubject|setdescgc|setdeskripsi)$/i;
handler.group = true;

export default handler;