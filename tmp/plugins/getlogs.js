import { logs, clearLogs } from '../lib/logs.js';

let handler = async (m, { conn }) => {
    const logText = logs(30);
    
    if (logText.length > 4000) {
        await conn.sendMessage(m.chat, { document: Buffer.from(logText), mimetype: 'text/plain', fileName: 'erine-logs.txt' }, { quoted: m });
    } else {
        m.reply('```\n' + logText + '\n```');
    }
}
handler.help = ['getlog']
handler.tags = ['owner']
handler.command = /^getlog$/i
handler.rowner = true

export default handler
