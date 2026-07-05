/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Author     : Lynx Decode
 * 📞 Contact    : +62 882-5804-1396
 * 📢 Channel    : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * ⚠️ Note       : Keep credit to respect the creator!
 * ─────────────────────────
 * 📝 Plugin: Brat Video HD (To Animated Sticker)
 */

import fetch from 'node-fetch'
import { Sticker, StickerTypes } from 'wa-sticker-formatter'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    let txt = text ? text : (m.quoted && m.quoted.text ? m.quoted.text : '')

    if (!txt) {
        return m.reply(`┌˚₊ ๑│ ʙ ʀ ᴀ ᴛ  ᴠ ɪ ᴅ ᴇ ᴏ │๑˚₊ 🎥\n┇ \n│ ❌ *Teksnya mana cuy?*\n│ \n│ 📌 *Cara pakai:*\n│ ${usedPrefix + command} halo dunia\n│ Atau balas pesan dengan perintah ${usedPrefix + command}\n┇ \n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`)
    }

    await m.react('⏳')

    try {
        const apiUrl = `https://api.nexray.eu.cc/maker/bratvidhd?text=${encodeURIComponent(txt)}`
        
        let res = await fetch(apiUrl)
        if (!res.ok) throw new Error('API sedang bermasalah / gagal merespon.')
        let buffer = await res.buffer()

        // FIX: Ganti ke DEFAULT biar rasio gak rusak & quality mentokin ke 100
        let sticker = new Sticker(buffer, {
            pack: 'ERINE-AI', 
            author: 'Lynx Decode', 
            type: StickerTypes.DEFAULT, 
            quality: 100, 
            background: 'transparent'
        })
        
        let stikerBuffer = await sticker.toBuffer()

        await conn.sendMessage(m.chat, { sticker: stikerBuffer }, { quoted: m })
        await m.react('✅')
        
    } catch (error) {
        console.error('[BRATVID ERROR]', error)
        await m.react('❌')
        m.reply(`┌˚₊ ๑│ ꜱ ʏ ꜱ ᴛ ᴇ ᴍ  ᴇ ʀ ʀ ᴏ ʀ │๑˚₊ ❌\n┇ Terjadi kesalahan sistem.\n┇ *Detail:* ${error.message || String(error)}\n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`)
    }
}

handler.help = ['bratvidhd <teks>']
handler.tags = ['maker']
handler.command = /^bratvidhd$/i
handler.limit = true

export default handler