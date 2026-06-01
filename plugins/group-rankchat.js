/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx Decode
 * ─────────────────────────
 * 📝 Plugin: Group Chat Rank (Canvas UI)
 */

import { createCanvas } from '@napi-rs/canvas'

// Normalisasi JID, biarin LID lolos biar chat tetep kehitung
const normalizeJid = (jid) => {
    if (!jid) return ''
    let fixed = String(jid).trim().replace(/:\d+@/g, '@')
    if (/^\d+$/.test(fixed)) return fixed + '@s.whatsapp.net'
    return fixed
}

const jidToNumber = (jid) => {
    return normalizeJid(jid).replace(/[^0-9]/g, '')
}

// Bikin roundRect buat ngelukis card & progress bar
const roundRect = (ctx, x, y, width, height, radius, fill, stroke) => {
    ctx.beginPath()
    ctx.moveTo(x + radius, y)
    ctx.lineTo(x + width - radius, y)
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
    ctx.lineTo(x + width, y + height - radius)
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
    ctx.lineTo(x + radius, y + height)
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
    ctx.lineTo(x, y + radius)
    ctx.quadraticCurveTo(x, y, x + radius, y)
    ctx.closePath()
    if (fill) ctx.fill()
    if (stroke) ctx.stroke()
}

// Inisialisasi DB aman
const safeDbInit = () => {
    if (!global.db) global.db = {}
    if (!global.db.data) global.db.data = {}
    if (!global.db.data.users) global.db.data.users = {}
    if (!global.db.data.chats) global.db.data.chats = {}
}

const getMessageStore = (conn, chatJid) => {
    try {
        if (conn?.chats?.[chatJid]?.messages) return conn.chats[chatJid].messages
    } catch { }
    try {
        if (global.db?.data?.chats?.[chatJid]?.messages) return global.db.data.chats[chatJid].messages
    } catch { }
    return {}
}

const buildCounts = (messages, participants) => {
    const counts = Object.create(null)
    const values = messages ? Object.values(messages) : []
    
    for (const msg of values) {
        const key = msg?.key
        if (!key) continue
        
        let sender = normalizeJid(key.participant || key.remoteJid || '')
        if (!sender) continue 
        
        counts[sender] = (counts[sender] || 0) + 1
    }
    
    for (const jid of participants) {
        const fixed = normalizeJid(jid)
        if (fixed && counts[fixed] == null) counts[fixed] = 0
    }
    return counts
}

