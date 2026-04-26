import axios from 'axios'
import FormData from 'form-data'

let handler = async (m, { conn, usedPrefix, command }) => {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''
    
    if (!mime) return m.reply(`Reply gambar/video/audio/dokumen dengan command *${usedPrefix + command}* bre!`)

    m.reply('⏳ Sedang upload ke server... (Catbox ngeblokir IP Panel lu lek, kita pake alternatif)')
    
    try {
        let mediaBuffer = await q.download()
        let ext = mime.split('/')[1].split(';')[0] || 'bin'

        // Pake Uguu.se yang udah terbukti lolos di panel lu
        let form = new FormData()
        form.append('files[]', mediaBuffer, { filename: `media.${ext}` })

        let res = await axios.post('https://uguu.se/upload.php', form, {
            headers: { ...form.getHeaders() }
        })
        
        // Ambil URL hasilnya
        let data = res.data.files[0].url

        m.reply(`*UPLOAD SUCCESS* 🚀\n\n*Link:* ${data}\n*Size:* ${(mediaBuffer.length / 1024 / 1024).toFixed(2)} MB`)

    } catch (e) {
        console.error(e)
        m.reply(`Error cuy: ${e.message || e}`)
    }
}

handler.help = ['tourl3', 'tourl']
handler.tags = ['tools']
handler.command = /^(tourl3|tourl)$/i
handler.limit = true

export default handler