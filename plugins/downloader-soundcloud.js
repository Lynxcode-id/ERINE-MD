import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return conn.reply(
      m.chat,
      `Example : ${usedPrefix + command} Swim chase atlantic`,
      m
    )
  }

  try {
    await m.react('⏳')

    let api = `${global.APIs.faa}/faa/soundcloud-play?query=${encodeURIComponent(text)}`
    let res = await fetch(api)
    let json = await res.json()

    if (!json.status) throw 'Gagal mengambil lagu.'

    let data = json.result

    let caption = `┌˚₊ ๑│ ᴇ ʀ ɪ ɴ ᴇ  ᴍ ᴅ │๑˚₊ 🎀
┇ 🎵 › sᴏᴜɴᴅᴄʟᴏᴜᴅ ᴅᴏᴡɴʟᴏᴀᴅᴇʀ
┇ 🌸 › sᴀꜰᴇ & ᴛʀᴜsᴛᴇᴅ ᴀssɪsᴛᴀɴᴛ
└˚₊ ๑ ᴛ ʀ ᴀ ᴄ ᴋ  ɪ ɴ ꜰ ᴏ ๑˚₊ 🍓

┌˚ · ๑୧ ᴅ ᴇ ᴛ ᴀ ɪ ʟ s
┇ 🎧 ⁞ ᴛɪᴛʟᴇ : ${data.title}
┇ 👤 ⁞ ᴀʀᴛɪsᴛ : ${data.user}
└˚₊ ๑୧

*Tunggu sebentar, audio sedang dikirim...* ⏳
© ᴇʀɪɴᴇ ᴍᴅ x ᴊᴋᴛ𝟺𝟾 ᴠɪʙᴇ`.trim()

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

    // Kirim pesan detail info duluan
    await conn.sendMessage(m.chat, { 
        text: caption,
        contextInfo: {
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterName: `「 🐣 ᴇʀɪɴᴇ-ᴍᴅ ɪɴғᴏʀᴍᴀᴛɪᴏɴ 🐣 」`,
                newsletterJid: "120363400612665352@newsletter"
            }
        }
    }, { quoted: fkontak })

    let audioRes = await fetch(data.download_url)
    let buffer = await audioRes.buffer()

    // Kirim audio
    await conn.sendMessage(m.chat, {
      audio: buffer,
      mimetype: 'audio/mpeg',
      fileName: `${data.title}.mp3`,
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterName: `「 🐣 ᴇʀɪɴᴇ-ᴍᴅ ɪɴғᴏʀᴍᴀᴛɪᴏɴ 🐣 」`,
            newsletterJid: "120363400612665352@newsletter"
        }
      }
    }, { quoted: fkontak })

    await m.react('✅')

  } catch (e) {
    console.error(e)
    await m.react('❌')
    conn.reply(m.chat, '⚠️ Gagal mengambil audio.', m)
  }
}

handler.help = ['soundcloud <judul>']
handler.tags = ['downloader']
handler.command = /^soundcloud$/i
handler.limit = true

export default handler
