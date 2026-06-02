/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx
 * ─────────────────────────
 * 📝 Plugin: Maker Brat Vermile (Animated Sticker Edition)
 */

import { createCanvas, loadImage, GlobalFonts } from '@napi-rs/canvas'
import fetch from 'node-fetch'
import fs from 'fs'
import fsp from 'fs/promises'
import path from 'path'
import os from 'os'
import { execFile } from 'child_process'
import { promisify } from 'util'
import { addExif } from '../lib/sticker.js'
import { Sticker } from 'wa-sticker-formatter'

const execFileAsync = promisify(execFile)

const BRAT_IMAGE_URL = "https://raw.githubusercontent.com/Ditzzx-vibecoder/Assets/main/Brat/Vermile.jpg"
const BRAT_FONT_URL = "https://raw.githubusercontent.com/Ditzzx-vibecoder/Assets/main/Brat/Poppins.ttf"

const CANVAS = { width: 512, height: 512 }
// Safe zone disesuaikan dari 1254x1254 ke rasio 512x512
const SAFE_ZONE = { a: 268, b: 457, c: 115, d: 405 } 
const TEXT_STYLE = {
    fontFamily: "PoppinsBratVermileVidSticker",
    maxFontSize: 40,
    minFontSize: 12,
    lineHeight: 1.18,
    color: "#111111",
    align: "center"
}

const VIDEO_CONFIG = {
    outputFormat: "mp4",
    fast_progress: true,
    fps: 15,
    width: 512,
    height: 512,
    lyric: {
        maxWordPerLayer: 3,
        frameDuration: 0.7,
        lastFrameDuration: 1.5
    }
}

async function downloadBuffer(url) {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`Gagal download: ${res.status} ${res.statusText}`)
    return Buffer.from(await res.arrayBuffer())
}

function normalizeText(text) {
    return String(text || "").replace(/\r/g, "").replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim()
}

function tokenize(text) {
    return normalizeText(text).replace(/[,，]/g, " ").split(/\s+/).map((v) => v.trim()).filter(Boolean)
}

function splitIntoLayers(tokens, maxWordPerLayer) {
    if (!Number.isFinite(maxWordPerLayer) || maxWordPerLayer <= 0) return [tokens]
    const layers = []
    for (let i = 0; i < tokens.length; i += maxWordPerLayer) {
        layers.push(tokens.slice(i, i + maxWordPerLayer))
    }
    return layers
}

function resolveDurations(frames, lyric) {
    return frames.map((frame) => frame.isLastInLayer ? Math.max(0.05, lyric.lastFrameDuration) : Math.max(0.05, lyric.frameDuration))
}

function buildRevealFrames(text, config) {
    const tokens = tokenize(text)
    const layers = splitIntoLayers(tokens, config.lyric.maxWordPerLayer)
    const frames = []

    for (const layer of layers) {
        let current = ""
        for (let i = 0; i < layer.length; i++) {
            current += (current ? " " : "") + layer[i]
            frames.push({ text: current, isLastInLayer: i === layer.length - 1 })
        }
    }
    const durations = resolveDurations(frames, config.lyric)
    return frames.map((frame, index) => ({ ...frame, duration: durations[index] }))
}

function getSafeRect(zone) {
    return {
        x: zone.c, y: zone.a, w: zone.d - zone.c, h: zone.b - zone.a,
        centerX: (zone.c + zone.d) / 2, centerY: (zone.a + zone.b) / 2
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
            current = test; continue
        }
        if (current) {
            lines.push(current); current = ""
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
        return clean ? wrapParagraph(ctx, clean, maxWidth) : [""]
    })
}

