/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Author     : Lynx Decode
 * 📞 Contact    : +62 882-5804-1396
 * 📢 Channel    : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * ⚠️ Note       : Keep credit to respect the creator!
 * ─────────────────────────
 * 📝 Plugin: MLBB Affinity 1 Maker (Custom BG)
 */

import fetch from 'node-fetch'
import { FormData, Blob } from 'formdata-node'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''

    if (!/image/.test(mime)) {
        return m.reply(`┌˚₊ ๑│ ᴀ ғ ɪ ɴ ɪ ᴛ ᴀ s  ᴍ ʟ │๑˚₊ ⚠️\n┇ \n│ ❌ *Format salah!*\n│ \n│ 📌 *Cara pakai:*\n│ Silakan reply/balas foto dengan perintah:\n│ ${usedPrefix + command} <nomor_bg>\n│ \n│ 💡 *Pilihan BG:* 1 s/d 6\n│ 📌 *Contoh:* ${usedPrefix + command} 2\n┇ \n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`)
    }

    let bgIndex = text ? parseInt(text.trim()) : 1
    if (isNaN(bgIndex) || bgIndex < 1 || bgIndex > 6) {
        return m.reply(`┌˚₊ ๑│ ᴀ ғ ɪ ɴ ɪ ᴛ ᴀ s  ᴍ ʟ │๑˚₊ ⚠️\n┇ \n│ ❌ *Nomor background tidak valid!*\n│ Pilihan nomor background yang tersedia hanya 1 sampai 6.\n┇ \n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`)
    }

    await m.react('⏳')

    try {
        let media = await q.download()
        let formData = new FormData()
        let blob = new Blob([media], { type: mime })
        formData.append('file', blob, 'upload_file')

        let uploadRes = await fetch('https://api.shinzu.web.id/api/upload/litterbox', {
            method: 'POST',
            body: formData
        })
        let uploadJson = await uploadRes.json()
        if (!uploadJson.status || !uploadJson.result) throw new Error('Gagal mengunggah media ke cloud.')
        let imageUrl = uploadJson.result.url

        const apiUrl = `https://restapi.jagoanproject.web.id/api/maker/afinitasml?image=${encodeURIComponent(imageUrl)}&bg=${bgIndex}`
        
        const res = await fetch(apiUrl, {
            headers: {
                'Authorization': 'Bearer Lynxdecode'
            }
        })

        const contentType = res.headers.get('content-type') || ''
        let mediaPayload

        if (contentType.includes('application/json')) {
            const json = await res.json()
            if (!json.status) {
                throw new Error(json.message || JSON.stringify(json))
            }
            
            let resultUrl = json?.result?.url || json?.data?.result?.url
            
            if (!resultUrl) {
                throw new Error(`Respon JSON API tidak sesuai:\n${JSON.stringify(json, null, 2)}`)
            }
            mediaPayload = { url: resultUrl }
        } else if (contentType.includes('image') || contentType.includes('application/octet-stream')) {
            const buffer = Buffer.from(await res.arrayBuffer())
            mediaPayload = buffer
        } else {
            const errText = await res.text()
            throw new Error(`Tipe konten tidak valid (${contentType}):\n${errText.substring(0, 300)}`)
        }

        let caption = `┌˚₊ ๑│ ᴀ ғ ɪ ɴ ɪ ᴛ ᴀ s  ᴍ ʟ │๑˚₊ 🎮\n` +
                      `┇ \n` +
                      `│ ✅ *Sukses membuat Afinitas MLBB!*\n` +
                      `│ 🖼️ *Background Ke:* ${bgIndex}\n` +
                      `┇ \n` +
                      `└˚₊ ๑ ────────────── ๑˚₊\n` +
                      `> © ERINE-AI`

        await conn.sendMessage(m.chat, {
            image: mediaPayload,
            caption: caption
        }, { quoted: m })

        await m.react('✅')

    } catch (error) {
        console.error('[AFINITASML ERROR]', error)
        await m.react('❌')
        
        let errMsg = error.message || String(error)
        if (errMsg.length > 500) errMsg = errMsg.substring(0, 500) + '... (cek console)'

        m.reply(`┌˚₊ ๑│ s ʏ s ᴛ ᴇ ᴍ  ᴇ ʀ ʀ ᴏ ʀ │๑˚₊ ❌\n┇ Terjadi kesalahan sistem.\n┇ *Detail:* ${errMsg}\n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`)
    }
}

handler.help = ['afinitasml <1-6>']
handler.tags = ['maker']
handler.command = /^(afinitasml)$/i
handler.limit = true

export default handler