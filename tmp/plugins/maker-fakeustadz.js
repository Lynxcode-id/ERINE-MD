/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx Decode
 * ─────────────────────────
 * 📝 Plugin: Fake Ustadz (Canvas Maker)
 */

import { createCanvas, loadImage, GlobalFonts } from "@napi-rs/canvas"
import axios from "axios"

// Load font (Pastikan file font Poppins-Regular.ttf ada di folder ./font/)
try {
    GlobalFonts.registerFromPath("./font/Poppins-Regular.ttf", "Poppins")
} catch (e) {
    console.log('[WARNING] Font Poppins tidak ditemukan di ./font/Poppins-Regular.ttf, menggunakan font sistem.')
}

const TEMPLATE_URL = "https://d.tmpfile.link/public/2026-06-04/83d6c3e3-ffad-4009-a2a9-1d23af15b4ef/IMG-20260604-WA0750.jpg"

function wrapText(ctx, text, maxWidth) {
    const words = text.split(" ")
    const lines = []
    let currentLine = ""

    for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word
        const width = ctx.measureText(testLine).width

        if (width > maxWidth && currentLine) {
            lines.push(currentLine)
            currentLine = word
        } else {
            currentLine = testLine
        }
    }
    if (currentLine) {
        lines.push(currentLine)
    }
    return lines
}

async function fakeustadz(text) {
    const { data } = await axios.get(TEMPLATE_URL, { responseType: "arraybuffer" })

    const img = await loadImage(Buffer.from(data))
    const canvas = createCanvas(img.width, img.height)
    const ctx = canvas.getContext("2d")

    ctx.drawImage(img, 0, 0, img.width, img.height)

    // Setting Area
    const boxX = 93
    const boxY = 171
    const boxWidth = 530
    const boxHeight = 145

    const padding = 25
    const maxWidth = boxWidth - (padding * 2)
    const maxHeight = boxHeight - (padding * 2)

    let fontSize = 50
    let lines = []

    while (fontSize >= 8) {
        ctx.font = `${fontSize}px Poppins, sans-serif`
        lines = wrapText(ctx, text, maxWidth)

        const lineHeight = fontSize * 1.25
        const totalHeight = lines.length * lineHeight

        const widestLine = Math.max(...lines.map(line => ctx.measureText(line).width))

        if (widestLine <= maxWidth && totalHeight <= maxHeight) {
            break
        }
        fontSize--
    }

    ctx.save()
    ctx.beginPath()
    ctx.rect(boxX, boxY, boxWidth, boxHeight)
    ctx.clip()

    ctx.font = `${fontSize}px Poppins, sans-serif`
    ctx.fillStyle = "#111"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"

    const lineHeight = fontSize * 1.25
    const startY = boxY + (boxHeight - (lines.length * lineHeight)) / 2 + (lineHeight / 2)

    for (let i = 0; i < lines.length; i++) {
        ctx.fillText(lines[i], boxX + (boxWidth / 2), startY + (i * lineHeight))
    }

    ctx.restore()
    return await canvas.encode("jpeg")
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return m.reply(`❌ Masukkan teks pertanyaannya!\n\n*Contoh:* ${usedPrefix + command} Apa hukumnya menikahi cewek shorthair?`)

    await m.react('⏳')

    try {
        const buffer = await fakeustadz(text)
        
        let caption = `⚡ *F A K E - U S T A D Z* ⚡\n\n> _Pertanyaan dari ${conn.getName(m.sender)}_`
        
        await conn.sendMessage(m.chat, { 
            image: buffer, 
            caption: caption 
        }, { quoted: m })

        await m.react('✅')
    } catch (e) {
        console.error('[FAKE USTADZ ERROR]', e)
        await m.react('❌')
        m.reply(`⚠️ *System Error:*\nGagal nge-render gambar canvas.`)
    }
}

handler.help = ['fakeustadz2 <teks>']
handler.tags = ['maker']
handler.command = /^(fakeustadz|ustadz2|tanyaustadz2)$/i
handler.limit = true

export default handler