import fetch from 'node-fetch'

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) {
      return m.reply(`Mana link GitHub-nya cuy?\n\nContoh:\n${usedPrefix + command} https://github.com/Lynxcode-id/ERINE-MD`)
  }

  if (!args[0].includes('github.com')) {
      return m.reply('❌ Link tidak valid! Pastikan itu adalah link dari github.com')
  }

  try {
    await m.react('⏳')

    let res = await fetch(`https://www.api-g4nggaa.biz.id/api/download/github?url=${args[0]}`)
    let json = await res.json()

    if (!json.status || !json.result) {
        throw '❌ Gagal mengambil data Repositori! Pastikan linknya benar dan repo bersifat Publik.'
    }

    let { author, repository, description, stars, forks, branch, download_url } = json.result

    let cleanStars = stars ? stars.replace(/\D/g, '') || '0' : '0'
    let cleanForks = forks ? forks.replace(/\D/g, '') || '0' : '0'
    let cleanDesc = description ? description.trim() : 'Tidak ada deskripsi.'

    let caption = `┌˚₊ ๑│ ᴇ ʀ ɪ ɴ ᴇ  ᴍ ᴅ │๑˚₊ 🎀
┇ 🚀 › ɢɪᴛʜᴜʙ ᴅᴏᴡɴʟᴏᴀᴅᴇʀ
┇ 🌸 › sᴀꜰᴇ & ᴛʀᴜsᴛᴇᴅ ᴀssɪsᴛᴀɴᴛ
└˚₊ ๑ ʀ ᴇ ᴘ ᴏ  ɪ ɴ ꜰ ᴏ ๑˚₊ 🍓

┌˚ · ๑୧ ᴅ ᴇ ᴛ ᴀ ɪ ʟ s
┇ 👤 ⁞ ᴀᴜᴛʜᴏʀ : ${author}
┇ 📦 ⁞ ʀᴇᴘᴏsɪᴛᴏʀʏ : ${repository}
┇ 🌿 ⁞ ʙʀᴀɴᴄʜ : ${branch}
┇ ⭐ ⁞ sᴛᴀʀs : ${cleanStars}
┇ 🍴 ⁞ ꜰᴏʀᴋs : ${cleanForks}
└˚₊ ๑୧

📝 ⁞ ᴅᴇsᴄʀɪᴘᴛɪᴏɴ :
${cleanDesc}

*Tunggu sebentar, file ZIP sedang dikirim...* ⏳
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

    await conn.sendMessage(m.chat, {
        document: { url: download_url },
        fileName: `${repository}-${branch}.zip`,
        mimetype: 'application/zip',
        caption: caption,
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
    m.reply('Waduh error cuy: ' + e.message)
  }
}

handler.help = ['gitclone', 'githubdl']
handler.tags = ['downloader']
handler.command = /^(gitclone|githubdl|ghdl)$/i
handler.limit = true

export default handler
