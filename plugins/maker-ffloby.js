// © INF PROJECT - Erine-MD
// Developed by INF PROJECT | Lynx

import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        return m.reply(`⚠️ *Format Salah!*\n\nContoh: *${usedPrefix + command} Lynx*`)
    }

    await m.react('⏳')

    try {
        let apikey = 'apikeymu' // ambil apikey sendiri di web bawah ini
        let apiUrl = `https://api.neoxr.eu/api/fflobby?text=${encodeURIComponent(text)}&apikey=${apikey}`
        
        let res = await fetch(apiUrl)
        let json = await res.json()

        if (!json.status || !json.data || !json.data.url) {
            throw new Error('Gagal mengambil data dari API Neoxr.')
        }
        
        let imgRes = await fetch(json.data.url)
        let thumbBuffer = Buffer.from(await imgRes.arrayBuffer())

        const emptyChar = String.fromCharCode(8206)
        const hiddenSpace = emptyChar.repeat(4000)
        
        let caption = `✅ *FF LOBBY MAKER*\n\n👤 *Name :* ${text}\n${hiddenSpace}`

        await conn.sendMessage(m.chat, {
            text: caption,
            contextInfo: {
                mentionedJid: [m.sender],
                externalAdReply: {
                    title: 'Free Fire Lobby - INF PROJECT',
                    body: '—  𝙶𝙴𝙽𝙴𝚁𝙰𝙻 𝙳𝙸𝚂𝚃𝚁𝙸𝙲𝚃  —',
                    thumbnail: thumbBuffer, 
                    sourceUrl: 'https://chat.whatsapp.com/CSMhBRB2DoICQwyy61txr0',
                    mediaType: 1, 
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: m })

        await m.react('✅')

    } catch (e) {
        console.error(e)
        await m.react('❌')
        m.reply(`❌ *Terjadi Kesalahan:* ${e.message}`)
    }
}

handler.help = ['fflobby1 <text>']
handler.tags = ['maker']
handler.command = /^(fflobby1)$/i
handler.limit = true 

export default handler