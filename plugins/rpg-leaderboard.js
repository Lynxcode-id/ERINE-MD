/*
# Fitur : Leaderboard
# Type : Plugins ESM
# Developed for : Erine-MD | INF PROJECT
# Api : lokal / database.json
*/

import pkg from '@whiskeysockets/baileys'
const { areJidsSameUser } = pkg

const getRandom = (list) => list[Math.floor(Math.random() * list.length)]

const leaderboards = [
  'atm','level','exp','money','limit','iron','gold','diamond','emerald','trash','potion',
  'wood','rock','string','umpan','petfood','common','uncommon','mythic','legendary','pet',
  'bank','chip','garam','minyak','gandum','steak','ayam_goreng',
  'ribs','roti','udang_goreng','bacon'
]

leaderboards.sort((a,b) => a.localeCompare(b))

let handler = async (m, { conn, args, usedPrefix, command }) => {
  let users = Object.entries(global.db.data.users).map(([jid, data]) => ({ ...data, jid }))

  let type = (args[0] || '').toLowerCase()
  let list = leaderboards.filter(v => users.some(u => u[v] > 0))

  if (!list.includes(type)) {
    let emoticon = (v) => global.rpg?.emoticon ? global.rpg.emoticon(v) : '⮕'
    
    let helpText = `乂  *L B  T Y P E  L I S T*\n\n`
    helpText += list.map(v => `${emoticon(v)} ${v}`).join('\n')
    helpText += `\n\n📌 *Contoh:* _${usedPrefix + command} money_`

    return conn.sendMessage(m.chat, {
      image: { url: getRandom(flaImg) + 'LEADERBOARD' },
      caption: helpText.trim(),
      contextInfo: {
        isForwarded: true,
        forwardingScore: 9999,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363400612665352@newsletter",
          newsletterName: "🌟 ᴇʀɪɴᴇ-ᴍᴅ ɪɴғᴏʀᴍᴀᴛɪᴏɴ",
          serverMessageId: -1
        }
      }
    }, { quoted: m })
  }

  await m.react('⏳')

  let sorted = users
    .map(v => ({ 
        jid: v.jid, 
        val: v[type] || 0, 
        name: v.registered ? v.name : conn.getName(v.jid) 
    }))
    .sort((a,b) => b.val - a.val)

  let rank = sorted.findIndex(v => areJidsSameUser(v.jid, m.sender)) + 1
  let top10 = sorted.slice(0, 10)

  let text = `🏆 *Rank kamu:* ${rank} dari ${sorted.length}\n\n`
  text += `乂  *T O P  1 0  ${type.toUpperCase()}*\n\n`
  
  text += top10.map((v, i) => {
    return `${i + 1}. [${toRupiah(v.val)}] - ${v.name}\n   wa.me/${v.jid.split('@')[0]}`
  }).join('\n\n')

  text += `\n\n© INF PROJECT | ERINE-MD`

  await conn.sendMessage(m.chat, {
    image: { url: getRandom(flaImg) + type },
    caption: text,
    contextInfo: {
      mentionedJid: top10.map(v => v.jid),
      isForwarded: true,
      forwardingScore: 9999,
      forwardedNewsletterMessageInfo: {
        newsletterJid: "120363400612665352@newsletter",
        newsletterName: "🌟 ᴇʀɪɴᴇ-ᴍᴅ ɪɴғᴏʀᴍᴀᴛɪᴏɴ",
        serverMessageId: -1
      }
    }
  }, { quoted: m })
  
  await m.react('✅')
}

handler.help = ['lb <type>', 'leaderboard']
handler.tags = ['xp', 'rpg']
handler.command = /^(leaderboard|lb)$/i
handler.rpg = true
handler.group = true
handler.register = true

export default handler

const flaImg = [
  'https://flamingtext.com/net-fu/proxy_form.cgi?&imageoutput=true&script=water-logo&fontsize=100&text=',
  'https://flamingtext.com/net-fu/proxy_form.cgi?&imageoutput=true&script=crafts-logo&fontsize=100&text=',
  'https://flamingtext.com/net-fu/proxy_form.cgi?&imageoutput=true&script=amped-logo&fontsize=100&text='
]

const toRupiah = n => parseInt(n).toLocaleString().replace(/,/g,'.')