let handler = async (m, { conn }) => {
    if (!m.isGroup) return
    safeDbInit()

    try { await m.react('📊') } catch { }

    const metadata = await conn.groupMetadata(m.chat).catch(() => null)
    if (!metadata) return m.reply('❌ Gagal ngambil data grup njir.')

    const participantJids = (metadata.participants || [])
        .map(p => normalizeJid(p.id || p.jid))
        .filter(Boolean)

    const messages = getMessageStore(conn, m.chat)
    const counts = buildCounts(messages, participantJids)

    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1])

    const top8 = sorted.slice(0, 8)
    const totalMessages = sorted.reduce((acc, item) => acc + item[1], 0)
    
    if (top8.length === 0 || totalMessages === 0) {
        return m.reply('⚠️ Belum ada data chat yang kesimpen di database bot untuk grup ini.')
    }

    const myJid = normalizeJid(m.sender)
    const myCount = counts[myJid] || 0
    const highestCount = top8[0][1]

    // --- SETUP CANVAS ---
    const canvasWidth = 1080
    const canvasHeight = 1000
    const canvas = createCanvas(canvasWidth, canvasHeight)
    const ctx = canvas.getContext('2d')

    // BG Cyberpunk Dark Blue
    const bg = ctx.createLinearGradient(0, 0, 0, canvasHeight)
    bg.addColorStop(0, '#060B14')
    bg.addColorStop(0.5, '#0B1423')
    bg.addColorStop(1, '#060B14')
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, canvasWidth, canvasHeight)

    // Glow atas
    const glow = ctx.createRadialGradient(canvasWidth / 2, 0, 50, canvasWidth / 2, 0, 800)
    glow.addColorStop(0, 'rgba(0, 255, 255, 0.15)')
    glow.addColorStop(1, 'rgba(0, 255, 255, 0)')
    ctx.fillStyle = glow
    ctx.fillRect(0, 0, canvasWidth, canvasHeight)

    // Title
    ctx.save()
    ctx.shadowBlur = 20
    ctx.shadowColor = '#00ffff'
    ctx.font = 'bold 58px sans-serif'
    ctx.fillStyle = '#00ffff'
    ctx.textAlign = 'center'
    ctx.fillText('LEADERBOARD GRUP', canvasWidth / 2, 90)
    ctx.restore()

    ctx.font = '24px sans-serif'
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'
    ctx.textAlign = 'center'
    ctx.fillText(`Total chat terbaca: ${totalMessages.toLocaleString()} pesan`, canvasWidth / 2, 135)

    // Setup Render List
    const startY = 190
    const rowHeight = 85
    const gap = 15

    let rankListCaption = []

    for (let i = 0; i < top8.length; i++) {
        const [jid, count] = top8[i]
        const rank = i + 1
        const rowY = startY + (i * (rowHeight + gap))
        
        let cardColor = 'rgba(20, 30, 45, 0.8)'
        let strokeColor = 'rgba(0, 255, 255, 0.2)'
        let rankColor = '#ffffff'
        
        if (rank === 1) { cardColor = 'rgba(0, 255, 255, 0.1)'; strokeColor = '#00ffff'; rankColor = '#00ffff'; }
        else if (rank === 2) { cardColor = 'rgba(0, 255, 255, 0.06)'; strokeColor = 'rgba(0, 255, 255, 0.6)'; rankColor = '#90e0ef'; }
        else if (rank === 3) { cardColor = 'rgba(0, 255, 255, 0.03)'; strokeColor = 'rgba(0, 255, 255, 0.3)'; rankColor = '#caf0f8'; }

        // Render Background Card
        ctx.save()
        ctx.fillStyle = cardColor
        ctx.strokeStyle = strokeColor
        ctx.lineWidth = 2
        roundRect(ctx, 60, rowY, canvasWidth - 120, rowHeight, 15, true, true)
        ctx.restore()

        // Render Rank Badge Circle
        ctx.fillStyle = strokeColor
        ctx.beginPath()
        ctx.arc(110, rowY + (rowHeight/2), 25, 0, Math.PI * 2)
        ctx.fill()
        
        ctx.font = 'bold 24px sans-serif'
        ctx.fillStyle = rank === 1 ? '#000000' : '#ffffff'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(`#${rank}`, 110, rowY + (rowHeight/2))

        // Get Name / Number (Handle LID Logic)
        let pushname = conn.getName ? conn.getName(jid) : ''
        
        if (!pushname || pushname === jid || pushname.includes('@lid')) {
            pushname = global.db?.data?.users?.[jid]?.name || ''
        }

        let displayName = pushname
        if (!displayName || displayName === jid || displayName.includes('@lid')) {
            displayName = jid.includes('@lid') ? 'Grup Member' : `+${jidToNumber(jid)}`
        }

        rankListCaption.push(`*${rank}.* ${displayName} ➪ ${count.toLocaleString()} msg`)

        // Render Name - FIX: Kordinat Y dinaikin & baseline di set top biar ga nabrak bar
        ctx.font = 'bold 28px sans-serif'
        ctx.fillStyle = rankColor
        ctx.textAlign = 'left'
        ctx.textBaseline = 'top' // PENTING: Biar text mulai dari atas
        ctx.fillText(displayName, 160, rowY + 22, 550)

        // Render Count
        ctx.font = 'bold 24px sans-serif'
        ctx.fillStyle = '#ffffff'
        ctx.textAlign = 'right'
        ctx.textBaseline = 'middle' 
        ctx.fillText(`${count.toLocaleString()} msg`, canvasWidth - 90, rowY + (rowHeight/2))

        // Render Bar Ratio - FIX: Kordinat Y diturunin biar aman di bawah teks nama
        const barMaxWidth = canvasWidth - 420
        const barWidth = Math.max(10, (count / highestCount) * barMaxWidth)
        
        ctx.fillStyle = 'rgba(255,255,255, 0.1)'
        roundRect(ctx, 160, rowY + 60, barMaxWidth, 8, 4, true, false) // Y di-set ke 60
        
        ctx.fillStyle = strokeColor
        roundRect(ctx, 160, rowY + 60, barWidth, 8, 4, true, false) // Y di-set ke 60
    }

    // --- CAPTION TEXT ---
    const mentions = top8.map(item => item[0])
    let caption = `📊 *RANKING CHAT GRUP*\n\n`
    caption += rankListCaption.join('\n')

    caption += `\n───────────────────\n`
    caption += `🔹 *Total Chat Grup:* ${totalMessages.toLocaleString()}\n`
    caption += `🔹 *Chat Kamu:* ${myCount.toLocaleString()} msg\n\n`
    caption += `> © INF PROJECT`

    await conn.sendMessage(m.chat, {
        image: canvas.toBuffer('image/png'),
        caption: caption,
        mentions: mentions
    }, { quoted: m })

    await m.react('✅')
}

handler.help = ['rankchat', 'totalpesan']
handler.tags = ['group']
handler.command = /^(rankchat|totalpesan)$/i
handler.group = true
handler.limit = true

export default handler