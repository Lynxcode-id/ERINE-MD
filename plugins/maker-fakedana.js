/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx Decode
 * ─────────────────────────
 * 📝 Plugin : Fake Dana Transfer Maker
 */

let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) {
        return m.reply(`┌˚₊ ๑│ ꜰ ᴀ ᴋ ᴇ  ᴅ ᴀ ɴ ᴀ │๑˚₊ 💸\n┇ \n│ ❌ Masukkan nominal uangnya cuy!\n│ \n│ *Contoh:*\n│ ${usedPrefix + command} 150000\n┇ \n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI X LYNX DECODE`);
    }

    // Filter input biar cuma ngambil angka, cegah error API
    let nominal = args.join('').replace(/[^0-9]/g, '');
    if (!nominal) return m.reply('❌ Nominal harus berupa angka cuy!');

    await m.react('⏳');

    try {
        // Tembak langsung URL API
        let apiUrl = `https://api-nanzz.my.id/docs/api/maker/fake-dana.php?text=${nominal}`;

        let caption = `┌˚₊ ๑│ ꜰ ᴀ ᴋ ᴇ  ᴅ ᴀ ɴ ᴀ │๑˚₊ 💸\n┇ \n│ ✅ *Struk transfer berhasil dibuat!*\n│ 👤 *Req by:* @${m.sender.split('@')[0]}\n┇ \n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI X LYNX DECODE`;

        // Kirim hasil gambar
        await conn.sendMessage(m.chat, { 
            image: { url: apiUrl }, 
            caption: caption.trim(),
            mentions: [m.sender]
        }, { quoted: m });

        await m.react('✅');

    } catch (e) {
        console.error('[FAKE DANA ERROR]', e);
        await m.react('❌');
        m.reply(`┌˚₊ ๑│ s ʏ s ᴛ ᴇ ᴍ  ᴇ ʀ ʀ ᴏ ʀ │๑˚₊ ❌\n┇ Gagal memproses gambar:\n┇ Server API sedang down atau bermasalah.\n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI X LYNX DECODE`);
    }
}

handler.help = ['fakedana <nominal>'];
handler.tags = ['maker'];
handler.command = /^(fakedana|danafake)$/i;
handler.limit = true;

export default handler;