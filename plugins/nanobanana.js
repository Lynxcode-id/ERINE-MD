/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Author     : Lynx Decode
 * 📞 Contact    : +62 882-5804-1396
 * 📢 Channel    : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * ⚠️ Note       : Keep credit to respect the creator!
 * ─────────────────────────
 * 📝 Plugin: NanoBanana AI Image Editor (Fixed Response Data)
 */

import axios from 'axios'
import FormDataNode from 'form-data'
import fetch from 'node-fetch'
import { FormData, Blob } from 'formdata-node'

async function generateNanobanana(imageUrl, prompt) {
    const image = await axios.get(imageUrl, { responseType: 'arraybuffer' })
    const buffer = Buffer.from(image.data, "binary")
    const form = new FormDataNode()
    form.append('file', buffer, { filename: 'image.jpg', contentType: 'image/jpeg' })
    form.append('prompt', prompt)
    form.append('output_format', 'jpg')
    form.append('generator_slug', 'ai-image-editor')
    
    const { data: generate } = await axios.post('https://banana-nano.ai/api/nano-banana-lite-image-to-image', form, {
        headers: {
            'accept': '*/*',
            'origin': 'https://banana-nano.ai',
            'referer': 'https://banana-nano.ai/ai-image-editor',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
            ...form.getHeaders()
        }
    })
    
    if (generate.success || generate.output_image_url || generate.data?.image_url || generate.r2_url) {
        return generate
    } else {
        throw new Error(generate.message || JSON.stringify(generate))
    }
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''
    
    if (!mime.startsWith('image/')) {
        return m.reply(`┌˚₊ ๑│ ɴ ᴀ ɴ ᴏ ʙ ᴀ ɴ ᴀ ɴ ᴀ  ᴀ ɪ │๑˚₊ 🎨\n┇ \n│ ❌ *Gambarnya mana cuy?*\n│ \n│ 📌 *Cara pakai:*\n│ Kirim/balas gambar dengan caption:\n│ ${usedPrefix + command} <prompt edit>\n┇ \n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`)
    }
    
    if (!text) {
        return m.reply(`┌˚₊ ๑│ ɴ ᴀ ɴ ᴏ ʙ ᴀ ɴ ᴀ ɴ ᴀ  ᴀ ɪ │๑˚₊ 🎨\n┇ \n│ ❌ *Prompt edit nya mana cuy?*\n│ \n│ 📌 *Contoh:*\n│ ${usedPrefix + command} add a pair of stylish glasses\n┇ \n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`)
    }

    await m.react('⏳')

    try {
        let media = await q.download()
        
        let formData = new FormData()
        let blob = new Blob([media], { type: mime })
        formData.append('file', blob, 'upload_file')

        let upRes = await fetch('https://api.shinzu.web.id/api/upload/litterbox', {
            method: 'POST',
            body: formData
        })
        let upJson = await upRes.json()

        if (!upJson.status || !upJson.result) throw new Error('Gagal mengunggah media ke uploader.')
        let uploadUrl = upJson.result.url
        
        const res = await generateNanobanana(uploadUrl, text)
        const resultUrl = res.r2_url || res.data?.image_url || res.output_image_url

        if (resultUrl) {
            await conn.sendMessage(m.chat, {
                image: { url: resultUrl },
                caption: `┌˚₊ ๑│ ɴ ᴀ ɴ ᴏ ʙ ᴀ ɴ ᴀ ɴ ᴀ  ᴀ ɪ │๑˚₊ 🎨\n┇ \n│ ✅ *Berhasil diedit!*\n┇ \n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`
            }, { quoted: m })

            await m.react('✅')
        } else {
            throw new Error('API tidak mengembalikan URL output gambar. Response: ' + JSON.stringify(res))
        }

    } catch (error) {
        console.error('[NANOBANANA ERROR]', error)
        await m.react('❌')
        m.reply(`┌˚₊ ๑│ ꜱ ʏ ꜱ ᴛ ᴇ ᴍ  ᴇ ʀ ʀ ᴏ ʀ │๑˚₊ ❌\n┇ Gagal mengedit gambar.\n┇ \n┇ *Detail:*\n┇ ${error.message || String(error)}\n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`)
    }
}

handler.help = ['nanobanana']
handler.tags = ['tools']
handler.command = /^(nanobanana|nana|editimage)$/i
handler.limit = true

export default handler