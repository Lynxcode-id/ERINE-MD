/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx Decode
 * 📞 WhatsApp  : +62 882-5804-1396
 * 📢 Channel   : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * ⚠️ Note      : Keep credit to respect the creator!
 * ─────────────────────────
 * 📝 Plugin: IDN Live Stream Search
 */

import axios from 'axios';

let handler = async (m, { conn, text, prefix, command }) => {
    await m.react('⚡');

    try {
        let [type, page] = text.split('|').map(v => v ? v.trim() : '');
        
        // Default langsung arahin ke JKT48
        type = type || 'jkt48';
        page = page || '1';

        const validTypes = ['all', 'trending', 'terjadwal', 'chit-chat', 'idol', 'e-sports', 'jkt48'];
        if (!validTypes.includes(type.toLowerCase())) {
            type = 'jkt48';
        }

        const apiUrl = `https://anabot.my.id/api/search/idn/livestream?type=${type}&page=${page}&apikey=freeApikey`;
        let res = await axios.get(apiUrl, { headers: { 'accept': 'application/json' } });
        
        if (!res.data || !res.data.success || !res.data.data?.result) {
            throw new Error('Gagal mengambil data livestream dari server.');
        }

        let streams = res.data.data.result;
        if (streams.length === 0) {
            throw new Error(`Tidak ada livestream yang ditemukan untuk kategori '${type}' di halaman ${page}.`);
        }

        let firstThumb = streams[0].image_url;
        let caption = `🎥 *IDN LIVE STREAM (${type.toUpperCase()})* - Page ${page}\n\n`;
        
        streams.forEach((stream, index) => {
            let statusLive = stream.status === 'live' ? '🔴 LIVE NOW' : '🗓️ SCHEDULED';
            let timeStamp = stream.status === 'live' ? stream.live_at : stream.scheduled_at;
            let timeString = timeStamp ? new Date(timeStamp * 1000).toLocaleString('id-ID') : '-';
            
            caption += `*${index + 1}. ${stream.title}*\n`;
            caption += `👤 *Streamer:* ${stream.creator?.name || '-'}\n`;
            caption += `📊 *Status:* ${statusLive}\n`;
            caption += `🕒 *Waktu:* ${timeString}\n`;
            if (stream.status === 'live') {
                caption += `👁️ *Viewers:* ${stream.view_count}\n`;
            }
            if (stream.playback_url) {
                caption += `🔗 *Playback:* ${stream.playback_url}\n`;
            }
            caption += `──────────────────\n\n`;
        });

        await conn.sendMessage(m.chat, {
            image: { url: firstThumb },
            caption: caption.trim()
        }, { quoted: m });

        await m.react('✅');

    } catch (err) {
        console.error("Error IDN Live Cuy:", err.message);
        await m.react('❌');
        m.reply(`❌ *Gagal memproses data.*\nError: ${err.message}\n\n*Format:* ${prefix + command} <type> | <page>\n*Contoh:* ${prefix + command} jkt48 | 1\n*Type:* all, trending, terjadwal, chit-chat, idol, e-sports, jkt48`);
    }
};

handler.help = ['idnlive <type|page>'];
handler.tags = ['search'];
handler.command = /^(idnlive|liveidn|idnstream)$/i;
handler.limit = true;

export default handler;