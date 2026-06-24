/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx Decode
 * ─────────────────────────
 * 📝 Plugin : Advanced Sewa Bot (Silent Join + Database)
 */

import fs from 'fs';
import path from 'path';

const dbDir = path.join(process.cwd(), 'database');
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

const dbPath = path.join(dbDir, 'sewabot.json');
if (!fs.existsSync(dbPath)) fs.writeFileSync(dbPath, JSON.stringify({}));

const readDB = () => JSON.parse(fs.readFileSync(dbPath));
const writeDB = (data) => fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const parseTime = (str) => {
    if (!str) return null;
    let match = str.match(/(\d+)\s*(h|jam|d|hari|w|minggu|mo|bulan|y|tahun)?/i);
    if (!match) return null;
    let val = parseInt(match[1]);
    let unit = (match[2] || 'd').toLowerCase();
    let ms = 0, label = '';
    if (/h|jam/.test(unit)) { ms = val * 3600000; label = `${val} Jam`; }
    else if (/d|hari/.test(unit)) { ms = val * 86400000; label = `${val} Hari`; }
    else if (/w|minggu/.test(unit)) { ms = val * 604800000; label = `${val} Minggu`; }
    else if (/mo|bulan/.test(unit)) { ms = val * 2592000000; label = `${val} Bulan`; }
    else if (/y|tahun/.test(unit)) { ms = val * 31536000000; label = `${val} Tahun`; }
    else { ms = val * 86400000; label = `${val} Hari`; }
    return { ms, label };
};

let handler = async (m, { conn, text, command, args, usedPrefix }) => {
    let db = readDB();
    let linkRegex = /chat\.whatsapp\.com\/([0-9A-Za-z]{20,24})/i;

    if (/^addsewa(bot|gc)?$/i.test(command)) {
        let match = text.match(linkRegex);
        let code = match ? match[1] : null;
        let durStr = args[args.length - 1] || '';
        let parsed = parseTime(durStr);

        if (!code) return m.reply(`*Format salah!*\nContoh: ${usedPrefix + command} https://chat.whatsapp.com/xxx 30d`);
        if (!parsed || parsed.ms <= 0) return m.reply(`*Durasi tidak valid!*`);

        let res;
        try {
            res = await conn.groupAcceptInvite(code);
        } catch (error) {
            if (error?.message?.includes('not-authorized')) return m.reply('❌ Tidak dapat bergabung (Terkena kick, tunggu 7 hari).');
            if (error?.message?.includes('gone')) return m.reply('❌ Link tidak valid/reset.');
            throw error;
        }

        let expired = Date.now() + parsed.ms;
        db[res] = { expired: expired, addedAt: Date.now() };
        writeDB(db);

        if (!global.db.data.chats[res]) global.db.data.chats[res] = {};
        global.db.data.chats[res].expired = expired;

        m.reply(`✅ Berhasil SILENT JOIN grup.\nID: ${res}\nDurasi: ${parsed.label}`);
    }

    if (/^delsewa(bot|gc)?$/i.test(command)) {
        let jid = m.isGroup ? m.chat : args[0];
        try {
            await conn.sendMessage(jid, { text: "Waktu sewa habis, bot pamit undur diri. 👋" });
            await delay(1000);
            await conn.groupLeave(jid);
        } catch (e) {
            m.reply(`⚠️ Gagal keluar otomatis.`);
        }
        if (db[jid]) {
            delete db[jid];
            writeDB(db);
        }
        if (global.db.data.chats[jid]) global.db.data.chats[jid].expired = 0;
        if (!m.isGroup) m.reply(`✅ Berhasil menghapus data & keluar grup.`);
    }

    if (/^renewsewa(bot|gc)?$/i.test(command)) {
        let jid = m.isGroup ? m.chat : args[0];
        let durStr = m.isGroup ? args[0] : args[1];
        
        if (!m.isGroup && jid && linkRegex.test(jid)) {
            let code = jid.match(linkRegex)[1];
            try {
                let info = await conn.groupGetInviteInfo(code);
                jid = info.id;
            } catch (e) {
                return m.reply('❌ Gagal mengambil ID dari link grup.');
            }
        }

        let parsed = parseTime(durStr || '');
        if (!parsed || parsed.ms <= 0) return m.reply(`*Format salah!*\nContoh: ${usedPrefix + command} 30d`);

        if (!db[jid]) {
            db[jid] = { expired: Date.now() + parsed.ms, addedAt: Date.now() };
        } else {
            let currentExp = db[jid].expired > Date.now() ? db[jid].expired : Date.now();
            db[jid].expired = currentExp + parsed.ms;
        }
        writeDB(db);

        if (!global.db.data.chats[jid]) global.db.data.chats[jid] = {};
        global.db.data.chats[jid].expired = db[jid].expired;

        m.reply(`✅ Sukses memperpanjang masa sewa grup selama *${parsed.label}*`);
        try {
            await conn.sendMessage(jid, { text: `🎉 Hore! Masa aktif bot di grup ini telah diperpanjang selama *${parsed.label}* oleh Owner!` });
        } catch (e) {
        }
    }
};

handler.help = ['addsewa', 'delsewa', 'renewsewa'];
handler.tags = ['owner'];
handler.command = /^(addsewa|delsewa|renewsewa)(bot|gc)?$/i;
handler.rowner = true;

export default handler;