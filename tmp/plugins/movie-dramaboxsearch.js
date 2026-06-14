/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx Decode
 * ─────────────────────────
 * 📝 Plugin: Dramabox Search
 */

import axios from 'axios'

// Helper buat download gambar jadi buffer
async function getBuffer(url) {
    try {
        const res = await axios.get(url, { 
            responseType: 'arraybuffer',
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
        })
        return Buffer.from(res.data)
    } catch (e) {
        return null // Fallback kalo telegra.ph lagi down
    }
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return m.reply(`❌ Masukkan judul drama!\n\n*Contoh:* ${usedPrefix + command} ceo`)

    await m.react('⏳')

    try {
        let { data: res } = await axios.get(`https://api.azbry.com/api/search/dramabox?q=${encodeURIComponent(text)}`)

        if (!res.status || !res.result || !res.result.items || res.result.items.length === 0) {
            throw new Error('Drama tidak ditemukan.')
        }

        let items = res.result.items.slice(0, 5)
        let caption = `⚡ ＤＲＡＭＡＢＯＸ ＳＥＡＲＣＨ ⚡\n\n`

        for (let i = 0; i < items.length; i++) {
            let item = items[i]
            caption += `» Title : ${item.bookName}
» Eps   : ${item.episodes} (Free: ${item.freeEpisodes})
» Score : ⭐ ${item.score}
» Link  : ${item.url}\n\n`
        }

        caption += `> _Gunakan ${usedPrefix}dramaboxdl <link> untuk mengunduh._`

        // Download gambar dulu biar WA gak gagal stream
        let imageBuf = await getBuffer('https://telegra.ph/file/5a5c68ff81ef8d5be1328.png')
        let msgOpt = imageBuf ? { image: imageBuf, caption: caption.trim() } : { text: caption.trim() }

        await conn.sendMessage(m.chat, msgOpt, { quoted: m })

        await m.react('✅')

    } catch (e) {
        console.error('[DRAMABOX SEARCH ERROR]', e)
        await m.react('❌')
        m.reply(`⚠️ *System Error:*\n_${e?.response?.data?.message || e.message || e}_`)
    }
}

handler.help = ['dramaboxsearch <judul>']
handler.tags = ['movie']
handler.command = /^(dramaboxsearch|searchdramabox)$/i
handler.limit = true

export default handler