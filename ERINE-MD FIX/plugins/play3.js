// © INF PROJECT - Jemima-MD
// Developed by INF PROJECT

import yts from 'yt-search'
import pkg from '@wishkeysocket/baileys'
const { generateWAMessageFromContent, prepareWAMessageMedia, proto } = pkg

function formatNumber(num) {
  return num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `Contoh penggunaan:\n\n${usedPrefix + command} everything u are hindia`

  await m.react('⏳') 

  try {
    const search = await yts(text)
    const v = search.videos[0]
    if (!v) throw '❌ Gagal menemukan lagu di YouTube.'

    let caption = `╭─「 🎵 𝐘𝐎𝐔𝐓𝐔𝐁𝐄 𝐏𝐋𝐀𝐘 」
│ 
│ ꕥ 𝐓𝐢𝐭𝐥𝐞 : ${v.title}
│ ꕥ 𝐂𝐡𝐚𝐧𝐧𝐞𝐥 : ${v.author.name}
│ ꕥ 𝐃𝐮𝐫𝐚𝐭𝐢𝐨𝐧 : ${v.timestamp}
│ ꕥ 𝐕𝐢𝐞𝐰𝐬 : ${formatNumber(v.views)}
│ ꕥ 𝐔𝐩𝐥𝐨𝐚𝐝 : ${v.ago}
│
╰───────────────

Silakan pilih format yang ingin diunduh atau cek liriknya melalui tombol di bawah.`.trim()

    let media = await prepareWAMessageMedia({ image: { url: v.thumbnail } }, { upload: conn.waUploadToServer })

    const msg = generateWAMessageFromContent(m.chat, {
      viewOnceMessage: {
        message: {
            messageContextInfo: {
              deviceListMetadata: {},
              deviceListMetadataVersion: 2
            },
            interactiveMessage: proto.Message.InteractiveMessage.create({
              body: proto.Message.InteractiveMessage.Body.create({
                text: caption
              }),
              footer: proto.Message.InteractiveMessage.Footer.create({
                text: "© INF PROJECT | ERINE-MD"
              }),
              header: proto.Message.InteractiveMessage.Header.create({
                hasMediaAttachment: true,
                ...media
              }),
              nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                buttons: [
                  {
                    name: "single_select",
                    buttonParamsJson: JSON.stringify({
                      title: "Pilih Menu 🔽",
                      sections: [
                        {
                          title: "📥 Media Downloader",
                          highlight_label: "Download",
                          rows: [
                            {
                              header: "🎵 Audio",
                              title: "Get Audio (MP3)",
                              description: `Unduh audio dari lagu ini`,
                              id: `${usedPrefix}ytmp3 ${v.url}`
                            },
                            {
                              header: "🎥 Video",
                              title: "Get Video (MP4)",
                              description: `Unduh video klip ini`,
                              id: `${usedPrefix}ytmp4 ${v.url}`
                            }
                          ]
                        },
                        {
                          title: "ℹ️ Informasi Tambahan",
                          rows: [
                            {
                              header: "📝 Lirik",
                              title: "Cek Lirik",
                              description: `Tampilkan lirik lagu ini`,
                              id: `${usedPrefix}lirik ${v.title}`
                            }
                          ]
                        }
                      ]
                    })
                  },
                  {
                    name: "cta_url",
                    buttonParamsJson: JSON.stringify({
                      display_text: "🌐 Buka di YouTube",
                      url: v.url,
                      merchant_url: v.url
                    })
                  }
                ]
              })
            })
        }
      }
    }, { quoted: m })

    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
    await m.react('✅')

  } catch(e) {
    console.error(e)
    await m.react('❌')
    m.reply('❌ Maaf cuy, gagal mengambil informasi lagu. YouTube mungkin lagi limit atau link error.')
  }
}

handler.help = ['play']
handler.tags = ['downloader']
handler.command = /^(play)$/i
handler.limit = true

export default handler
