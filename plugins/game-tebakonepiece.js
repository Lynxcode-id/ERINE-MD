import fetch from 'node-fetch';

let timeout = 60000;
let poin = 500;

let handler = async (m, { conn, usedPrefix }) => {
    conn.tebakonepiece = conn.tebakonepiece ? conn.tebakonepiece : {};
    let id = m.chat;
    
    if (id in conn.tebakonepiece) {
        return conn.reply(m.chat, '⚠️ Masih ada soal belum terjawab di chat ini', conn.tebakonepiece[id][0]);
    }

    await m.reply('⏳ *Mencari soal...*');

    try {
        let response = await fetch('https://api.jagoanproject.biz.id/api/game/tebakonepiece', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer jg_9cTY7aSGLdqZErDysaLfO6Wn'
            }
        });
        
        let json = await response.json();
        if (!json.status) throw 'Gagal mengambil soal dari API Jagoan Project.';

        let caption = `╭─⟡ *T E B A K  O N E  P I E C E* ⟡─╮\n│\n│ 👤 *Karakter siapakah ini?*\n│\n│ ⏱️ *Waktu:* ${(timeout / 1000)} Detik\n│ 🎁 *Bonus:* ${poin} XP\n│\n╰─────────────────────────⟡\n\n> _Balas pesan ini untuk menjawab!_`;

        conn.tebakonepiece[id] = [
            await conn.sendMessage(m.chat, { 
                image: { url: json.result.img }, 
                caption: caption 
            }, { quoted: m }),
            json.result.jawaban.toLowerCase(),
            poin,
            setTimeout(() => {
                if (conn.tebakonepiece[id]) {
                    conn.reply(m.chat, `⏱️ Waktu habis!\n\nJawabannya adalah: *${json.result.jawaban}*`, conn.tebakonepiece[id][0]);
                    delete conn.tebakonepiece[id];
                }
            }, timeout)
        ];
        
    } catch (e) {
        console.error(e);
        m.reply(`❌ *Terjadi kesalahan:* ${e.message || e}`);
    }
}

handler.help = ['tebakonepiece'];
handler.tags = ['game'];
handler.command = /^(tebakonepiece)$/i;
handler.limit = true;
handler.group = true;

export default handler;