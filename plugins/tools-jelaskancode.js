/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx Decode
 * 📞 WhatsApp  : +62 882-5804-1396
 * 📢 Channel   : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * ⚠️ Note      : Keep credit to respect the creator!
 * ─────────────────────────
 */

import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return m.reply(`Kirim kode yang mau dijelasin cuy!\n\n💡 *Contoh:* ${usedPrefix + command} function fibonacci(n) { if (n <= 1) return n; return fibonacci(n - 1) + fibonacci(n - 2); }`);

    await m.react('⏳');

    try {
        let url = `https://api.cuki.biz.id/api/aicode/jelaskancode?q=${encodeURIComponent(text)}`;
        let res = await fetch(url);
        let json = await res.json();

        if (!json.success || !json.data) {
            await m.react('❌');
            return m.reply('❌ Gagal menjelaskan kode. Server API mungkin sedang error.');
        }

        let meta = json.data.metadata || {};
        let codeInfo = json.data.codeInfo || {};
        let expl = json.data.explanation || {};
        let analysis = json.data.analysis || {};

        let teks = `╭───「 🧠 *AI CODE EXPLAINER* 」───\n`;
        teks += `│ 🏷️ *Title:* ${meta.title || 'Code Explanation'}\n`;
        teks += `│ 🌐 *Language:* ${meta.language || 'Unknown'}\n`;
        teks += `│ 📈 *Complexity:* ${analysis.complexity?.level || 'Moderate'}\n`;
        teks += `╰─────────────────────────\n\n`;

        if (expl.summary) {
            teks += `📝 *Summary:*\n${expl.summary}\n\n`;
        }

        if (expl.sections && expl.sections.length > 0) {
            teks += `📖 *Deep Explanation:*\n${expl.sections[0].content}\n\n`;
        }

        teks += `> ©ERINE PROJECT`;

        await conn.sendMessage(m.chat, { text: teks.trim() }, { quoted: m });

        await m.react('✅');
    } catch (e) {
        console.error(e);
        await m.react('❌');
        m.reply('❌ Gagal terhubung ke server API cuy.');
    }
}

handler.help = ['explaincode <code>', 'jelaskancode <code>'];
handler.tags = ['tools'];
handler.command = /^(explaincode|jelaskancode|explain)$/i;
handler.limit = true;

export default handler;