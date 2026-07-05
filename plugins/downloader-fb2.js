/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Scraper    : Lynx Decode
 * 📢 Channel    : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * ⚠️ Note       : Keep credit to respect the creator!
 * ─────────────────────────
 * 📝 Plugin: Facebook Downloader (fbdown.blog)
 */

import axios from "axios"
import qs from "qs"

async function fbdown(url) {
    try {
        const { data } = await axios.post(
            "https://fbdown.blog/get.php",
            qs.stringify({ url }),
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
                    "Referer": "https://fbdown.blog/",
                    "Origin": "https://fbdown.blog",
                    "Accept": "application/json, text/plain, */*",
                    "Sec-Fetch-Site": "same-origin",
                    "Sec-Fetch-Mode": "cors",
                    "Sec-Fetch-Dest": "empty"
                }
            }
        )

        if (data.error) {
            throw new Error(data.message || "Video tidak ditemukan atau link salah.")
        }

        const hd = data.data.medias.find(v => v.type === "video" && v.quality === "HD")
        const sd = data.data.medias.find(v => v.type === "video" && v.quality === "SD")
        const audio = data.data.medias.find(v => v.type === "audio")

        return {
            success: true,
            title: data.data.title,
            description: data.data.description,
            author: data.data.author,
            author_id: data.data.author_id,
            thumbnail: data.data.thumbnail,
            duration: data.data.duration,
            filename: data.data.filename,
            hd: hd?.url || null,
            sd: sd?.url || null,
            audio: audio?.url || null,
            media: data.data.medias
        }
    } catch (e) {
        return { 
            success: false, 
            message: e.response?.data?.message || e.message || String(e)
        }
    }
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
    let url = text ? text : (m.quoted && m.quoted.text ? m.quoted.text : '')

    if (!url) {
        return m.reply(`┌˚₊ ๑│ ꜰ ᴀ ᴄ ᴇ ʙ ᴏ ᴏ ᴋ  ᴅ ʟ │๑˚₊ 📥\n┇ \n│ ❌ *Link Facebook-nya mana cuy?*\n│ \n│ 📌 *Cara pakai:*\n│ ❦ ${usedPrefix + command} https://www.facebook.com/share/v/xxx/\n┇ \n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`)
    }

    if (!url.match(/facebook\.com|fb\.watch|fb\.gg/i)) {
        return m.reply(`❌ *Link tidak valid! Pastikan itu link video Facebook cuy.*\n\n> © ERINE-AI`)
    }

    await m.react('⏳')

    try {
        const res = await fbdown(url.trim())

        if (!res.success) throw new Error(res.message)

        const videoUrl = res.hd || res.sd
        if (!videoUrl) throw new Error("Link unduhan video (HD/SD) tidak ditemukan dari server.")

        let caption = `┌˚₊ ๑│ ꜰ ᴀ ᴄ ᴇ ʙ ᴏ ᴏ ᴋ  ᴅ ʟ │๑˚₊ 📥\n┇ \n`
        caption += `│ 📌 *Judul:* ${res.title ? res.title : 'Tidak ada judul'}\n`
        caption += `│ 👤 *Author:* ${res.author ? res.author : 'Unknown'}\n`
        caption += `│ ⏱️ *Durasi:* ${res.duration ? res.duration : '-'}\n`
        caption += `│ 🌟 *Resolusi:* ${res.hd ? 'HD' : 'SD'}\n`
        caption += `┇ \n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`

        await conn.sendMessage(m.chat, { 
            video: { url: videoUrl }, 
            caption: caption 
        }, { quoted: m })

        await m.react('✅')
    } catch (error) {
        console.error('[FBDOWN ERROR]', error)
        await m.react('❌')
        m.reply(`┌˚₊ ๑│ ꜱ ʏ ꜱ ᴛ ᴇ ᴍ  ᴇ ʀ ʀ ᴏ ʀ │๑˚₊ ❌\n┇ Gagal mengunduh video.\n┇ \n┇ *Detail:*\n┇ ${error.message || String(error)}\n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`)
    }
}

handler.help = ['fb <url>', 'facebook <url>']
handler.tags = ['downloader']
handler.command = /^(fb2|fbdl2|facebook2|facebookdl2)$/i
handler.limit = true

export default handler