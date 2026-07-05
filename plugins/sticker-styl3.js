import axios from 'axios'
import { createSticker, StickerTypes } from 'wa-sticker-formatter'

if (!global.stickerlySession) global.stickerlySession = {}

class StickerLy {
  async search(keyword) {
    try {
      const { data } = await axios.post(
        'https://api.sticker.ly/v4/stickerPack/smartSearch',
        {
          keyword,
          enabledKeywordSearch: true,
          filter: {
            extendSearchResult: false,
            sortBy: 'RECOMMENDED',
            languages: ['ALL'],
            minStickerCount: 5,
            searchBy: 'ALL',
            stickerType: 'ALL'
          }
        },
        {
          headers: {
            'User-Agent': 'androidapp.stickerly/3.31.0 (M2006C3LG; U; Android 29; in-ID; id;)',
            'Content-Type': 'application/json'
          },
          timeout: 20000
        }
      )

      let packs =
        data?.result?.stickerPacks ||
        data?.stickerPacks ||
        data?.data ||
        []

      return packs.map(v => ({
        id: v.packId,
        name: v.name,
        author: v.authorName || 'Unknown',
        count: v.resourceFiles?.length || 0,
        animated: v.isAnimated,
        prefix: v.resourceUrlPrefix,
        files: v.resourceFiles || [],
        url: v.shareUrl || `https://sticker.ly/s/${v.packId}`
      }))
    } catch (e) {
      console.log('Stickerly Search Error:', e.message)
      return []
    }
  }
}

const scraper = new StickerLy()

async function sendStickerPack(conn, jid, stickers, title, quoted) {
  const size = 30
  const chunks = []

  for (let i = 0; i < stickers.length; i += size) {
    chunks.push(stickers.slice(i, i + size))
  }

  for (const chunk of chunks) {
    const stickerList = []

    for (const s of chunk) {
      try {
        const img = await axios.get(s.image, {
          responseType: 'arraybuffer',
          timeout: 20000
        })

        const buffer = Buffer.from(img.data)

        const sticker = await createSticker(buffer, {
          pack: global.packname || 'ʀʏᴏ ʏᴀᴍᴀᴅᴀ - ᴍᴅ',
          author: global.author || 'ʙʏ ʜɪʟᴍᴀɴ',
          type: s.animated
            ? StickerTypes.FULL
            : StickerTypes.DEFAULT
        })

        stickerList.push({
          data: sticker
        })
      } catch (e) {
        console.log('Sticker Convert Error:', e.message)
      }
    }

    if (!stickerList.length) continue

    await conn.sendMessage(
      jid,
      {
        cover: { url: chunk[0].image },
        stickers: stickerList,
        name: `✨ ${title}`,
        publisher: global.packname || 'ᴇʀɪɴᴇ-ᴀɪ',
        description: global.author || 'ʙʏ ʟʏɴx ᴅᴇᴄᴏᴅᴇ'
      },
      { quoted }
    )

    await new Promise(resolve => setTimeout(resolve, 1000))
  }
}

let handler = async (m, { args, usedPrefix, command }) => {
  if (!args.length) {
    return m.reply(
      `Contoh:\n${usedPrefix + command} patrick`
    )
  }

  const query = args.join(' ')
  const packs = await scraper.search(query)

  if (!packs.length) {
    return m.reply('❌ Sticker pack tidak ditemukan.')
  }

  global.stickerlySession[m.sender] = packs.slice(0, 10)

  let teks = `✨ *HASIL STICKER.LY*\n\n`

  packs.slice(0, 10).forEach((v, i) => {
    teks += `${i + 1}. ${v.name}\n`
    teks += `• Author: ${v.author}\n`
    teks += `• Sticker: ${v.count}\n`
    teks += `• URL: ${v.url}\n\n`
  })

  teks += `Ketik nomor (1-10)`

  m.reply(teks.trim())
}

handler.before = async function (m) {
  if (!/^(10|[1-9])$/.test(m.text)) return

  const session = global.stickerlySession?.[m.sender]
  if (!session) return

  const pick = session[Number(m.text) - 1]
  if (!pick) return m.reply('Nomor tidak valid.')

  delete global.stickerlySession[m.sender]

  m.reply(
  `❀ Mengirim *${pick.name}*\n` +
  `❀ Total Sticker: ${pick.files.length}\n` +
  `❀ Dikirim: ${Math.min(pick.files.length, 30)}\n` +
  `❀ ${pick.url}`
)

  const stickers = pick.files
  .slice(0, 30)
  .map(file => ({
    image: pick.prefix + file,
    animated: pick.animated
  }))

  if (!stickers.length) {
    return m.reply('❌ Sticker kosong.')
  }

  await sendStickerPack(
    this,
    m.chat,
    stickers,
    pick.name,
    m
  )
}

handler.help = ['stickerly3 <query>']
handler.tags = ['sticker']
handler.command = /^stickerly3$/i
handler.limit = true

export default handler