function fitText(ctx, text, rect) {
    for (let size = TEXT_STYLE.maxFontSize; size >= TEXT_STYLE.minFontSize; size--) {
        setFont(ctx, size)
        const lineHeight = Math.ceil(size * TEXT_STYLE.lineHeight)
        const lines = wrapText(ctx, text, rect.w)
        const totalHeight = lines.length * lineHeight
        if (totalHeight <= rect.h) return { size, lines, lineHeight, totalHeight }
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
    for (let i = 0; i < fitted.lines.length; i++) {
        ctx.fillText(fitted.lines[i], rect.centerX, startY + i * fitted.lineHeight)
    }
    ctx.restore()
}

async function createFrame(image, text, filePath) {
    const canvas = createCanvas(CANVAS.width, CANVAS.height)
    const ctx = canvas.getContext("2d")
    ctx.drawImage(image, 0, 0, CANVAS.width, CANVAS.height)
    drawCenteredText(ctx, text, SAFE_ZONE)
    fs.writeFileSync(filePath, await canvas.encode("png"))
}

function escapeConcatPath(filePath) {
    return filePath.replace(/'/g, "'\\''")
}

function buildManifest(frames, framePaths) {
    const lines = []
    for (let i = 0; i < frames.length; i++) {
        lines.push(`file '${escapeConcatPath(framePaths[i])}'`)
        lines.push(`duration ${frames[i].duration}`)
    }
    lines.push(`file '${escapeConcatPath(framePaths[framePaths.length - 1])}'`)
    return lines.join("\n")
}

async function encodeVideo(concatPath, outputPath, config) {
    const args = [
        "-y", "-f", "concat", "-safe", "0", "-i", concatPath,
        "-vf", `fps=${config.fps},scale=${config.width}:${config.height}:flags=lanczos`,
        "-c:v", "libx264", "-preset", "ultrafast", "-crf", "28",
        "-pix_fmt", "yuv420p", outputPath
    ]
    await execFileAsync("ffmpeg", args, { maxBuffer: 1024 * 1024 * 10 })
}

async function createSticker(img, url, packName, authorName, quality = 50) {
    let stickerMetadata = { type: 'full', pack: packName, author: authorName, quality }
    return (new Sticker(img ? img : url, stickerMetadata)).toBuffer()
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return m.reply(`⚠️ *Teksnya mana cuy?*\n\nContoh: *${usedPrefix + command} Halo semuanya*`)

    await m.react('⏳')
    let tmpDir

    try {
        if (!global.BratVermileVidFontRegSticker) {
            const fontBuffer = await downloadBuffer(BRAT_FONT_URL)
            GlobalFonts.register(fontBuffer, TEXT_STYLE.fontFamily)
            global.BratVermileVidFontRegSticker = true
        }

        const frames = buildRevealFrames(text, VIDEO_CONFIG)
        if (!frames.length) throw new Error("Teks kosong cuy.")

        tmpDir = await fsp.mkdtemp(path.join(os.tmpdir(), "vermile-bratvid-"))
        const outputPath = path.join(tmpDir, `output-${Date.now()}.mp4`)

        const imageBuffer = await downloadBuffer(BRAT_IMAGE_URL)
        const image = await loadImage(imageBuffer)

        const framePaths = frames.map((_, index) => path.join(tmpDir, `frame-${String(index + 1).padStart(4, "0")}.png`))

        if (VIDEO_CONFIG.fast_progress) {
            const batchSize = 5
            for (let start = 0; start < frames.length; start += batchSize) {
                const batch = frames.slice(start, start + batchSize)
                await Promise.all(batch.map((frame, i) => createFrame(image, frame.text, framePaths[start + i])))
            }
        } else {
            for (let i = 0; i < frames.length; i++) {
                await createFrame(image, frames[i].text, framePaths[i])
            }
        }

        const concatPath = path.join(tmpDir, "concat.txt")
        fs.writeFileSync(concatPath, buildManifest(frames, framePaths))

        await encodeVideo(concatPath, outputPath, VIDEO_CONFIG)

        const videoBuffer = await fsp.readFile(outputPath)
        
        let packname = global.stickpack || 'INF PROJECT'
        let author = global.stickauth || 'Lynx'
        let stiker = false

        try {
            stiker = await addExif(videoBuffer, packname, author)
        } catch (e) {
            console.error(e)
        } finally {
            if (!stiker) {
                stiker = await createSticker(videoBuffer, false, packname, author)
            }
        }

        if (stiker) {
            await conn.sendMessage(m.chat, { sticker: stiker }, { quoted: m })
            await m.react('✅')
        } else {
            throw new Error('Gagal convert video ke animated sticker.')
        }

    } catch (e) {
        console.error(e)
        await m.react('❌')
        m.reply(`❌ *[ERROR]* Gagal bikin stiker video njir:\n_${e.message}_`)
    } finally {
        if (tmpDir) {
            await fsp.rm(tmpDir, { recursive: true, force: true }).catch(() => {})
        }
    }
}

handler.help = ['bratvidvermile <teks>']
handler.tags = ['maker']
handler.command = /^(bratvidvermile|vermilebratvid)$/i
handler.limit = true

export default handler