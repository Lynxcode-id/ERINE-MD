/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx Decode
 * 📢 Channel   : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * ─────────────────────────
 * 📝 Plugin: Search - NPM Packages
 */

import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        return m.reply(
            `⚠️ *Ngapain lu?*\n\n` +
            `Ketik nama package-nya njir, formatnya: *${usedPrefix + command} <nama module>*\n\n` +
            `💡 *Contoh:*\n` +
            `${usedPrefix + command} axios`
        )
    }

    await m.react('⏳')

    try {
        // API NPM dari Faa udah bener nih
        let apiUrl = `https://api-faa.my.id/faa/npmjs?name=${encodeURIComponent(text.trim())}`
        
        let res = await fetch(apiUrl)
        let json = await res.json()

        if (!json.status || !json.result || json.result.length === 0) {
            throw new Error('Data kosong.')
        }

        let caption = `📦 *NPM SEARCH RESULT*\n\n`
        caption += `🔍 *Pencarian:* ${text}\n`
        caption += `━━━━━━━━━━━━━━━\n\n`
        let limit = json.result.length > 10 ? 10 : json.result.length
        
        for (let i = 0; i < limit; i++) {
            let v = json.result[i]
            caption += `*${i + 1}. ${v.name}* (v${v.version})\n`
            caption += `🔗 *Link:* ${v.link}\n`
            caption += `📝 *Desc:* ${v.description || 'Tidak ada deskripsi'}\n\n`
        }
        
        caption += `> © INF PROJECT`

        await conn.sendMessage(m.chat, { 
            text: caption.trim() 
        }, { quoted: m })

        await m.react('✅')
    } catch (e) {
        console.error(e)
        await m.react('❌')
        m.reply(`❌ *Error njir:* Gagal nyari data NPM, cek API-nya idup apa kaga.`)
    }
}

handler.help = ['npmsearch <package>']
handler.tags = ['search']
handler.command = /^(npmsearch)$/i
handler.limit = true

export default handler