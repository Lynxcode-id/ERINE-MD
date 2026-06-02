// © INF PROJECT - Erine-MD
// Developed by INF PROJECT | Lynx

import { generateWAMessageFromContent } from '@whiskeysockets/baileys'
import moment from 'moment-timezone'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    let [name, location, link, startTime, endTime] = text.split('|').map(v => v?.trim() || '')

    if (!name || !location) {
        return m.reply(
            `⚠️ *Format Salah!*\n\n` +
            `Gunakan format:\n` +
            `${usedPrefix + command} Nama Acara | Lokasi | Link (Opsional) | Jam Mulai (Opsional) | Jam Selesai (Opsional)\n\n` +
            `*Contoh 1 (Lengkap):*\n` +
            `${usedPrefix + command} Mabar ML | Land of Dawn | https://discord.gg/xxx | 19:00 | 21:00\n\n` +
            `*Contoh 2 (Tanpa Link):*\n` +
            `${usedPrefix + command} Rapat JKT48 | Theater`
        )
    }

    await m.react('⏳')

    try {
        const timezone = 'Asia/Makassar'
        
        let startMoment = moment().tz(timezone).add(1, 'hours')
        if (startTime) {
            let [h, min] = startTime.split(':')
            if (h && min) {
                startMoment = moment().tz(timezone).set({ hour: parseInt(h), minute: parseInt(min), second: 0 })
                if (startMoment.isBefore(moment().tz(timezone))) {
                    startMoment.add(1, 'days') 
                }
            }
        }
        let startUnix = startMoment.unix()
        if (endTime) {
            let [hEnd, mEnd] = endTime.split(':')
            if (hEnd && mEnd) {
                let endMoment = moment.unix(startUnix).tz(timezone).set({ hour: parseInt(hEnd), minute: parseInt(mEnd), second: 0 })
                if (endMoment.isAfter(startMoment)) {
                    endUnix = endMoment.unix()
                }
            }
        }

        let eventPayload = {
            isCanceled: false,
            name: name,
            location: {
                degreesLatitude: 0,
                degreesLongitude: 0,
                name: location
            },
            startTime: startUnix,
            endTime: endUnix,
            extraGuestsAllowed: true,
            isScheduleCall: false,
            hasReminder: true,
            reminderOffsetSec: 3600,
            contextInfo: { mentionedJid: [] }
        }
        
        if (link && link.startsWith('http')) {
            eventPayload.joinLink = link
        }

        let msg = await generateWAMessageFromContent(m.chat, {
            eventMessage: eventPayload
        }, { quoted: m })

        await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
        await m.react('✅')

    } catch (e) {
        console.error('Error Create Event:', e)
        await m.react('❌')
        m.reply(`❌ Gagal membuat event: ${e.message}`)
    }
}

handler.help = ['createevent']
handler.tags = ['tools']
handler.command = /^(createevent|buaticara|addevent)$/i
handler.group = true 
handler.admin = true 

export default handler