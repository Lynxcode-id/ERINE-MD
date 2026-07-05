/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx Decode
 * 📞 WhatsApp  : +62 882-5804-1396
 * 📢 Channel   : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * ⚠️ Note      : Keep credit to respect the creator!
 * ─────────────────────────
 * 📝 Plugin: Simulate Group Events (Anti-LID Version)
 */

import { participantsUpdate } from '../handler.js';

let handler = async (m, { conn, usedPrefix, command, args: [event], text }) => {
    if (!event) {
        return await conn.reply(m.chat, `contoh:
${usedPrefix + command} welcome @user
${usedPrefix + command} bye @user
${usedPrefix + command} promote @user
${usedPrefix + command} demote @user`.trim(), m, null, [['Welcome', '#simulate welcome'], ['Bye', '#simulate bye']])
    }
    
    let mentions = text.replace(event, '').trimStart()
    let who = mentions ? conn.parseMention(mentions) : []
    let part = who.length ? who : [m.sender]
    
    // Paksa konversi semua LID yang nyasar di parameter 'part' menjadi JID murni (s.whatsapp.net)
    part = part.map(user => {
        let normalized = String(user || '').trim();
        if (normalized.endsWith('@lid')) {
            // Cek ke memory global mapping isLid bot lu
            if (conn.isLid?.[normalized]) {
                return conn.isLid[normalized];
            }
            // Kalau ga ketemu di map, bersihin nomornya dan paksa lempar ke format s.whatsapp.net
            let num = normalized.split('@')[0];
            return `${num}@s.whatsapp.net`;
        }
        return normalized;
    });

    let act = false
    let prefixSign = typeof htjava !== 'undefined' ? htjava : '✧'
    
    m.reply(`*${prefixSign} Simulating ${event}...*`)
    
    switch (event.toLowerCase()) {
        case 'add':
        case 'invite':
        case 'welcome':
            act = 'add'
            break
        case 'bye':
        case 'kick':
        case 'leave':
        case 'remove':
            act = 'remove'
            break
        case 'promote':
            act = 'promote'
            break
        case 'demote':
            act = 'demote'
            break
        default:
            throw '❌ Pilihan event tidak valid!\n*Pilih:* welcome, bye, promote, atau demote'
    }
    
    if (act) {
        return await participantsUpdate.call(conn, {
            id: m.chat,
            participants: part,
            action: act
        })
    }
}

handler.help = ['simulate <event> [@mention]']
handler.tags = ['owner']
handler.rowner = true
handler.command = /^(simulate|simulasi)$/i;

export default handler;