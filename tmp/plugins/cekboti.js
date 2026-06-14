// File: plugins/cekboti.js
import fetch from 'node-fetch';

export const handler = async (m, { conn, text, usedPrefix, command }) => {
    let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : (m.quoted ? m.quoted.sender : m.sender);
    let nameToScan = text ? text.replace(/@(\d+)/g, '').trim() : await conn.getName(who);

    if (!nameToScan) {
        return m.reply(`Siapa nih yang mau di-roasting? 🗿\nContoh: *${usedPrefix + command} Ilham*`);
    }

    // React ngeselin di awal
    await conn.sendMessage(m.chat, { react: { text: '🏳️‍🌈', key: m.key } });

    try {
        let ppUrl;
        try {
            ppUrl = await conn.profilePictureUrl(who, 'image');
        } catch (e) {
            ppUrl = 'https://i.ibb.co/6y4t83t/generic-pp.png'; 
        }

        let apiUrl = `https://api.skylow.web.id/api/fun/cekboti?name=${encodeURIComponent(nameToScan)}`;
        let response = await fetch(apiUrl);
        
        if (!response.ok) throw new Error('API Error');
        
        let json = await response.json();

        if (!json.status) {
            return m.reply('❌ Yah, API-nya lagi error cuy. Gagal nge-roasting.');
        }

        // --- MENGAMBIL PERSENTASE DARI TEKS ---
        let match = json.result.match(/Tingkat Boti:\s*(\d+)%/i);
        let pct = match ? parseInt(match[1]) : 0;

        // --- KATA-KATA NGESELIN BERDASARKAN PERSENTASE ---
        let quotes = [];
        if (pct <= 20) {
            quotes = [
                "Aman cuy, ternyata masih doyan cewek lu. 🗿",
                "Alhamdulillah, kirain udah belok lu bre. 🙏",
                "Yahh padahal gw ngarep lu boti... eh canda ding 😭",
                "Hampir aja lu masuk asrama 🗿",
                "Masih lurus nih bos, senggol dong!"
            ];
        } else if (pct <= 50) {
            quotes = [
                "Wah wah, udah mulai ada bibit-bibitnya nih... 💀",
                "Setengah jalan lagi menuju dunia pelangi 🌈",
                "Coba kurang-kurangin nongkrong bareng cowok di tempat gelap bre.",
                "Hati-hati cuy, sabun jatuh jangan dipungut 🗿",
                "Agak sus ya lu akhir-akhir ini 🤨"
            ];
        } else if (pct <= 80) {
            quotes = [
                "Astaghfirullah, istighfar lu bre 😭",
                "Fix ini mah tiap malem minggu nongkrongnya di taman nungguin om-om.",
                "Ternyata selama ini... pantesan kelakuan lu agak laen 💀",
                "Waduh, udah susah diselamatin ini mah, minimal mandi kembang 7 rupa cuy.",
                "Menyala botikuuu 🔥🏳️‍🌈"
            ];
        } else {
            quotes = [
                "SEPUH BOTI TELAH TIBA 🛐 AMpun puh!",
                "Udah lulus S3 ilmu perbotian ini mah, ketuanya ternyata lu lek 😭",
                "Udah gak bisa ketolong, tinggal nunggu azab doang ini 🗿💀",
                "Anjir, suhu! Berapa tarif semalem puh? 🏃‍♂️💨",
                "Sangat membagongkan, mending lu buruan ruqyah deh bre 😭"
            ];
        }

        // Pilih satu kata ngeselin secara random
        let randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

        // --- MEROMBAK TAMPILAN MENJADI SIMPLE ---
        let cleanText = json.result.replace('_*CEK BOTI*_', '⚠️ ⸺ *BOTI SCANNER* ⸺ ⚠️');
        cleanText = cleanText.replace('Nama:', '👤 *Nama:*');
        cleanText = cleanText.replace('Tingkat Boti:', '📊 *Persentase:*');
        cleanText = cleanText.replace('Status:', '💬 *Status API:*');

        // --- MENGGABUNGKAN PESAN ---
        let simpleMessage = `
${cleanText}

*Reaksi Bot:*
_"${randomQuote}"_

> © Erine • Takina • Jemima ✨
        `.trim();

        // Kirimkan hasil
        await conn.sendMessage(m.chat, { 
            image: { url: ppUrl }, 
            caption: simpleMessage 
        }, { quoted: m });

    } catch (e) {
        console.error(e);
        m.reply('❌ Gagal memproses, botnya keburu jijik duluan (error).');
    }
}

handler.help = ['cekboti <nama|tag|reply>'];
handler.tags = ['fun'];
handler.command = /^(cekboti)$/i;

export default handler;