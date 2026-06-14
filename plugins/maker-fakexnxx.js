import fetch from 'node-fetch'

let handler = async (m, { conn, text }) => {
  let [name, quote] = text.split('|').map(v => v.trim())
  if (!name || !quote) {
    throw 'Penggunaan: .fakexnxx <nama> | <quote>\nContoh: .fakexnxx zenn | Hai nama saya zen.'
  }

  let apiUrl = `https://api.siputzx.my.id/api/m/fake-xnxx?name=${encodeURIComponent(name)}&quote=${encodeURIComponent(quote)}&likes=999`

  let res = await fetch(apiUrl)
  let contentType = res.headers.get('content-type')

  const contextInfo = {
    isForwarded: true,
    forwardingScore: 9999,
    forwardedNewsletterMessageInfo: {
      newsletterJid: "120363400612665352@newsletter",
      newsletterName: "🌟 ᴇʀɪɴᴇ-ᴍᴅ ɪɴғᴏʀᴍᴀᴛɪᴏɴ",
      serverMessageId: -1
    }
  }

  if (contentType.includes('application/json')) {
    let json = await res.json()
    if (!json.status) throw json.error || 'Gagal membuat gambar.'
    if (!json.result?.url) throw 'Gagal mendapatkan URL gambar.'
    
    await conn.sendMessage(m.chat, {
      image: { url: json.result.url },
      caption: `Selesai!\n\nNama: ${name}\nQuote: ${quote}`,
      contextInfo
    }, { quoted: m })
  } else {
    await conn.sendMessage(m.chat, {
      image: { url: apiUrl },
      caption: `Selesai!\n\nNama: ${name}\nQuote: ${quote}`,
      contextInfo
    }, { quoted: m })
  }
}

handler.help = ['fakexnxx <nama> | <quote>']
handler.tags = ['maker']
handler.command = /^fakexnxx$/i

export default handler
