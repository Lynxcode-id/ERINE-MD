import JavaScriptObfuscator from 'javascript-obfuscator';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    // Bisa baca dari pesan yang di-reply, atau dari teks langsung
    let code = m.quoted && m.quoted.text ? m.quoted.text : text;

    if (!code) {
        return m.reply(`Mana kode yang mau di-enkripsi (obfuscate) cuy?\n\n💡 *Contoh:* ${usedPrefix + command} const bot = require('baileys');\nAtau balas/reply chat yang isinya kode JS dengan command *${usedPrefix + command}*`);
    }

    await m.reply('⏳ *Sedang mengacak kode...*');

    try {
        // Proses Obfuscation dengan settingan hardcore biar makin pusing bacanya
        let obfuscationResult = JavaScriptObfuscator.obfuscate(code, {
            compact: true,
            controlFlowFlattening: true,
            controlFlowFlatteningThreshold: 1,
            numbersToExpressions: true,
            simplify: true,
            stringArrayShuffle: true,
            splitStrings: true,
            stringArrayThreshold: 1
        });

        let result = obfuscationResult.getObfuscatedCode();

        await m.reply(`✅ *Success!*\n\n\`\`\`javascript\n${result}\n\`\`\``);
    } catch (e) {
        console.error(e);
        m.reply(`❌ *Error:* Gagal mengobfuscate kode. Pastikan syntax JS lu valid cuy!\n\n_Log: ${e.message}_`);
    }
}

handler.help = ['enc2 <code>'];
handler.tags = ['tools'];
handler.command = /^(enc2)$/i;
handler.limit = true;

export default handler;