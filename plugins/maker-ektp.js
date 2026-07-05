/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Author     : Lynx Decode
 * 📞 Contact    : +62 882-5804-1396
 * 📢 Channel    : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * ⚠️ Note       : Keep credit to respect the creator!
 * ─────────────────────────
 * 📝 Plugin: E-KTP Maker
 */

import fetch from 'node-fetch'
import { FormData, Blob } from 'formdata-node'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''

    if (!/image/.test(mime)) {
        return m.reply(`┌˚₊ ๑│ ᴇ - ᴋ ᴛ ᴘ  ᴍ ᴀ ᴋ ᴇ ʀ │๑˚₊ 🪪\n┇ \n│ ❌ *Reply foto buat pas photo-nya cuy!*\n│ \n│ 📌 *Cara pakai:*\n│ Reply foto dengan format:\n│ ${usedPrefix + command} prov | kota | nik | nama | ttl | jk | goldar | alamat | rtrw | kel | kec | agama | status | kerja | warga | berlaku | terbuat\n┇ \n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`)
    }

    if (!text) {
        return m.reply(`❌ *Formatnya kurang cuy! Pisahkan dengan tanda |*\n\nContoh:\n${usedPrefix + command} PREFEKTUR TOKYO | NERIMA | 2112090309120001 | DORAEMON | MATSUSHIBA, 03-09-2112 | LAKI-LAKI | DORAYAKI | RUMAH KELUARGA NOBI NO. 7 | 005/002 | NERIMA | TSUKIMIDAI | DORAYAKISME | MENIKAH | ROBOT | WNA | SEUMUR HIDUP | 03-09-2112\n\n> © ERINE-AI`)
    }

    await m.react('⏳')

    try {
        let [
            prov = 'PREFEKTUR TOKYO', 
            kota = 'NERIMA', 
            nik = '2112090309120001', 
            nama = 'DORAEMON', 
            ttl = 'MATSUSHIBA, 03-09-2112', 
            jk = 'LAKI-LAKI', 
            goldar = 'O', 
            alamat = 'RUMAH KELUARGA NOBI', 
            rtrw = '005/002', 
            kel = 'NERIMA', 
            kec = 'TSUKIMIDAI', 
            agama = 'ISLAM', 
            status = 'BELUM KAWIN', 
            kerja = 'ROBOT', 
            warga = 'WNA', 
            berlaku = 'SEUMUR HIDUP', 
            buat = '03-09-2112'
        ] = text.split('|').map(v => v.trim())

        let media = await q.download()
        let formData = new FormData()
        let blob = new Blob([media], { type: mime })
        formData.append('file', blob, 'upload_file')

        let res = await fetch('https://api.shinzu.web.id/api/upload/litterbox', {
            method: 'POST',
            body: formData
        })
        let json = await res.json()
        
        if (!json.status || !json.result) throw new Error('Gagal mengunggah foto profil.')
        let pas_photo = json.result.url

        const apiUrl = `https://api.synoxcloud.xyz/canvas/e-ktp?provinsi=${encodeURIComponent(prov)}&kota=${encodeURIComponent(kota)}&nik=${encodeURIComponent(nik)}&nama=${encodeURIComponent(nama)}&ttl=${encodeURIComponent(ttl)}&jenis_kelamin=${encodeURIComponent(jk)}&golongan_darah=${encodeURIComponent(goldar)}&alamat=${encodeURIComponent(alamat)}&rt_rw=${encodeURIComponent(rtrw)}&kel_desa=${encodeURIComponent(kel)}&kecamatan=${encodeURIComponent(kec)}&agama=${encodeURIComponent(agama)}&status=${encodeURIComponent(status)}&pekerjaan=${encodeURIComponent(kerja)}&kewarganegaraan=${encodeURIComponent(warga)}&masa_berlaku=${encodeURIComponent(berlaku)}&terbuat=${encodeURIComponent(buat)}&pas_photo=${encodeURIComponent(pas_photo)}`

        let caption = `┌˚₊ ๑│ ᴇ - ᴋ ᴛ ᴘ  ᴍ ᴀ ᴋ ᴇ ʀ │๑˚₊ 🪪\n┇ \n│ ✅ *Sukses membuat e-KTP!*\n┇ \n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`

        await conn.sendMessage(m.chat, { image: { url: apiUrl }, caption }, { quoted: m })
        await m.react('✅')
    } catch (error) {
        console.error('[KTP ERROR]', error)
        await m.react('❌')
        m.reply(`┌˚₊ ๑│ ꜱ ʏ ꜱ ᴛ ᴇ ᴍ  ᴇ ʀ ʀ ᴏ ʀ │๑˚₊ ❌\n┇ Terjadi kesalahan sistem.\n┇ *Detail:* ${error.message || String(error)}\n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`)
    }
}

handler.help = ['ektp', 'ktp']
handler.tags = ['maker']
handler.command = /^(ektp|ktp|buatktp)$/i
handler.limit = true

export default handler