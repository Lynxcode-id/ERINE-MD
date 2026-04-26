/*
---------------------------------------------------------------

• Fitur TikTok MP3 Downloader
• Creator - Pembuat Code ini : @Lynx decode
• Saluran Saya : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
• Rilis : 26 April 2026
• Notes : Jangan hapus wm! - jangan hapus credit ini hargai pembuat - creator !!

---------------------------------------------------------------
*/

import ttdown from '../scrape/tiktok.js'
import axios from 'axios'
import ffmpeg from 'fluent-ffmpeg'
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg'
import fs from 'fs'

ffmpeg.setFfmpegPath(ffmpegInstaller.path)

function formatNumber(num) {
    if (!num) return '0'
    const n = parseInt(num)
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M'
    if (n >= 1000) return (n / 1000).toFixed(1) + 'K'
    return n.toString()
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
    const url = text?.trim()

    if (!url) {
        return m.reply(`╭┈┈⬡「 🎵 *ᴛɪᴋᴛᴏᴋ ᴅᴏᴡɴʟᴏᴀᴅ* 」
┃ ㊗ ᴜsᴀɢᴇ: \`${usedPrefix + command} <url>\`
╰┈┈⬡

> Contoh: ${usedPrefix + command} https://vt.tiktok.com/xxx`)
    }

    if (!url.match(/tiktok\.com|vt\.tiktok/i)) {
        return m.reply('❌ URL tidak valid. Gunakan link TikTok.')
    }

    if (m.react) m.react('🕕')

    try {
        const result = await ttdown(url)
        
        const carivideotanpawm = result.downloads.find(d => d.type == 'mp3')
        if (!carivideotanpawm) {
            if (m.react) m.react('❌')
            return m.reply('❌ Audio MP3 tidak ditemukan.')
        }

        await conn.sendMessage(m.chat, {
            audio: { url: carivideotanpawm.url },
            mimetype: 'audio/mpeg',
            fileName: `TikTok_Audio_${Date.now()}.mp3`,
            contextInfo: {
                forwardingScore: 99,
                isForwarded: true,
                externalAdReply: {
                    title: result.title || 'TikTok Audio',
                    body: `👤 By \`${result.author?.username || '-'}\``,
                    thumbnailUrl: result.author?.avatar || result.author?.cover,
                    sourceUrl: url,
                    mediaUrl: url,
                    mediaType: 2,
                    renderLargerThumbnail: false,
                }
            }
        }, { quoted: m })

        if (m.react) m.react('✅')

        // cleanup
        setTimeout(() => {
            if (result.file && fs.existsSync(result.file)) {
                fs.unlinkSync(result.file)
            }
        }, 5000)

    } catch (err) {
        console.error('[TikTokDL] Error:', err)
        if (m.react) m.react('❌')
        m.reply(`❌ *ɢᴀɢᴀʟ ᴍᴇɴɢᴜɴᴅᴜʜ*\n\n> ${err.message}`)
    }
}

handler.help = ['ttmp3 <url>']
handler.tags = ['download']
handler.command = /^(ttmp3|ttmusic|tiktokmusic)$/i
handler.cooldown = 10
handler.limit = 1 

export default handler