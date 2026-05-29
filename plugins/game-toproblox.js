/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx Decode
 * 📞 WhatsApp  : +62 882-5804-1396
 * 📢 Channel   : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * ⚠️ Note      : Keep credit to respect the creator!
 * ─────────────────────────
 */

import fetch from 'node-fetch';

let handler = async (m, { conn }) => {
    await m.reply('⏳ *Mengambil data Top Games Roblox...*');

    try {
        let apiUrl = `https://api.cuki.biz.id/api/game/roblox-topgame?apikey=cuki-x`;
        let response = await fetch(apiUrl);
        let json = await response.json();

        if (!json.success || !json.data || !json.data.results) {
            throw new Error('Gagal mengambil data dari API.');
        }

        let teks = `╭───「 🎮 *TOP ${json.data.total} ROBLOX GAMES* 」───\n│\n`;

        for (let game of json.data.results) {
            teks += `│ 🏆 *Rank:* ${game.rank}\n`;
            teks += `│ 🕹️ *Name:* ${game.name}\n`;
            teks += `│ 👥 *Players:* ${game.playerCountText}\n`;
            teks += `│ 🔗 *Link:* ${game.url}\n│\n`;
        }
        
        teks += `╰─────────────────────────`;

        await conn.sendMessage(m.chat, {
            text: teks
        }, { quoted: m });

    } catch (e) {
        console.error(e);
        m.reply(`❌ *Terjadi kesalahan:* ${e.message || e}`);
    }
}

handler.help = ['toproblox'];
handler.tags = ['game', 'info'];
handler.command = /^(toproblox|robloxtop)$/i;
handler.limit = true;

export default handler;