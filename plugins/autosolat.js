import moment from "moment-timezone"

export async function before(m) {
  this.autosholat = this.autosholat || {}

  const who = m.mentionedJid?.[0] || (m.fromMe ? this.user.jid : m.sender)
  const id = m.chat
  const now = Date.now()

  if (id in this.autosholat && now - this.autosholat[id].timestamp < 300000) return false

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

  const timeNow = moment().tz("Asia/Makassar").format("HH:mm")

  if (Object.values(jadwalSholat).includes(timeNow)) {
    const sholat = Object.keys(jadwalSholat).find(key => jadwalSholat[key] === timeNow)
    const caption = `@${who.split`@`[0]},\nWaktu *${sholat}* telah tiba, ambillah air wudhu dan segeralah shalat.\n\n*${timeNow}*\n_untuk wilayah Makassar dan sekitarnya._`

    let wm = global.wm || "Erine System"
    let senderNumber = m.sender.split('@')[0]
    let fkontak = {
        key: {
            fromMe: false,
            participant: `0@s.whatsapp.net`
        },
        message: {
            contactMessage: {
                displayName: wm,
                vcard: `BEGIN:VCARD\nVERSION:3.0\nN:XL;${wm},;;;\nFN:${wm}\nitem1.TEL;waid=${senderNumber}:${senderNumber}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
            }
        }
    }

    this.autosholat[id] = {
      msg: await this.reply(m.chat, caption, fkontak, {
        contextInfo: {
          mentionedJid: [who],
          isForwarded: true,
          forwardingScore: 9999,
          forwardedNewsletterMessageInfo: {
            newsletterJid: "120363400612665352@newsletter",
            newsletterName: "🌟 ᴇʀɪɴᴇ-ᴍᴅ ɪɴғᴏʀᴍᴀᴛɪᴏɴ",
            serverMessageId: -1
          }
        }
      }),
      timestamp: now
    }

    setTimeout(() => delete this.autosholat[id], 57000)
  }
}

export const disabled = false
