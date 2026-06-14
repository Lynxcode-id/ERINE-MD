import PhoneNumber from 'awesome-phonenumber'
import { xpRange } from '../lib/levelling.js'

let handler = async (m, { conn }) => {
  let who = m.mentionedJid && m.mentionedJid[0]
    ? m.mentionedJid[0]
    : m.fromMe
    ? conn.user.jid
    : m.sender

  let user = global.db.data.users[who]
  if (!user) return m.reply('❌ *User tidak ditemukan di database!*')

  let pp = './src/avatar_contact.png'
  try {
    pp = await conn.profilePictureUrl(who, 'image')
  } catch {}

  let level = user.level || 0
  let exp = user.exp || 0
  let limit = user.limit || 0
  let role = user.role || 'Beginner'
  let { min, xp, max } = xpRange(level, global.multiplier || 1)

  let username = conn.getName(who)
  let premium = user.premiumTime > 0 ? 'Premium 🌟' : 'Free User'
  let number = PhoneNumber('+' + who.replace('@s.whatsapp.net', '')).getNumber('international')
  let link = `https://wa.me/${who.split('@')[0]}`
  let str = `
乂  *U S E R  -  P R O F I L E*

┌  ◦  *Name:* ${username} ${user.registered ? `(${user.name})` : ''}
│  ◦  *Number:* ${number}
│  ◦  *Age:* ${user.registered ? user.age : 'Unknown'}
│  ◦  *Status:* ${user.registered ? 'Registered ✔️' : 'Unregistered ❌'}
└  ◦  *Type:* ${premium}

乂  *R P G  -  S T A T U S*

┌  ◦  *Role:* ${role}
│  ◦  *Level:* ${level}
│  ◦  *Limit:* ${limit}
└  ◦  *Exp:* ${exp} (${exp - min} / ${xp})

> ✧ *Link:* _${link}_
`.trim()

  conn.sendFile(m.chat, pp, 'profile.jpg', str, m, false, {
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
  })
}

handler.help = ['profile [@user]']
handler.tags = ['xp']
handler.command = /^profile$/i
handler.register = true
handler.rpg = true

export default handler
