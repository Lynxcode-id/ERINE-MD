/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx Decode
 * ─────────────────────────
 * 📝 Plugin : Clone Group Meta to New Group
 */

let handler = async (m, { conn, isOwner }) => {
    if (!isOwner) return m.reply('❌ Fitur khusus Owner bot cuy! Bahaya kalau dipake member.');

    await m.react('⏳');

    try {
        let meta = await conn.groupMetadata(m.chat).catch(() => ({}));
        let name = meta.subject || 'Erine Cloned Group';
        let desc = meta.desc || 'No Description';

        m.reply(`┌˚₊ ๑│ ᴄ ʟ ᴏ ɴ ᴇ  ɢ ʀ ᴜ ᴘ │๑˚₊ 🔄\n┇ \n│ 🔄 Sedang mengkloning grup:\n│ *${name}*\n│ \n│ Proses ini mungkin butuh waktu...\n┇ \n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`);

        let group = await conn.groupCreate(name, [m.sender]);
        let id = group.id;

        await conn.groupUpdateDescription(id, desc);

        let link = await conn.groupInviteCode(id);
        
        let caption = `┌˚₊ ๑│ ᴄ ʟ ᴏ ɴ ᴇ  s ᴜ ᴋ s ᴇ s │๑˚₊ ✅
┇ 
│ ✅ *Grup berhasil dikloning!*
│ 📄 *Nama:* ${name}
│ 🆔 *New ID:* ${id}
┇ 
│ 🔗 *Link Grup Baru:*
│ https://chat.whatsapp.com/${link}
┇ 
└˚₊ ๑ ────────────── ๑˚₊
> © ERINE-AI`;

        await conn.sendMessage(m.chat, { text: caption.trim() }, { quoted: m });
        await m.react('✅');

    } catch (e) {
        console.error('[CLONE GC ERROR]', e);
        await m.react('❌');
        m.reply('❌ Gagal mengkloning grup. Pastikan bot premium dan tidak kena limit harian WhatsApp.');
    }
}

handler.help = ['clonegc'];
handler.tags = ['owner', 'group'];
handler.command = /^(clonegc|duplicategc|cloneder)$/i;
handler.group = true;
handler.owner = true;

export default handler;