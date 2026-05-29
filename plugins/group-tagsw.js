import * as baileys from "@whiskeysockets/baileys"
import crypto from "node:crypto"
import { PassThrough } from 'stream'
import ffmpeg from 'fluent-ffmpeg'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  let [textInput, warna, url] = text.split('|').map(v => v?.trim() || '')

  let id;
  if (url) {
    try {
      const inviteCode = url.split('/').pop().split('?')[0]
      let geti = await conn.groupGetInviteInfo(inviteCode)
      id = geti.id
    } catch (e) {
      return m.reply('❖━━━━━━[ *SYSTEM ERROR* ]━━━━━━❖\n\n[❌] Gagal mendapatkan info grup!\n[💡] Pastikan tautan undangan valid dan bot tidak diblokir.')
    }
  } else {
    id = m.chat
  }

  let quoted = m.quoted || m
  let cap = quoted.caption || textInput
  let q = quoted
  let mime = q?.mimetype || q?.msg?.mimetype || ''

  await m.react('⏳')
  
  if (/image/.test(mime)) {
    const buffer = await quoted.download().catch(() => null)
    if (!buffer) return m.reply('❖━━━━━━[ *SYSTEM ERROR* ]━━━━━━❖\n\n[❌] Gagal mengunduh gambar dari server WhatsApp.')

    const sta = await groupStatus(conn, id, {
      image: buffer,
      caption: cap
    })
    await m.react('✅')
    return conn.reply(m.chat, '❖━━━━━━[ *TASK COMPLETE* ]━━━━━━❖\n\n[✅] Status gambar berhasil diunggah ke grup target.', sta)
  
  } else if (/video/.test(mime)) {
    const buffer = await quoted.download().catch(() => null)
    if (!buffer) return m.reply('❖━━━━━━[ *SYSTEM ERROR* ]━━━━━━❖\n\n[❌] Gagal mengunduh video dari server WhatsApp.')

    const sta = await groupStatus(conn, id, {
      video: buffer,
      caption: cap
    })
    await m.react('✅')
    return conn.reply(m.chat, '❖━━━━━━[ *TASK COMPLETE* ]━━━━━━❖\n\n[✅] Status video berhasil diunggah ke grup target.', sta)
  
  } else if (/audio/.test(mime)) {
    m.reply('❖━━━━━━[ *AUDIO PROCESSING* ]━━━━━━❖\n\n[⚡] Menginisialisasi mesin render...\n[⏳] Merender Voice Note & Waveform...\n\n_Mohon tunggu sebentar, Lynx!_')
    
    try {
      const buffer = await quoted.download().catch(() => null)
      if (!buffer) throw new Error('Gagal mengekstrak audio.')

      const audioVn = await toVN(buffer)
      const audioWaveform = await generateWaveform(buffer)

      const sta = await groupStatus(conn, id, {
        audio: audioVn,
        waveform: audioWaveform,
        mimetype: "audio/ogg; codecs=opus",
        ptt: true
      })
      await m.react('✅')
      return conn.reply(m.chat, '❖━━━━━━[ *TASK COMPLETE* ]━━━━━━❖\n\n[✅] Status Voice Note (VN) berhasil diunggah ke grup target.', sta)
    } catch (e) {
      console.error(e)
      await m.react('❌')
      return m.reply(`❖━━━━━━[ *SYSTEM CRITICAL* ]━━━━━━❖\n\n[❌] Gagal merender VN:\n> ${e.message}`)
    }

  } else if (warna) {
    if (!cap) return m.reply('❖━━━━━━[ *SYSTEM ERROR* ]━━━━━━❖\n\n[❌] Teks untuk status tidak boleh kosong!')

    const warnaStatusWA = new Map([
      ['biru',    '#34B7F1'],
      ['hijau',   '#25D366'],
      ['kuning',  '#FFD700'],
      ['jingga',  '#FF8C00'],
      ['merah',   '#FF3B30'],
      ['ungu',    '#9C27B0'],
      ['abu',     '#9E9E9E'],
      ['hitam',   '#000000'],
      ['putih',   '#FFFFFF'],
      ['cyan',    '#00BCD4']
    ])

    const textWarna = warna.toLowerCase()
    let color = null
    for (const [nama, kode] of warnaStatusWA.entries()) {
      if (textWarna.includes(nama)) {
        color = kode
        break
      }
    }

    if (!color) return m.reply('❖━━━━━━[ *SYSTEM ERROR* ]━━━━━━❖\n\n[❌] Kode warna tidak ditemukan dalam database sistem.')

    const sta = await groupStatus(conn, id, {
      text: cap,
      backgroundColor: color
    })
    await m.react('✅')
    return conn.reply(m.chat, '❖━━━━━━[ *TASK COMPLETE* ]━━━━━━❖\n\n[✅] Status teks berwarna berhasil diunggah ke grup target.', sta)
  
  } else {
    let guide = `❖━━━━━━[ *SYSTEM ERROR* ]━━━━━━❖\n\n[❌] Parameter atau media tidak terdeteksi!\n\n[💡] *Cara Penggunaan:*\n1. Reply media (Gambar/Video/Audio) dengan perintah *${usedPrefix + command}*\n2. Atau kirim teks berwarna dengan format:\n> *${usedPrefix + command} Teks | Warna | Link Grup (Opsional)*`
    return m.reply(guide)
  }
}

