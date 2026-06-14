let handler = async (m, { conn }) => {
  let rine = `┌˚₊ ๑│ ᴇ ʀ ɪ ɴ ᴇ  ᴍ ᴅ │๑˚₊ 🎀
┇ 🌸 › ʜᴀʟᴏᴏ, ɴʏᴀʀɪɪɴ ᴇʀɪɴᴇ ʏᴀ?
└˚₊ ๑ ᴀ ᴜ ᴛ ᴏ  ʀ ᴇ s ᴘ ᴏ ɴ s ᴇ ๑˚₊ 🍓

Kalau kamu emang beneran butuh Erine, 
langsung aja ketik *.menu* yaa! ✨

Tapi inget, jangan spam! Ntar owner 
narik Erine keluar dari grup kalian lho... 🙄

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

  await conn.sendMessage(
    m.chat,
    {
      text: rine,
      contextInfo: {
          forwardingScore: 999,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
              newsletterName: `「 🐣 ᴇʀɪɴᴇ-ᴍᴅ ɪɴғᴏʀᴍᴀᴛɪᴏɴ 🐣 」`,
              newsletterJid: "120363400612665352@newsletter"
          }
      }
    },
    { quoted: fkontak }
  )
}

handler.customPrefix = /^(tes|bot|rine|test)$/i
handler.command = new RegExp

export default handler
