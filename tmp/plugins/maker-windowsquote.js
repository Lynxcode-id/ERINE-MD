/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx Decode
 * 📢 Channel   : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * ─────────────────────────
 * 📝 Plugin : Windows Quotes Maker
 */

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        return m.reply(`┌˚₊ ๑│ ᴡ ɪ ɴ ᴅ ᴏ ᴡ s  ǫ ᴜ ᴏ ᴛ ᴇ s │๑˚₊ 💻\n┇ \n│ ❌ Teksnya mana cuy?\n│ \n│ *Contoh:*\n│ ${usedPrefix + command} kenapa nyahh aku salah mulu\n┇ \n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`);
    }

    await m.react('⏳');

    try {
        let encodedText = encodeURIComponent(text);
        let apiUrl = `https://api-nanzz.my.id/docs/api/maker/windows-quotes.php?text=${encodedText}`;

        let caption = `┌˚₊ ๑│ ᴡ ɪ ɴ ᴅ ᴏ ᴡ s  ǫ ᴜ ᴏ ᴛ ᴇ s │๑˚₊ ✨\n┇ \n│ 💻 *Sukses membuat quotes Windows!*\n│ 👤 *Req by:* @${m.sender.split('@')[0]}\n┇ \n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`;

        await conn.sendMessage(m.chat, { 
            image: { url: apiUrl }, 
            caption: caption.trim(),
            mentions: [m.sender]
        }, { quoted: m });

        await m.react('✅');

    } catch (e) {
        console.error('[WINDOWS QUOTES ERROR]', e);
        await m.react('❌');
        m.reply(`┌˚₊ ๑│ s ʏ s ᴛ ᴇ ᴍ  ᴇ ʀ ʀ ᴏ ʀ │๑˚₊ ❌\n┇ Gagal memproses gambar:\n┇ Server API sedang down atau timeout.\n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`);
    }
}

handler.help = ['windowsquote <teks>', 'winquote <teks>'];
handler.tags = ['maker'];
handler.command = /^(windowsquote|winquote)$/i;
handler.limit = true;

export default handler;