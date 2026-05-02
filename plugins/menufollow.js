import moment from 'moment-timezone'

let handler = async (m, { conn, usedPrefix, command, text }) => {
  global.__menuReplyLock ||= new Map()
  if (global.__menuReplyLock.get(m.chat)) return
  global.__menuReplyLock.set(m.chat, true)
  setTimeout(() => global.__menuReplyLock.delete(m.chat), 2500)

  try {
    let plugins = Object.values(global.plugins || {}).filter(p => !p.disabled)
    let categories = {}
    for (let p of plugins) {
      let helps = Array.isArray(p.help) ? p.help : [p.help]
      let tags = Array.isArray(p.tags) ? p.tags : [p.tags]
      for (let tag of tags) {
        if (!tag) continue
        tag = tag.toLowerCase().trim()
        if (!categories[tag]) categories[tag] = []
        categories[tag].push({ helps, limit: p.limit, premium: p.premium, owner: p.owner, admin: p.admin, prefix: !p.customPrefix })
      }
    }

    let input = (text || m.text || '').toLowerCase().trim()
    let arrayMenu = Object.keys(categories).sort()
    let selectedCategory = input.replace(usedPrefix + command, '').trim()

    if (selectedCategory && (categories[selectedCategory] || selectedCategory === 'all')) {
      let menuText = [`*───「 ${selectedCategory.toUpperCase()} 」───*\n`]
      let targets = selectedCategory === 'all' ? arrayMenu : [selectedCategory]

      for (let tag of targets) {
        if (selectedCategory === 'all') menuText.push(`\n*# ${tag.toUpperCase()}*`)
        for (let item of categories[tag]) {
          for (let cmd of item.helps) {
            let prefix = item.prefix ? usedPrefix : ''
            menuText.push(`◦ ${prefix}${cmd}`)
          }
        }
      }
      
      return await conn.sendMessage(m.chat, { 
        text: menuText.join('\n'),
        contextInfo: {
            externalAdReply: {
                title: 'ᴇʀɪɴᴇ-ᴍᴅ ᴍᴀɴᴀɢᴇ ᴍᴇɴᴜ',
                body: `Menampilkan Menu: ${selectedCategory}`,
                thumbnailUrl: global.menuThumb,
                sourceUrl: '',
                mediaType: 1,
                renderLargerThumbnail: true
            }
        }
      }, { quoted: m })
    }

    const teks = `*MANAGE MENU SETTING*

Panduan memakai robot whatsapp ini:
Jika kalian masih keliru ketik command ini
*.tutorbot* untuk mendapatkan penjelasan tatacara
penggunaan bot.`

    let rows = arrayMenu.map(v => ({
      title: `✨ Menu ${v.toUpperCase()}`,
      description: `Menampilkan daftar perintah ${v}`,
      id: `${usedPrefix}${command} ${v}`
    }))

    let msg = {
      viewOnceMessage: {
        message: {
          interactiveMessage: {
            header: { title: `*ᴇʀɪɴᴇ-ᴍᴅ | ᴘʀᴏᴊᴇᴄᴛ*`, hasVideoMessage: false },
            body: { text: teks },
            footer: { text: 'ᴇʀɪɴᴇ-ᴍᴅ ᴍᴀɴᴀɢᴇ ᴍᴇɴᴜ' },
            nativeFlowMessage: {
              buttons: [
                {
                  name: 'single_select',
                  buttonParamsJson: JSON.stringify({
                    title: '✨ Pilih Menu',
                    sections: [{ title: `Tersedia ${arrayMenu.length} Kategori`, rows }]
                  })
                },
                {
                  name: 'quick_reply',
                  buttonParamsJson: JSON.stringify({
                    display_text: '📑 Semua Menu',
                    id: `${usedPrefix}${command} all`
                  })
                },
                {
                  name: 'quick_reply',
                  buttonParamsJson: JSON.stringify({
                    display_text: '👤 Developer',
                    id: `${usedPrefix}owner`
                  })
                }
              ]
            }
          }
        }
      }
    }

    await conn.relayMessage(m.chat, msg, {})

  } catch (error) {
    console.error(error)
    m.reply('Error menampilkan menu.')
  }
}

handler.help = ['help']
handler.tags = ['main']
handler.command = /^(help)$/i

export default handler
