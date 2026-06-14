/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx Decode
 * 📞 WhatsApp  : +62 882-5804-1396
 * 📢 Channel   : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * ⚠️ Note      : Keep credit to respect the creator!
 * ─────────────────────────
 * 📝 Plugin: Find Command (Pencari Lokasi File Plugin)
 */

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        return m.reply(`⚠️ *Nama command-nya apa cuy?*\n\n📌 *Cara pakai:*\n${usedPrefix + command} <nama_cmd>\n\n*Contoh:*\n${usedPrefix + command} upcode`);
    }

    await m.react('⏳');

    let keyword = text.toLowerCase().trim();
    let found = [];

    // Looping semua plugin yang terdaftar di memory (global.plugins)
    for (let [filename, plugin] of Object.entries(global.plugins)) {
        if (!plugin || plugin.disabled) continue;
        
        let cmd = plugin.command;
        if (!cmd) continue;

        let isMatch = false;

        // Pengecekan dinamis: Regex, Array, atau String
        if (cmd instanceof RegExp) {
            isMatch = cmd.test(keyword) || cmd.toString().toLowerCase().includes(keyword);
        } else if (Array.isArray(cmd)) {
            isMatch = cmd.some(c => c.toLowerCase().includes(keyword));
        } else if (typeof cmd === 'string') {
            isMatch = cmd.toLowerCase().includes(keyword);
        }

        if (isMatch) {
            found.push({
                file: filename,
                help: Array.isArray(plugin.help) ? plugin.help.join(', ') : (plugin.help || '-'),
                tags: Array.isArray(plugin.tags) ? plugin.tags.join(', ') : (plugin.tags || '-')
            });
        }
    }

    if (found.length === 0) {
        await m.react('❌');
        return m.reply(`❌ Plugin yang memuat command *${keyword}* tidak ditemukan di sistem.`);
    }

    let txt = `🔍 *HASIL PENCARIAN COMMAND: ${keyword}*\n\n`;
    found.forEach((v, i) => {
        txt += `*${i + 1}. ${v.file}*\n`;
        txt += `   ◦ *Tags:* ${v.tags}\n`;
        txt += `   ◦ *Help:* ${v.help}\n\n`;
    });

    await conn.sendMessage(m.chat, { text: txt.trim() }, { quoted: m });
    await m.react('✅');
};

handler.help = ['findcmd <nama_cmd>'];
handler.tags = ['owner'];
handler.command = /^(findcmd|caricmd|searchcmd|whereis)$/i;
handler.owner = true; // Fitur khusus lu doang cuy

export default handler;