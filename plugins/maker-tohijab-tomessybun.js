import uploadImage from '../lib/uploadImage.js'
import fetch from 'node-fetch'

let handler = async (m, { conn, usedPrefix, command }) => {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''
    
    if (!/image\/(jpe?g|png)/.test(mime)) {
        return m.reply(`Kirim atau reply gambar dengan caption *${usedPrefix + command}*`)
    }

    const pushname = m.pushName || m.sender.split('@')[0]
    const fKontak = { 
        key: { fromMe: false, participant: `0@s.whatsapp.net`, remoteJid: 'status@broadcast' }, 
        message: { 
            contactMessage: { 
                displayName: pushname, 
                vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;a,;;;\nFN:${pushname}\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` 
            } 
        } 
    }

    await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } })

    try {
        let img = await q.download()
        let url = await uploadImage(img)
        
        let apiUrl = ''
        if (command === 'tohijab') {
            apiUrl = `https://api.lexcode.biz.id/api/ai/tohijab?url=${encodeURIComponent(url)}`
        } else if (command === 'tomessybun') {
            apiUrl = `https://api.lexcode.biz.id/api/ai/tomessybun?url=${encodeURIComponent(url)}`
        }

        let res = await fetch(apiUrl)
        let json = await res.json()

        let resultUrl = ''
        
        // Handling response API
        if (command === 'tohijab' && json.status) {
            resultUrl = json.result.hijab
        } else if (command === 'tomessybun' && json.success) {
            resultUrl = json.result
        } else {
            throw 'Gagal memproses gambar atau API sedang down.'
        }

        // Caption Simple Erine MD
        let caption = `✨ *AI Style Editor*
◦ *Mode* : ${command === 'tohijab' ? 'Hijab Style' : 'Messy Bun'}
◦ *Status* : Sukses

_© Erine MD_`

        await conn.sendMessage(m.chat, { 
            image: { url: resultUrl }, 
            caption: caption 
        }, { quoted: fKontak })
        
        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })

    } catch (e) {
        console.error(e)
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
        m.reply(`❌ *Error:* ${e.message || e}`)
    }
}

handler.help = ['tohijab', 'tomessybun']
handler.tags = ['ai']
handler.command = /^(tohijab|tomessybun)$/i
handler.limit = true

export default handler