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

let lastCheck = 0;

let handler = m => m;

handler.before = async function (m, { conn }) {
    let now = Date.now();
    
    // Cek database setiap 15 detik sekali (biar gak bikin bot lag/berat)
    if (now - lastCheck < 15000) return true;
    lastCheck = now;

    if (!fs.existsSync(dbPath)) return true;
    
    try {
        let db = JSON.parse(fs.readFileSync(dbPath));
        let changed = false;

        for (let jid in db) {
            // Jika waktu sekarang sudah melewati waktu expired
            if (db[jid].expired && now >= db[jid].expired) {
                let teksPamit = perpisahan[Math.floor(Math.random() * perpisahan.length)];

                try {
                    await conn.sendMessage(jid, { text: teksPamit });
                    await delay(3000); // Jeda 3 detik biar pesannya kekirim dulu
                    await conn.groupLeave(jid); // Bot left group
                } catch (e) {
                    console.log(`[SEWADB] Gagal mengirim pesan / keluar dari grup ${jid}`);
                }

                // Hapus data grup dari sewadb biar ga di-spam keluar terus
                delete db[jid];
                changed = true;
                
                // Reset limit di database utama juga
                if (global.db?.data?.chats?.[jid]) global.db.data.chats[jid].expired = 0;
            }
        }

        // Save ulang database jika ada grup yang dihapus
        if (changed) {
            fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
        }
        
    } catch (e) {
        console.error("Error Auto-Leave Sewa:", e);
    }
    
    return true; // Wajib return true biar hook lanjut ke plugin lain
}

export default handler;