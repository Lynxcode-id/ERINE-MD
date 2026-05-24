// © INF PROJECT - Erine-MD
// Developed by INF PROJECT

import pkg from '@whiskeysockets/baileys'
const { downloadContentFromMessage } = pkg

let handler = async (m, { conn }) => {
    if (!m.quoted) throw '⚠️ Reply pesan *View Once* (Sekali Lihat) yang mau dibuka, Bang!'
    
    const isViewOnce = m.quoted.mtype === 'viewOnceMessageV2' || m.quoted.mtype === 'viewOnceMessageV2Extension'
    if (!isViewOnce) throw '❌ Ini bukan pesan *View Once*.'

    await m.react('⏳')

    try {
        let msg = m.quoted.message
        let type = Object.keys(msg)[0]
        let mediaData = msg[type]
        let media = await downloadContentFromMessage(
            mediaData, 
            type === 'imageMessage' ? 'image' : 'video'
        )

        let buffer = Buffer.from([])
        for await (const chunk of media) {
            buffer = Buffer.concat([buffer, chunk])
        }

        const caption = mediaData.caption || ''
        
        if (/video/.test(type)) {
            await conn.sendFile(m.chat, buffer, 'media.mp4', caption, m)
        } else if (/image/.test(type)) {
            await conn.sendFile(m.chat, buffer, 'media.jpg', caption, m)
        }

        await m.react('✅')

    } catch (e) {
        console.error(e)
        await m.react('❌')
        m.reply('❌ Gagal mendownload media. Mungkin versinya nggak cocok atau file sudah kadaluarsa.')
    }
}

handler.help = ['readviewonce', 'rvo']
handler.tags = ['tools']
handler.command = /^(readviewonce|rvo)$/i

handler.register = true
handler.limit = true

export default handler
