/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx Decode
 * 📢 Channel   : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * ─────────────────────────
 * 📝 Plugin : MLBB Stalk
 */

import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        return m.reply(`❌ Format salah cuy!\n\n*Contoh Penggunaan:*\n${usedPrefix + command} 144025050 2725\nAtau\n${usedPrefix + command} 144025050|2725`)
    }

    await m.react('⏳')

    // Pisahkan userId dan zoneId (support spasi atau garis vertikal)
    let [userId, zoneId] = text.replace('|', ' ').split(/\s+/)

    if (!userId || !zoneId) {
        await m.react('❌')
        return m.reply(`❌ Masukkan User ID dan Zone ID dengan lengkap!\nContoh: ${usedPrefix + command} 144025050 2725`)
    }

    try {
        const apiKey = 'x34J0' // API Key bawaan dari lu
        const apiUrl = `https://api.theresav.biz.id/stalk/mlbbstalk?userId=${userId}&zoneId=${zoneId}&apikey=${apiKey}`

        const response = await fetch(apiUrl)
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`)
        
        const data = await response.json()

        if (!data.status || !data.result) {
            throw new Error('User ID tidak ditemukan atau server sedang error.')
        }

        const res = data.result

        // Loop buat nampilin list promo First Recharge tanpa mangkas data
        let frText = ''
        if (res.first_recharge && res.first_recharge.length > 0) {
            frText = '\n│ 💎 *First Recharge Promo:*\n'
            res.first_recharge.forEach(fr => {
                let statusIcon = fr.available ? '✅ Tersedia' : '❌ Habis'
                frText += `│  ◦ ${fr.title} : ${statusIcon}\n`
            })
        }

        let caption = `┌˚₊ ๑│ ᴍ ʟ ʙ ʙ  s ᴛ ᴀ ʟ ᴋ ᴇ ʀ │๑˚₊ 🎮
┇ 
│ 👤 *Nickname:* ${res.nickname}
│ 🆔 *ID:* ${res.userId} (${res.zoneId})
│ 🌍 *Region:* ${res.region} (${res.countryCode.toUpperCase()})
${frText}┇ 
└˚₊ ๑ ────────────── ๑˚₊
> © ERINE-MD`

        await conn.sendMessage(m.chat, {
            text: caption.trim()
        }, { quoted: m })

        await m.react('✅')

    } catch (e) {
        console.error('[ML STALK ERROR]', e)
        await m.react('❌')
        m.reply(`┌˚₊ ๑│ s ʏ s ᴛ ᴇ ᴍ  ᴇ ʀ ʀ ᴏ ʀ │๑˚₊ ❌\n┇ Gagal mengecek data akun:\n┇ ${e.message || e}\n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-MD`)
    }
}

handler.help = ['mlstalk <userid zoneid>']
handler.tags = ['search', 'tools']
handler.command = /^(mlstalk|stalkml)$/i
handler.limit = true

export default handler