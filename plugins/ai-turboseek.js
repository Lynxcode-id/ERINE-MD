/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx Decode
 * 📢 Channel   : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * ─────────────────────────
 * 📝 Plugin: TurboSeek AI (LexCode API)
 */

import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        return m.reply(`Mau cari berita atau informasi apa cuy?\n\n*Contoh:*\n${usedPrefix + command} latest news in indonesia`)
    }

    await m.react('⏳')

    try {
        const apiUrl = `https://api.lexcode.biz.id/api/ai/turboseek?text=${encodeURIComponent(text)}`
        const response = await fetch(apiUrl)
        
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`)
        
        const data = await response.json()
        
        if (!data.success) throw new Error('API LexCode merespon dengan status false')

        const { answer, references } = data.result

        let caption = `┌˚₊ ๑│ ᴛ ᴜ ʀ ʙ ᴏ s ᴇ ᴇ ᴋ │๑˚₊ 🌐\n`
        caption += `┇ 🔍 › *Query:* ${text}\n`
        caption += `└˚₊ ๑ ───────── ๑˚₊\n\n`

        // Nampilin jawaban AI kalau ada isinya
        if (answer && answer.trim() !== '') {
            caption += `📝 *AI Answer:*\n${answer}\n\n`
        }

        // Nampilin referensi/sumber link
        if (references && Array.isArray(references) && references.length > 0) {
            caption += `📚 *References:*\n`
            references.forEach((ref, index) => {
                caption += `*${index + 1}.* ${ref.title}\n🔗 ${ref.url}\n\n`
            })
        } else if (!answer || answer.trim() === '') {
            // Kalau answer kosong & references kosong
            caption += `_Tidak ada hasil atau referensi yang ditemukan._\n\n`
        }

        caption += `> © ERINE-MD`

        await conn.sendMessage(m.chat, {
            text: caption.trim(),
            contextInfo: {
                externalAdReply: {
                    title: "🌐 TurboSeek AI - Erine Project",
                    body: "Powered by LexCode API",
                    thumbnailUrl: "https://i.ibb.co/4YBNyvP/images-76.jpg",
                    sourceUrl: "https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i",
                    mediaType: 1,
                    renderLargerThumbnail: false
                }
            }
        }, { quoted: m })

        await m.react('✅')
    } catch (error) {
        console.error('[TURBOSEEK ERROR]', error)
        await m.react('❌')
        m.reply(`❌ Gagal mencari data.\n> *Detail:* ${error.message || error}`)
    }
}

handler.help = ['turboseek <query>', 'news <query>']
handler.tags = ['ai', 'internet']
handler.command = /^(turboseek|ts)$/i
handler.limit = true

export default handler