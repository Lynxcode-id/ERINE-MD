import moment from "moment-timezone"

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

const jadwalSholat = {
    Fajr: "04:42",
    Sunrise: "05:58",
    Dhuhr: "12:03",
    Asr: "15:09",
    Sunset: "18:08",
    Maghrib: "18:08",
    Isha: "19:38",
    Imsak: "04:32",
    Midnight: "00:03",
    Firstthird: "22:04",
    Lastthird: "02:01",
}

let azanTracker = new Map()

setInterval(async () => {
    const conn = global.conn
    if (!conn || !conn.user || !global.db?.data?.chats) return

    const timeNow = moment().tz("Asia/Makassar").format("HH:mm")

    if (Object.values(jadwalSholat).includes(timeNow)) {
        const sholat = Object.keys(jadwalSholat).find(key => jadwalSholat[key] === timeNow)
        const lockKey = `${sholat}-${timeNow}`

        if (azanTracker.has(lockKey)) return
        azanTracker.set(lockKey, true)

        const randomQuote = islamicQuotes[Math.floor(Math.random() * islamicQuotes.length)]
        let wm = global.wm || "Erine System"

        let fkontak = {
            key: { fromMe: false, participant: `0@s.whatsapp.net` },
            message: {
                contactMessage: {
                    displayName: wm,
                    vcard: `BEGIN:VCARD\nVERSION:3.0\nN:XL;${wm},;;\nFN:${wm}\nitem1.TEL;waid=0:0\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
                }
            }
        }

        let caption = `| 📢 *P A N G G I L A N  S H O L A T*\n\n» *Waktu* : ${sholat}\n» *Jam* : ${timeNow} WITA\n» *Lokasi* : Makassar & Sekitarnya\n\nHalo seluruh warga grup, waktu *${sholat}* telah tiba.\nMari sejenak tinggalkan aktivitas, ambil air wudhu, dan segera dirikan shalat. 🕋\n\n_${randomQuote}_`

        const activeChats = Object.keys(global.db.data.chats).filter(id => id.endsWith('@g.us'))

        for (let jid of activeChats) {
            let chatSetting = global.db.data.chats[jid]

            if (!chatSetting || chatSetting.isBanned || !chatSetting.autosholat) continue

            try {
                await conn.sendMessage(jid, {
                    image: { url: "https://files.catbox.moe/amkc8i.jpg" },
                    caption: caption,
                    contextInfo: {
                        isForwarded: true,
                        forwardingScore: 9999,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: "120363400612665352@newsletter",
                            newsletterName: "🌟 ᴇʀɪɴᴇ-ᴍᴅ ɪɴғᴏʀᴍᴀᴛɪᴏɴ",
                            serverMessageId: -1
                        }
                    }
                }, { quoted: fkontak })
            } catch (err) {
                console.error(`[AUTOSHOLAT ERROR] Gagal mengirim broadcast ke room ${jid}:`, err.message)
            }
        }

        setTimeout(() => azanTracker.delete(lockKey), 65000)
    }
}, 30000)

let handler = async (m, { text, usedPrefix, command }) => {
    let chat = global.db.data.chats[m.chat]
    if (!text) return m.reply(`📦 *Opsi Pengaturan:*\n\n• ${usedPrefix + command} on\n• ${usedPrefix + command} off`)

    if (text.toLowerCase() === 'on') {
        chat.autosholat = true
        m.reply('✅ *Auto Panggilan Sholat berhasil diaktifkan.*')
    } else if (text.toLowerCase() === 'off') {
        chat.autosholat = false
        m.reply('❌ *Auto Panggilan Sholat dinonaktifkan di grup ini.*')
    } else {
        m.reply('⚠️ Pilihan tidak valid. Gunakan *on* atau *off*.')
    }
}

handler.help = ['autosholat <on/off>']
handler.tags = ['group']
handler.command = /^(autosholat|autoshola|panggilansholat)$/i
handler.group = true
handler.admin = true

export default handler