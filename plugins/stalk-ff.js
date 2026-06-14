import fetch from 'node-fetch'

let handler = async (m, { conn, args, usedPrefix, command }) => {
  // Peringatan kalau user lupa masukin ID
  if (!args[0]) {
      return m.reply(`Ketik *${usedPrefix + command}* diikuti dengan ID Free Fire lu cuy.\n\nContoh: *${usedPrefix + command} 3238006990*`)
  }
  
  await m.react('⏳')
  
  try {
    // Tembak API Deline
    let apiUrl = `https://api.deline.web.id/stalker/stalkff?id=${args[0]}`
    let res = await fetch(apiUrl)
    let json = await res.json()
    
    // Cek kalau API-nya gagal nangkep data
    if (!json.status || !json.result) {
        await m.react('❌')
        return m.reply('❌ Gagal cuy! Pastikan ID Free Fire yang lu masukin bener.')
    }

    // Ekstrak data dari result
    let { player_id, nickname, game, status } = json.result

    // Layout aesthetic khas Erine-MD
    let caption = `૮꒰ 🎮 ꒱ა ₊˚ ꜰ ʀ ᴇ ᴇ  ꜰ ɪ ʀ ᴇ  ꜱ ᴛ ᴀ ʟ ᴋ ᴇ ʀ ✧\n\n`
    caption += `┌˚ · ๑୧ ᴘ ʀ ᴏ ꜰ ɪ ʟ  ɪ ɴ ꜰ ᴏ\n`
    caption += `┇ 🆔 ⁞ ɪᴅ ᴀᴄᴄᴏᴜɴᴛ : ${player_id}\n`
    caption += `┇ 👤 ⁞ ɴɪᴄᴋɴᴀᴍᴇ   : ${nickname}\n`
    caption += `┇ 🎮 ⁞ ɢᴀᴍᴇ       : ${game}\n`
    caption += `┇ 🟢 ⁞ ꜱᴛᴀᴛᴜꜱ     : ${status}\n`
    caption += `└˚₊ ๑୧`

    // Kirim hasilnya ke WA
    await conn.sendMessage(m.chat, { text: caption }, { quoted: m })
    await m.react('✅')

  } catch (e) {
    console.error('❌ ERROR STALK FF:', e)
    await m.react('❌')
    m.reply(`❌ Waduh error cuy. Server API-nya mungkin lagi gangguan.\n\n*Log:* ${String(e)}`)
  }
}

handler.help = ['stalkff <id>', 'cekff <id>']
handler.tags = ['tools']
handler.command = /^(stalkff|ffstalk|cekff)$/i
handler.limit = true // Kasih limit biar ga diserang spam

export default handler