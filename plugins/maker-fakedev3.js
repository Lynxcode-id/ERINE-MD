/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Author     : Lynx Decode
 * 📞 Contact    : +62 882-5804-1396
 * 📢 Channel    : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * ⚠️ Note       : Keep credit to respect the creator!
 * ─────────────────────────
 * 📝 Plugin: Fake Developer 3 Maker
 */

import fetch from 'node-fetch'
import { FormData, Blob } from 'formdata-node'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        return m.reply(`┌˚₊ ๑│ ғ ᴀ ᴋ ᴇ  ᴅ ᴇ ᴠ  3 │๑˚₊ ⚠️\n┇ \n│ ❌ *Format salah!*\n│ \n│ 📌 *Cara pakai:*\n│ ${usedPrefix + command} <teks>\n│ \n│ 💡 *Tips:* _Kirim/reply foto dengan caption command ini,_\n│ _jika tidak membalas foto, akan menggunakan PP-mu._\n┇ \n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`)
    }

    await m.react('⏳')

    let imageUrl = ''
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''

    try {
        if (/image/.test(mime)) {
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
            imageUrl = uploadJson.result.url
        } else {
            imageUrl = await conn.profilePictureUrl(m.sender, 'image').catch(() => 'https://i.ibb.co/1s8T3sY/48f7ce63c7aa.jpg')
        }

        const apiUrl = `https://restapi.jagoanproject.web.id/api/maker/fakedev3?text=${encodeURIComponent(text)}&verified=true&image=${encodeURIComponent(imageUrl)}`
        
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

        let caption = `┌˚₊ ๑│ ғ ᴀ ᴋ ᴇ  ᴅ ᴇ ᴠ  3 │๑˚₊ 💻\n` +
                      `┇ \n` +
                      `│ 📝 *Text:* ${text}\n` +
                      `┇ \n` +
                      `└˚₊ ๑ ────────────── ๑˚₊\n` +
                      `> © ERINE-AI`

        await conn.sendMessage(m.chat, {
            image: mediaPayload,
            caption: caption
        }, { quoted: m })

        await m.react('✅')

    } catch (error) {
        console.error('[FAKEDEV3 ERROR]', error)
        await m.react('❌')
        
        let errMsg = error.message || String(error)
        if (errMsg.length > 500) errMsg = errMsg.substring(0, 500) + '... (cek console)'

        m.reply(`┌˚₊ ๑│ s ʏ s ᴛ ᴇ ᴍ  ᴇ ʀ ʀ ᴏ ʀ │๑˚₊ ❌\n┇ Terjadi kesalahan sistem.\n┇ *Detail:* ${errMsg}\n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`)
    }
}

handler.help = ['fakedev3 <teks>']
handler.tags = ['maker']
handler.command = /^(fakedev3|devfake3)$/i
handler.limit = true

export default handler