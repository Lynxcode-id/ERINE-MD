/*
---------------------------------------------------------------

• Fitur Maker Fake ML Profile (Uguu Uploader)
• Creator - Pembuat Code ini : @Lynx decode
• Saluran Saya : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
• Rilis : 26 April 2026
• Notes : Jangan hapus wm! - jangan hapus credit ini hargai pembuat - creator !!

---------------------------------------------------------------
*/

import axios from 'axios'
import FormData from 'form-data'

// Fungsi uploader ke Uguu
async function uploadUguu(buffer) {
    let form = new FormData()
    form.append('files[]', buffer, 'image.jpg')
    let { data } = await axios.post('https://uguu.se/upload.php', form, {
        headers: form.getHeaders()
    })
    return data.files[0].url
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return m.reply(`❌ Masukkan nickname cuy!\n*Contoh:* ${usedPrefix + command} Lynx\n\n_Catatan: Kamu bisa reply gambar langsung atau tag orang biar PP-nya dipake._`)

    m.reply('⏳ Sedang memproses upload gambar ke Uguu & bikin Fake ML, tunggu sebentar cuy...')

    try {
        let buffer
        let mime = (m.quoted ? m.quoted : m.msg).mimetype || ''

        // 1. Cek apakah user me-reply gambar dari chat
        if (/image/.test(mime)) {
            buffer = await m.quoted.download()
        } else {
            // 2. Kalau ga reply gambar, ambil PP user/target
            let who = m.quoted ? m.quoted.sender : m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.sender
            let avatarUrl
            try {
                avatarUrl = await conn.profilePictureUrl(who, 'image')
            } catch (e) {
                // Fallback gambar default kalau profil diprivasi / ga pake PP
                avatarUrl = 'https://telegra.ph/file/24fa902ead26340f3df2c.png'
            }
            // Jadikan PP sebagai buffer
            buffer = await (await axios.get(avatarUrl, { responseType: 'arraybuffer' })).data
        }

        // 3. Upload Buffer ke Uguu
        let uguuUrl = await uploadUguu(buffer)

        // 4. Hit API Canvas pakai URL dari Uguu
        let apiUrl = `https://api.theresav.biz.id/canvas/fakeml?avatar=${encodeURIComponent(uguuUrl)}&nickname=${encodeURIComponent(text)}&apikey=3aXI6`

        // 5. Kirim Hasil
        await conn.sendFile(m.chat, apiUrl, 'fakeml.png', `🎮 *FAKE PROFILE ML*\n\nSukses cuy!`, m)

    } catch (e) {
        console.error("Error Fake ML:", e)
        m.reply('❌ Terjadi kesalahan saat memproses gambar atau server API sedang gangguan.')
    }
}

handler.help = ['fakeml <nama>']
handler.tags = ['maker', 'canvas']
handler.command = /^(fakeml)$/i
handler.limit = true

export default handler