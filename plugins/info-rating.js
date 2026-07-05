/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx Decode
 * 📝 Plugin: User Rating & Feedback Erine-AI
 */

import fs from 'fs'
import path from 'path'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    // --- UI KHAS ERINE-AI ---
    const headerUI = "┌˚₊ ๑│ ᴇ ʀ ɪ ɴ ᴇ - ᴀ ɪ  ʀ ᴀ ᴛ ɪ ɴ ɢ │๑˚₊"
    const hrUI = "└˚₊ ๑ ────────────── ๑˚₊"
    const footerUI = "> © ERINE-AI | USER FEEDBACK"

    // --- SETUP DATABASE ---
    const dirPath = './database'
    const filePath = path.join(dirPath, 'rating.json')

    // Otomatis bikin folder & file kalau belum ada
    if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true })
    if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, JSON.stringify([]))

    // Helper baca & tulis file JSON
    const readDB = () => JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    const writeDB = (data) => fs.writeFileSync(filePath, JSON.stringify(data, null, 2))

    try {
        await m.react('⏳')

        // ==========================================
        // 1. FITUR INPUT RATING (-rating)
        // ==========================================
        if (command === 'rating') {
            if (!text || !text.includes('|')) {
                await m.react('❌')
                return m.reply(`${headerUI} 📝\n┇ \n│ *FORMAT SALAH!*\n│ \n│ ◦ *Format Pendek:*\n│ ${usedPrefix + command} nama | bintang | ulasan\n│ \n│ ◦ *Format Panjang:*\n│ ${usedPrefix + command} nama | bintang | ulasan | saran | kritik | masukan | perbaikan\n│ \n│ 💡 *Catatan:* Bintang dari 0 - 10\n┇ \n${hrUI}\n${footerUI}`)
            }

            // Parsing teks berdasarkan pembatas pipa (|)
            let args = text.split('|').map(v => v.trim())
            let nama = args[0]
            let bintang = parseFloat(args[1])
            let ulasan = args[2]
            
            // Opsional (kalau pakai format pendek, sisanya otomatis jadi strip "-")
            let saran = args[3] || '-'
            let kritik = args[4] || '-'
            let masukan = args[5] || '-'
            let perbaikan = args[6] || '-'

            // Validasi Input
            if (!nama || isNaN(bintang) || !ulasan) {
                await m.react('❌')
                return m.reply(`${headerUI} ❌\n┇ \n│ Pastikan *Nama*, *Bintang (Angka)*, dan *Ulasan* terisi dengan benar!\n┇ \n${hrUI}\n${footerUI}`)
            }

            if (bintang < 0 || bintang > 10) {
                await m.react('❌')
                return m.reply(`${headerUI} ❌\n┇ \n│ Rating bintang harus di antara angka *0 sampai 10*!\n┇ \n${hrUI}\n${footerUI}`)
            }

            let db = readDB()
            
            // Cek apakah user dengan nama ini udah pernah ngasih rating
            let userIdx = db.findIndex(v => v.nama.toLowerCase() === nama.toLowerCase())
            
            let ratingData = {
                sender: m.sender,
                nama: nama,
                bintang: bintang,
                ulasan: ulasan,
                saran: saran,
                kritik: kritik,
                masukan: masukan,
                perbaikan: perbaikan,
                date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
            }

            if (userIdx !== -1) {
                db[userIdx] = ratingData // Kalau udah ada, timpa (update)
            } else {
                db.push(ratingData) // Kalau belum ada, tambahin baru
            }

            writeDB(db) // Save ke JSON

            let replyText = `${headerUI} ⭐\n┇ \n` +
                            `│ ✅ *RATING BERHASIL DISIMPAN!*\n` +
                            `│ Terima kasih atas feedback-nya Kak *${nama}* ✨\n` +
                            `│ \n` +
                            `│ 👤 *Nama:* ${nama}\n` +
                            `│ ⭐ *Bintang:* ${bintang}/10\n` +
                            `│ 💬 *Ulasan:* ${ulasan}\n` +
                            `┇ \n${hrUI}\n${footerUI}`
            
            await m.reply(replyText)
            await m.react('✅')
        }

        // ==========================================
        // 2. FITUR CEK RATING (-viewrating)
        // ==========================================
        if (command === 'viewrating') {
            if (!text) {
                await m.react('❌')
                return m.reply(`${headerUI} 🔍\n┇ \n│ Masukkan nama user yang ingin dilihat ratingnya!\n│ *Contoh:* ${usedPrefix + command} lynx\n┇ \n${hrUI}\n${footerUI}`)
            }

            let db = readDB()
            let data = db.find(v => v.nama.toLowerCase() === text.toLowerCase())

            if (!data) {
                await m.react('❌')
                return m.reply(`${headerUI} ❌\n┇ \n│ Data rating untuk nama *${text}* tidak ditemukan di database.\n┇ \n${hrUI}\n${footerUI}`)
            }

            // Tampilan full info user yang ngasih rating
            let viewText = `${headerUI} 🔍\n┇ \n` +
                           `│ 👤 *Nama:* ${data.nama}\n` +
                           `│ ⭐ *Bintang:* ${data.bintang}/10\n` +
                           `│ 💬 *Ulasan:* ${data.ulasan}\n` +
                           `│ \n` +
                           `│ 💡 *Saran:* ${data.saran}\n` +
                           `│ 📉 *Kritik:* ${data.kritik}\n` +
                           `│ 📥 *Masukan:* ${data.masukan}\n` +
                           `│ 🛠️ *Perbaikan:* ${data.perbaikan}\n` +
                           `│ \n` +
                           `│ 📅 *Tanggal:* ${data.date}\n` +
                           `┇ \n${hrUI}\n${footerUI}`
            
            await m.reply(viewText)
            await m.react('✅')
        }

    } catch (e) {
        console.error('[RATING SYSTEM ERROR]', e)
        await m.react('❌')
        m.reply(`${headerUI} ❌\n┇ \n│ Terjadi kesalahan pada sistem rating.\n│ Info: ${e.message}\n┇ \n${hrUI}\n${footerUI}`)
    }
}

handler.help = ['rating', 'viewrating']
handler.tags = ['main', 'info']
handler.command = /^(rating|viewrating)$/i

export default handler