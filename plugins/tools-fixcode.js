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
    if (!text) return m.reply(`Kirim kode yang mau dianalisa cuy!\n\n💡 *Contoh:* ${usedPrefix + command} function add(a, b) { return a + b }`);

    await m.react('⏳');

    try {
        let url = `https://api.cuki.biz.id/api/aicode/convertLangue?q=${encodeURIComponent(text)}`;
        let res = await fetch(url);
        let json = await res.json();

        if (!json.success || !json.data) {
            await m.react('❌');
            return m.reply('❌ Gagal menganalisa kode. Pastikan format atau server API aman.');
        }

        let meta = json.data.metadata || {};
        let analysis = json.data.codeAnalysis || {};
        let bugs = json.data.bugsFound || {};
        let raw = json.data.rawResponse || {};
        let severity = meta.severityInfo || {};

        let teks = `╭───「 💻 *AI CODE ANALYZER* 」───\n`;
        teks += `│ 🏷️ *Title:* ${meta.title || 'Code Analysis'}\n`;
        teks += `│ 🌐 *Language:* ${meta.detectedLanguage || 'Unknown'}\n`;
        if (severity.level) {
            teks += `│ ${severity.icon || '📌'} *Severity:* ${severity.level} (${severity.description || ''})\n`;
        }
        teks += `╰─────────────────────────\n\n`;

        if (bugs.summary) {
            teks += `📝 *Summary:*\n${bugs.summary}\n\n`;
        } else if (raw.explanation) {
            teks += `📝 *Explanation:*\n${raw.explanation}\n\n`;
        }

        if (analysis.fixed && analysis.fixed.code) {
            let lang = meta.detectedLanguage ? meta.detectedLanguage.toLowerCase() : 'javascript';
            teks += `✨ *Fixed Code:*\n`;
            teks += `\`\`\`${lang}\n`;
            teks += `${analysis.fixed.code}\n`;
            teks += `\`\`\`\n\n`;
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

handler.help = ['aicode <code>', 'bugfix <code>'];
handler.tags = ['tools'];
handler.command = /^(aicode|bugfix|analyze)$/i;
handler.limit = true;

export default handler;