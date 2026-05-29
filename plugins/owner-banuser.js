/**
 * © ERINE-MD | Lynx | INF PROJECT
 */

let handler = async (m, { conn, text, usedPrefix, command }) => {
    let who;
    if (m.isGroup) {
        if (m.mentionedJid && m.mentionedJid.length > 0) {
            who = m.mentionedJid[0];
        } else if (m.quoted) {
            who = m.quoted.sender;
        } else if (text) {
            let input = text.replace(/[^0-9]/g, '');
            if (!input) return m.reply(`Input tidak valid! Gunakan tag, reply, atau ketik nomor.\n\nContoh: ${usedPrefix + command} 62812xxxx`);
            who = input + '@s.whatsapp.net';
        }
    } else {
        who = m.chat;
    }

    if (!who) return m.reply(`Tag targetnya atau reply pesannya, cuy!\nContoh: ${usedPrefix + command} @user`);
    let users = global.db.data.users;
    if (!users) {
        global.db.data.users = {};
        users = global.db.data.users;
    }
    
    if (!users[who]) {
        users[who] = { 
            banned: false, 
            name: await conn.getName(who).catch(() => 'Unknown'),
        };
    }

    users[who].banned = true;
    await m.reply(`✅ *User Berhasil Di-Ban!*
👤 *User:* @${who.split('@')[0]}
🛡️ *Status:* Banned`, null, { mentions: [who] });
};

handler.help = ['ban @user'];
handler.tags = ['owner'];
handler.command = /^ban(user)?$/i;
handler.owner = true;

export default handler;