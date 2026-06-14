import fetch from 'node-fetch'

let sessions = {}

const gemini = {
  getnewcookie: async () => {
    const r = await fetch(
      'https://gemini.google.com/_/BardChatUi/data/batchexecute?rpcids=mAGuaC&source-path=%2F&bl=boq_assistant-bard-web-server_20250814.06_p1&hl=en-US&_reqid=173780&rt=c',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
        body: 'f.req=%5B%5B%5B%22mAGuaC%22%2C%22%5B0%5D%22%2Cnull%2C%22generic%22%5D%5D%5D&'
      }
    )
    const ck = r.headers.get('set-cookie')
    if (!ck) throw Error('cookie kosong')
    return ck.split(';')[0]
  },

  ask: async (prompt, prev = null) => {
    let resume = null, cookie = null
    if (prev) {
      let j = JSON.parse(Buffer.from(prev, 'base64').toString())
      resume = j.newresumearray
      cookie = j.cookie
    }

    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      'X-Goog-Ext-525001261-Jspb': '[1,null,null,null,"9ec249fc9ad08861",null,null,null,[4]]',
      cookie: cookie || await gemini.getnewcookie()
    }

    const body = new URLSearchParams({
      'f.req': JSON.stringify([null, JSON.stringify([[prompt], ['en-US'], resume])])
    })

    const r = await fetch(
      'https://gemini.google.com/_/BardChatUi/data/assistant.lamda.BardFrontendService/StreamGenerate?hl=en-US&rt=c',
      { method: 'POST', headers, body }
    )

    if (!r.ok) throw Error(`${r.status} ${r.statusText}`)

    const t = await r.text()

    const arr = Array.from(t.matchAll(/^\d+\n(.+?)\n/gm))
    if (!arr.length) throw Error('respon gemini kosong')

    const pick = arr.reverse().find(v => {
      try {
        const j = JSON.parse(v[1])
        return j?.[0]?.[2]
      } catch {
        return false
      }
    })

    if (!pick) throw Error('format respon gemini berubah')

    const p = JSON.parse(JSON.parse(pick[1])[0][2])

    return {
      text: (p?.[4]?.[0]?.[1]?.[0] || '...').replace(/\*\*(.+?)\*\*/g, '*$1*'),
      id: Buffer.from(JSON.stringify({
        newresumearray: [...(p?.[1] || []), p?.[4]?.[0]?.[0]],
        cookie: headers.cookie
      })).toString('base64')
    }
  }
}

let handler = async (m, { text, usedPrefix, command, conn }) => {
  if (!text) {
    return m.reply(
      `🥁 *Nijika Ijichi AI*\n\nContoh:\n${usedPrefix + command} halo nijika`
    )
  }

  let uid = m.sender
  let prev = sessions[uid] && sessions[uid].expire > Date.now()
    ? sessions[uid].id
    : null

  let system = `
Kamu adalah Nijika Ijichi dari anime "Bocchi the Rock!".
Kepribadian:
- Ceria, hangat, dan suportif
- Selalu menyemangati orang lain
- Dewasa, bertanggung jawab, dan perhatian
- Kadang keibuan tapi tetap santai
- Drummer dan leader Kessoku Band

Tetap jawab sebagai Nijika Ijichi.
Jangan keluar karakter.
User adalah cowok yang kamu ajak ngobrol dengan ramah.
`

  let prompt = `${system}\nUser: ${text}\nNijika Ijichi:`

  try {
    let res = await gemini.ask(prompt, prev)

    sessions[uid] = {
      id: res.id,
      expire: Date.now() + 24 * 60 * 60 * 1000
    }

    await conn.sendMessage(m.chat, {
      image: { url: 'https://files.catbox.moe/g6twz1.jpg' },
      caption: res.text,
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

  } catch (e) {
    console.error('[Nijika Gemini Error]', e)
    m.reply('Nijika lagi nyetel drum… coba lagi sebentar ya')
  }
}

handler.help = ['nijika <teks>']
handler.tags = ['ai']
handler.command = /^(nijika|nijikaai)$/i
handler.limit = true

export default handler
