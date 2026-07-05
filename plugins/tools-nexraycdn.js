/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Author     : Lynx Decode
 * 📞 Contact    : +62 882-5804-1396
 * 📢 Channel    : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * ⚠️ Note       : Keep credit to respect the creator!
 * ─────────────────────────
 * 📝 Plugin: Nexray Uploader (Tourl)
 */

import fetch from 'node-fetch'
import { FormData, Blob } from 'formdata-node'

let handler = async (m, { conn, usedPrefix, command }) => {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''

    if (!mime) {
        return m.reply(`┌˚₊ ๑│ ɴ ᴇ x ʀ ᴀ ʏ  ᴜ ᴘ ʟ ᴏ ᴀ ᴅ │๑˚₊ ⚠️\n┇ \n│ ❌ *Format salah!*\n│ \n│ 📌 *Cara pakai:*\n│ Silakan reply/balas media (foto/video/audio) dengan command ${usedPrefix + command}\n┇ \n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`)
    }

    await m.react('⏳')

    try {
        let media = await q.download()
        let formData = new FormData()
        let blob = new Blob([media], { type: mime })
        
        let ext = mime.split('/')[1] || 'bin'
        formData.append('file', blob, `erine_upload.${ext}`)
        formData.append('ttl', '3600') 

        let res = await fetch('https://api.nexray.eu.cc/upload', {
            method: 'POST',
            body: formData
        })
        
        let json = await res.json()
        if (!json.status || !json.result || !json.result.success) {
            throw new Error('Gagal mengunggah media ke server Nexray.')
        }

        let resultUrl = json.result.url
        let size = (json.result.size / 1024).toFixed(2) + ' KB'
        let exp = new Date(json.result.expiresAt).toLocaleString('id-ID')

        let caption = `┌˚₊ ๑│ ɴ ᴇ x ʀ ᴀ ʏ  ᴜ ᴘ ʟ ᴏ ᴀ ᴅ │๑˚₊ 🚀\n` +
                      `┇ \n` +
                      `│ ✅ *Sukses mengunggah media!*\n` +
                      `│ 🔗 *URL:* ${resultUrl}\n` +
                      `│ 📁 *Size:* ${size}\n` +
                      `│ ⏳ *Expired:* ${exp}\n` +
                      `┇ \n` +
                      `└˚₊ ๑ ────────────── ๑˚₊\n` +
                      `> © ERINE-AI`

        await m.reply(caption)
        await m.react('✅')

    } catch (error) {
        console.error('[NEXRAY ERROR]', error)
        await m.react('❌')
        
        let errMsg = error.message || String(error)
        if (errMsg.length > 500) errMsg = errMsg.substring(0, 500) + '... (cek console)'

        m.reply(`┌˚₊ ๑│ s ʏ s ᴛ ᴇ ᴍ  ᴇ ʀ ʀ ᴏ ʀ │๑˚₊ ❌\n┇ Terjadi kesalahan sistem.\n┇ *Detail:* ${errMsg}\n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`)
    }
}

handler.help = ['tourl9', 'nexraycdn']
handler.tags = ['tools']
handler.command = /^(tourl9|nexraycdn)$/i
handler.limit = true

export default handler