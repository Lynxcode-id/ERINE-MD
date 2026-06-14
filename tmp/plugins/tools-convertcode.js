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
    let [lang, ...codeArr] = text.split('|');
    let code = codeArr.join('|').trim();

    if (!lang || !code) {
        return m.reply(`Format salah cuy!\n\n💡 *Contoh:* ${usedPrefix + command} nodejs | function hello() { console.log('Hi') }`);
    }

    await m.react('⏳');

    try {
        let query = `Convert this code to ${lang.trim()}:\n${code}`;
        let url = `https://api.cuki.biz.id/api/aicode/convertLangue?q=${encodeURIComponent(query)}`;
        let res = await fetch(url);
        let json = await res.json();

        if (!json.success || !json.data) {
            await m.react('❌');
            return m.reply('❌ Gagal mengonversi kode. Server API mungkin sedang error.');
        }

        let meta = json.data.metadata || {};
        let comp = json.data.codeComparison || {};
        let analysis = json.data.analysis || {};
        let conv = meta.conversion || {};

        let teks = `╭───「 💻 *AI CODE CONVERTER* 」───\n`;
        teks += `│ 🏷️ *Title:* ${meta.title || 'Code Conversion'}\n`;
        teks += `│ 🔄 *From:* ${conv.from || 'Auto-detect'} ➡️ *To:* ${conv.to || lang.trim()}\n`;
        teks += `╰─────────────────────────\n\n`;

        if (analysis.explanation) {
            teks += `📝 *Explanation:*\n${analysis.explanation}\n\n`;
        }

        if (comp.target && comp.target.code) {
            let targetLang = comp.target.language ? comp.target.language.toLowerCase() : lang.trim().toLowerCase();
            teks += `✨ *Converted Code:*\n`;
            teks += `\`\`\`${targetLang}\n`;
            teks += `${comp.target.code}\n`;
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

handler.help = ['convertcode <lang> | <code>'];
handler.tags = ['tools'];
handler.command = /^(convertcode|convcode|codeconvert)$/i;
handler.limit = true;

export default handler;