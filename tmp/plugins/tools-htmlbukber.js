/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx Decode
 * 📞 WhatsApp  : +62 882-5804-1396
 * 📢 Channel   : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * ⚠️ Note      : Keep credit to respect the creator!
 * ─────────────────────────
 * 📝 Plugin: HTML Generator - Ngajak Bukber
 */

import axios from 'axios'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text || !text.includes('|')) {
        return m.reply(`❌ Format salah!\n\n*Contoh:* ${usedPrefix + command} Lynx Decode | 6288258041396 | ayo bukber cuy, gass!`)
    }

    let [nama, nomor, pesan] = text.split('|').map(v => v.trim())

    if (!nama || !nomor || !pesan) {
        return m.reply(`❌ Pastikan data lengkap: nama, nomor, dan pesan tidak boleh kosong!`)
    }

    await m.react('⏳')

    try {
        let { data: res } = await axios.get(`https://api.jagoanproject.biz.id/api/html/ngajakbukber`, {
            params: { nama, nomor, pesan },
            headers: {
                "Authorization": "Bearer jg_9cTY7aSGLdqZErDysaLfO6Wn"
            }
        })

        if (!res.status || !res.result || !res.result.downloadUrl) {
            throw new Error(res.message || 'Gagal membuat file HTML dari server.')
        }

        let { data: htmlBuffer } = await axios.get(res.result.downloadUrl, {
            responseType: 'arraybuffer'
        })

        if (!htmlBuffer) {
            throw new Error('Gagal mengunduh file HTML yang sudah digenerate.')
        }

        let caption = `⚡ ＨＴＭＬ - ＢＵＫＢＥＲ ⚡

» Sender : ${nama}
» Target : ${nomor}
» Note   : ${pesan}

> File HTML berhasil dibuat. Silakan download dan buka di browser, atau teruskan ke target.
`.trim()

        await conn.sendMessage(m.chat, {
            document: htmlBuffer,
            fileName: `Undangan_Bukber_${nama.replace(/\s+/g, '_')}.html`,
            mimetype: 'text/html',
            caption: caption
        }, { quoted: m })

        await m.react('✅')

    } catch (e) {
        console.error('[BUKBER HTML ERROR]', e)
        await m.react('❌')
        m.reply(`⚠️ *System Error:*\n_${e?.response?.data?.message || e.message || e}_`)
    }
}

handler.help = ['bukber <nama|nomor|pesan>']
handler.tags = ['tools']
handler.command = /^(bukber|ngajakbukber|htmlbukber)$/i
handler.limit = true

export default handler