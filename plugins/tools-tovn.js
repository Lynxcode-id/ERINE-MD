/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx Decode
 * 📢 Channel   : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * ─────────────────────────
 * 📝 Plugin: Audio/Video to Voice Note (VN)
 */

import fs from 'fs'
import path from 'path'
import { tmpdir } from 'os'
import { exec } from 'child_process'

let handler = async (m, { conn, usedPrefix, command }) => {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''

    if (!/audio|video/.test(mime)) {
        return m.reply(`❌ Balas pesan audio atau video dengan perintah *${usedPrefix + command}*`)
    }

    await m.react('⏳')

    let ext = mime.split('/')[1]?.split(';')[0] || 'mp3'
    if (ext === 'mpeg') ext = 'mp3'
    if (ext === 'mp4') ext = 'mp4'

    let tmpIn = path.join(tmpdir(), `${Date.now()}_in.${ext}`)
    let tmpOut = path.join(tmpdir(), `${Date.now()}_out.ogg`)

    try {
        let media = await q.download()
        if (!media) throw new Error('Gagal mendownload media')

        await fs.promises.writeFile(tmpIn, media)

        // Proses konversi ke format Opus (Standar Voice Note WA) menggunakan FFmpeg
        exec(`ffmpeg -i ${tmpIn} -c:a libopus -b:a 128k -vbr on -compression_level 10 ${tmpOut}`, async (err, stdout, stderr) => {
            if (err) {
                console.error('[TO VN ERROR]', err)
                await m.react('❌')
                m.reply(`❌ Gagal mengonversi file ke Voice Note.\n> Pastikan server pterodactyl lu udah terinstal FFmpeg.`)
                
                if (fs.existsSync(tmpIn)) fs.unlinkSync(tmpIn)
                return
            }

            let audioBuffer = await fs.promises.readFile(tmpOut)
            
            await conn.sendMessage(m.chat, {
                audio: audioBuffer,
                mimetype: 'audio/ogg; codecs=opus',
                ptt: true
            }, { quoted: m })

            await m.react('✅')

            // Cleanup
            if (fs.existsSync(tmpIn)) fs.unlinkSync(tmpIn)
            if (fs.existsSync(tmpOut)) fs.unlinkSync(tmpOut)
        })

    } catch (e) {
        console.error('[TO VN DOWNLOAD ERROR]', e)
        await m.react('❌')
        m.reply(`❌ Terjadi kesalahan saat memproses media!\n> *Detail:* ${e.message || e}`)
        
        if (fs.existsSync(tmpIn)) fs.unlinkSync(tmpIn)
        if (fs.existsSync(tmpOut)) fs.unlinkSync(tmpOut)
    }
}

handler.help = ['tovn <reply media>']
handler.tags = ['tools']
handler.command = /^(tovn|vn|ptt)$/i
handler.limit = true

export default handler