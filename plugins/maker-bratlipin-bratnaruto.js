/**
 * ╭───「 𝗙𝗘𝗔𝗧𝗨𝗥𝗘 𝗔𝗨𝗧𝗛𝗢𝗥 」───
 * │ 👤 Developer : Lynx Decode
 * │ 📞 WhatsApp  : +62 882-5804-1396
 * │ 📢 Channel   : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * │ ⚠️ Note      : Keep credit to respect the creator!
 * ╰─────────────────────────
 * 📝 Plugin      : Brat Vtuber & Naruto Maker
 */

import fetch from 'node-fetch'
import fs from 'fs'
import path from 'path'
import os from 'os'
import { spawn } from 'child_process'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return m.reply(`Contoh: ${usedPrefix + command} Nah, I'd win ✌️`)

    await m.react('⏳')

    try {
        let endpoint = ''
        if (command.toLowerCase() === 'bratlipin') {
            endpoint = 'brat-vtuber-lipin'
        } else if (command.toLowerCase() === 'bratnaruto') {
            endpoint = 'brat-naruto'
        }

        const apiUrl = `https://api-nanzz.my.id/docs/api/maker/brat/${endpoint}.php?text=${encodeURIComponent(text)}`
        
        const res = await fetch(apiUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        })
        
        if (!res.ok) throw new Error(`Status ${res.status}: ${res.statusText}`)
            
        let buffer;
        const contentType = res.headers.get('content-type')
        
        if (contentType && contentType.includes('application/json')) {
            const json = await res.json()
            const imgUrl = json.result || json.url || json.data
            
            if (!imgUrl) throw new Error('URL Gambar tidak ditemukan di respon JSON')
            
            const imgRes = await fetch(imgUrl)
            buffer = Buffer.from(await imgRes.arrayBuffer())
        } else {
            buffer = Buffer.from(await res.arrayBuffer())
        }

        const tmpIn = path.join(os.tmpdir(), `in_${Date.now()}.png`)
        const tmpOut = path.join(os.tmpdir(), `out_${Date.now()}.webp`)
        
        fs.writeFileSync(tmpIn, buffer)

        await new Promise((resolve, reject) => {
            const ff = spawn('ffmpeg', [
                '-i', tmpIn,
                '-vcodec', 'libwebp',
                '-vf', 'scale=512:512:flags=lanczos:force_original_aspect_ratio=decrease,format=rgba,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=#00000000',
                '-lossless', '0',
                '-loop', '0',
                '-preset', 'default',
                '-an', '-vsync', '0',
                '-y', tmpOut
            ])
            ff.on('close', code => code === 0 ? resolve() : reject(new Error('FFmpeg error')))
        })

        const webpBuffer = fs.readFileSync(tmpOut)
        
        await conn.sendMessage(m.chat, { sticker: webpBuffer }, { quoted: m })

        if (fs.existsSync(tmpIn)) fs.unlinkSync(tmpIn)
        if (fs.existsSync(tmpOut)) fs.unlinkSync(tmpOut)

        await m.react('✅')
    } catch (e) {
        console.error(`[${command.toUpperCase()} ERROR]`, e)
        await m.react('❌')
        m.reply(`❌ Gagal membuat stiker.\n> *Detail:* ${e.message}`)
    }
}

handler.help = ['bratlipin <teks>', 'bratnaruto <teks>']
handler.tags = ['maker']
handler.command = /^(bratlipin|bratnaruto)$/i
handler.limit = true

export default handler