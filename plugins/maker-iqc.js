/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Author     : Lynx Decode
 * 📞 Contact    : +62 882-5804-1396
 * 📢 Channel    : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * ⚠️ Note       : Keep credit to respect the creator!
 * ─────────────────────────
 * 📝 Plugin: IQC Canvas (iPhone Quote)
 * 📦 Npm       : npm i iqc-canvas
 */

import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const { generateIQC } = require('iqc-canvas')

let handler = async (m, { conn, text, usedPrefix, command }) => {
    let mainText = text ? text : (m.quoted && m.quoted.text ? m.quoted.text : '')

    if (!mainText) return m.reply(`┌˚₊ ๑│ ɪ ǫ ᴄ  ᴍ ᴀ ᴋ ᴇ ʀ │๑˚₊ 💬\n┇ \n│ ❌ *Teksnya mana cuy?*\n│ \n│ 📌 *Cara pakai:*\n│ ${usedPrefix + command} halo dunia\n│ Atau balas pesan dengan perintah ${usedPrefix + command}\n┇ \n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`)

    await m.react('⏳')

    try {
        let time = new Date().toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'Asia/Jakarta'
        }).replace(':', '.')
        
        let opts = {
            showPlusBtn: true,
            reactionEmojis: ['🤙', '🔥', '😹', '⚡', '😎', '🙈',]
        }

        if (text && m.quoted && m.quoted.text) {
            opts.reply = {
                sender: conn.getName(m.quoted.sender) || m.quoted.pushName || 'User',
                text: m.quoted.text
            }
        }

        const result = await generateIQC(mainText, time, opts)

        if (!result.success) throw new Error('Gagal mengeksekusi iqc-canvas.')

        let caption = `┌˚₊ ๑│ ɪ ǫ ᴄ  ᴍ ᴀ ᴋ ᴇ ʀ │๑˚₊ 💬\n┇ \n│ ✅ *Sukses membuat quote iOS!*\n┇ \n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`

        await conn.sendMessage(m.chat, { image: result.image, caption }, { quoted: m })
        await m.react('✅')
    } catch (error) {
        console.error('[IQC ERROR]', error)
        await m.react('❌')
        m.reply(`┌˚₊ ๑│ ꜱ ʏ ꜱ ᴛ ᴇ ᴍ  ᴇ ʀ ʀ ᴏ ʀ │๑˚₊ ❌\n┇ Terjadi kesalahan sistem.\n┇ *Detail:* ${error.message || String(error)}\n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`)
    }
}

handler.help = ['iqc <teks>']
handler.tags = ['maker']
handler.command = /^iqc|iphoneqc$/i
handler.limit = true

export default handler