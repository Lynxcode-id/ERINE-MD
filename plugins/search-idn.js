/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx Decode
 * 📞 WhatsApp  : +62 882-5804-1396
 * 📢 Channel   : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * ⚠️ Note      : Keep credit to respect the creator!
 * ─────────────────────────
 * 📝 Plugin: IDN Event Search
 */

import axios from 'axios';

let handler = async (m, { conn, text, prefix, command }) => {
    await m.react('⚡');

    try {
        let [type, page] = text.split('|').map(v => v ? v.trim() : '');
        
        type = type || 'live';
        page = page || '1';

        const validTypes = ['event', 'live', 'giveaway-group'];
        if (!validTypes.includes(type.toLowerCase())) {
            type = 'live';
        }

        const apiUrl = `https://anabot.my.id/api/search/idn/event?type=${type}&page=${page}&apikey=freeApikey`;
        let res = await axios.get(apiUrl, { headers: { 'accept': 'application/json' } });
        
        if (!res.data || !res.data.success || !res.data.data?.result?.data) {
            throw new Error('Gagal mengambil data event dari server.');
        }

        let events = res.data.data.result.data;
        if (events.length === 0) {
            throw new Error('Tidak ada event yang ditemukan di halaman ini.');
        }

        let firstThumb = events[0].image;
        let caption = `🎉 *IDN EVENTS (${type.toUpperCase()})* - Page ${page}\n\n`;
        
        events.forEach((ev, index) => {
            let startDate = new Date(ev.start_date * 1000).toLocaleDateString('id-ID');
            let endDate = ev.end_date === 0 ? 'Selamanya' : new Date(ev.end_date * 1000).toLocaleDateString('id-ID');
            
            caption += `*${index + 1}. ${ev.name}*\n`;
            caption += `🗓️ *Periode:* ${startDate} - ${endDate}\n`;
            caption += `📌 *Kategori:* ${ev.category?.name || '-'}\n`;
            if (ev.event_url) caption += `🔗 *Link:* ${ev.event_url}\n`;
            caption += `──────────────────\n\n`;
        });

        await conn.sendMessage(m.chat, {
            image: { url: firstThumb },
            caption: caption.trim()
        }, { quoted: m });

        await m.react('✅');

    } catch (err) {
        console.error("Error IDN Event Cuy:", err.message);
        await m.react('❌');
        m.reply(`❌ *Gagal memproses data.*\nError: ${err.message}\n\n*Format:* ${prefix + command} <type> | <page>\n*Contoh:* ${prefix + command} live | 1\n*Type:* event, live, giveaway-group`);
    }
};

handler.help = ['idnevent <type|page>'];
handler.tags = ['search'];
handler.command = /^(idnevent|eventidn)$/i;
handler.limit = true;

export default handler;