/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Author     : Lynx Decode
 * 📞 Contact    : +62 882-5804-1396
 * 📢 Channel    : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * ⚠️ Note       : Keep credit to respect the creator!
 * ─────────────────────────
 * 📝 Plugin: Anime to Real (Erine-AI)
 */

import fetch from 'node-fetch'
import uploadImage from '../lib/uploadImage.js'

let handler = async (m, { conn, usedPrefix, command }) => {
    const headerUI = "┌˚₊ ๑│ ᴇ ʀ ɪ ɴ ᴇ - ᴀ ɪ  ᴀ ɴ ɪ ᴍ ᴇ 2 ʀ ᴇ ᴀ ʟ │๑˚₊"
    const hrUI = "└˚₊ ๑ ────────────── ๑˚₊"
    const footerUI = "> © ERINE-AI | ANIME TO REAL"

    let target = m.quoted ? m.quoted : m
    let mime = (target.msg || target).mimetype || ''
    
    if (!/image\/(jpe?g|png)/.test(mime)) return m.reply(`${headerUI} ❌\n┇ \n│ Mohon balas/kirim foto anime yang ingin diubah kak!\n│ *Ketik:* ${usedPrefix + command}\n┇ \n${hrUI}\n${footerUI}`)

    try {
        await m.react('⏳')
        let media = await target.download()
        
        // Upload menggunakan fungsi uploadImage lokal Erine
        let imageUrl = await uploadImage(media)
        if (!imageUrl) throw new Error('Gagal mengunggah foto ke server.')

        // Hit API Anime2Real
        let res = await fetch(`https://api.ikyyxd.my.id/edit/anime2real?url=${encodeURIComponent(imageUrl)}`)
        let json = await res.json()

        if (!json.status || !json.result || !json.result.result_url) throw new Error('Gagal memproses gambar. Pastikan fotonya anime yang jelas.')

        let captionText = `${headerUI} ✨\n┇ \n│ Yeyy! Berhasil mengubah anime menjadi nyata!\n┇ \n${hrUI}\n${footerUI}`

        await conn.sendMessage(m.chat, { image: { url: json.result.result_url }, caption: captionText }, { quoted: m })
        await m.react('✅')
    } catch (e) {
        await m.react('❌')
        m.reply(`${headerUI} ❌\n┇ \n│ Maaf kak, terjadi kesalahan saat memproses gambar.\n│ ${e.message}\n┇ \n${hrUI}\n${footerUI}`)
    }
}

handler.help = ['animetoreal']
handler.tags = ['tools']
handler.command = /^(animetoreal|toreal2)$/i

export default handler