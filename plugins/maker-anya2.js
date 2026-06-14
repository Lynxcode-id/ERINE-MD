/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx
 * ─────────────────────────
 * 📝 Plugin: Maker Anya Signboard (Sticker Edition)
 */

import { createCanvas, loadImage, GlobalFonts } from '@napi-rs/canvas'
import fetch from 'node-fetch'
import { addExif } from '../lib/sticker.js'
import { Sticker } from 'wa-sticker-formatter'

const ANYA_IMAGE_URL = "https://files.catbox.moe/k4lps7.jpg" 
const FONT_URL = "https://raw.githubusercontent.com/Ditzzx-vibecoder/Assets/main/Brat/Poppins.ttf"

const CANVAS = { width: 1024, height: 1024 }
const SAFE_ZONE = { a: 530, b: 900, c: 200, d: 824 } 
const TEXT_STYLE = {
    fontFamily: "PoppinsAnya",
    maxFontSize: 85,
    minFontSize: 20,
    lineHeight: 1.2,
    color: "#2b2b2b",
    align: "center"
}

async function downloadBuffer(url) {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`Gagal download: ${res.status} ${res.statusText}`)
    return Buffer.from(await res.arrayBuffer())
}

function normalizeText(text) {
    return String(text || "")
        .replace(/\r/g, "")
        .replace(/[ \t]+/g, " ")
        .replace(/\n{3,}/g, "\n\n")
        .trim()
}

function getSafeRect(zone) {
    return {
        x: zone.c,
        y: zone.a,
        w: zone.d - zone.c,
        h: zone.b - zone.a,
        centerX: (zone.c + zone.d) / 2,
        centerY: (zone.a + zone.b) / 2
    }
}

function setFont(ctx, size) {
    ctx.font = `${size}px ${TEXT_STYLE.fontFamily}`
}

function splitLongWord(ctx, word, maxWidth) {
    const chars = [...word]
    const parts = []
    let current = ""

    for (const char of chars) {
        const test = current + char
        if (ctx.measureText(test).width <= maxWidth || !current) {
            current = test
        } else {
            parts.push(current)
            current = char
        }
    }
    if (current) parts.push(current)
    return parts
}

function wrapParagraph(ctx, paragraph, maxWidth) {
    const words = paragraph.split(" ").filter(Boolean)
    const lines = []
    let current = ""

    for (const word of words) {
        const test = current ? `${current} ${word}` : word
        if (ctx.measureText(test).width <= maxWidth) {
            current = test
            continue
        }
        if (current) {
            lines.push(current)
            current = ""
        }
        if (ctx.measureText(word).width <= maxWidth) {
            current = word
        } else {
            const parts = splitLongWord(ctx, word, maxWidth)
            lines.push(...parts.slice(0, -1))
            current = parts.at(-1) || ""
        }
    }
    if (current) lines.push(current)
    return lines
}

function wrapText(ctx, text, maxWidth) {
    return text.split("\n").flatMap((paragraph) => {
        const clean = paragraph.trim()
        if (!clean) return [""]
        return wrapParagraph(ctx, clean, maxWidth)
    })
}

function fitText(ctx, text, rect) {
    for (let size = TEXT_STYLE.maxFontSize; size >= TEXT_STYLE.minFontSize; size--) {
        setFont(ctx, size)
        const lineHeight = Math.ceil(size * TEXT_STYLE.lineHeight)
        const lines = wrapText(ctx, text, rect.w)
        const totalHeight = lines.length * lineHeight

        if (totalHeight <= rect.h) {
            return { size, lines, lineHeight, totalHeight }
        }
    }

    const size = TEXT_STYLE.minFontSize
    setFont(ctx, size)
    const lineHeight = Math.ceil(size * TEXT_STYLE.lineHeight)
    const lines = wrapText(ctx, text, rect.w)
    const maxLines = Math.max(1, Math.floor(rect.h / lineHeight))
    const clipped = lines.slice(0, maxLines)

    if (lines.length > maxLines && clipped.length) {
        let last = clipped[clipped.length - 1]
        while (last.length > 0 && ctx.measureText(`${last}...`).width > rect.w) {
            last = last.slice(0, -1)
        }
        clipped[clipped.length - 1] = `${last}...`
    }

    return { size, lines: clipped, lineHeight, totalHeight: clipped.length * lineHeight }
}

function drawCenteredText(ctx, text, zone) {
    const rect = getSafeRect(zone)
    const fitted = fitText(ctx, text, rect)
    const startY = rect.y + (rect.h - fitted.totalHeight) / 2

    ctx.save()
    ctx.beginPath()
    ctx.rect(rect.x, rect.y, rect.w, rect.h)
    ctx.clip()

    setFont(ctx, fitted.size)
    ctx.fillStyle = TEXT_STYLE.color
    ctx.textAlign = TEXT_STYLE.align
    ctx.textBaseline = "top"

    fitted.lines.forEach((line, index) => {
        const y = startY + index * fitted.lineHeight
        ctx.fillText(line, rect.centerX, y)
    })
    ctx.restore()
}

async function createSticker(img, url, packName, authorName, quality = 70) {
    let stickerMetadata = {
        type: 'full',
        pack: packName,
        author: authorName,
        quality
    }
    return (new Sticker(img ? img : url, stickerMetadata)).toBuffer()
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return m.reply(`⚠️ *Teksnya mana cuy?*\n\nContoh: *${usedPrefix + command} Halo INF Project!*`)

    await m.react('⏳')

    try {
        if (!global.AnyaFontRegistered) {
            const fontBuffer = await downloadBuffer(FONT_URL)
            GlobalFonts.register(fontBuffer, TEXT_STYLE.fontFamily)
            global.AnyaFontRegistered = true
        }

        const imageBuffer = await downloadBuffer(ANYA_IMAGE_URL)
        const image = await loadImage(imageBuffer)
        const canvas = createCanvas(CANVAS.width, CANVAS.height)
        const ctx = canvas.getContext("2d")

        ctx.drawImage(image, 0, 0, CANVAS.width, CANVAS.height)
        
        const inputText = normalizeText(text)
        drawCenteredText(ctx, inputText, SAFE_ZONE)

        const finalBuffer = await canvas.encode("png")

        let packname = global.stickpack || 'INF PROJECT'
        let author = global.stickauth || 'Lynx'
        let stiker = false

        try {
            stiker = await addExif(finalBuffer, packname, author)
        } catch (e) {
            console.error(e)
        } finally {
            if (!stiker) {
                stiker = await createSticker(finalBuffer, false, packname, author)
            }
        }

        if (stiker) {
            await conn.sendMessage(m.chat, { sticker: stiker }, { quoted: m })
            await m.react('✅')
        } else {
            throw new Error('Gagal convert ke webp sticker.')
        }

    } catch (e) {
        console.error(e)
        await m.react('❌')
        m.reply(`❌ *[ERROR]* Gagal bikin stiker njir:\n_${e.message}_`)
    }
}

handler.help = ['anya2 <teks>']
handler.tags = ['maker']
handler.command = /^(anya2)$/i
handler.limit = true

export default handler