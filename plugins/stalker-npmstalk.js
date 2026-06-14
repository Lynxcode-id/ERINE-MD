/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx Decode
 * 📢 Channel   : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * ─────────────────────────
 * 📝 Plugin: NPM Stalker
 */

import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        return m.reply(`Masukkan username NPM yang mau di-stalk!\n\n*Contoh:*\n${usedPrefix + command} colinhacks`)
    }

    await m.react('⏳')

    try {
        const apiUrl = `https://api.pixxxry.eu.cc/stalk/npm?username=${encodeURIComponent(text)}`
        const response = await fetch(apiUrl)
        
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`)
        
        const data = await response.json()
        
        if (!data.status || !data.result) throw new Error('Username tidak ditemukan atau API bermasalah')

        const res = data.result
        
        let caption = `┌˚₊ ๑│ ɴ ᴘ ᴍ  s ᴛ ᴀ ʟ ᴋ ᴇ ʀ │๑˚₊ 📦\n`
        caption += `┇ 👤 *Name:* ${res.name || res.username}\n`
        caption += `┇ 📧 *Email:* ${res.email || '-'}\n`
        caption += `┇ 📦 *Total Packages:* ${res.stats?.total_packages || 0}\n`
        caption += `┇ 📉 *Monthly Downloads:* ${res.stats?.total_monthly_downloads?.toLocaleString('id-ID') || 0}\n`
        caption += `┇ 🔗 *Profile:* ${res.profile || '-'}\n`
        caption += `└˚₊ ๑ ────────────── ๑˚₊\n\n`

        if (res.packages && res.packages.length > 0) {
            caption += `📚 *Top 5 Packages:*\n`
            let limit = Math.min(res.packages.length, 5)
            for (let i = 0; i < limit; i++) {
                let pkg = res.packages[i]
                caption += `*${i + 1}. ${pkg.name}* (v${pkg.version})\n`
                caption += `> ⬇️ ${pkg.downloads_monthly?.toLocaleString('id-ID')}/mo\n`
                caption += `> 🔗 ${pkg.links?.npm || '-'}\n\n`
            }
        }

        caption += `> © ERINE-MD`

        await conn.sendMessage(m.chat, {
            image: { url: res.avatar || 'https://i.ibb.co/4YBNyvP/images-76.jpg' },
            caption: caption.trim()
        }, { quoted: m })

        await m.react('✅')
    } catch (error) {
        console.error('[NPM STALK ERROR]', error)
        await m.react('❌')
        m.reply(`❌ Gagal mencari data NPM.\n> *Detail:* ${error.message || error}`)
    }
}

handler.help = ['npmstalk <username>']
handler.tags = ['stalker']
handler.command = /^(npmstalk|stalknpm)$/i
handler.limit = true

export default handler