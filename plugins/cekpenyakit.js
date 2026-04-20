/** * ───「 CEK POTENSI PENYAKIT 」───✧
 * 👤 Author  : LYNX DECODE { FEMULA + CARBEAT }
 * 🚀 Channel : https://whatsapp.com/channel/0029Vb1CcDWDp2Q5YT4FZn1k
 * 🤖 Bot     : Jemima-MD
 * ────────────────────────✧
 */

import fetch from 'node-fetch';

const handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return m.reply(`Masukkan tanggal lahir!\nContoh: *${usedPrefix + command} 05 02 2006*`);

    const args = text.split(/[- /\.]/);
    if (args.length < 3) return m.reply(`Format tanggal salah!\nContoh: *${usedPrefix + command} 05 02 2006*`);

    // Fix: Pastikan tgl dan bln selalu 2 digit (padding 0) agar API tidak error
    const tgl = args[0].padStart(2, '0');
    const bln = args[1].padStart(2, '0');
    const thn = args[2];

    m.reply('Menerawang potensi penyakit berdasarkan primbon...');

    try {
        const apiUrl = `https://api.siputzx.my.id/api/primbon/cek_potensi_penyakit?tgl=${tgl}&bln=${bln}&thn=${thn}`;
        const res = await fetch(apiUrl);
        const json = await res.json();

        if (!json.status || !json.data) throw new Error('Data tidak ditemukan. Pastikan format tanggal benar (DD MM YYYY).');

        const { analisa, sektor, elemen, catatan } = json.data;
        const now = new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });

        const replyMsg = `╭── [ *POTENSI PENYAKIT* ] ──✧
│ 📅 *Tgl Lahir:* ${tgl}-${bln}-${thn}
│
│ 📊 *Sektor:* │ ${sektor}
│
│ 🧬 *Analisa Elemen:* │ ${elemen}
│
│ 💡 *Catatan:* │ ${catatan}
╰───────────────✧

👤 *Request by:* ${m.pushName}
🤖 *© ERINE-MD* • ${now}`;

        await conn.sendMessage(m.chat, { text: replyMsg }, { quoted: m });

    } catch (e) {
        console.error(e);
        m.reply(`Gagal memproses!\nError: ${e.message}`);
    }
};

handler.command = /^(cekpenyakit|potensipenyakit|penyakit)$/i;
handler.help = ['cekpenyakit <tgl> <bln> <thn>'];
handler.tags = ['primbon'];
handler.limit = true;
handler.register = true;

export default handler;