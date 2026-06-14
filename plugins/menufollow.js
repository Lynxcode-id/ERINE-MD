import moment from 'moment-timezone'

let handler = async (m, { conn, usedPrefix, command, text }) => {
  if (!global.__helpLock) global.__helpLock = new Map()
  if (global.__helpLock.get(m.chat)) return
  global.__helpLock.set(m.chat, true)
  setTimeout(() => global.__helpLock.delete(m.chat), 3000)

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
        categories[tag].push({ helps, prefix: !p.customPrefix })
      }
    }

    let input = (text || '').toLowerCase().trim()
    let arrayMenu = Object.keys(categories).sort()

    const contextInfo = {
      isForwarded: true,
      forwardingScore: 9999,
      forwardedNewsletterMessageInfo: {
        newsletterJid: "120363400612665352@newsletter",
        newsletterName: "🌟 ᴇʀɪɴᴇ-ᴍᴅ ɪɴғᴏʀᴍᴀᴛɪᴏɴ",
        serverMessageId: -1
      }
    }

    if (input && (categories[input] || input === 'all')) {
      let menuText = [`*───「 ${input.toUpperCase()} 」───*\n`]
      let targets = input === 'all' ? arrayMenu : [input]

      for (let tag of targets) {
        if (input === 'all') menuText.push(`\n*# ${tag.toUpperCase()}*`)
        for (let item of categories[tag]) {
          for (let cmd of item.helps) {
            menuText.push(`◦ ${item.prefix ? usedPrefix : ''}${cmd}`)
          }
        }
      }
      
      return await conn.sendMessage(m.chat, { text: menuText.join('\n'), contextInfo }, { quoted: m })
    }

    const teks = `*MANAGE MENU SETTING*\n\nSilakan pilih kategori di bawah cuy.`
    let rows = arrayMenu.map(v => ({
      title: `✨ Menu ${v.toUpperCase()}`,
      description: `Daftar perintah ${v}`,
      id: `${usedPrefix}${command} ${v}`
    }))

    let msg = {
      viewOnceMessage: {
        message: {
          interactiveMessage: {
            body: { text: teks },
            footer: { text: 'ᴇʀɪɴᴇ-ᴍᴅ ᴍᴀɴᴀɢᴇ ᴍᴇɴᴜ' },
            header: { title: `*ᴇʀɪɴᴇ-ᴍᴅ | ᴘʀᴏᴊᴇᴄᴛ*`, hasVideoMessage: false },
            contextInfo: contextInfo,
            nativeFlowMessage: {
              buttons: [
                {
                  name: 'single_select',
                  buttonParamsJson: JSON.stringify({ title: '✨ Pilih Menu', sections: [{ title: `Tersedia ${arrayMenu.length} Kategori`, rows }] })
                },
                {
                  name: 'quick_reply',
                  buttonParamsJson: JSON.stringify({ display_text: '📑 Semua Menu', id: `.help all` })
                }
              ]
            }
          }
        }
      }
    }

    await conn.relayMessage(m.chat, msg, { quoted: global.fkontak || m })

  } catch (error) { m.reply('Error menampilkan menu.') }
}

handler.help = ['help']
handler.tags = ['main']
handler.command = /^(help)$/i

export default handler
