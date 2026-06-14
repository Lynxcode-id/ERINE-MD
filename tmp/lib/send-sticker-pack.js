import fs from 'fs'
import os from 'os'
import path from 'path'
import { spawn } from 'child_process'

const sleep = ms => new Promise(r => setTimeout(r, ms))

function tmpFile(ext = '') {
    return path.join(
        os.tmpdir(),
        `erine_${Date.now()}_${Math.random().toString(16).slice(2)}${ext}`
    )
}

function isValidWebp(buffer) {
    return (
        Buffer.isBuffer(buffer) &&
        buffer.length >= 12 &&
        buffer.slice(0, 4).toString('ascii') === 'RIFF' &&
        buffer.slice(8, 12).toString('ascii') === 'WEBP'
    )
}

function createExif(options = {}) {
    const packname = options.packname ?? options.name ?? 'Sticker Pack'
    const author = options.author ?? options.publisher ?? 'Erine'
    const packId = options.packId ?? `com.erine.${Date.now()}`
    const emojis = options.emojis ?? ['❤']

    const json = {
        'sticker-pack-id': packId,
        'sticker-pack-name': packname,
        'sticker-pack-publisher': author,
        emojis,
        'is-avatar-sticker': 0,
        'android-app-store-link': '',
        'ios-app-store-link': ''
    }

    const exifAttr = Buffer.from([
        0x49, 0x49, 0x2A, 0x00,
        0x08, 0x00, 0x00, 0x00,
        0x01, 0x00, 0x41, 0x57,
        0x07, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x16, 0x00,
        0x00, 0x00
    ])

    const jsonBuffer = Buffer.from(JSON.stringify(json), 'utf8')
    const exif = Buffer.concat([exifAttr, jsonBuffer])
    exif.writeUIntLE(jsonBuffer.length, 14, 4)
    return exif
}

function addExifToWebpFallback(webpBuffer, options = {}) {
    const exif = createExif(options)
    const exifChunkId = Buffer.from('EXIF')
    const exifSize = Buffer.alloc(4)
    exifSize.writeUInt32LE(exif.length)

    const exifIndex = webpBuffer.indexOf(Buffer.from('EXIF'))

    if (exifIndex !== -1) {
        const oldExifSize = webpBuffer.readUInt32LE(exifIndex + 4)
        const padding = oldExifSize % 2 === 1 ? 1 : 0

        const beforeExif = webpBuffer.slice(0, exifIndex)
        const afterExif = webpBuffer.slice(exifIndex + 8 + oldExifSize + padding)

        const newPadding = exif.length % 2 === 1 ? Buffer.from([0x00]) : Buffer.alloc(0)
        const newWebp = Buffer.concat([beforeExif, exifChunkId, exifSize, exif, newPadding, afterExif])

        newWebp.writeUInt32LE(newWebp.length - 8, 4)
        return newWebp
    }

    const riffHeader = webpBuffer.slice(0, 4)
    const webpSignature = webpBuffer.slice(8, 12)
    const webpData = webpBuffer.slice(12)
    const padding = exif.length % 2 === 1 ? Buffer.from([0x00]) : Buffer.alloc(0)

    const newWebpData = Buffer.concat([webpData, exifChunkId, exifSize, exif, padding])
    const newFileSize = Buffer.alloc(4)
    newFileSize.writeUInt32LE(4 + newWebpData.length)

    return Buffer.concat([riffHeader, newFileSize, webpSignature, newWebpData])
}

async function convertToWebp(buffer) {
    return new Promise((resolve, reject) => {
        const input = tmpFile('.png')
        const output = tmpFile('.webp')

        fs.writeFileSync(input, buffer)

        const ff = spawn('ffmpeg', [
            '-i', input,
            '-vcodec', 'libwebp',
            '-vf', 'scale=512:512:flags=lanczos:force_original_aspect_ratio=decrease,format=rgba,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=#00000000',
            '-lossless', '0',
            '-loop', '0',
            '-preset', 'default',
            '-an',
            '-vsync', '0',
            '-y',
            output
        ])

        ff.on('close', code => {
            try {
                if (fs.existsSync(input)) fs.unlinkSync(input)
                if (code !== 0) {
                    if (fs.existsSync(output)) fs.unlinkSync(output)
                    return reject(new Error('FFmpeg gagal convert ke WebP'))
                }

                const webpBuffer = fs.readFileSync(output)
                if (fs.existsSync(output)) fs.unlinkSync(output)
                resolve(webpBuffer)
            } catch (e) {
                reject(e)
            }
        })

        ff.on('error', err => {
            try {
                if (fs.existsSync(input)) fs.unlinkSync(input)
                if (fs.existsSync(output)) fs.unlinkSync(output)
            } catch {}
            reject(err)
        })
    })
}

async function toStickerBuffer(buffer, options = {}) {
    if (!Buffer.isBuffer(buffer)) buffer = Buffer.from(buffer)

    let webpBuffer
    if (isValidWebp(buffer)) {
        webpBuffer = buffer
    } else {
        webpBuffer = await convertToWebp(buffer)
    }

    return addExifToWebpFallback(webpBuffer, options)
}

function pickSendMessage(conn) {
    if (typeof conn?.sendMessage === 'function') return conn.sendMessage.bind(conn)
    if (typeof conn?.ws?.sendMessage === 'function') return conn.ws.sendMessage.bind(conn.ws)
    if (typeof conn?.sock?.sendMessage === 'function') return conn.sock.sendMessage.bind(conn.sock)
    throw new Error('sendMessage tidak ditemukan di koneksi')
}

export async function sendStickerPack(conn, chat, stickerBuffers = [], quoted = null, options = {}) {
    if (!Array.isArray(stickerBuffers) || !stickerBuffers.length) {
        throw new Error('stickerBuffers kosong')
    }

    const sendMessage = pickSendMessage(conn)
    const meta = {
        packname: options.packname || options.name || 'Sticker Pack',
        author: options.author || options.publisher || 'Erine',
        packId: options.packId || `com.erine.${Date.now()}`,
        emojis: options.emojis || ['❤'],
        delay: Number.isFinite(options.delay) ? options.delay : 350
    }

    let sent = 0
    let failed = 0

    for (const item of stickerBuffers) {
        try {
            const webp = await toStickerBuffer(item, meta)

            await sendMessage(
                chat,
                {
                    sticker: webp,
                    contextInfo: {
                        isForwarded: true,
                        forwardingScore: 1
                    }
                },
                quoted ? { quoted } : {}
            )

            sent++
            if (meta.delay > 0) await sleep(meta.delay)
        } catch {
            failed++
        }
    }

    return { sent, failed }
}