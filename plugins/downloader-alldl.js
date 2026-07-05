/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Integrator : Lynx Decode
 * 📞 Contact    : +62 882-5804-1396
 * 📢 Channel    : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * ⚠️ Note       : Keep credit to respect the creator!
 * ─────────────────────────
 * 📝 Plugin     : Universal Downloader (Cmnty API)
 * 🎨 UI         : ERINE-AI Custom Style
 */

import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    const header = (title, emoji) => `┌˚₊ ๑│ ${title} │๑˚₊ ${emoji}\n┇ \n`
    const footer = () => `\n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`

    let url = text.match(/https?:\/\/[^\s]+/i)?.[0]

    if (!url) {
        return m.reply(header('UNIVERSAL DOWNLOADER', '📥') + `│ ❌ *Mana linknya cuy?*\n│ *Support:* TikTok, CapCut, SnackVideo, Twitter/X, GDrive, GitHub, Lahelu\n│ *Contoh:* ${usedPrefix + command} https://vt.tiktok.com/xxxx/` + footer())
    }

    await m.react('⏳')

    try {
        let platform = ''
        if (/tiktok\.com/i.test(url)) platform = 'tiktok'
        else if (/capcut\.com/i.test(url)) platform = 'capcut'
        else if (/snackvideo\.com/i.test(url)) platform = 'snackvideo'
        else if (/twitter\.com|x\.com/i.test(url)) platform = 'twitter'
        else if (/drive\.google\.com/i.test(url)) platform = 'gdrive'
        else if (/github\.com/i.test(url)) platform = 'github'
        else if (/lahelu\.com/i.test(url)) platform = 'lahelu'
        else throw new Error('Link tidak didukung atau tidak dikenali.')

        let apiUrl = `https://api.cmnty.web.id/downloader/${platform}?url=${encodeURIComponent(url)}`
        let res = await fetch(apiUrl, { headers: { 'Accept': 'application/json' } })
        let json = await res.json()

        if (!json.status) throw new Error('Gagal mengambil data dari server.')

        let data = json.data || json.result || json
        let mediaUrls = []
        let mediaType = 'video'
        let fileName = ''
        let caption = header(`${platform.toUpperCase()} DOWNLOADER`, '⬇️')

        if (platform === 'tiktok') {
            if (data.type === 'image' || Array.isArray(data.media)) {
                let isImageSlide = data.media.every(v => v.type === 'image' || v.url.includes('.jpeg') || v.url.includes('.jpg'))
                
                if (isImageSlide || data.type === 'image') {
                    mediaType = 'image'
                    mediaUrls = data.media.map(v => v.url)
                } else {
                    let hdVideo = data.media.find(v => v.quality === 'HD')
                    let sdVideo = data.media.find(v => v.quality === 'SD')
                    mediaUrls = [(hdVideo || sdVideo || data.media[0]).url]
                }
            } else {
                mediaUrls = [data.media]
            }
            caption += `│ 📝 *Title:* ${data.title || '-'}\n┇ `
        } else if (platform === 'capcut') {
            mediaUrls = [data.originalVideoUrl]
            caption += `│ 👤 *Author:* ${data.authorName || '-'}\n`
            caption += `│ 📝 *Title:* ${data.title || '-'}\n┇ `
        } else if (platform === 'snackvideo') {
            mediaUrls = [data.videoUrl]
            caption += `│ 📝 *Title:* ${data.title || '-'}\n`
            caption += `│ ⏱️ *Durasi:* ${data.duration || '-'}\n`
            caption += `│ 👀 *Views:* ${data.interaction?.views || 0}\n┇ `
        } else if (platform === 'twitter') {
            mediaUrls = [data.downloadLink]
            caption += `│ 📝 *Title:* ${data.videoTitle || '-'}\n`
            caption += `│ 💬 *Desc:* ${data.videoDescription || '-'}\n┇ `
        } else if (platform === 'gdrive') {
            mediaType = 'document'
            mediaUrls = [data.download]
            fileName = data.name || 'GDrive_File'
            caption += `│ 📝 *File Name:* ${fileName}\n┇ `
        } else if (platform === 'github') {
            mediaType = 'document'
            mediaUrls = [data.zip_download_url]
            fileName = `${data.name}.zip`
            caption += `│ 📝 *Repo:* ${data.full_name}\n`
            caption += `│ 💬 *Desc:* ${data.description || '-'}\n`
            caption += `│ ⭐ *Stars:* ${data.stargazers_count}\n┇ `
        } else if (platform === 'lahelu') {
            mediaUrls = [data.media]
            caption += `│ 👤 *User:* ${data.userUsername || '-'}\n`
            caption += `│ 📝 *Title:* ${data.title || '-'}\n`
            caption += `│ 👍 *Upvotes:* ${data.raw?.totalUpvotes || 0}\n┇ `
        }

        caption += footer()

        if (mediaType === 'image' && mediaUrls.length > 0) {
            for (let img of mediaUrls) {
                await conn.sendMessage(m.chat, { image: { url: img } }, { quoted: m })
                await new Promise(resolve => setTimeout(resolve, 1500))
            }
            await conn.sendMessage(m.chat, { text: caption }, { quoted: m })
        } else if (mediaType === 'document') {
            await conn.sendMessage(m.chat, { 
                document: { url: mediaUrls[0] }, 
                fileName: fileName,
                mimetype: platform === 'github' ? 'application/zip' : 'application/octet-stream',
                caption: caption
            }, { quoted: m })
        } else {
            await conn.sendMessage(m.chat, { 
                video: { url: mediaUrls[0] }, 
                caption: caption 
            }, { quoted: m })
        }

        await m.react('✨')

    } catch (e) {
        console.error(e)
        await m.react('❌')
        m.reply(header('DOWNLOAD ERROR', '❌') + `│ ❌ *Terjadi kesalahan:*\n│ ${e.message}` + footer())
    }
}

handler.help = ['alldl <link>']
handler.tags = ['downloader']
handler.command = /^alldl$/i
handler.limit = true

export default handler