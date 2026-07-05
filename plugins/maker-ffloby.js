// © INF PROJECT - Erine-MD
// Developed by INF PROJECT | Lynx

import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        return m.reply(`⚠️ *Format Salah!*\n\nContoh: *${usedPrefix + command} Lynx*`)
    }

    await m.react('⏳')

    try {
        // 1. Request ke API Neoxr
        let apikey = '2lYSFh' // Apikey Neoxr lu
        let apiUrl = `https://api.neoxr.eu/api/fflobby?text=${encodeURIComponent(text)}&apikey=${apikey}`
        
        let res = await fetch(apiUrl)
        let json = await res.json()

        if (!json.status || !json.data || !json.data.url) {
            throw new Error('Gagal mengambil data dari API Neoxr.')
        }

        // 2. Ambil gambar dari URL di dalam JSON jadi Buffer
        let imgRes = await fetch(json.data.url)
        let thumbBuffer = Buffer.from(await imgRes.arrayBuffer())

        // 3. Setup Spasi Gaib biar chat rapi & "Baca selengkapnya"
        const emptyChar = String.fromCharCode(8206)
        const hiddenSpace = emptyChar.repeat(4000)
        
        let caption = `✅ *FF LOBBY MAKER*\n\n👤 *Name :* ${text}\n${hiddenSpace}`

        // 4. Kirim pakai AdReply Banner Gede
        await conn.sendMessage(m.chat, {
            text: caption,
            contextInfo: {
                mentionedJid: [m.sender],
                externalAdReply: {
                    title: 'Free Fire Lobby - INF PROJECT',
                    body: '—  𝙶𝙴𝙽𝙴𝚁𝙰𝙻 𝙳𝙸𝚂𝚃𝚁𝙸𝙲𝚃  —',
                    thumbnail: thumbBuffer, // Buffer gambar FF Lobby lu
                    sourceUrl: 'https://chat.whatsapp.com/CSMhBRB2DoICQwyy61txr0', // Bebas arahin ke GC lu
                    mediaType: 1, 
                    renderLargerThumbnail: true // Wajib true biar jadi banner gede
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