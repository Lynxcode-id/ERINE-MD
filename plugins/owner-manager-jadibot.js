/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Author     : Lynx Decode
 * 📞 Contact    : +62 882-5804-1396
 * 📢 Channel    : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * ⚠️ Note       : Keep credit to respect the creator!
 * ─────────────────────────
 * 📝 Plugin: Jadibot Manager All-in-One
 */

import fs from 'fs'
import path from 'path'
import { stopJadibot } from '../lib/jadibot.js'

let handler = async (m, { conn, command, text, usedPrefix }) => {
    const ROOT = path.join(process.cwd(), 'session', 'jadibot')
    
    if (!fs.existsSync(ROOT)) {
        return m.reply(`┌˚₊ ๑│ ᴊ ᴀ ᴅ ɪ ʙ ᴏ ᴛ  ᴍ ᴀ ɴ ᴀ ɢ ᴇ ʀ │๑˚₊ 🤖\n┇ \n│ ❌ Belum ada sesi jadibot yang terdaftar.\n┇ \n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI X LYNX DECODE`)
    }

    const cmd = command.toLowerCase()
    let dirs = fs.readdirSync(ROOT).filter(v => /^[0-9]+$/.test(v))

    if (cmd === 'listjadibot' || cmd === 'jadibotlist') {
        if (dirs.length === 0) return m.reply(`┌˚₊ ๑│ ʟ ɪ s ᴛ  ᴊ ᴀ ᴅ ɪ ʙ ᴏ ᴛ │๑˚₊ 🤖\n┇ \n│ ❌ Belum ada sesi jadibot yang terdaftar.\n┇ \n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI X LYNX DECODE`)

        await m.react('⏳')
        let txt = `┌˚₊ ๑│ ʟ ɪ s ᴛ  ᴊ ᴀ ᴅ ɪ ʙ ᴏ ᴛ │๑˚₊ 🤖\n┇ \n`
        let activeCount = 0
        let mentions = []

        for (const id of dirs) {
            const jid = `${id}@s.whatsapp.net`
            mentions.push(jid)
            const sessionPath = path.join(ROOT, id)
            const dbPath = path.join(sessionPath, 'database_jadibot.json')
            
            let mode = 'REGULAR'
            if (fs.existsSync(dbPath)) {
                try {
                    const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'))
                    const botJid = Object.keys(db.settings || {})[0]
                    const settings = db.settings?.[botJid] || {}
                    mode = (settings.jadibotMode || (settings.jadibotPremium ? 'premium' : 'regular')).toUpperCase()
                } catch (e) {}
            }

            let stat = fs.statSync(sessionPath)
            let createdAt = new Date(stat.birthtimeMs || stat.mtimeMs).toLocaleString('id-ID', { 
                timeZone: 'Asia/Jakarta',
                day: '2-digit', month: '2-digit', year: 'numeric',
                hour: '2-digit', minute: '2-digit', second: '2-digit'
            })
            
            let isActive = global.jadibotSessions && global.jadibotSessions.has(id)
            if (isActive) activeCount++

            txt += `│ 👤 *User:* @${id}\n`
            txt += `│ ⚡ *Mode:* ${mode}\n`
            txt += `│ ${isActive ? '🟢' : '🔴'} *Status:* ${isActive ? 'Online' : 'Offline'}\n`
            txt += `│ 📅 *Dibuat:* ${createdAt} WIB\n`
            txt += `┇ \n`
        }

        txt += `│ 📊 *Total:* ${dirs.length} Sesi (${activeCount} Aktif)\n`
        txt += `└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI X LYNX DECODE`

        await conn.sendMessage(m.chat, { text: txt, mentions }, { quoted: m })
        await m.react('✅')
    } 
    else if (cmd === 'cleansessionjadibot' || cmd === 'cleanjadibot') {
        await m.react('⏳')
        let deleted = 0
        
        for (const id of dirs) {
            let isActive = global.jadibotSessions && global.jadibotSessions.has(id)
            if (!isActive) {
                const sessionPath = path.join(ROOT, id)
                try {
                    fs.rmSync(sessionPath, { recursive: true, force: true })
                    deleted++
                } catch (e) {
                    console.error(`Gagal menghapus sesi jadibot ${id}:`, e)
                }
            }
        }
        
        await m.reply(`┌˚₊ ๑│ ᴄ ʟ ᴇ ᴀ ɴ  ᴊ ᴀ ᴅ ɪ ʙ ᴏ ᴛ │๑˚₊ 🧹\n┇ \n│ ✅ *Berhasil membersihkan sesi mati!*\n│ 🗑️ *Total Dihapus:* ${deleted} Sesi\n┇ \n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI X LYNX DECODE`)
        await m.react('✅')
    }
    else if (cmd === 'deljadibot') {
        if (!text) return m.reply(`┌˚₊ ๑│ ᴅ ᴇ ʟ ᴇ ᴛ ᴇ  ᴊ ᴀ ᴅ ɪ ʙ ᴏ ᴛ │๑˚₊ 🗑️\n┇ \n│ ❌ Masukkan nomor jadibot yang mau dihapus!\n│ *Contoh:* ${usedPrefix + command} 628xxx\n┇ \n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI X LYNX DECODE`)
        
        let target = text.replace(/[^0-9]/g, '')
        if (!target) return m.reply('❌ Nomor tidak valid.')
        
        const sessionPath = path.join(ROOT, target)
        let isActive = global.jadibotSessions && global.jadibotSessions.has(target)
        
        if (!fs.existsSync(sessionPath) && !isActive) {
            return m.reply(`┌˚₊ ๑│ ᴅ ᴇ ʟ ᴇ ᴛ ᴇ  ᴊ ᴀ ᴅ ɪ ʙ ᴏ ᴛ │๑˚₊ 🗑️\n┇ \n│ ❌ Sesi jadibot untuk nomor *${target}* tidak ditemukan.\n┇ \n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI X LYNX DECODE`)
        }
        
        await m.react('⏳')
        try {
            await stopJadibot(`${target}@s.whatsapp.net`, true)
            await m.reply(`┌˚₊ ๑│ ᴅ ᴇ ʟ ᴇ ᴛ ᴇ  ᴊ ᴀ ᴅ ɪ ʙ ᴏ ᴛ │๑˚₊ 🗑️\n┇ \n│ ✅ Sesi jadibot untuk nomor *${target}* berhasil dihentikan & dihapus secara permanen.\n┇ \n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI X LYNX DECODE`)
            await m.react('✅')
        } catch (e) {
            await m.react('❌')
            m.reply(`❌ Gagal menghapus sesi: ${e.message}`)
        }
    }
}

handler.help = ['listjadibot', 'cleansessionjadibot', 'deljadibot <nomor>']
handler.tags = ['owner', 'jadibot']
handler.command = /^(listjadibot|jadibotlist|cleansessionjadibot|cleanjadibot|deljadibot)$/i
handler.owner = true

export default handler