/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx Decode
 * ─────────────────────────
 * 📝 Plugin: Femboy Checker
 */

import { generateCard } from '@kyzzknz/femboy-canvas'
import fetch from 'node-fetch'

async function fetchAvatar(conn, jid) {
    try {
        const url = await conn.profilePictureUrl(jid, 'image').catch(() => 'https://telegra.ph/file/24fa902ead26340f3df2c.png')
        if (url) {
            const r = await fetch(url)
            if (r.ok) return Buffer.from(await r.arrayBuffer())
        }
        return null
    } catch { 
        return null 
    }
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
    let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : m.sender
    let nama = text ? text.replace(/@\d+/g, '').trim() : conn.getName(who) || who.split('@')[0]
    if (!nama) nama = 'Femboy'

    let pct = Math.floor(Math.random() * (85 - 35 + 1) + 35)
    if (Math.random() < 0.15) pct = Math.floor(Math.random() * 35)
    if (Math.random() < 0.08) pct = Math.floor(Math.random() * 10 + 90)
    if (Math.random() < 0.03) pct = 69

    await m.react('⏳')
    
    try {
        const avatarBuf = await fetchAvatar(conn, who)
        const card = await generateCard(nama, pct, avatarBuf, global.botname || 'Erine-MD', global.website || 'INF Project')
        
        if (avatarBuf) avatarBuf.fill(0)

        await conn.sendMessage(m.chat, {
            image: card,
            mimetype: 'image/jpeg',
            caption: `> 📊 *Tingkat Femboy:* ${pct}%\n> 👤 *Target:* ${nama}`
        }, { quoted: m })
        
        await m.react('✅')
    } catch (e) {
        console.error(e)
        await m.react('❌')
        m.reply('⚠️ Gagal memproses gambar canvas.')
    }
}

handler.help = ['cekfemboy2 <@tag/nama>']
handler.tags = ['fun']
handler.command = /^(cekfemboy2|femboy2|fem2)$/i
handler.register = true
handler.limit = true

export default handler