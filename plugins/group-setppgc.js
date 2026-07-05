/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx Decode
 * ─────────────────────────
 * 📝 Plugin: Set Group Profile Picture (Fix Jimp v1.x getWidth)
 */

import { S_WHATSAPP_NET } from '@whiskeysockets/baileys'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)

async function generateProfilePicture(buffer) {
    const jimpModule = require('jimp')
    const J = jimpModule.Jimp || jimpModule.default || jimpModule
    
    // Berhasil ngebaca gambar!
    const image = await J.read(buffer)

    // Di Jimp v1.x, getWidth() udah DIHAPUS. Gantinya pake bitmap.width
    const width = image.bitmap?.width || image.width || 1000
    const height = image.bitmap?.height || image.height || 1000

    // Pake try-catch buat nyesuain syntax resize (Support Jimp Lama & Baru)
    try {
        // Syntax Jimp v0.x (Lama)
        if (width > height) {
            image.resize(720, J.AUTO || -1)
        } else {
            image.resize(J.AUTO || -1, 720)
        }
    } catch (err) {
        // Syntax Jimp v1.x (Baru - Pake Object)
        if (width > height) {
            image.resize({ w: 720 })
        } else {
            image.resize({ h: 720 })
        }
    }

    let imgBuffer
    try {
        // Syntax Buffer Jimp v1.x (Sesuai dokumentasi lu kemaren)
        imgBuffer = await image.getBuffer('image/jpeg')
    } catch {
        try {
            // Syntax Buffer Jimp v0.x (Lama)
            imgBuffer = await image.getBufferAsync(J.MIME_JPEG || 'image/jpeg')
        } catch {
            imgBuffer = await image.getBufferAsync('image/png')
        }
    }

    // Dibungkus Buffer.from biar Baileys ga ZodError
    return { img: Buffer.from(imgBuffer) } 
}

let handler = async (m, { conn, usedPrefix, command }) => {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || q.mediaType || ''
    
    if (!/image/g.test(mime)) {
        return m.reply(`⚠️ *Format Salah!*\n\nKirim gambar dengan caption *${usedPrefix + command}* atau reply gambarnya.`)
    }

    await m.react('⏳')

    try {
        let media = await q.download()
        if (!media) throw new Error('Gagal ngedownload gambar dari chat.')

        let { img } = await generateProfilePicture(media)
        
        // IQ Stanza WA Terbaru (target & to: S_WHATSAPP_NET)
        await conn.query({
            tag: 'iq',
            attrs: {
                target: m.chat,
                to: S_WHATSAPP_NET,
                type: 'set',
                xmlns: 'w:profile:picture'
            },
            content: [
                {
                    tag: 'picture',
                    attrs: { type: 'image' },
                    content: img
                }
            ]
        })

        await m.reply('✅ *Update Profile Group Sukses!*\n\n> © INF PROJECT')
        await m.react('✅')
    } catch (e) {
        console.error(e)
        await m.react('❌')
        m.reply(`❌ *[ERROR]* Gagal mengganti profile group!\n\nDetail: ${e.message}`)
    }
}

handler.help = ['setppgc']
handler.tags = ['group']
handler.command = /^(setppgc|setppgrup|setppgroup|setpp)$/i

handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler