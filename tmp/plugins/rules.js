export const handler = async (m, { conn }) => {
    const rulesText = `
╔════ ≪ 📜 ERINE-MD PROTOCOLS 📜 ≫ ════╗

Selamat datang! Harap baca dan patuhi kebijakan sistem di bawah ini agar Erine dapat melayani Anda dengan optimal.

🚀 *1. ANTI-SPAM SYSTEM*
Mohon beri jeda (delay) sekitar 5 detik setiap kali mengirim perintah. Erine dilengkapi dengan deteksi spam; penggunaan yang terlalu brutal akan memicu *Auto-Banned* dari sistem.

📵 *2. ZERO CALL TOLERANCE*
Nomor ini dioperasikan sepenuhnya oleh sistem bot. Melakukan Panggilan Suara (Call) atau Video Call (VC) akan langsung memicu *BLOCK PERMANEN* tanpa peringatan.

⏳ *3. SYSTEM DELAY & PING*
Apabila Erine lambat merespon, mohon bersabar dan jangan melakukan spam perintah ulang. Hal ini biasanya dikarenakan:
• *Traffic* server sedang padat.
• Kendala pada jaringan/API.
• Erine sedang dalam mode perbaikan (Maintenance).

🛑 *4. CLEAN USAGE (NO NSFW/SARA)*
Dilarang keras memanfaatkan fitur Erine untuk memuat, mencari, atau menyebarkan konten berbau pornografi (NSFW), SARA, toxic, maupun aktivitas ilegal lainnya. 

🔐 *5. DATA & PRIVACY*
Erine tidak mengeksploitasi data pribadi Anda. Namun, seluruh risiko dan kerugian yang timbul dari penyalahgunaan fitur bot sepenuhnya menjadi tanggung jawab masing-masing pengguna.

🎟️ *6. GROUP DEPLOYMENT*
Dilarang mengundang (invite) Erine ke dalam grup publik maupun private secara sepihak. Silakan hubungi Owner untuk pembelian akses/sewa grup.

⚠️ *PENALTY EXECUTION*
Pelanggaran terhadap protokol di atas akan ditindak melalui sistem:
▸ *Warn 1-3:* Peringatan ringan sistem.
▸ *Banned:* Penangguhan akses bot sementara.
▸ *Blocked:* Pemutusan akses secara permanen.

_"Gunakan teknologi dengan bijak. Let's keep the system clean and fast!"_

╚════ ≪ ⚡ POWERED BY ERINE PROJECT ⚡ ≫ ════╝
`.trim();

    await conn.sendMessage(m.chat, {
        image: { url: "https://c.termai.cc/i133/4qd262V.jpg" },
        caption: rulesText,
        contextInfo: {
            mentionedJid: [m.sender],
            isForwarded: true,
            forwardingScore: 9999,
            forwardedNewsletterMessageInfo: {
                newsletterJid: "120363400612665352@newsletter",
                newsletterName: "✨ - ᴇʀɪɴᴇ ɪɴғᴏʀᴍᴀᴛɪᴏɴ",
                serverMessageId: -1
            }
        }
    }, { quoted: m });
};

handler.help = ['rules', 'tos', 'rule'];
handler.tags = ['info', 'main'];
handler.command = /^(rules|rule|tos)$/i;

export default handler;
