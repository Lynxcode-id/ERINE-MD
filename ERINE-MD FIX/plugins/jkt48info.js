/**
 * Fitur JKT48 News by Erine-MD
 * Base Nao ESM
 **/

import fetch from 'node-fetch'
import moment from 'moment-timezone'

moment.locale('id') // Biar nama bulannya pakai Bahasa Indonesia

let handler = async (m, { conn, usedPrefix, command }) => {
  try {
    await m.react('⏳') // React loading

    // Ambil data dari API
    let res = await fetch('https://www.api-g4nggaa.biz.id/api/news/jkt48')
    let json = await res.json()

    if (!json.status || !json.result || json.result.length === 0) {
        throw '❌ Gagal mengambil data berita JKT48 cuy! Mungkin API lagi down.'
    }

    // --- HEADER AESTHETIC ---
    let caption = `┌˚₊ ๑│ ᴇ ʀ ɪ ɴ ᴇ  ᴍ ᴅ │๑˚₊ 🎀\n`
    caption += `┇ 📰 › ᴊᴋᴛ𝟺𝟾 ɴᴇᴡs ᴜᴘᴅᴀᴛᴇ\n`
    caption += `┇ 🌸 › ɪɴꜰᴏ ᴛᴇʀʙᴀʀᴜ ᴏsʜɪ-ᴍᴜ!\n`
    caption += `└˚₊ ๑ ᴛʜᴇᴀᴛᴇʀ ɪɴꜰᴏ ๑˚₊ 🍓\n\n`
    
    caption += `୨ ✧ ୧ *Berita JKT48 Terbaru* 🦢\n`
    caption += `*Jangan sampai ketinggalan info yaa~* (๑ ˃̵ᴗ˂̵) ♡\n\n`

    // --- LOOPING DATA BERITA ---
    // Kita batasi nampilin 10 berita terbaru biar chatnya gak kepanjangan banget
    let newsList = json.result.slice(0, 10) 

    newsList.forEach((v, i) => {
        // Konversi waktu GMT ke WIB (Jakarta) biar sesuai sama format lokal
        let date = moment(new Date(v.published)).tz('Asia/Jakarta').format('DD MMMM YYYY, HH:mm')
        
        caption += `┌˚ · ๑୧ ɴᴇᴡs ${i + 1}\n`
        caption += `┇ 📌 ⁞ ᴛɪᴛʟᴇ : *${v.title}*\n`
        caption += `┇ 🗞️ ⁞ sᴏᴜʀᴄᴇ : ${v.source}\n`
        caption += `┇ 📅 ⁞ ᴅᴀᴛᴇ : ${date} WIB\n`
        caption += `┇ 🔗 ⁞ ʟɪɴᴋ : ${v.link}\n`
        caption += `└˚₊ ๑୧\n\n`
    })

    caption += `© ᴇʀɪɴᴇ ᴍᴅ x ᴊᴋᴛ𝟺𝟾 ᴠɪʙᴇ`

    const THUMB = global.menuThumb || 'https://c.termai.cc/i140/snh8Knp.jpg'

    // Kirim pesan dengan gambar + saluran OFC
    await conn.sendMessage(m.chat, {
        image: { url: THUMB },
        caption: caption.trim(),
        contextInfo: {
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterName: `「 🐣 ᴇʀɪɴᴇ-ᴍᴅ ɪɴғᴏʀᴍᴀᴛɪᴏɴ 🐣 」`,
                newsletterJid: "120363400612665352@newsletter"
            }
        }
    }, { quoted: m })

    await m.react('✅') // React sukses

  } catch (e) {
    console.error(e)
    await m.react('❌')
    m.reply('Waduh error cuy: ' + e.message)
  }
}

handler.help = ['jkt48info', 'infojkt48']
handler.tags = ['jkt48', 'info']
handler.command = /^(jkt48info|infojkt48|infojkt)$/i
handler.limit = true // Pakai limit soalnya request API

export default handler