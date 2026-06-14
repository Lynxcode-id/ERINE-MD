import { dirname } from 'path'
import { fileURLToPath } from 'url'
import * as fs from 'fs'
import * as path from 'path'
import * as crypto from 'crypto'
import { ffmpeg } from './converter.js'
import fluent_ffmpeg from 'fluent-ffmpeg'
import { spawn } from 'child_process'
import uploadFile from './uploadFile.js'
import uploadImage from './uploadImage.js'
import { fileTypeFromBuffer } from 'file-type'
import webp from 'node-webpmux'
import fetch from 'node-fetch'

const __dirname = dirname(fileURLToPath(import.meta.url))
const tmp = path.join(__dirname, '../tmp')

if (!fs.existsSync(tmp)) fs.mkdirSync(tmp, { recursive: true })

/**
 * Image to Sticker
 * @param {Buffer} img Image Buffer
 * @param {String} url Image URL
 */
function sticker2(img, url) {
  return new Promise(async (resolve, reject) => {
    let inp = path.join(tmp, Date.now() + '.jpeg')
    try {
      if (url) {
        let res = await fetch(url)
        if (res.status !== 200) throw await res.text()
        img = Buffer.from(await res.arrayBuffer())
      }
      await fs.promises.writeFile(inp, img)
      let ff = spawn('ffmpeg', [
        '-y',
        '-i', inp,
        '-vf', 'scale=512:512:flags=lanczos:force_original_aspect_ratio=decrease,format=rgba,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=#00000000,setsar=1',
        '-f', 'png',
        '-'
      ])
      
      let bufs = []
      
      const [_spawnprocess, ..._spawnargs] = [...(support.gm ? ['gm'] : support.magick ? ['magick'] : []), 'convert', 'png:-', 'webp:-']
      let im = spawn(_spawnprocess, _spawnargs)
      
      ff.on('error', reject)
      im.on('error', reject)
      
      im.stdout.on('data', chunk => bufs.push(chunk))
      ff.stdout.pipe(im.stdin)
      
      im.on('exit', () => {
        resolve(Buffer.concat(bufs))
      })
    } catch (e) {
      reject(e)
    } finally {
      if (fs.existsSync(inp)) await fs.promises.unlink(inp).catch(() => {})
    }
  })
}

async function canvas(code, type = 'png', quality = 0.92) {
  let res = await fetch('https://nurutomo.herokuapp.com/api/canvas?' + new URLSearchParams({
    type,
    quality
  }), {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain',
      'Content-Length': code.length
    },
    body: code
  })
  return Buffer.from(await res.arrayBuffer())
}

/**
 * Image to Sticker (Canvas Method)
 */
async function sticker1(img, url) {
  url = url ? url : await uploadImage(img)
  let mime = 'image/jpeg'
  if (!url && img) {
    let type = await fileTypeFromBuffer(img)
    mime = type?.mime || 'image/jpeg'
  }
  let sc = `let im = await loadImg('data:${mime};base64,'+(await window.loadToDataURI('${url}')))
c.width = c.height = 512
let max = Math.max(im.width, im.height)
let w = 512 * im.width / max
let h = 512 * im.height / max
ctx.drawImage(im, 256 - w / 2, 256 - h / 2, w, h)
`
  return await canvas(sc, 'webp')
}

/**
 * Sticker WM (XTeam API)
 */
async function sticker3(img, url, packname, author) {
  url = url ? url : await uploadFile(img)
  let res = await fetch('https://api.xteam.xyz/sticker/wm?' + new URLSearchParams({
    url,
    packname,
    author
  }))
  return Buffer.from(await res.arrayBuffer())
}

/**
 * Sticker 4 (FFMPEG Internal)
 */
async function sticker4(img, url) {
  if (url) {
    let res = await fetch(url)
    if (res.status !== 200) throw await res.text()
    img = Buffer.from(await res.arrayBuffer())
  }
  return await ffmpeg(img, [
    '-vf', 'scale=512:512:flags=lanczos:force_original_aspect_ratio=decrease,format=rgba,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=#00000000,setsar=1'
  ], 'jpeg', 'webp')
}

/**
 * Sticker 5 (wa-sticker-formatter)
 */
async function sticker5(img, url, packname, author, categories = [''], extra = {}) {
  const { Sticker } = await import('wa-sticker-formatter')
  const stickerMetadata = {
    type: 'default',
    pack: packname,
    author,
    categories,
    ...extra
  }
  return (new Sticker(img ? img : url, stickerMetadata)).toBuffer()
}

/**
 * Sticker 6 (Fluent-FFMPEG)
 */
function sticker6(img, url) {
  return new Promise(async (resolve, reject) => {
    let tmpFile = path.join(tmp, Date.now() + '.tmp')
    let out = tmpFile + '.webp'
    try {
        if (url) {
          let res = await fetch(url)
          if (res.status !== 200) throw await res.text()
          img = Buffer.from(await res.arrayBuffer())
        }
        const type = await fileTypeFromBuffer(img) || { mime: 'image/jpeg', ext: 'jpg' }
        tmpFile = path.join(tmp, Date.now() + '.' + type.ext)
        out = tmpFile + '.webp'
        
        await fs.promises.writeFile(tmpFile, img)
        
        let Fffmpeg = /video/i.test(type.mime) ? fluent_ffmpeg(tmpFile).inputFormat(type.ext) : fluent_ffmpeg(tmpFile)
        Fffmpeg
          .on('error', (err) => {
            console.error(err)
            reject(err)
          })
          .on('end', async () => {
            let result = await fs.promises.readFile(out)
            resolve(result)
          })
          .addOutputOptions([
            `-vcodec`, `libwebp`, `-vf`,
            `scale='min(320,iw)':min(320,ih):force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`
          ])
          .toFormat('webp')
          .save(out)
    } catch (e) {
        reject(e)
    } finally {
        // Pembersihan file di-handle di event end/error atau via pemantau folder tmp
    }
  })
}

/**
 * Add EXIF (Watermark)
 */
async function addExif(webpSticker, packname, author, categories = [''], extra = {}) {
  const img = new webp.Image();
  const json = { 
    'sticker-pack-id': crypto.randomBytes(32).toString('hex'), 
    'sticker-pack-name': packname, 
    'sticker-pack-publisher': author, 
    'emojis': categories, 
    ...extra 
  };
  let exifAttr = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00]);
  let jsonBuffer = Buffer.from(JSON.stringify(json), 'utf8');
  let exif = Buffer.concat([exifAttr, jsonBuffer]);
  exif.writeUIntLE(jsonBuffer.length, 14, 4);
  await img.load(webpSticker)
  img.exif = exif
  return await img.save(null)
}

/**
 * Main Sticker Function
 */
async function sticker(img, url, ...args) {
  let lastError, stiker
  const funcs = [
    sticker3, 
    support.ffmpeg && sticker6, 
    sticker5,
    support.ffmpeg && support.ffmpegWebp && sticker4,
    support.ffmpeg && (support.convert || support.magick || support.gm) && sticker2,
    sticker1
  ].filter(f => f)

  for (let func of funcs) {
    try {
      stiker = await func(img, url, ...args)
      if (Buffer.isBuffer(stiker) && stiker.includes('WEBP')) {
        try {
          return await addExif(stiker, ...args)
        } catch (e) {
          return stiker
        }
      }
      if (stiker.toString().includes('html')) continue
    } catch (err) {
      lastError = err
      continue
    }
  }
  return lastError
}

const support = {
  ffmpeg: true,
  ffprobe: true,
  ffmpegWebp: true,
  convert: true,
  magick: false,
  gm: false,
  find: false
}

export {
  sticker,
  sticker1,
  sticker2,
  sticker3,
  sticker4,
  sticker5,
  sticker6,
  addExif,
  support
}
