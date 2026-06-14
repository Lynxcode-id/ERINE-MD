/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx Decode
 * 📢 Channel   : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * ─────────────────────────
 * 📝 Plugin : Group Analytics (@napi-rs/canvas Edition - UI FIX)
 */

import moment from 'moment-timezone'
import { createCanvas } from '@napi-rs/canvas'

// 1. AUTO-TRACKER
export async function all(m) {
    if (!m.isGroup) return
    
    const DB = global.db
    if (!DB || !DB.data || !DB.data.chats) return

    let chat = DB.data.chats[m.chat]
    if (!chat) return

    if (!chat.analytics || typeof chat.analytics !== 'object') {
        chat.analytics = {
            total: 0,
            users: {},
            daily: { 'Sen': 0, 'Sel': 0, 'Rab': 0, 'Kam': 0, 'Jum': 0, 'Sab': 0, 'Min': 0 },
            lastReset: Date.now()
        }
    }

    moment.locale('id')
    const today = moment.tz('Asia/Makassar').format('ddd') 

    chat.analytics.total += 1
    chat.analytics.users[m.sender] = (chat.analytics.users[m.sender] || 0) + 1
    
    if (chat.analytics.daily[today] !== undefined) {
        chat.analytics.daily[today] += 1
    }
}

// 2. MAIN HANDLER
let handler = async (m, { conn, usedPrefix, command }) => {
    const DB = global.db
    let chat = DB.data.chats[m.chat]
    
    // AUTO-FIX DB
    if (!chat.analytics || typeof chat.analytics !== 'object') {
        chat.analytics = {
            total: 1,
            users: { [m.sender]: 1 },
            daily: { 'Sen': 0, 'Sel': 0, 'Rab': 0, 'Kam': 0, 'Jum': 0, 'Sab': 0, 'Min': 0 },
            lastReset: Date.now()
        }
        moment.locale('id')
        const today = moment.tz('Asia/Makassar').format('ddd')
        if (chat.analytics.daily[today] !== undefined) chat.analytics.daily[today] += 1
    }

    if (chat.analytics.total === 0) {
        chat.analytics.total = 1
        chat.analytics.users[m.sender] = 1
    }

    await m.react('⏳')

    try {
        const data = chat.analytics
        const meta = await conn.groupMetadata(m.chat).catch(() => ({}))
        const groupName = meta.subject || 'Unknown Group'
        const memberCount = meta.participants?.length || 0
        const talkers = Object.keys(data.users).length

        const sortedUsers = Object.entries(data.users).sort((a, b) => b[1] - a[1])
        const topUserId = sortedUsers[0] ? sortedUsers[0][0] : null
        const topScore = sortedUsers[0] ? sortedUsers[0][1] : 1 // Mencegah bug limit infinity
        
        let topUserPushname = '-'
        if (topUserId) {
            topUserPushname = await conn.getName(topUserId) || topUserId.split('@')[0]
        }

        // ==========================================
        // MULAILAH PROSES MENGGAMBAR CANVAS (800x450)
        // ==========================================
        const canvas = createCanvas(800, 450)
        const ctx = canvas.getContext('2d')

        const roundRect = (x, y, w, h, r, color) => {
            ctx.fillStyle = color
            ctx.beginPath()
            ctx.moveTo(x + r, y)
            ctx.lineTo(x + w - r, y)
            ctx.quadraticCurveTo(x + w, y, x + w, y + r)
            ctx.lineTo(x + w, y + h - r)
            ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
            ctx.lineTo(x + r, y + h)
            ctx.quadraticCurveTo(x, y + h, x, y + h - r)
            ctx.lineTo(x, y + r)
            ctx.quadraticCurveTo(x, y, x + r, y)
            ctx.closePath()
            ctx.fill()
        }

        // 1. Background Gradient 
        const grd = ctx.createLinearGradient(0, 0, 800, 450)
        grd.addColorStop(0, '#7f1d1d') 
        grd.addColorStop(1, '#450a0a') 
        ctx.fillStyle = grd
        ctx.fillRect(0, 0, 800, 450)

        // 2. Title Header
        ctx.fillStyle = '#ffffff'
        ctx.textBaseline = 'alphabetic'
        ctx.font = 'bold 32px sans-serif'
        ctx.fillText('GROUP ANALYTICS', 40, 50)
        ctx.font = '16px sans-serif'
        ctx.fillStyle = '#fca5a5'
        ctx.fillText(`> ${groupName.toUpperCase()}`, 40, 75)

        // 3. Badge Live Statistics Pojok Kanan Atas (DIPERBAIKI)
        const badgeX = 610
        const badgeY = 35
        const badgeW = 150
        const badgeH = 30
        roundRect(badgeX, badgeY, badgeW, badgeH, badgeH / 2, '#ffffff') 
        
        ctx.beginPath()
        ctx.arc(badgeX + 20, badgeY + (badgeH / 2), 5, 0, Math.PI * 2)
        ctx.fillStyle = '#dc2626'
        ctx.fill()
        
        ctx.fillStyle = '#991b1b'
        ctx.font = 'bold 14px sans-serif'
        ctx.textBaseline = 'middle' // Bikin teks di tengah-tengah vertikal
        ctx.fillText('Live Statistics', badgeX + 35, badgeY + (badgeH / 2))
        ctx.textBaseline = 'alphabetic' // Balikin ke normal

        // 4. Empat Kotak Stat di Atas
        const boxY = 100
        const labels = ['MESSAGES', 'TALKERS', 'MEMBERS', 'TOP USER']
        const values = [data.total.toString(), talkers.toString(), memberCount.toString(), topUserPushname.substring(0, 10)]

        for (let i = 0; i < 4; i++) {
            roundRect(40 + (i * 185), boxY, 165, 80, 10, '#ffffff')
            ctx.fillStyle = '#991b1b'
            ctx.font = 'bold 12px sans-serif'
            ctx.fillText(labels[i], 55 + (i * 185), boxY + 25)
            ctx.fillStyle = '#000000'
            ctx.font = 'bold 24px sans-serif'
            ctx.fillText(values[i], 55 + (i * 185), boxY + 60)
        }

        // 5. Box Chart (Kiri Bawah)
        roundRect(40, 200, 450, 210, 15, '#ffffff')
        ctx.fillStyle = '#991b1b'
        ctx.font = 'bold 20px sans-serif'
        ctx.fillText('Chat Activity', 60, 235)
        ctx.fillStyle = '#64748b'
        ctx.font = '12px sans-serif'
        ctx.fillText('Aktivitas chat mingguan', 60, 255)

        const days = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min']
        const chartData = days.map(d => data.daily[d] || 0)
        const maxVal = Math.max(...chartData, 5) 
        const chartW = 390
        const chartH = 80
        const startX = 70
        const startY = 360

        // Garis Dasar
        ctx.strokeStyle = '#e2e8f0'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(startX - 10, startY + 5)
        ctx.lineTo(startX + chartW + 10, startY + 5)
        ctx.stroke()

        // Garis Grafik
        ctx.strokeStyle = '#dc2626'
        ctx.lineWidth = 3
        ctx.lineJoin = 'round'
        ctx.beginPath()
        const stepX = chartW / 6
        chartData.forEach((val, i) => {
            const x = startX + (i * stepX)
            const y = startY - ((val / maxVal) * chartH)
            if (i === 0) ctx.moveTo(x, y)
            else ctx.lineTo(x, y)
        })
        ctx.stroke()

        // Titik dan Angka Grafik
        ctx.textAlign = 'center'
        chartData.forEach((val, i) => {
            const x = startX + (i * stepX)
            const y = startY - ((val / maxVal) * chartH)
            
            ctx.fillStyle = '#dc2626'
            ctx.beginPath()
            ctx.arc(x, y, 6, 0, Math.PI * 2)
            ctx.fill()
            ctx.fillStyle = '#ffffff'
            ctx.beginPath()
            ctx.arc(x, y, 3, 0, Math.PI * 2)
            ctx.fill()

            ctx.fillStyle = '#dc2626'
            ctx.font = 'bold 12px sans-serif'
            ctx.fillText(val.toString(), x, y - 10)
            
            ctx.fillStyle = '#64748b'
            ctx.fillText(days[i], x, startY + 25)
        })
        ctx.textAlign = 'left'

        // 6. Box Top Yappers (Kanan Bawah)
        roundRect(510, 200, 250, 210, 15, '#ffffff')
        ctx.fillStyle = '#991b1b'
        ctx.font = 'bold 20px sans-serif'
        ctx.fillText('Top GC Yappers', 530, 235)
        ctx.fillStyle = '#64748b'
        ctx.font = '12px sans-serif'
        ctx.fillText('Ranking member paling aktif', 530, 255)

        // ==========================================
        // RENDER PROGRESS BAR (DIPERBAIKI TOTAL)
        // ==========================================
        let topY = 285 // Titik tengah (Y) buat bar pertama
        const barX = 525
        const barW = 220
        const barH = 24
        const barR = barH / 2 // Ujung bulat sempurna
        
        const medalColors = ['#eab308', '#94a3b8', '#b45309', '#64748b', '#64748b'] // Emas, Perak, Perunggu, Abu2

        for (let i = 0; i < 5; i++) {
            const user = sortedUsers[i]
            let name = '-'
            if (user) {
                name = await conn.getName(user[0]) || user[0].split('@')[0]
            }
            const countText = user ? `${user[1]} chat` : `0 chat`

            // 1. Background Bar Pink Pudar
            roundRect(barX, topY - (barH / 2), barW, barH, barR, '#fecaca')

            // 2. Fill Bar Merah (Anti-Overflow Math.min)
            let fillWidth = 0
            if (user && user[1] > 0) {
                fillWidth = (user[1] / topScore) * barW
                fillWidth = Math.max(fillWidth, barH) // Minimal seukuran buletan (24px)
                fillWidth = Math.min(fillWidth, barW) // Maksimal sepanjang bar (220px)
                roundRect(barX, topY - (barH / 2), fillWidth, barH, barR, '#dc2626')
            }

            // 3. Medali Buletan Kiri
            ctx.fillStyle = medalColors[i]
            ctx.beginPath()
            ctx.arc(barX + 14, topY, 8, 0, Math.PI * 2)
            ctx.fill()
            
            // Angka dalem medali
            ctx.fillStyle = '#ffffff'
            ctx.font = 'bold 10px sans-serif'
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'
            ctx.fillText((i + 1).toString(), barX + 14, topY)

            // 4. Teks Nama & Chat (Dynamic Color)
            let nameColor = fillWidth > 45 ? '#ffffff' : '#1e293b'
            let countColor = fillWidth > (barW - 30) ? '#ffffff' : '#991b1b'

            ctx.textAlign = 'left'
            ctx.fillStyle = nameColor
            ctx.font = 'bold 11px sans-serif'
            ctx.fillText(name.substring(0, 15), barX + 32, topY)
            
            ctx.textAlign = 'right'
            ctx.fillStyle = countColor
            ctx.fillText(countText, barX + barW - 12, topY)

            // Reset baseline buat aman
            ctx.textAlign = 'left'
            ctx.textBaseline = 'alphabetic'
            topY += 32
        }

        // 7. Watermark Bawah
        ctx.fillStyle = '#fca5a5'
        ctx.font = '10px sans-serif'
        ctx.textAlign = 'center'
        let wktuwib = moment.tz('Asia/Makassar').format('HH:mm:ss')
        let date = moment.tz('Asia/Makassar').format('DD/MM/YYYY')
        ctx.fillText(`Generated by Erine MD • ${date}, ${wktuwib}`, 400, 435)

        // EKSTRAK BUFFER
        const finalBuffer = await canvas.encode('png')

        // ==========================================
        // RENDER CAPTION STYLE ERINE MD
        // ==========================================
        let caption = `┌˚₊ ๑│ ɢ ʀ ᴏ ᴜ ᴘ  ᴀ ɴ ᴀ ʟ ʏ ᴛ ɪ ᴄ s │๑˚₊ 📊
┇ 
│ 👥 *Grup:* ${groupName}
│ 🗣️ *Member Aktif:* ${talkers} / ${memberCount}
│ ✉️ *Total Pesan:* ${data.total}
│ 👑 *Top Yapper:* ${topUserPushname}
┇ 
└˚₊ ๑ ────────────── ๑˚₊
> © ERINE-AI`

        await conn.sendMessage(m.chat, {
            image: finalBuffer,
            caption: caption,
            mentions: sortedUsers.slice(0, 5).map(u => u[0])
        }, { quoted: m })

        await m.react('✅')

    } catch (e) {
        console.error(e)
        await m.react('❌')
        m.reply(`┌˚₊ ๑│ s ʏ s ᴛ ᴇ ᴍ  ᴇ ʀ ʀ ᴏ ʀ │๑˚₊ ❌\n┇ Gagal memproses data analitik:\n┇ ${e.message || e}\n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`)
    }
}

handler.help = ['analisisgc', 'topchatgc']
handler.tags = ['group']
handler.command = /^(analisisgc|statsgc2|topchatgc|topyapping2)$/i
handler.group = true

export default handler