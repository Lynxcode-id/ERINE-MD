import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'sewadb.json');
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const perpisahan = [
    "Waktu sewa bot di grup ini sudah habis 🥺. Bot pamit undur diri ya, terima kasih sudah menggunakan jasa kami! 👋",
    "Sayonara semuanya! 💫 Masa aktif bot sudah sampai di sini. Sampai jumpa lagi di lain waktu~",
    "Masa sewa telah berakhir! ⏳ Terima kasih buat keseruannya. Kalau mau sewa lagi, langsung hubungi owner ya. Bye bye! 🚀",
    "Halo semua, karena durasi sewa sudah habis, bot harus pamit keluar dari grup ini. 😔 Jaga kesehatan selalu ya, dadah! 👋",
    "Pemberitahuan: Masa aktif bot telah selesai. 📉 Terima kasih sudah menyewa! Owner, tolong tarik aku pulang 🏃‍♂️💨"
];

export async function before(m, { conn }) {
    if (!fs.existsSync(dbPath)) return;
    let db = JSON.parse(fs.readFileSync(dbPath));
    let now = Date.now();
    let changed = false;

    for (let jid in db) {
        if (db[jid].expired && now >= db[jid].expired) {
            let teksPamit = perpisahan[Math.floor(Math.random() * perpisahan.length)];

            try {
                await conn.sendMessage(jid, { text: teksPamit });
                await delay(2000);
                await conn.groupLeave(jid);
            } catch (e) {
                console.error(`[SEWADB] Gagal leave otomatis dari grup ${jid}`);
            }

            delete db[jid];
            changed = true;
            if (global.db.data.chats[jid]) global.db.data.chats[jid].expired = 0;
        }
    }

    if (changed) fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
}
