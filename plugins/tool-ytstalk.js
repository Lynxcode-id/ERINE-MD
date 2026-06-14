/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx
 * ─────────────────────────
 * 📝 Plugin: YouTube Stalker (Fixed Parameter)
 */

import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return m.reply(`⚠️ *Masukkan nama channel YouTube cuy!*\n\nContoh: *${usedPrefix + command} @Lynxpreset_*`)

    await m.react('⏳')

    try {
        // Parameternya diganti dari "query" jadi "username" sesuai log error API-nya
        let username = encodeURIComponent(text.trim())
        let res = await fetch(`https://api.azbry.com/api/stalk/youtube?username=${username}`)
        let rawText = await res.text()

        let json
        try {
            json = JSON.parse(rawText)
        } catch (e) {
            throw new Error('API sedang down atau maintenance (Bukan JSON).')
        }

        if (!json.status || !json.result) {
            throw new Error(`Dari API: ${json.message || 'Channel tidak ditemukan.'}\n💡 *Coba tambahkan '@' jika belum ada.*`)
        }

        let { name, id, url, thumbnail, subscribers, video_count, verified, about } = json.result

        let caption = `💠 ─── [ *YOUTUBE STALK* ] ─── 💠\n\n`
        caption += `📛 *Channel:* ${name}\n`
        caption += `🆔 *ID:* ${id}\n`
        caption += `👥 *Subscribers:* ${subscribers}\n`
        caption += `🎥 *Total Video:* ${video_count == "-1" ? "Disembunyikan" : video_count}\n`
        caption += `✅ *Verified:* ${verified ? 'Iya' : 'Tidak'}\n`
        caption += `📝 *About:*\n${about || 'Tidak ada deskripsi'}\n\n`
        caption += `🔗 *Link:* ${url || '-'}\n\n`
        caption += `> © ${json.creator || 'Azbry'} x INF PROJECT`

        await conn.sendMessage(m.chat, {
            image: { url: thumbnail },
            caption: caption
        }, { quoted: m })

        await m.react('✅')

    } catch (e) {
        console.error(e)
        await m.react('❌')
        m.reply(`❌ *[ERROR]* Gagal mengambil data:\n_${e.message}_`)
    }
}

handler.help = ['stalkyt <nama channel>']
handler.tags = ['stalking']
handler.command = /^(stalkyt|ytstalk)$/i
handler.limit = true

export default handler