/**
 * Send WhatsApp status on group.
 * @param {import("@whiskeysockets/baileys").WASocket} conn
 * @param {string} jid
 * @param {import("@whiskeysockets/baileys").AnyMessageContent} content
 */
async function groupStatus(conn, jid, content) {
  const { backgroundColor } = content
  delete content.backgroundColor

  const inside = await baileys.generateWAMessageContent(content, {
    upload: conn.waUploadToServer,
    backgroundColor
  })

  const messageSecret = crypto.randomBytes(32)
  const m = baileys.generateWAMessageFromContent(jid, {
    messageContextInfo: { messageSecret },
    groupStatusMessageV2: {
      message: {
        ...inside,
        messageContextInfo: { messageSecret }
      }
    }
  }, {})

  await conn.relayMessage(jid, m.message, { messageId: m.key.id })
  return m
}

handler.help = ["swgc", "upswgc"]
handler.command = ["swgc", "upswgc"]
handler.tags = ["tools"]
handler.admin = true

async function toVN(inputBuffer) {
  return new Promise((resolve, reject) => {
    const inStream = new PassThrough()
    const outStream = new PassThrough()
    const chunks = []

    inStream.end(inputBuffer)

    ffmpeg(inStream)
      .noVideo()
      .audioCodec('libopus')
      .format('ogg')
      .audioBitrate('48k')
      .audioChannels(1)
      .audioFrequency(48000)
      .outputOptions([
        '-map_metadata', '-1',
        '-application', 'voip',
        '-compression_level', '10',
        '-page_duration', '20000'
      ])
      .on('error', reject)
      .on('end', () => resolve(Buffer.concat(chunks)))
      .pipe(outStream, { end: true })

    outStream.on('data', c => chunks.push(c))
  })
}

async function generateWaveform(inputBuffer, bars = 64) {
  return new Promise((resolve, reject) => {
    const inputStream = new PassThrough()
    inputStream.end(inputBuffer)

    const chunks = []

    ffmpeg(inputStream)
      .audioChannels(1)
      .audioFrequency(16000)
      .format("s16le")
      .on("error", reject)
      .on("end", () => {
        const rawData = Buffer.concat(chunks)
        const samples = rawData.length / 2

        const amplitudes = []
        for (let i = 0; i < samples; i++) {
          let val = rawData.readInt16LE(i * 2)
          amplitudes.push(Math.abs(val) / 32768)
        }

        let blockSize = Math.floor(amplitudes.length / bars)
        let avg = []
        for (let i = 0; i < bars; i++) {
          let block = amplitudes.slice(i * blockSize, (i + 1) * blockSize)
          avg.push(block.reduce((a, b) => a + b, 0) / block.length)
        }

        let max = Math.max(...avg)
        let normalized = avg.map(v => Math.floor((v / max) * 100))

        let buf = Buffer.from(new Uint8Array(normalized))
        resolve(buf.toString("base64"))
      })
      .pipe() 
      .on("data", chunk => chunks.push(chunk))
  })
}

export default handler