import moment from "moment-timezone"
import fs from 'fs'
import path from 'path'
import os from 'os'
import { spawn } from 'child_process'
import axios from 'axios'

const THUMBNAIL_URL = "https://files.catbox.moe/21875b.jpg"
const AUDIO_URL = "https://files.catbox.moe/fkbmek.mp3"
const NEWSLETTER_JID = "120363400612665352@newsletter"
const NEWSLETTER_NAME = "🌟 ᴇʀɪɴᴇ-ᴍᴅ ɪɴғᴏʀᴍᴀᴛɪᴏɴ"

const jadwalAzan = {
    Subuh: "04:45",
    Dzuhur: "12:04",
    Ashar: "15:26",
    Maghrib: "17:59",
    Isya: "19:13"
}

const islamicQuotes = [
    "Perbaiki shalatmu, maka Allah akan memperbaiki hidupmu.",
    "Jadikanlah sabar dan shalat sebagai penolongmu.",
    "Shalat adalah istirahat terbaik bagi jiwa yang lelah dengan urusan dunia.",
    "Ketenangan hati yang hakiki hanya bisa ditemukan dalam sujud kepada-Nya.",
    "Jangan biarkan kesibukan duniawi membuatmu menunda panggilan Ilahi.",
    "Sujud adalah saat terbaik di mana jarak antara hamba dan Pencipta-Nya begitu dekat.",
    "Amalan yang pertama kali dihisab pada hari kiamat adalah shalat.",
    "Shalat bukan hanya kewajiban, tapi kebutuhan jiwa untuk tetap tenang.",
    "Ketika kau merasa kehilangan segalanya, ingatlah kau masih punya Allah dalam sujudmu.",
    "Dunia ini hanya sementara, jangan korbankan akhiratmu demi kesenangan sesaat.",
    "Shalat tepat waktu adalah wujud cinta tertinggi kita kepada Sang Pencipta.",
    "Langkah kaki menuju masjid adalah penggugur dosa dan peningkat derajat.",
    "Nyalakan cahaya hatimu dengan ruku' dan sujud yang khusyuk.",
    "Kesuksesan sejati dimulai dari sajadah saat fajar menyingsing.",
    "Shalat adalah tiang agama, jagalah tiang itu agar hidupmu tidak runtuh."
]

let azanTracker = new Map()

async function getOpusAudio(url) {
    const tempInput = path.join(os.tmpdir(), `azan_${Date.now()}_in.mp3`)
    const tempOutput = path.join(os.tmpdir(), `azan_${Date.now()}_out.opus`)

    try {
        const { data } = await axios.get(url, { responseType: 'arraybuffer' })
        fs.writeFileSync(tempInput, Buffer.from(data))

        await new Promise((resolve, reject) => {
            const ffmpeg = spawn('ffmpeg', [
                '-i', tempInput,
                '-map_metadata', '-1',
                '-vn', '-ac', '1', '-ar', '48000',
                '-c:a', 'libopus', '-b:a', '128k',
                '-y', tempOutput
            ])

            let stderr = ''
            ffmpeg.stderr.on('data', d => stderr += d.toString())
            ffmpeg.on('close', code => code === 0 ? resolve() : reject(new Error(stderr)))
        })

        return fs.readFileSync(tempOutput)
    } catch (err) {
        console.error("[AUTOSHOLAT] Gagal konversi audio:", err.message)
        return null
    } finally {
        if (fs.existsSync(tempInput)) fs.unlinkSync(tempInput)
        if (fs.existsSync(tempOutput)) fs.unlinkSync(tempOutput)
    }
}

setInterval(async () => {
    const conn = global.conn
    if (!conn?.user || !global.db?.data?.chats) return

    const timeNow = moment().tz("Asia/Makassar").format("HH:mm")
    const sholat = Object.keys(jadwalAzan).find(key => jadwalAzan[key] === timeNow)
    
    if (!sholat) return

    const lockKey = `${sholat}-${timeNow}`
    if (azanTracker.has(lockKey)) return
    
    azanTracker.set(lockKey, true)

    const randomQuote = islamicQuotes[Math.floor(Math.random() * islamicQuotes.length)]
    const wm = global.wm || "Erine System"
    const caption = `| 📢 *P A N G G I L A N  A Z A N*\n\n» *Waktu* : ${sholat}\n» *Jam* : ${timeNow} WITA\n» *Lokasi* : Makassar & Sekitarnya\n\nHalo seluruh warga grup, waktu *${sholat}* telah tiba.\nMari sejenak tinggalkan aktivitas, ambil air wudhu, dan segera dirikan shalat. 🕋\n\n_${randomQuote}_`

    const fkontak = {
        key: { fromMe: false, participant: `0@s.whatsapp.net` },
        message: {
            contactMessage: {
                displayName: wm,
                vcard: `BEGIN:VCARD\nVERSION:3.0\nN:XL;${wm},;;\nFN:${wm}\nitem1.TEL;waid=0:0\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
            }
        }
    }

    const contextErine = {
        isForwarded: true,
        forwardingScore: 9999,
        forwardedNewsletterMessageInfo: {
            newsletterJid: NEWSLETTER_JID,
            newsletterName: NEWSLETTER_NAME,
            serverMessageId: -1
        }
    }

    const opusBuffer = await getOpusAudio(AUDIO_URL)
    const activeChats = Object.keys(global.db.data.chats).filter(id => id.endsWith('@g.us'))

    for (let jid of activeChats) {
        const chatSetting = global.db.data.chats[jid]
        
        if (!chatSetting || chatSetting.isBanned || !chatSetting.autosholat) continue

        try {
            const msgImage = await conn.sendMessage(jid, {
                image: { url: THUMBNAIL_URL }, 
                caption: caption,
                contextInfo: contextErine
            }, { quoted: fkontak })

            const audioPayload = opusBuffer ? {
                audio: opusBuffer,
                mimetype: 'audio/ogg; codecs=opus',
                ptt: true,
                contextInfo: contextErine
            } : {
                audio: { url: AUDIO_URL },
                mimetype: 'audio/mpeg',
                ptt: true,
                contextInfo: contextErine
            }

            await conn.sendMessage(jid, audioPayload, { quoted: msgImage })

        } catch (err) {
            console.error(`[AUTOSHOLAT] Gagal mengirim ke ${jid}:`, err.message)
        }
    }

    setTimeout(() => azanTracker.delete(lockKey), 65000)
}, 30000)

const handler = async (m, { text, usedPrefix, command }) => {
    const chat = global.db.data.chats[m.chat]
    const action = text?.toLowerCase()

    if (!['on', 'off'].includes(action)) {
        return m.reply(`📦 *Opsi Pengaturan Auto Azan:*\n\n• ${usedPrefix + command} on\n• ${usedPrefix + command} off`)
    }
    
    chat.autosholat = (action === 'on')
    m.reply(action === 'on' 
        ? '✅ *Auto Azan Sholat berhasil diaktifkan di grup ini.*' 
        : '❌ *Auto Azan Sholat dinonaktifkan di grup ini.*'
    )
}

handler.help = ['autoazan <on/off>']
handler.tags = ['group']
handler.command = /^(autoazan)$/i
handler.group = true
handler.admin = true

export default handler