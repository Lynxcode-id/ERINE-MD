// © INF PROJECT - Erine-MD
// Developed by INF PROJECT

import fetch from 'node-fetch'
import pkg from '@wishkeysocket/baileys' 
const { getBinaryNodeChild, getBinaryNodeChildren } = pkg

let handler = async (m, { conn, text, participants, usedPrefix, command }) => {
  if (!text) throw `⚠️ Masukkan nomor yang ingin ditambahkan!\n\n📌 Contoh:\n${usedPrefix + command} 628xxxx`

  await m.react('⏳')

  let _participants = participants.map(user => user.id)
  let users = (await Promise.all(
    text.split(',')
      .map(v => v.replace(/[^0-9]/g, ''))
      .filter(v => v.length > 4 && v.length < 20 && !_participants.includes(v + '@s.whatsapp.net'))
      .map(async v => [v, await conn.onWhatsApp(v + '@s.whatsapp.net')])
  )).filter(v => v[1][0]?.exists).map(v => v[0] + '@c.us')

  if (!users.length) {
    await m.react('❌')
    return m.reply('❌ Nomor tidak valid, sudah ada di grup, atau privasi nomor tersebut tidak mengizinkan.')
  }

  const response = await conn.query({
    tag: 'iq',
    attrs: {
      type: 'set',
      xmlns: 'w:g2',
      to: m.chat,
    },
    content: users.map(jid => ({
      tag: 'add',
      attrs: {},
      content: [{ tag: 'participant', attrs: { jid } }]
    }))
  })

  const pp = await conn.profilePictureUrl(m.chat, 'image').catch(_ => null)
  let jpegThumbnail = Buffer.alloc(0)
  if (pp) {
    try {
        const res = await fetch(pp)
        jpegThumbnail = Buffer.from(await res.arrayBuffer())
    } catch (e) {
        console.error('Gagal fetch thumbnail:', e)
    }
  }

  const add = getBinaryNodeChild(response, 'add')
  const participant = getBinaryNodeChildren(add, 'participant')

  if (!participant?.length) {
    await m.react('❌')
    return m.reply('❌ Gagal mendapatkan respon dari server WhatsApp.')
  }

  let gagal408 = participant.filter(v => v.attrs.error == '408')
  if (gagal408.length) {
    for (const gagal of gagal408) {
      let nomor = gagal.attrs.jid.split('@')[0]
      await conn.reply(m.chat, `⚠️ Tidak dapat menambahkan @${nomor} karena dia baru saja keluar atau di-kick dari grup ini.`, m, {
        mentions: [gagal.attrs.jid]
      })
    }
  }

  let undang403 = participant.filter(v => v.attrs.error == '403')
  if (undang403.length) {
    for (const user of undang403) {
      const jid = user.attrs.jid
      const content = getBinaryNodeChild(user, 'add_request')
      const invite_code = content.attrs.code
      const invite_code_exp = content.attrs.expiration
      
      let txt = `📨 Mengundang @${jid.split('@')[0]} menggunakan link undangan karena privasi akunnya...`
      await m.reply(txt, null, { mentions: [jid] })
      
      await conn.sendGroupV4Invite(
        m.chat,
        jid,
        invite_code,
        invite_code_exp,
        await conn.getName(m.chat),
        'Undangan untuk bergabung ke Erine-MD Project',
        jpegThumbnail
      )
    }
  }

  await m.react('✅')
}

handler.help = ['add', '+'].map(v => v + ' <nomor>')
handler.tags = ['group']
handler.command = /^(add|\+)$/i
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler