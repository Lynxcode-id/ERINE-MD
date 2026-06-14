/**
 * 【 Artyde Photo To Sketch 】
 * 📝 Adaptasi  : LYNX DECODE (Erine-MD)
 * ───────────────────────
 */

import { readFile } from 'node:fs/promises'
import path from 'node:path'

const BASE = 'https://artyde.com'
const PAGE = `${BASE}/photo_to_sketch`
const UPLOAD_URL = `${BASE}/upload_photoToSketch_website`
const UA = 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Mobile Safari/537.36'

const MIME = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.gif': 'image/gif',
    '.bmp': 'image/bmp'
}

const sleep = ms => new Promise(r => setTimeout(r, ms))
const isUrl = v => /^https?:\/\//i.test(v || '')

function getHeaders(extra = {}) {
    return {
        'user-agent': UA,
        'accept': '*/*',
        'origin': BASE,
        'referer': PAGE,
        ...extra
    }
}

function getMime(ext = '') {
    return MIME[ext.toLowerCase()] || 'image/jpeg'
}

function buildOutputName(fileId = '') {
    return String(fileId).replace(/\.[^.]+$/, '.png')
}

function buildOutputUrl(fileId = '') {
    return `${BASE}/output/${buildOutputName(fileId)}`
}

async function loadImage(input, options = {}) {
    if (Buffer.isBuffer(input)) {
        return {
            buffer: input,
            filename: options.fileName || 'image.jpg',
            ext: '.jpg',
            contentType: options.mimeType || 'image/jpeg'
        }
    }

    if (isUrl(input)) {
        const res = await fetch(input, {
            headers: { 'user-agent': UA, 'accept': '*/*' }
        })

        if (!res.ok) throw new Error(`Gagal fetch image: ${res.status}`)

        const buffer = Buffer.from(await res.arrayBuffer())
        const url = new URL(input)
        const rawName = path.basename(url.pathname) || 'image.jpg'
        const filename = decodeURIComponent(rawName)
        const ext = path.extname(filename) || '.jpg'
        const contentType = (res.headers.get('content-type') || getMime(ext)).split(';')[0]

        return { buffer, filename, ext, contentType }
    }

    const buffer = await readFile(input)
    const filename = path.basename(input)
    const ext = path.extname(filename) || '.jpg'

    return { buffer, filename, ext, contentType: getMime(ext) }
}

async function uploadPhoto(image, options = {}) {
    const uploadFields = options.uploadField
        ? [options.uploadField]
        : ['file', 'image', 'img', 'photo', 'source_image', 'upload']

    let lastError = null

    for (const field of uploadFields) {
        try {
            const form = new FormData()
            const blob = new Blob([image.buffer], { type: image.contentType })
            form.append(field, blob, image.filename)

            const res = await fetch(UPLOAD_URL, {
                method: 'POST',
                headers: getHeaders(),
                body: form
            })

            const json = await res.json().catch(() => ({}))

            if (res.ok && json?.status === 'success' && json?.file_id) {
                return {
                    upload_field: field,
                    file_id: json.file_id,
                    filename: json.filename,
                    token: json.token || null,
                    queue: json.queue ?? null,
                    raw: json
                }
            }

            lastError = new Error(`Upload gagal pada field=${field}`)
        } catch (err) {
            lastError = err
        }
    }

    throw lastError || new Error('Upload gagal total')
}

async function checkOutput(outputUrl) {
    const res = await fetch(outputUrl, {
        method: 'GET',
        headers: {
            'user-agent': UA,
            'accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'referer': BASE + '/'
        }
    })

    if (res.ok) {
        return {
            ok: true,
            status: res.status,
            content_type: res.headers.get('content-type') || null,
            content_length: res.headers.get('content-length') || null
        }
    }

    return { ok: false, status: res.status }
}

async function waitForResult(fileId, options = {}) {
    const interval = Number(options.interval || 3000)
    const maxAttempts = Number(options.maxAttempts || 25)
    const outputUrl = buildOutputUrl(fileId)

    let last = null

    for (let i = 1; i <= maxAttempts; i++) {
        const result = await checkOutput(outputUrl)
        last = result

        if (result.ok) {
            return {
                done: true,
                attempts: i,
                output_name: buildOutputName(fileId),
                output_url: outputUrl,
                ...result
            }
        }

        await sleep(interval)
    }

    return {
        done: false,
        output_name: buildOutputName(fileId),
        output_url: outputUrl,
        last
    }
}

export async function artydePhotoToSketch(input, options = {}) {
    const image = await loadImage(input, options)
    const uploaded = await uploadPhoto(image, options)
    const result = await waitForResult(uploaded.file_id, options)

    if (!result.done) throw new Error('Timeout saat menunggu hasil rendering sketch.')

    return {
        status: true,
        base: BASE,
        result_url: result.output_url,
        content_type: result.content_type
    }
}

export default artydePhotoToSketch