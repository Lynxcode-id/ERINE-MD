// © INF PROJECT - Erine-MD
// Developed by INF PROJECT

import axios from 'axios'
import pkg from '@whiskeysockets/baileys'
const { generateWAMessageFromContent, proto } = pkg

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        return m.reply(`Ketik pencariannya cuy!\nContoh: *${usedPrefix}ttimgs cosplay*`)
    }

    if (command === 'ttimgsend') {
        let [indexStr, ...queryArr] = text.split(' ')
        let query = queryArr.join(' ')
        let index = parseInt(indexStr)

        m.reply('Bentar cuy, lagi nyiapin semua fotonya. Bakal dikirim beruntun nih... ⏳')

        try {
            let apiUrl = `https://api.shinzu.web.id/api/search/tiktok-photo?query=${encodeURIComponent(query)}`
            let res = await axios.get(apiUrl)
            let json = res.data

            if (!json.status || !json.result || !json.result[index]) {
                return m.reply('Waduh, datanya udah ga ketemu cuy atau error.')
            }

            let data = json.result[index]
            let images = data.images || []
            let author = data.author || 'Tidak diketahui'
            let title = data.title || 'Tidak ada caption'
            let music = data.music || '-'

            if (images.length === 0) return m.reply('Gambar kosong cuy!')

            let caption = `🎵 *TIKTOK IMAGE SEARCH* 🎵\n\n`
            caption += `👤 *Author:* ${author}\n`
            caption += `📝 *Deskripsi:* ${title}\n`
            caption += `🎶 *Audio:* ${music}\n\n`
            caption += `📸 *Total Foto yang dikirim:* ${images.length} gambar.\n`
            caption += `© INF PROJECT | Erine-MD`

            await conn.sendMessage(m.chat, { image: { url: images[0] }, caption: caption }, { quoted: m })

            if (images.length > 1) {
                for (let i = 1; i < images.length; i++) {
                    await new Promise(resolve => setTimeout(resolve, 1500))
                    await conn.sendMessage(m.chat, { image: { url: images[i] } })
                }
                m.reply(`✅ *Beres cuy!* Semua ${images.length} foto udah dikirim.`)
            }
        } catch (e) {
            console.error('❌ TTImgs Send Error:', e)
            m.reply('Error cuy saat ngambil fotonya.')
        }
        return
    }

    m.reply('Tunggu bentar cuy, lagi nyari foto TikTok-nya... ⏳')

    try {
        let apiUrl = `https://api.shinzu.web.id/api/search/tiktok-photo?query=${encodeURIComponent(text)}`
        let res = await axios.get(apiUrl)
        let json = res.data

        if (!json.status || !json.result || json.result.length === 0) {
            return m.reply('Yah, fotonya ga ketemu cuy. Coba pake kata kunci lain yak!')
        }

        let sections = [{
            title: "Hasil Pencarian TikTok Images",
            highlight_label: "Pilihan Top",
            rows: []
        }]

        let maxResults = json.result.length > 10 ? 10 : json.result.length
        
        for (let i = 0; i < maxResults; i++) {
            let resData = json.result[i]
            
            sections[0].rows.push({
                header: `By: @${resData.author}`,
                title: `Pilihan ${i + 1} (${resData.images?.length || 0} Foto)`,
                description: (resData.title || 'Tanpa Caption').substring(0, 60) + '...',
                id: `${usedPrefix}ttimgsend ${i} ${text}`
            })
        }

        let buttonParamsJson = JSON.stringify({
            title: "Pilih Hasil Foto",
            sections: sections
        })

        let interactiveMessage = proto.Message.InteractiveMessage.fromObject({
            body: { text: `🔍 *TIKTOK IMAGE SEARCH*\n\nMenemukan *${json.result.length}* hasil untuk pencarian "${text}".\n\nSilakan klik tombol di bawah buat milih postingan mana yang mau di-*download* semua fotonya cuy!` },
            footer: { text: "© INF PROJECT | Erine-MD" },
            header: { title: "Hasil Pencarian", hasMediaAttachment: false },
            nativeFlowMessage: {
                buttons: [{
                    name: "single_select",
                    buttonParamsJson: buttonParamsJson
                }]
            }
        })

        let msg = generateWAMessageFromContent(m.chat, {
            viewOnceMessage: {
                message: {
                    messageContextInfo: {
                        deviceListMetadataVersion: 2,
                        deviceListMetadata: {}
                    },
                    interactiveMessage: interactiveMessage
                }
            }
        }, { userJid: conn.user.id, quoted: m })

        await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })

    } catch (e) {
        console.error('❌ TTImgs Error:', e)
        m.reply('Waduh, API-nya lagi error atau server down cuy. Coba lagi bentar yak!')
    }
}

handler.help = ['ttimgs <query>']
handler.tags = ['search']
handler.command = /^(ttimgs|ttimage|ttimgsend)$/i
handler.limit = true 

export default handler
