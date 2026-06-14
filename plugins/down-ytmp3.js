/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx Decode
 * 📞 WhatsApp  : +62 882-5804-1396
 * 📢 Channel   : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * ⚠️ Note      : Keep credit to respect the creator!
 * ─────────────────────────
 * 📝 Plugin: YouTube MP3 Downloader
 */

import axios from 'axios'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return m.reply(`⚠️ Masukan URL YouTube!\n\nContoh: *${usedPrefix + command}* https://youtu.be/xxx`)

    await m.react('⚡')

    const fetchAndDownload = async () => {
        const endpoint = 'https://api.ryzumi.net/api/downloader/ytmp3'

        const res = await axios.get(endpoint, {
            params: { url: text },
            headers: { 'accept': 'application/json' }
        })

        const yt = res.data

        if (!yt || !yt.url) throw new Error('Data atau link audio gak ditemuin dari server Ryzumi.')

        try {
            const audioRes = await axios.get(yt.url, {
                responseType: 'arraybuffer',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                }
            })
            yt.audioBuffer = Buffer.from(audioRes.data)
            return yt
        } catch (err) {
            console.log('Error Download Buffer Ryzumi:', err.message)
            throw new Error('Gagal mengunduh file audio ke buffer. Kemungkinan server pengunduh lagi sibuk/limit.')
        }
    }

    try {
        const yt = await fetchAndDownload()

        let caption = `╭━━━ [ *Y O U T U B E  -  M P 3* ] ━━━💠
┣ 🎵 *Judul:* ${yt.title || 'Tidak diketahui'}
┣ 👤 *Channel:* ${yt.author || '-'}
┣ ⏱️ *Durasi:* ${yt.lengthSeconds ? yt.lengthSeconds + ' detik' : '-'}
┣ 👁️ *Views:* ${yt.views ? yt.views.toLocaleString('id-ID') : '-'}
┣ 📅 *Upload:* ${yt.uploadDate || '-'}
┣ 💿 *Kualitas:* ${yt.quality || '128kbps'}
╰━━━━━━━━━━━━━━━━━━━━━━💠

> ⚡ _Audio sedang dikirim, harap tunggu sebentar..._`

        let thumbUrl = yt.thumbnail || 'https://i.ibb.co/1s8T3sY/48f7ce63c7aa.jpg'

        // Kirim Thumbnail + Detail (Tetap pakai contextInfo Channel)
        await conn.sendMessage(m.chat, { 
            image: { url: thumbUrl },
            caption: caption,
            contextInfo: {
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: "120363400612665352@newsletter",
                    newsletterName: "🌟 ᴇʀɪɴᴇ-ᴍᴅ ɪɴғᴏʀᴍᴀᴛɪᴏɴ",
                    serverMessageId: -1
                }
            }
        }, { quoted: m })

        // Kirim Audio murni (Bukan VN Channel)
        await conn.sendMessage(m.chat, { 
            audio: yt.audioBuffer, 
            mimetype: 'audio/mpeg', 
            ptt: false,
            fileName: `${yt.title}.mp3`
            // contextInfo channel sengaja dihapus biar kebaca audio biasa
        }, { quoted: m })

        await m.react('✅')

    } catch (e) {
        console.error(e)
        await m.react('❌')
        m.reply(`❌ Gagal: ${e.message}`)
    }
}

handler.help = ['ytmp3 <url>']
handler.tags = ['downloader']
handler.command = /^(ytmp3|yta)$/i
handler.limit = true

export default handler