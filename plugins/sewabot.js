import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'sewadb.json');
if (!fs.existsSync(dbPath)) fs.writeFileSync(dbPath, JSON.stringify({}));
const readDB = () => JSON.parse(fs.readFileSync(dbPath));
const writeDB = (data) => fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const parseTime = (str) => {
    let match = str.match(/(\d+)\s*(d|hari|h|jam|m|menit|w|minggu)?/i);
    if (!match) return null;
    let val = parseInt(match[1]);
    let unit = (match[2] || 'd').toLowerCase();
    let ms = 0, label = '';
    
    if (/d|hari/.test(unit)) { ms = val * 86400000; label = `${val} Hari`; }
    else if (/h|jam/.test(unit)) { ms = val * 3600000; label = `${val} Jam`; }
    else if (/m|menit/.test(unit)) { ms = val * 60000; label = `${val} Menit`; }
    else if (/w|minggu/.test(unit)) { ms = val * 604800000; label = `${val} Minggu`; }
    
    return { ms, label };
};

const perpisahan = [
    "Waktu sewa bot di grup ini sudah habis 🥺. Bot pamit undur diri ya, terima kasih sudah menggunakan jasa kami! 👋",
    "Sayonara semuanya! 💫 Masa aktif bot sudah sampai di sini. Sampai jumpa lagi di lain waktu~",
    "Masa sewa telah berakhir! ⏳ Terima kasih buat keseruannya. Kalau mau sewa lagi, langsung hubungi owner ya. Bye bye! 🚀",
    "Halo semua, karena durasi sewa sudah habis, bot harus pamit keluar dari grup ini. 😔 Jaga kesehatan selalu ya, dadah! 👋",
    "Pemberitahuan: Masa aktif bot telah selesai. 📉 Terima kasih sudah menyewa! Owner, tolong tarik aku pulang 🏃‍♂️💨"
];

let handler = async (m, { conn, text, command, args, usedPrefix }) => {
    let db = readDB();
    let linkRegex = /chat\.whatsapp\.com\/([0-9A-Za-z]{20,24})/i;

    if (/^addsewabot$/i.test(command)) {
        let match = text.match(linkRegex);
        let code = match ? match[1] : null;
        
        let durStr = args[args.length - 1] || '';
        let parsed = parseTime(durStr);

        if (!code) return m.reply(`*Format salah!*\nContoh: ${usedPrefix + command} https://chat.whatsapp.com/xxx 30d\n\n*Format Durasi:*\n- d = Hari (30d)\n- h = Jam (12h)\n- m = Menit (30m)\n- w = Minggu (1w)`);
        if (!parsed || parsed.ms <= 0) return m.reply(`*Durasi tidak valid!*\nContoh: ${usedPrefix + command} https://chat.whatsapp.com/xxx 30d`);

        let res;
        try {
            res = await conn.groupAcceptInvite(code);
        } catch (error) {
            if (error?.message?.includes('not-authorized')) return m.reply('Tidak dapat bergabung karena terkena kick sebelumnya (Tunggu max 7 hari).');
            if (error?.message?.includes('gone')) return m.reply('Link tidak valid atau sudah direset admin.');
            throw error;
        }

        let expired = Date.now() + parsed.ms;
        db[res] = { expired: expired, addedAt: Date.now() };
        writeDB(db);

        if (!global.db.data.chats[res]) global.db.data.chats[res] = {};
        global.db.data.chats[res].expired = expired;

        m.reply(`✅ Berhasil SILENT JOIN grup dan mencatat data sewa!\n\nID Grup: ${res}\nDurasi: ${parsed.label}\n\n*Note:* Bot sengaja tidak mengirim pesan ke dalam grup untuk menghindari Banned/Spam detection WhatsApp.`);
    }

    if (/^delsewabot$/i.test(command)) {
        let jid = m.isGroup ? m.chat : args[0];
        
        if (!m.isGroup && jid && linkRegex.test(jid)) {
            let code = jid.match(linkRegex)[1];
            try {
                let info = await conn.groupGetInviteInfo(code);
                jid = info.id;
            } catch (e) {
                return m.reply('❌ Gagal mengambil ID dari link grup. Mungkin link hangus atau bot tidak memiliki akses.');
            }
        }

        if (!jid) return m.reply(`Masukkan ID/Link Grup atau gunakan perintah ini di dalam grup.\nContoh: ${usedPrefix + command} https://chat... atau ${usedPrefix + command} 12036xxx@g.us`);

        let teksPamit = perpisahan[Math.floor(Math.random() * perpisahan.length)];
        
        try {
            await conn.sendMessage(jid, { text: teksPamit });
            await delay(2000);
            await conn.groupLeave(jid);
        } catch (e) {
            m.reply(`⚠️ Gagal mengirim pesan/keluar grup secara otomatis, mungkin bot sudah dikeluarkan.`);
        }

        if (db[jid]) {
            delete db[jid];
            writeDB(db);
        }
        if (global.db.data.chats[jid]) global.db.data.chats[jid].expired = 0;

        if (!m.isGroup) m.reply(`✅ Berhasil menghapus sewa dan memproses keluar dari grup:\n${jid}`);
    }

    if (/^renewsewabot$/i.test(command)) {
        let jid = m.isGroup ? m.chat : args[0];
        let durStr = m.isGroup ? args[0] : args[1];
        
        if (!m.isGroup && jid && linkRegex.test(jid)) {
            let code = jid.match(linkRegex)[1];
            try {
                let info = await conn.groupGetInviteInfo(code);
                jid = info.id;
            } catch (e) {
                return m.reply('❌ Gagal mengambil ID dari link grup. Mungkin link hangus atau bot tidak memiliki akses.');
            }
        }

        let parsed = parseTime(durStr || '');

        if (!parsed || parsed.ms <= 0) return m.reply(`*Format salah!*\nDi grup: ${usedPrefix + command} 30d\nDi PC: ${usedPrefix + command} <link/id> 30d\n\n*Unit:* d (hari), h (jam), m (menit), w (minggu)`);

        if (!db[jid]) {
            db[jid] = { expired: Date.now() + parsed.ms, addedAt: Date.now() };
        } else {
            let currentExp = db[jid].expired > Date.now() ? db[jid].expired : Date.now();
            db[jid].expired = currentExp + parsed.ms;
        }
        writeDB(db);

        if (!global.db.data.chats[jid]) global.db.data.chats[jid] = {};
        global.db.data.chats[jid].expired = db[jid].expired;

        m.reply(`✅ Sukses memperpanjang masa sewa grup selama ${parsed.label} untuk ID:\n${jid}`);
        try {
            await conn.sendMessage(jid, { text: `🎉 Hore! Masa aktif bot di grup ini telah diperpanjang selama ${parsed.label}!` });
        } catch (e) {
            m.reply(`⚠️ Gagal mengirim pesan ke grup tersebut. Tapi data sewa tetap diperpanjang.`);
        }
    }
};

handler.help = ['addsewabot', 'delsewabot', 'renewsewabot'];
handler.tags = ['owner'];
handler.command = /^(addsewabot|delsewabot|renewsewabot)$/i;
handler.rowner = true;

export default handler;