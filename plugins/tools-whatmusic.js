/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Author     : Lynx Decode
 * 📞 Contact    : +62 882-5804-1396
 * 📢 Channel    : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * ⚠️ Note       : Keep credit to respect the creator!
 * ─────────────────────────
 * 📝 Plugin: Song Identify (TheresaV API)
 * 📦 Npm       : npm i form-data axios
 */

import axios from 'axios'
import FormData from 'form-data'
import fs from 'fs'
import path from 'path'
import os from 'os'

let handler = async (m, { conn, usedPrefix, command }) => {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''

    if (!/audio|video/.test(mime)) {
        return m.reply(`┌˚₊ ๑│ ꜱ ᴏ ɴ ɢ  ɪ ᴅ ᴇ ɴ ᴛ ɪ ꜰ ʏ │๑˚₊ 🎵\n┇ \n│ ❌ *Reply audio atau video cuy!*\n│ \n│ 📌 *Cara pakai:*\n│ Reply VN/Audio/Video dengan pesan:\n│ ${usedPrefix + command}\n┇ \n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI x INF PROJECT`)
    }

    await m.react('⏳')
    
    let ext = mime.split('/')[1]?.split(';')[0] || 'mp3'
    let tmpFile = path.join(os.tmpdir(), `whatmusic_${Date.now()}_${m.sender.split('@')[0]}.${ext}`)

    try {
        let buffer = await q.download()
        
        // Simpan sementara buat dikirim ke form-data
        fs.writeFileSync(tmpFile, buffer)

        const form = new FormData()
        form.append('file', fs.createReadStream(tmpFile))
        form.append('apikey', 'x34J0')

        const { data } = await axios.post('https://api.theresav.biz.id/tools/whatmusic', form, {
            headers: {
                ...form.getHeaders()
            }
        })

        if (!data.status || !data.result) {
            throw new Error('Lagu tidak ditemukan atau suara tidak jelas.')
        }

        let res = data.result
        let caption = `┌˚₊ ๑│ ꜱ ᴏ ɴ ɢ  ɪ ᴅ ᴇ ɴ ᴛ ɪ ꜰ ʏ │๑˚₊ 🎵\n` +
                      `┇ \n` +
                      `│ ✅ *Lagu Ditemukan!*\n` +
                      `│ 🎬 *Judul:* ${res.title || '-'}\n` +
                      `│ 👤 *Artist:* ${res.artists || '-'}\n` +
                      `│ 💿 *Album:* ${res.album || '-'}\n` +
                      `│ 🎼 *Genre:* ${res.genres || '-'}\n` +
                      `│ 🔗 *Shazam:* ${res.url || '-'}\n` +
                      `┇ \n` +
                      `└˚₊ ๑ ────────────── ๑˚₊\n` +
                      `> © ERINE-AI x INF PROJECT`

        if (res.image && res.image.startsWith('http')) {
            await conn.sendMessage(m.chat, { image: { url: res.image }, caption: caption }, { quoted: m })
        } else {
            await m.reply(caption)
        }

        await m.react('✅')

    } catch (error) {
        console.error('[WHATMUSIC ERROR]', error)
        await m.react('❌')
        
        let errMsg = error.response?.data?.message || error.message || String(error)
        m.reply(`┌˚₊ ๑│ ꜱ ʏ ꜱ ᴛ ᴇ ᴍ  ᴇ ʀ ʀ ᴏ ʀ │๑˚₊ ❌\n┇ Terjadi kesalahan sistem.\n┇ *Detail:* ${errMsg}\n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`)
    } finally {
        if (fs.existsSync(tmpFile)) {
            fs.unlinkSync(tmpFile)
        }
    }
}

handler.help = ['whatmusic', 'identifymusic']
handler.tags = ['tools', 'search']
handler.command = /^(whatmusic|identifymusic)$/i
handler.limit = true

export default handler