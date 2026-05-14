import moment from 'moment-timezone'
import fetch from 'node-fetch'
import fs from 'fs'
import os from 'os'
import pkg from '@whiskeysocket/baileys'

const { generateWAMessageFromContent, prepareWAMessageMedia, proto } = pkg

moment.locale('id')

function clockString(ms) {
    let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
    let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
    let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
    return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}

const formatSize = (size) => {
    return (size / 1024 / 1024 / 1024).toFixed(2) + ' GB'
}

let handler = async (m, { conn, usedPrefix, command, text }) => {
  if (!global.__menuLock) global.__menuLock = new Map()
  if (global.__menuLock.get(m.chat)) return
  global.__menuLock.set(m.chat, true)
  setTimeout(() => global.__menuLock.delete(m.chat), 3500)

  try {
    const who = m.sender
    let user = global.db.data.users[who]

    await m.react('⏳')
    
    let audios = global.menuAudio || [];
    let MENU_SOUND = '';
    
    if (Array.isArray(audios) && audios.length > 0) {
        MENU_SOUND = audios[Math.floor(Math.random() * audios.length)];
    } else if (typeof audios === 'string' && audios.trim() !== '') {
        MENU_SOUND = audios;
    }

    const THUMB = global.menuThumb || 'https://telegra.ph/file/0b32e0a0bb580004f2f01.jpg'

    const isOwner = Array.isArray(global.owner)
      ? global.owner.some(v => (Array.isArray(v) ? v[0] : v) === who.split('@')[0])
      : false

    let botname = global.namebot || conn.user?.name || 'ᴇʀɪɴᴇ-ᴍᴅ | ᴘʀᴏᴊᴇᴄᴛ'
    let owner = global.nameown || 'Lynx Decode'
    let version = global.version || '18.1.8'

    let limit = (isOwner || user?.premiumTime >= 1) ? 'ᴜɴʟɪᴍɪᴛᴇᴅ' : (user?.limit || 0)

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

    let menuType = (text || '').toLowerCase().trim()
    let arrayMenu = Object.keys(categories).sort()

    let wktuwib = moment.tz('Asia/Makassar').format('HH:mm:ss')
    let date = moment.tz('Asia/Makassar').format('DD/MM/YYYY')
    let runtime = clockString(process.uptime() * 1000)
    let ramTerpakai = formatSize(os.totalmem() - os.freemem())
    let ramTotal = formatSize(os.totalmem())

    let headerCaption = `┌˚₊ ๑│ ᴇ ʀ ɪ ɴ ᴇ  ᴍ ᴅ │๑˚₊ 🎀
┇ ✨ › ᴇʀɪɴᴇ sɪᴀᴘ ʙᴀɴᴛᴜ ᴋᴇʙᴜᴛᴜʜᴀɴᴍᴜ
┇ 🌸 › sᴀꜰᴇ & ᴛʀᴜsᴛᴇᴅ ᴀssɪsᴛᴀɴᴛ
┇ 🩰 › sᴇᴍᴀɴɢᴀᴛ sᴇᴘᴇʀᴛɪ ᴏsʜɪ-ᴍᴜ!
└˚₊ ๑ ᴛʜᴇᴀᴛᴇʀ ɪɴꜰᴏ ๑˚₊ 🍓

୨ ✧ ୧ Selamat Siang Center, @${who.split('@')[0]} 🦢
*Jangan lupa tersenyum hari ini yaa~* (๑ ˃̵ᴗ˂̵) ♡

┌˚ · ๑୧ ᴍ ᴇ ᴍ ʙ ᴇ ʀ  s ᴛ ᴀ ᴛ s
┇ 👤 ⁞ ᴜsᴇʀɴᴀᴍᴇ : @${who.split('@')[0]}
┇ 💳 ⁞ ʟɪᴍɪᴛ    : ${limit}
┇ ⏳ ⁞ ʀᴜɴᴛɪᴍᴇ  : ${runtime}
┇ 💾 ⁞ ʀᴀᴍ ᴜsᴇ  : ${ramTerpakai} / ${ramTotal}
┇ ⏰ ⁞ ᴛɪᴍᴇ     : ${wktuwib} ᴡɪᴛᴀ
┇ 📅 ⁞ ᴅᴀᴛᴇ     : ${date}
┇ 🎀 ⁞ ᴠᴇʀsɪᴏɴ  : v${version}
└˚₊ ๑୧

૮꒰ 🍓 ꒱ა ₊˚ s ᴇ ᴛ ʟ ɪ s ᴛ  ᴍ ᴇ ɴ ᴜ ✧
♡ .allmenu — sᴇᴍᴜᴀ ꜰɪᴛᴜʀ ᴇʀɪɴᴇ
♡ .downloadmenu — ᴅᴏᴡɴʟᴏᴀᴅᴇʀ
♡ .aimenu — ᴀɪ ᴄʜᴀᴛ (ᴏsʜɪ-ɪɴsᴘɪʀᴇᴅ)
♡ .groupmenu — ᴋᴇʙᴜᴛᴜʜᴀɴ ɢʀᴜᴘ
♡ .ownmenu — ᴋʜᴜsᴜs ɢᴇɴᴇʀᴀʟ ᴍᴀɴᴀɢᴇʀ`.trim()

    if (!menuType || (!categories[menuType] && menuType !== 'all')) {
      
      let media = await prepareWAMessageMedia({ image: { url: THUMB } }, { upload: conn.waUploadToServer })

      let sections = []
      let currentSection = { title: "🌟 Kategori Utama", highlight_label: "Hot", rows: [] }
      
      for (let tag of arrayMenu) {
          currentSection.rows.push({
              header: "✨ Menu",
              title: tag.toUpperCase(),
              description: `Menampilkan fitur kategori ${tag}`,
              id: `${usedPrefix}menu ${tag}`
          })
          
          if (currentSection.rows.length >= 10) {
              sections.push(currentSection)
              currentSection = { title: "🌟 Kategori Lainnya", rows: [] }
          }
      }
      if (currentSection.rows.length > 0 && !sections.includes(currentSection)) {
          sections.push(currentSection)
      }

      const msg = generateWAMessageFromContent(m.chat, {
        viewOnceMessage: {
          message: {
              messageContextInfo: {
                deviceListMetadata: {},
                deviceListMetadataVersion: 2
              },
              interactiveMessage: proto.Message.InteractiveMessage.create({
                body: { text: headerCaption },
                footer: { text: "© ᴇʀɪɴᴇ ᴍᴅ x ᴊᴋᴛ ᴠɪʙᴇ" },
                header: { hasMediaAttachment: true, ...media },
                contextInfo: {
                  isForwarded: true,
                  forwardedNewsletterMessageInfo: {
                    newsletterJid: "120363400612665352@newsletter",
                    newsletterName: "🌟 ᴇʀɪɴᴇ-ᴍᴅ ɪɴғᴏʀᴍᴀᴛɪᴏɴ",
                    serverMessageId: -1
                  }
                },
                nativeFlowMessage: {
                  buttons: [
                    {
                      name: "single_select",
                      buttonParamsJson: JSON.stringify({ title: "📋 Pilih List Menu", sections: sections })
                    },
                    {
                      name: "quick_reply",
                      buttonParamsJson: JSON.stringify({ display_text: "⚡ All Menu", id: ".menu all" })
                    },
                    {
                      name: "quick_reply",
                      buttonParamsJson: JSON.stringify({ display_text: "📚 Tutor Bot", id: ".tutorbot" })
                    }
                  ]
                }
              })
          }
        }
      }, { quoted: global.fkontak })

      await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })

    } else {
      let menuText = [`૮꒰ 🍓 ꒱ა ₊˚ ᴍ ᴇ ɴ ᴜ : ${menuType.toUpperCase()} ✧\n`]
      let targets = menuType === 'all' ? arrayMenu : [menuType]

      for (const tag of targets) {
        menuText.push(`┌˚ · ๑୧ ${tag.toUpperCase()}`)
        for (const item of categories[tag]) {
          for (const cmd of item.helps) {
            const prefix = item.prefix ? usedPrefix : ''
            menuText.push(`┇ ♡ ${prefix}${cmd}`)
          }
        }
        menuText.push(`└˚₊ ๑୧\n`)
      }

      await conn.sendMessage(m.chat, {
          image: { url: THUMB },
          caption: menuText.join('\n').trim(),
          contextInfo: {
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
              newsletterJid: "120363400612665352@newsletter",
              newsletterName: "🌟 ᴇʀɪɴᴇ-ᴍᴅ ɪɴғᴏʀᴍᴀᴛɪᴏɴ",
              serverMessageId: -1
            }
          }
      }, { quoted: global.fkontak })
    }

    if (MENU_SOUND !== '') {
        await conn.sendFile(m.chat, MENU_SOUND, 'menu.mp3', null, m, true, { type: 'audioMessage', ptt: true })
    }

    await m.react('✅')

  } catch (e) {
    console.error(e)
    m.reply('Menu error: ' + e.message)
  }
}

handler.command = /^(menu|allmenu)$/i 
handler.tags = ['main']
handler.help = ['menu']

export default handler
