/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx Decode
 * 📞 WhatsApp  : +62 882-5804-1396
 * 📢 Channel   : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * ⚠️ Note      : Keep credit to respect the creator!
 * ─────────────────────────
 * 📝 Plugin : Group Status (SWGC) VN to Video Visualizer (FIXED)
 */

import * as baileys from "@whiskeysockets/baileys"
import crypto from "node:crypto"
import fs from 'fs'
import path from 'path'
import { tmpdir } from 'os'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

let handler = async (m, { conn, text, usedPrefix, command }) => {
  let [textInput, warna, url] = text.split('|').map(v => v?.trim() || '')

  let id;
  if (url) {
    try {
      const inviteCode = url.split('/').pop().split('?')[0]
      let geti = await conn.groupGetInviteInfo(inviteCode)
      id = geti.id
    } catch (e) {
      return m.reply(`┌˚₊ ๑│ s ʏ s ᴛ ᴇ ᴍ  ᴇ ʀ ʀ ᴏ ʀ │๑˚₊ ❌\n┇ Gagal mendapatkan info grup!\n┇ Pastikan tautan undangan valid.\n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-MD`)
    }
  } else {
    id = m.chat
  }

  let quoted = m.quoted || m
  let cap = quoted.caption || textInput
  let mime = quoted.mimetype || quoted.msg?.mimetype || ''

  await m.react('⏳')

  try {
    if (/image/.test(mime)) {
      const buffer = await quoted.download().catch(() => null)
      if (!buffer) throw new Error('Gagal mengunduh gambar.')

      await groupStatus(conn, id, { image: buffer, caption: cap })
      await m.react('✅')
      return m.reply(`┌˚₊ ๑│ s ᴡ ɢ ᴄ  ᴜ ᴘ ʟ ᴏ ᴀ ᴅ ᴇ ʀ │๑˚₊ 🖼️\n┇ ✅ Status gambar berhasil diunggah.\n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-MD`)
    
    } else if (/video/.test(mime)) {
      const buffer = await quoted.download().catch(() => null)
      if (!buffer) throw new Error('Gagal mengunduh video.')

      await groupStatus(conn, id, { video: buffer, caption: cap })
      await m.react('✅')
      return m.reply(`┌˚₊ ๑│ s ᴡ ɢ ᴄ  ᴜ ᴘ ʟ ᴏ ᴀ ᴅ ᴇ ʀ │๑˚₊ 🎥\n┇ ✅ Status video berhasil diunggah.\n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-MD`)
    
    } else if (/audio/.test(mime)) {
      m.reply(`┌˚₊ ๑│ ᴀ ᴜ ᴅ ɪ ᴏ  ᴘ ʀ ᴏ ᴄ ᴇ s s │๑˚₊ ⚡\n┇ Mengonversi VN ke Video...\n┇ Merender waveform visualizer...\n┇ _Tunggu sebentar, ini pasti work!_\n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-MD`)
      
      const media = await quoted.download().catch(() => null)
      if (!media) throw new Error('Gagal mengekstrak audio.')

      let ext = 'ogg'
      if (mime) {
          ext = mime.split('/')[1]?.split(';')[0] || 'ogg'
          if (ext === 'mpeg') ext = 'mp3'
          if (ext === 'mp4') ext = 'm4a'
      }

      let tmpIn = path.join(tmpdir(), `${Date.now()}_in.${ext}`)
      let tmpOut = path.join(tmpdir(), `${Date.now()}_out.mp4`)

      await fs.promises.writeFile(tmpIn, media)

      // 🔥 KUNCI: Render Video Vertikal (720x1280) dengan Waveform Bar Style
      await execAsync(`ffmpeg -i "${tmpIn}" -filter_complex "[0:a]showwaves=s=720x1280:mode=cline:colors=#25D366[wv];color=black:s=720x1280[c];[c][wv]overlay=format=auto" -c:v libx264 -pix_fmt yuv420p -c:a aac -b:a 128k -shortest "${tmpOut}"`)

      // Deteksi Durasi
      let realDuration = 15;
      try {
        const { stdout: dur } = await execAsync(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${tmpOut}"`)
        realDuration = Math.max(1, Math.ceil(parseFloat(dur.trim())))
      } catch (err) {
        console.log('[FFPROBE WARN] Gagal deteksi durasi real.')
      }

      let videoBuffer = await fs.promises.readFile(tmpOut)

      // Upload sebagai Video Normal (Menggunakan fungsi groupStatus andalan lu)
      await groupStatus(conn, id, {
          video: videoBuffer,
          caption: cap || '🎤 Voice Note',
          mimetype: 'video/mp4'
      })

      await m.react('✅')
      
      // Cleanup file temporer
      ;[tmpIn, tmpOut].forEach(f => fs.existsSync(f) && fs.unlinkSync(f))

      return m.reply(`┌˚₊ ๑│ s ᴡ ɢ ᴄ  ᴜ ᴘ ʟ ᴏ ᴀ ᴅ ᴇ ʀ │๑˚₊ 🎥\n┇ ✅ Status VN as Video berhasil.\n┇ ⏱️ Durasi: ${realDuration}s\n┇ 📊 Waveform: Video Visualizer\n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-MD`)

    } else if (warna) {
      if (!cap) throw new Error('Teks untuk status tidak boleh kosong!')

      const warnaStatusWA = new Map([
        ['biru', '#34B7F1'], ['hijau', '#25D366'], ['kuning', '#FFD700'],
        ['jingga', '#FF8C00'], ['merah', '#FF3B30'], ['ungu', '#9C27B0'],
        ['abu', '#9E9E9E'], ['hitam', '#000000'], ['putih', '#FFFFFF'],
        ['cyan', '#00BCD4']
      ])

      let color = null
      for (const [nama, kode] of warnaStatusWA.entries()) {
        if (warna.toLowerCase().includes(nama)) {
          color = kode
          break
        }
      }

      if (!color) throw new Error('Kode warna tidak ditemukan dalam database.')

      await groupStatus(conn, id, { text: cap, backgroundColor: color })
      await m.react('✅')
      return m.reply(`┌˚₊ ๑│ s ᴡ ɢ ᴄ  ᴜ ᴘ ʟ ᴏ ᴀ ᴅ ᴇ ʀ │๑˚₊ 📝\n┇ ✅ Status teks berwarna berhasil.\n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-MD`)
    
    } else {
      let guide = `┌˚₊ ๑│ ɢ ᴜ ɪ ᴅ ᴇ  ᴜ s ᴀ ɢ ᴇ │๑˚₊ 📌\n`
      guide += `┇ 1. Reply media (Gambar/Video/Audio)\n`
      guide += `┇ 2. Teks berwarna:\n`
      guide += `┇    *${usedPrefix + command} Teks | Warna | Link Grup*\n`
      guide += `└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-MD`
      return m.reply(guide)
    }
  } catch (error) {
    console.error('[SWGC ERROR]', error)
    await m.react('❌')
    return m.reply(`┌˚₊ ๑│ s ʏ s ᴛ ᴇ ᴍ  ᴇ ʀ ʀ ᴏ ʀ │๑˚₊ ❌\n┇ Gagal mengunggah status:\n┇ ${error.message || error}\n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-MD`)
  }
}

// Handler standar Baileys untuk semua jenis media
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

export default handler