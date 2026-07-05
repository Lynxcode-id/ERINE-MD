/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Author     : Lynx Decode
 * 📞 Contact    : +62 882-5804-1396
 * 📢 Channel    : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * ⚠️ Note       : Keep credit to respect the creator!
 * ─────────────────────────
 * 📝 Plugin: Image to Text (OCR SynoxCloud)
 * 📦 Npm       : npm i form-data axios
 */

import axios from 'axios'
import FormData from 'form-data'

let handler = async (m, { conn, usedPrefix, command }) => {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''

    if (!/image\/(jpe?g|png|webp)/.test(mime)) {
        return m.reply(`┌˚₊ ๑│ ᴏ ᴄ ʀ  ( ᴛ ᴇ ᴋ ꜱ  ɢ ᴀ ᴍ ʙ ᴀ ʀ ) │๑˚₊ 📝\n┇ \n│ ❌ *Reply atau kirim gambar cuy!*\n│ \n│ 📌 *Cara pakai:*\n│ Kirim/Reply gambar dengan caption:\n│ ${usedPrefix + command}\n┇ \n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`)
    }

    await m.react('⏳')

    try {
        let buffer = await q.download()
        const form = new FormData()
        form.append('file', buffer, { filename: 'image.jpg' })

        const { data } = await axios.post('https://api.synoxcloud.xyz/tools/ocr', form, {
            headers: {
                ...form.getHeaders()
            }
        })

        if (!data.status || !data.result?.text) {
            throw new Error('Gagal mengekstrak teks dari server API.')
        }

        let resText = data.result.text.trim()
        
        if (!resText) {
            throw new Error('Tidak ada teks yang terdeteksi di gambar ini cuy.')
        }

        let caption = `┌˚₊ ๑│ ᴏ ᴄ ʀ  ʀ ᴇ ꜱ ᴜ ʟ ᴛ │๑˚₊ 📝\n` +
                      `┇ \n` +
                      `${resText}\n` +
                      `┇ \n` +
                      `└˚₊ ๑ ────────────── ๑˚₊\n` +
                      `> © ERINE-AI`

        await m.reply(caption)
        await m.react('✅')

    } catch (error) {
        console.error('[OCR ERROR]', error)
        await m.react('❌')
        
        let errMsg = error.response?.data?.message || error.message || String(error)
        m.reply(`┌˚₊ ๑│ ꜱ ʏ ꜱ ᴛ ᴇ ᴍ  ᴇ ʀ ʀ ᴏ ʀ │๑˚₊ ❌\n┇ Terjadi kesalahan sistem.\n┇ *Detail:* ${errMsg}\n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`)
    }
}

handler.help = ['ocr2']
handler.tags = ['tools']
handler.command = /^ocr2$/i
handler.limit = true

export default handler