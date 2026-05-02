import { isActive } from '../lib/jadibot.js'

function format(ms) {
    let s = Math.floor(ms / 1000)
    let m = Math.floor(s / 60)
    let h = Math.floor(m / 60)

    if (h) return `${h}j ${m % 60}m ${s % 60}s`
    if (m) return `${m}m ${s % 60}s`
    return `${s}s`
}

let handler = async (m, { conn, usedPrefix }) => {
    // Di G1 biasanya pake global.session atau global.conns
    // Kita cek mana yang ada isinya
    const sessions = global.session || global.conns || []
    
    await m.react?.('📡')

    // Konversi ke array biar gampang di-map (buat jaga-jaga kalau dia Map/Object)
    const activeNodes = Array.isArray(sessions) 
        ? sessions 
        : (sessions instanceof Map ? Array.from(sessions.values()) : Object.values(sessions))

    // Filter hanya yang bener-bener konek (punya user jid)
    const list = activeNodes.filter(v => v.user && v.state !== 'close')

    if (list.length === 0) {
        return m.reply(
            `╭━━━━━━━〔 ⚡ 〕━━━━━━━╮\n` +
            `┃  🌐 𝗦𝗬𝗦𝗧𝗘𝗠: 𝗘𝗥𝗜𝗡𝗘 𝗚𝟭\n` +
            `┃  📊 𝗦𝗧𝗔𝗧𝗨𝗦: 𝗜𝗗𝗟𝗘 (𝟬)\n` +
            `┣━━━━━━━━━━━━━━━━━━━━━━━\n` +
            `┃ ❌ Tidak ada jadibot yang\n` +
            `┃ sedang aktif saat ini.\n` +
            `╰━━━━━━━━━━━━━━━━━━━━━━━⬣\n\n` +
            `> Ketik *${usedPrefix}jadibot* untuk join.`
        )
    }

    let text = `╭━━━━━━〔 🤖 〕━━━━━━╮\n`
    text += `┃  🌐 𝗘𝗥𝗜𝗡𝗘 𝗡𝗘𝗫𝗨𝗦 - 𝗚𝟭\n`
    text += `┃  🛰️ 𝗔𝗖𝗧𝗜𝗩𝗘 𝗡𝗢𝗗𝗘𝗦: ${list.length}\n`
    text += `┣━━━━━━━━━━━━━━━━━━━━━\n\n`

    let mentions = []

    list.forEach((v, i) => {
        const jid = v.user.jid || v.user.id
        const id = jid.split(':')[0].split('@')[0]
        const uptime = v.startedAt ? format(Date.now() - v.startedAt) : 'Aktif'
        
        text += `┌───〔 🟢 𝗡𝗢𝗗𝗘 ${i + 1} 〕\n`
        text += `│ 👤 𝗨𝘀𝗲𝗿: @${id}\n`
        text += `│ ⏳ 𝗨𝗽𝘁𝗶𝗺𝗲: ${uptime}\n`
        text += `│ 🛰️ 𝗦𝘁𝗮𝘁𝘂𝘀: Connected\n`
        text += `└──────────────⬣\n\n`
        
        mentions.push(id + '@s.whatsapp.net')
    })

    text += `> 𝘚𝘺𝘴𝘵𝘦𝘮 𝘔𝘰𝘯𝘪𝘵𝘰𝘳: 𝘓𝘺𝘯𝘹-𝘌𝘯𝘨𝘪𝘯𝘦`

    await conn.sendMessage(m.chat, {
        text: text.trim(),
        mentions: mentions
    }, { quoted: m })

    await m.react?.('✅')
}

handler.help = ['listjadibot', 'cekjadibot']
handler.tags = ['main']
handler.command = /^(listjadibot|cekjadibot|listjbot)$/i

export default handler