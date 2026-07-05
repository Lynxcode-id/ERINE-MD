/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx Decode
 * 📢 Channel   : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * ─────────────────────────
 * 📝 Plugin : Group Attendance (Fixed)
 */

let handler = async (m, { conn, text, usedPrefix, command, isAdmin }) => {
    conn.absen = conn.absen ? conn.absen : {};
    let id = m.chat;

    if (command === 'mulaiabsen') {
        if (!isAdmin) return m.reply('❌ Fitur ini khusus Admin grup!');
        if (id in conn.absen) return m.reply(`❌ Masih ada sesi absen yang berjalan di grup ini.\n\nKetik ${usedPrefix}tutupabsen untuk mengakhiri.`);
        
        conn.absen[id] = [
            m.reply(`┌˚₊ ๑│ ᴀ ʙ s ᴇ ɴ s ɪ  ᴅ ɪ ᴍ ᴜ ʟ ᴀ ɪ │๑˚₊ 📝\n┇ \n│ Silakan ketik *${usedPrefix}hadir* atau *${usedPrefix}absen* untuk mengisi daftar hadir.\n┇ \n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI X LYNX DECODE`),
            [], // Array buat nyimpen jid
            text || '-' // Fix: variabel text sudah aman di sini
        ];
    } 
    
    else if (/^(hadir|absen)$/i.test(command)) {
        if (!(id in conn.absen)) return m.reply(`❌ Tidak ada sesi absen yang aktif. Admin harus mengetik ${usedPrefix}mulaiabsen terlebih dahulu.`);
        
        let absenList = conn.absen[id][1];
        const jid = conn.decodeJid(m.sender);
        
        if (absenList.includes(jid)) return m.reply('✅ Kamu sudah melakukan absen sebelumnya.');
        
        absenList.push(jid);
        m.reply(`✅ Berhasil absen! Total hadir: ${absenList.length} orang.`);
    }

    else if (command === 'cekabsen') {
        if (!(id in conn.absen)) return m.reply(`❌ Tidak ada sesi absen yang aktif.`);
        
        let absenList = conn.absen[id][1];
        let text = `┌˚₊ ๑│ ᴅ ᴀ ғ ᴛ ᴀ ʀ  ʜ ᴀ ᴅ ɪ ʀ │๑˚₊ 📋\n┇ \n│ 👥 *Total:* ${absenList.length} orang\n┇ \n`;
        
        absenList.forEach((v, i) => {
            text += `│ *${i + 1}.* @${v.split('@')[0]}\n`;
        });
        
        text += `┇ \n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI X LYNX DECODE`;
        
        conn.sendMessage(m.chat, { text: text.trim(), mentions: absenList }, { quoted: m });
    }

    else if (command === 'tutupabsen') {
        if (!isAdmin) return m.reply('❌ Khusus Admin grup cuy!');
        if (!(id in conn.absen)) return m.reply('❌ Gak ada absen yang lagi jalan.');
        
        let absenList = conn.absen[id][1];
        m.reply(`┌˚₊ ๑│ ᴀ ʙ s ᴇ ɴ s ɪ  ᴅ ɪ ᴛ ᴜ ᴛ ᴜ ᴘ │๑˚₊ 🔒\n┇ \n│ Sesi absen telah diakhiri.\n│ 👥 *Total Hadir:* ${absenList.length} orang\n┇ \n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI X LYNX DECODE`);
        delete conn.absen[id];
    }
}

handler.help = ['mulaiabsen', 'hadir', 'cekabsen', 'tutupabsen'];
handler.tags = ['group'];
handler.command = /^(mulaiabsen|hadir|absen|cekabsen|tutupabsen)$/i;
handler.group = true;

export default handler;