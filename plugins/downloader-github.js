/**
 * Fitur Github Downloader by Erine-MD
 * Base Nao ESM
 **/

import fetch from 'node-fetch'

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) {
      return m.reply(`Mana link GitHub-nya cuy?\n\nContoh:\n${usedPrefix + command} https://github.com/Lynxcode-id/ERINE-MD`)
  }

  // Validasi simpel biar user masukin link github beneran
  if (!args[0].includes('github.com')) {
      return m.reply('❌ Link tidak valid! Pastikan itu adalah link dari github.com')
  }

  try {
    await m.react('⏳') // React loading

    // Hit API GitHub G4NGGAAA
    let res = await fetch(`https://www.api-g4nggaa.biz.id/api/download/github?url=${args[0]}`)
    let json = await res.json()

    if (!json.status || !json.result) {
        throw '❌ Gagal mengambil data Repositori! Pastikan linknya benar dan repo bersifat Publik.'
    }

    let { author, repository, description, stars, forks, branch, download_url } = json.result

    // Bersihkan spasi atau enter berlebih dari data API
    let cleanStars = stars ? stars.replace(/\D/g, '') || '0' : '0'
    let cleanForks = forks ? forks.replace(/\D/g, '') || '0' : '0'
    let cleanDesc = description ? description.trim() : 'Tidak ada deskripsi.'

    // --- CAPTION AESTHETIC ERINE-MD ---
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

    // Ambil foto profil GitHub author untuk Thumbnail
    const THUMB = `https://github.com/${author}.png`

    // Kirim pesan File (Document) ZIP dengan caption rapi
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
            },
            externalAdReply: {
                title: repository,
                body: `Author: ${author}`,
                thumbnailUrl: THUMB,
                sourceUrl: args[0],
                mediaType: 1,
                renderLargerThumbnail: true
            }
        }
    }, { quoted: m })

    await m.react('✅') // React sukses

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