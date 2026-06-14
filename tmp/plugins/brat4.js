/**
* Fitur: brat canvas
* Author: Kanoo
* Channel: https://whatsapp.com/channel/0029VbCM1YCCcW4vfjvGJN02
* *Note*: install brat-canvas dulu *npm i brat-canvas*
*/


import { bratGen } from 'brat-canvas'
import { Sticker } from 'wa-sticker-formatter'

let handler = async (m, { conn, text }) => {
    if (m.quoted && m.quoted.text) {
        text = m.quoted.text || 'hai'
    } else if (text) {
        text = text
    } else if (!text && !m.quoted) return m.reply('reply / masukan teks')

    try {
        await m.react('🕒')

        const { buffer } = await bratGen(text)
        const imageBuffer = Buffer.from(buffer)

        let stiker = await new Sticker(imageBuffer, {
            type: 'crop',
            pack: global.stickpack || global.namebot || 'Sticker Pack',
            author: global.stickauth || global.author || 'Bot',
            quality: 10
        }).toBuffer()

        if (stiker) {
            await conn.sendFile(m.chat, stiker, '', '', m)
            await m.react('✅')
        } else {
            await m.react('❌')
        }
    } catch (e) {
        await m.react('❌')
        throw e
    }
}

handler.help = ['brat4 <text>']
handler.tags = ['sticker']
handler.command = /^(brat4)$/i
handler.limit = true
handler.register = false
handler.group = false

export default handler