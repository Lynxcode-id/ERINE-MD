/** * ───「 INFO OWNER & COMMUNITY 」───✧
 * 👤 Author  : LYNX DECODE { FEMULA + CARBEAT }
 * 📝 Note    : Fitur khusus buat blokir command dari member biasa
 * ────────────────────────✧
 */

let handler = async (m, { text, usedPrefix, command }) => {
    // Inisialisasi array di database kalo belum ada
    if (!global.db.data.blockcmd) global.db.data.blockcmd = [];

    // Fitur buat ngeliat daftar cmd yang diblokir
    if (command === 'listblockcmd') {
        if (global.db.data.blockcmd.length === 0) return m.reply('✅ Belum ada command yang diblokir cuy.');
        let list = global.db.data.blockcmd.map((v, i) => `│ ${i + 1}. ${v}`).join('\n');
        return m.reply(`╭━━[ *DAFTAR BLOKIR CMD* ]━━\n${list}\n╰━━━━━━━━━━━━━━━━━━`);
    }

    if (!text) throw `Masukkan nama command yang mau diblokir/dibuka!\n\nContoh:\n${usedPrefix + command} tiktok\n${usedPrefix + command} getplugin`;

    let cmd = text.trim().toLowerCase();
    let isBlock = command === 'blockcmd';

    if (isBlock) {
        if (global.db.data.blockcmd.includes(cmd)) throw `⚠️ Command *${cmd}* udah ada di daftar blokir cuy!`;
        
        global.db.data.blockcmd.push(cmd);
        m.reply(`✅ Berhasil memblokir command *${cmd}*.\nSekarang cuma Owner yang bisa pake fitur ini!`);
    } else {
        if (!global.db.data.blockcmd.includes(cmd)) throw `⚠️ Command *${cmd}* emang ga ada di daftar blokir.`;
        
        global.db.data.blockcmd = global.db.data.blockcmd.filter(c => c !== cmd);
        m.reply(`✅ Berhasil ngebuka blokir command *${cmd}*.\nSekarang member biasa udah bisa pake lagi.`);
    }
};

// Hook buat nyegat pesan dan ngecek apakah command diblokir
handler.before = async function (m, { isOwner }) {
    if (!m.text || !global.db.data.blockcmd || global.db.data.blockcmd.length === 0) return;

    let body = m.text.trim();
    // Deteksi prefix (mendukung segala macam prefix simbol)
    let prefixRegex = /^[°•π÷×¶∆£¢€¥®™+✓_=|~!?@#$%^&.©^]/i;
    let hasPrefix = prefixRegex.test(body);
    let cmdName = '';

    if (hasPrefix) {
        cmdName = body.replace(prefixRegex, '').trim().split(' ')[0].toLowerCase();
    } else {
        cmdName = body.split(' ')[0].toLowerCase();
    }
    
    // Kalo command ada di daftar blokir dan yang pake bukan owner
    if (global.db.data.blockcmd.includes(cmdName)) {
        if (!isOwner) {
            await m.reply(`❌ *Akses Ditolak!*\n\nCommand *${cmdName}* sedang dikunci oleh Owner (Lynx). Lu ga punya izin buat pake fitur ini cuy.`);
            return true; // Return true buat stop eksekusi plugin utamanya
        }
    }
}

handler.help = ['blockcmd', 'unblockcmd', 'listblockcmd'];
handler.tags = ['owner'];
handler.command = /^(blockcmd|unblockcmd|listblockcmd)$/i;
handler.owner = true; // Cuma lu (Owner) yang bisa nambah/hapus list blokir

export default handler;