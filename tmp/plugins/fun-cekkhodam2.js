/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx Decode
 * 📞 WhatsApp  : +62 882-5804-1396
 * 📢 Channel   : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * ⚠️ Note      : Keep credit to respect the creator!
 * ─────────────────────────
 */

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return m.reply(`Siapa nama yang mau di-scan khodamnya cuy?\n\n💡 *Contoh:* ${usedPrefix + command} Lynx`);

    await m.reply('⏳ *Scanning database khodam...*');

    const khodamList = [
        { name: "Macan Putih Cyborg", desc: "Agresif, suka begadang, tapi sering error kalau disuruh ngoding.", element: "Cyber-Beast" },
        { name: "Naga RGB", desc: "Berwibawa dan bersinar, tapi tagihan listriknya mahal.", element: "Neon-Myth" },
        { name: "Kucing Oyen Skena", desc: "Ngeselin, suka nyuri chat orang, tapi kalau diajak nongkrong asik.", element: "Street-Beast" },
        { name: "Sapu Lidi Bluetooth", desc: "Sangat rajin bersih-bersih grup dari member toxic.", element: "Tech-Item" },
        { name: "Jin Qorin Hacker", desc: "Bisa nembus firewall NASA, tapi sering lupa password akun sendiri.", element: "Cyber-Ghost" },
        { name: "Lele Terbang Turbo", desc: "Lincah dan licin, susah ditangkap apalagi disuruh mandi.", element: "Aqua-Mecha" },
        { name: "Sempak Firaun Neon", desc: "Membawa aura wibawa zaman purba dengan sentuhan lampu disko.", element: "Relic" },
        { name: "Kulkas 2 Pintu Smart-AI", desc: "Dingin, cuek, tapi selalu bisa diandalkan pas lagi kelaparan.", element: "Appliance" },
        { name: "Batu Bata Wireless", desc: "Keras kepala, susah dibilangin, cocok buat alat tawuran digital.", element: "Weapon" },
        { name: "Ayam Kampus Cyber", desc: "Berkokok setiap jam 3 pagi pake autotune.", element: "Avian-Mecha" },
        { name: "Tuyul Kripto", desc: "Jago nyari cuan di internet, tapi sering rugi kena rugpull.", element: "Cyber-Ghost" },
        { name: "Kipas Angin RGB", desc: "Selalu bikin suasana adem, walau kadang suaranya berisik banget.", element: "Appliance" }
    ];

    const randomKhodam = khodamList[Math.floor(Math.random() * khodamList.length)];
    const power = Math.floor(Math.random() * 100) + 1;
    const aura = ['Merah Menyala', 'Biru Neon', 'Hijau Matrix', 'Ungu Janda', 'Hitam Vantablack', 'Putih Tulang'];
    const randomAura = aura[Math.floor(Math.random() * aura.length)];

    let teks = `╭───「 🔮 *CEK KHODAM CYBER* 」───\n`;
    teks += `│ 👤 *Nama:* ${text}\n`;
    teks += `│ 👻 *Khodam:* ${randomKhodam.name}\n`;
    teks += `│ 🧬 *Elemen:* ${randomKhodam.element}\n`;
    teks += `│ ⚡ *Power:* ${power}%\n`;
    teks += `│ 💫 *Aura:* ${randomAura}\n`;
    teks += `│ 📝 *Sifat:* ${randomKhodam.desc}\n`;
    teks += `╰─────────────────────────`;

    await conn.sendMessage(m.chat, {
        text: teks,
        contextInfo: {
            isForwarded: true, // Paksa status diteruskan
            forwardingScore: 999, // Bikin skor forward tinggi
            externalAdReply: {
                showAdAttribution: true, // Nampilin icon panah/Tautan (wajib biar lolos WA ori)
                title: "System Scan Khodam",
                body: "E R I N E - M D",
                thumbnailUrl: "https://files.catbox.moe/mcbppr.png",
                sourceUrl: "https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i",
                mediaType: 1,
                renderLargerThumbnail: true
            }
        }
    }, { quoted: m });
}

handler.help = ['cekkhodam2 <nama>', 'khodam <nama>'];
handler.tags = ['fun'];
handler.command = /^(cekkhodam2|khodam2)$/i;
handler.limit = true;

export default handler;