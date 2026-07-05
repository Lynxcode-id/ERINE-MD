/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx Decode
 * ─────────────────────────
 * 📝 Plugin : Quote Maker / QC Sticker (Erine-MD)
 * 🔄 Update : Fix Zoom / Crop Terpotong Menggunakan StickerTypes.FULL
 */

import axios from 'axios'
import { Sticker, StickerTypes } from 'wa-sticker-formatter'

let handler = async (m, { conn, args, usedPrefix, command }) => {
    let text = ''
    let color = 'white'

    const colorMap = {
        putih: 'white',
        hitam: 'black',
        merah: 'red',
        biru: 'blue',
        hijau: 'green',
        kuning: 'yellow',
        ungu: 'purple',
        pink: 'pink',
        orange: 'orange',
        coklat: 'brown',
        abu: 'gray',
        cyan: 'cyan'
    }

    const listWarna = Object.keys(colorMap).map(v => `• ${v}`).join('\n')

    if (args.length) {
        const raw = args.join(' ')
        if (raw.includes('|')) {
            const [warna, isi] = raw.split('|')
            text = isi.trim()
            color = colorMap[warna.trim().toLowerCase()] || 'white'
        } else {
            text = raw.trim()
        }
    } else if (m.quoted?.text) {
        text = m.quoted.text
    } else {
        return m.reply(`Contoh penggunaan:
${usedPrefix + command} halo lynx
${usedPrefix + command} merah| halo lynx
Reply teks lalu ${usedPrefix + command}

List warna:
${listWarna}`)
    }

    if (!text) return m.reply('Teks kosong!')
    if (text.length > 120) return m.reply('Maksimal 120 karakter!')

    await m.react('⏳')

    const nama = m.pushName || 'User'
    const avatar = await conn.profilePictureUrl(m.sender, 'image').catch(() => 'https://files.catbox.moe/nwvkbt.png')

    const url = `https://api.deline.web.id/maker/qc?text=${encodeURIComponent(text)}&color=${color}&avatar=${encodeURIComponent(avatar)}&nama=${encodeURIComponent(nama)}`

    try {
        const { data } = await axios.get(url, { responseType: 'arraybuffer' })
        
        // Menggunakan StickerTypes.FULL agar gambar QC utuh secara keseluruhan (tidak terpotong/ter-zoom)
        const stiker = new Sticker(data, {
            pack: global.stickpack || 'Erine-MD',
            author: global.stickauth || 'Lynx Decode',
            type: StickerTypes.FULL,
            categories: ['🤩', '🎉'],
            quality: 100
        })

        const bufferSticker = await stiker.toBuffer()
        await conn.sendMessage(m.chat, { sticker: bufferSticker }, { quoted: m })
        
        await m.react('✅')
    } catch (e) {
        console.error(e)
        await m.react('❌')
        return m.reply('❌ Gagal membuat QC sticker.')
    }
}

handler.help = ['qc <warna>|<teks>', 'qc <teks>']
handler.tags = ['sticker']
handler.command = /^qc$/i
handler.limit = true
handler.register = true

export default handler