/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx Decode
 * ─────────────────────────
 * 📝 Plugin: Scheduler Reminder System (WITA Target)
 */

import moment from 'moment-timezone'

global.botReminders = global.botReminders || []

if (!global.reminderInterval) {
    global.reminderInterval = setInterval(async () => {
        if (!global.conn || !global.botReminders || global.botReminders.length === 0) return
        
        let now = moment().tz('Asia/Makassar') 
        
        for (let i = global.botReminders.length - 1; i >= 0; i--) {
            let rem = global.botReminders[i]
            let target = moment.tz(rem.targetTime, 'YYYY-MM-DD HH:mm', 'Asia/Makassar')
            let diffInMinutes = Math.ceil(target.diff(now, 'seconds') / 60)

            if (diffInMinutes === 0) {
                try {
                    await global.conn.sendMessage(rem.chat, { 
                        text: `🔔 *WAKTU HABIS!* 🔔\n\nHalo @${rem.user.split('@')[0]}, sudah jam *${target.format('HH:mm')} WITA*!\nSaatnya: *${rem.message}*`,
                        mentions: [rem.user]
                    }, { quoted: rem.quoted })
                } catch (e) {
                    console.error(e)
                }
                global.botReminders.splice(i, 1)
                continue
            }

            if (diffInMinutes > 0 && diffInMinutes <= 3) {
                if (rem.lastAlertedMinutes !== diffInMinutes) {
                    try {
                        await global.conn.sendMessage(rem.chat, {
                            text: `⏳ *COUNTDOWN REMINDER* ⏳\n\nHalo @${rem.user.split('@')[0]}, *${diffInMinutes} menit lagi* menuju jam *${target.format('HH:mm')} WITA*!\nAgenda: *${rem.message}*`,
                            mentions: [rem.user]
                        }, { quoted: rem.quoted })
                    } catch (e) {
                        console.error(e)
                    }
                    rem.lastAlertedMinutes = diffInMinutes
                }
            }
            
            if (diffInMinutes < 0) {
                global.botReminders.splice(i, 1)
            }
        }
    }, 15000) 
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text || !text.includes('|')) {
        return m.reply(`❌ Format salah!\n\n*Format:* ${usedPrefix + command} HH:MM | Agenda\n*Contoh:* ${usedPrefix + command} 10:05 | Mancing`);
    }

    await m.react('⏳');

    try {
        let [timeInput, ...msgArr] = text.split('|');
        let message = msgArr.join('|').trim();
        let time = timeInput.trim();

        let timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        if (!timeRegex.test(time)) {
            return m.reply(`❌ Format jam salah! Gunakan format 24 jam (Contoh: 10:05 atau 22:15)`);
        }

        let [hours, minutes] = time.split(':');
        let now = moment().tz('Asia/Makassar');
        let target = moment().tz('Asia/Makassar').hours(parseInt(hours)).minutes(parseInt(minutes)).seconds(0).milliseconds(0);

        if (target.isBefore(now)) {
            target.add(1, 'days');
        }

        global.botReminders.push({
            chat: m.chat,
            user: m.sender,
            targetTime: target.format('YYYY-MM-DD HH:mm'),
            message: message,
            lastAlertedMinutes: null,
            quoted: m
        });

        let caption = `✅ *Reminder Berhasil Diatur!*\n\n» *Agenda* : ${message}\n» *Waktu* : ${target.format('HH:mm')} WITA (${target.format('DD-MM-YYYY')})\n\n> Bot akan otomatis mengirim pengingat beruntun setiap menit mulai dari 3 menit sebelum waktu target.`.trim();
        
        m.reply(caption);
        await m.react('✅');

    } catch (e) {
        console.error('[REMINDER SYSTEM ERROR]', e);
        await m.react('❌');
        m.reply(`⚠️ *System Error:*\n_${e.message || e}_`);
    }
};

handler.help = ['remind <jam|agenda>'];
handler.tags = ['tools'];
handler.command = /^(remind|reminder|setreminder)$/i;
handler.limit = true;

export default handler;