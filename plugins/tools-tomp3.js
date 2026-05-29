/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx Decode
 * 📞 WhatsApp  : +62 882-5804-1396
 * 📢 Channel   : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * ⚠️ Note      : Keep credit to respect the creator!
 * ─────────────────────────
 * 📝 Plugin: Tools - To MP3 (Bypass Panel Non-Root)
 */

import fs from 'fs'
import path from 'path'
import os from 'os'
import { randomBytes } from 'crypto'
import ffmpeg from 'fluent-ffmpeg'
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg'

ffmpeg.setFfmpegPath(ffmpegInstaller.path)

let handler = async (m, { conn, usedPrefix, command }) => {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''

    if (!/video|document/.test(mime)) {
        return m.reply(`⚠️ *Format Salah!*\n\nSilahkan reply video yang ingin diubah menjadi audio dengan caption *${usedPrefix + command}*`)
    }

    await m.react('⏳')

    try {
        let media = await q.download()
        if (!media) throw new Error('Gagal mendownload media.')
        let ran = randomBytes(5).toString('hex')
        let tmpIn = path.join(os.tmpdir(), `${ran}_in.mp4`)
        let tmpOut = path.join(os.tmpdir(), `${ran}_out.mp3`)

        fs.writeFileSync(tmpIn, media)
        await new Promise((resolve, reject) => {
            ffmpeg(tmpIn)
                .toFormat('mp3')
                .on('end', () => resolve())
                .on('error', (err) => reject(err))
                .save(tmpOut)
        })

        let audio = fs.readFileSync(tmpOut)

        await conn.sendMessage(m.chat, { 
            audio: audio, 
            mimetype: 'audio/mpeg', 
            ptt: false,
            fileName: `Convert-${m.sender.split('@')[0]}.mp3`,
            caption: '> © INF PROJECT'
        }, { quoted: m })

        if (fs.existsSync(tmpIn)) fs.unlinkSync(tmpIn)
        if (fs.existsSync(tmpOut)) fs.unlinkSync(tmpOut)

        await m.react('✅')
    } catch (e) {
        console.error(e)
        await m.react('❌')
        m.reply(`❌ *Terjadi Kesalahan:* Gagal mengkonversi media ke MP3.`)
    }
}

handler.help = ['tomp3 <reply video>']
handler.tags = ['tools']
handler.command = /^to(mp3|audio)$/i
handler.limit = true

export default handler