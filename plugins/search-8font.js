/**
 * ╭───「 𝗙𝗘𝗔𝗧𝗨𝗥𝗘 𝗔𝗨𝗧𝗛𝗢𝗥 」───
 * │ 👤 Developer : Lynx Decode
 * │ 📞 WhatsApp  : +62 882-5804-1396
 * │ 📢 Channel   : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * │ ⚠️ Note      : Keep credit to respect the creator!
 * ╰─────────────────────────
 * 📝 Plugin      : 8Font Search
 */

import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        return m.reply(`⚠️ Format salah!\n\n📌 *Cara pakai:*\n${usedPrefix + command} query | halaman\n\n*Contoh:*\n${usedPrefix + command} cute jellyfish | 1\n${usedPrefix + command} modern | 2`)
    }

    await m.react('⏳')

    try {
        let [query, page] = text.split('|').map(v => v.trim())
        
        if (!page || isNaN(page)) page = '1'

        const apiUrl = `https://api.cuki.biz.id/api/search/8font?apikey=cuki-x&query=${encodeURIComponent(query)}&page=${page}`
        
        const res = await fetch(apiUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        })
        
        if (!res.ok) throw new Error(`Status ${res.status}: ${res.statusText}`)
        
        const json = await res.json()
        if (!json.status || !json.data || !json.data.fonts || json.data.fonts.length === 0) {
            throw new Error(`Font tidak ditemukan untuk query: *${query}* di halaman *${page}*`)
        }

        let caption = `┌˚₊ ๑│ ᴇ ʀ ɪ ɴ ᴇ  ᴍ ᴅ │๑˚₊ 🚀\n`
        caption += `┇ 🎨 › 8 ꜰ ᴏ ɴ ᴛ  s ᴇ ᴀ ʀ ᴄ ʜ\n`
        caption += `└˚₊ ๑ ʀ ᴇ s ᴜ ʟ ᴛ s ๑˚₊ 🔍\n\n`
        caption += `📊 *Pencarian:* ${query}\n`
        caption += `📄 *Halaman:* ${page}\n`
        caption += `Total Hasil di Halaman Ini: ${json.data.fonts.length}\n\n`

        for (let i = 0; i < json.data.fonts.length; i++) {
            let f = json.data.fonts[i]
            let dateClean = f.date ? f.date.replace(' |', '') : 'Unknown'
            let categories = f.categories ? f.categories.join(', ') : 'None'

            caption += `┌ 📝 *Title:* ${f.title}\n`
            caption += `├ 🏷️ *Categories:* ${categories}\n`
            caption += `└ 📅 *Date:* ${dateClean}\n\n`
        }

        caption += `> © Lynx Decode`

        let firstImage = json.data.fonts[0].image
        
        if (firstImage) {
            await conn.sendMessage(m.chat, { 
                image: { url: firstImage }, 
                caption: caption.trim() 
            }, { quoted: m })
        } else {
            await conn.sendMessage(m.chat, { text: caption.trim() }, { quoted: m })
        }

        await m.react('✅')
    } catch (e) {
        console.error('[8FONT SEARCH ERROR]', e)
        await m.react('❌')
        m.reply(`❌ Gagal mencari font.\n> *Detail:* ${e.message}`)
    }
}

handler.help = ['8font <query> | <page>']
handler.tags = ['search']
handler.command = /^(8font|searchfont|fontsearch)$/i
handler.limit = true

export default handler