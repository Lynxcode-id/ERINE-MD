/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Author     : Lynx Decode
 * 📞 Contact    : +62 882-5804-1396
 * 📢 Channel    : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * ⚠️ Note       : Keep credit to respect the creator!
 * ─────────────────────────
 * 📝 Plugin: Brat Ruromiya Sticker Maker
 */

import fetch from 'node-fetch'
import { Sticker, StickerTypes } from 'wa-sticker-formatter'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    let txt = text ? text : (m.quoted && m.quoted.text ? m.quoted.text : '')

    if (!txt) {
        return m.reply(`┌˚₊ ๑│ ʙ ʀ ᴀ ᴛ  ʀ ᴜ ʀ ᴏ ᴍ ɪ ʏ ᴀ │๑˚₊ ⚠️\n┇ \n│ ❌ *Teks kosong!*\n│ \n│ 📌 *Cara pakai:*\n│ ${usedPrefix + command} <teks>\n│ _Atau reply pesan teks yang ingin dijadikan stiker._\n┇ \n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`)
    }

    await m.react('⏳')

    try {
        const apiUrl = `https://restapi.jagoanproject.web.id/api/maker/bratruromiya?text=${encodeURIComponent(txt)}`
        
        const res = await fetch(apiUrl, {
            headers: {
                'Authorization': 'Bearer Lynxdecode'
            }
        })

        const contentType = res.headers.get('content-type') || ''
        let buffer

        if (contentType.includes('application/json')) {
            const json = await res.json()
            if (!json.status) {
                throw new Error(json.message || JSON.stringify(json))
            }
            
            let resultUrl = json?.result?.url || json?.data?.result?.url
            if (!resultUrl) {
                throw new Error(`Respon JSON API tidak sesuai:\n${JSON.stringify(json, null, 2)}`)
            }
            
            const mediaRes = await fetch(resultUrl)
            buffer = Buffer.from(await mediaRes.arrayBuffer())
        } else if (contentType.includes('image') || contentType.includes('application/octet-stream')) {
            buffer = Buffer.from(await res.arrayBuffer())
        } else {
            const errText = await res.text()
            throw new Error(`Tipe konten tidak valid (${contentType}):\n${errText.substring(0, 300)}`)
        }

        const sticker = new Sticker(buffer, {
            pack: global.packname || 'ERINE-AI',
            author: global.author || 'Lynx Decode',
            type: StickerTypes.FULL,
            quality: 100
        })

        const stickerBuffer = await sticker.toBuffer()

        await conn.sendMessage(m.chat, { 
            sticker: stickerBuffer 
        }, { quoted: m })

        await m.react('✅')

    } catch (error) {
        console.error('[BRATRUROMIYA ERROR]', error)
        await m.react('❌')
        
        let errMsg = error.message || String(error)
        if (errMsg.length > 500) errMsg = errMsg.substring(0, 500) + '... (cek console)'

        m.reply(`┌˚₊ ๑│ s ʏ s ᴛ ᴇ ᴍ  ᴇ ʀ ʀ ᴏ ʀ │๑˚₊ ❌\n┇ Terjadi kesalahan sistem.\n┇ *Detail:* ${errMsg}\n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`)
    }
}

handler.help = ['bratruromiya2 <teks>']
handler.tags = ['maker']
handler.command = /^(bratruromiya2)$/i
handler.limit = true

export default handler