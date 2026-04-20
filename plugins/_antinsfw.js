// © INF PROJECT - Erine-MD
// Developed by INF PROJECT

import axios from 'axios'
import FormData from 'form-data'

export async function before(m, { conn, isAdmin, isBotAdmin }) {
    // 🔥 FIX JADIBOT: Otomatis nentuin mau pakai Database bot utama atau Jadibot
    const DB = conn.db || global.db

    // 1. Cek apakah ini di Grup
    if (!m.isGroup) return
    
    // Pengecekan database chat yang aman
    if (!DB.data || !DB.data.chats || !DB.data.chats[m.chat]) return
    let chat = DB.data.chats[m.chat]
    if (!chat.antiNsfw) return // Kalo ga diaktifin, skip aja

    // 2. Kalo yang ngirim Admin atau Bot sendiri, bebaskan
    if (m.fromMe || isAdmin) return

    // 3. Deteksi tipe pesannya (Gambar biasa, gambar viewOnce, atau Sticker)
    let isImage = m.mtype === 'imageMessage' || (m.mtype === 'viewOnceMessageV2' && m.msg?.imageMessage)
    let isSticker = m.mtype === 'stickerMessage'

    if (!isImage && !isSticker) return

    try {
        // Download media (Gambar / Sticker)
        let media = await m.download()
        let ext = isSticker ? 'webp' : 'jpg'

        // Upload ke server Pomf sementara buat dapet Link
        let form = new FormData()
        form.append('files[]', media, `media.${ext}`)

        let uploadRes = await axios.post('https://pomf.lain.la/upload.php', form, {
            headers: form.getHeaders()
        })

        let mediaUrl = uploadRes.data.files[0].url

        // Tembak ke API Deline
        let apiUrl = `https://api.deline.web.id/ai/nsfwcheck?url=${encodeURIComponent(mediaUrl)}`
        let { data } = await axios.get(apiUrl)

        if (data.status && data.result) {
            let label = data.result.labelName.toLowerCase()
            let confidence = data.result.confidence

            // Kalau terdeteksi Porn/Hentai dengan akurasi di atas 60% (0.6)
            if ((label.includes('porn') || label.includes('hentai')) && confidence > 0.6) {
                
                // Pastiin bot admin biar bisa ngehapus pesan & kick
                if (isBotAdmin) {
                    // Hapus pesan bokepnya
                    await conn.sendMessage(m.chat, { delete: m.key })

                    // Hitung peringatan user pake DB yang bener (Bot Utama / Jadibot)
                    if (!DB.data.users[m.sender]) DB.data.users[m.sender] = {}
                    let user = DB.data.users[m.sender]
                    user.warnNsfw = (user.warnNsfw || 0) + 1

                    // Kalo peringatan udah nyampe 5, KICK!
                    if (user.warnNsfw >= 5) {
                        await conn.sendMessage(m.chat, { 
                            text: `🚨 *ELIMINASI OTOMATIS* 🚨\n\n@${m.sender.split('@')[0]} Telah melampaui batas peringatan pengiriman konten 18+ (5/5).\n\nSayonara! 🔨🗿`, 
                            mentions: [m.sender] 
                        })
                        await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
                        user.warnNsfw = 0 // Reset setelah di-kick
                    } else {
                        // Kalo belum 5, kasih peringatan doang
                        await conn.sendMessage(m.chat, { 
                            text: `⚠️ *PERINGATAN NSFW!* (@${m.sender.split('@')[0]})\n\nSistem AI mendeteksi gambar/stiker berbau 18+ (Akurasi: ${(confidence * 100).toFixed(1)}%).\nPesan telah dihapus otomatis.\n\nIni adalah peringatan ke-${user.warnNsfw}/5. Jika mencapai 5, kamu akan di-kick otomatis!`, 
                            mentions: [m.sender] 
                        })
                    }
                } else {
                    // Kalo bot bukan admin
                    await conn.sendMessage(m.chat, { 
                        text: `Astagfirullah @${m.sender.split('@')[0]} ngirim gituan. 😭\nSayangnya bot belum jadi admin, jadi kaga bisa ngehapus pesannya. Admin tolong tindak!`, 
                        mentions: [m.sender] 
                    })
                }
            }
        }
    } catch (e) {
        console.error('❌ Anti-NSFW Error:', e)
    }
}
