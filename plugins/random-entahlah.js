/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx Decode
 * 📞 WhatsApp  : +62 882-5804-1396
 * 📢 Channel   : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * ⚠️ Note      : Keep credit to respect the creator!
 * ─────────────────────────
 * 📝 Plugin: Random API (Asupan, PP Couple, JKT48, Meme)
 */

import axios from 'axios'

let handler = async (m, { conn, command }) => {
    await m.react('⚡')

    let apikey = 'free' // Ganti kalau lu punya apikey langganan dari ikyyxd
    let cmd = command.toLowerCase()

    try {
        // ==========================================
        // COMMAND: PP COUPLE
        // ==========================================
        if (cmd === 'ppcouple' || cmd === 'ppcp') {
            let res = await axios.get(`https://api.ikyyxd.my.id/random/ppcouple?apikey=${apikey}`)
            
            let cowo = res.data?.result?.cowo || res.data?.cowo
            let cewe = res.data?.result?.cewe || res.data?.cewe

            if (!cowo || !cewe) throw new Error('Format respon API gagal dibaca cuy.')

            await conn.sendMessage(m.chat, { image: { url: cowo }, caption: '👨 *Cowok*' }, { quoted: m })
            await conn.sendMessage(m.chat, { image: { url: cewe }, caption: '👩 *Cewek*' }, { quoted: m })
            
            await m.react('✅')
            return
        }

        // ==========================================
        // COMMAND: RANDOM VIDEO (Asupan, JKT48, Meme)
        // ==========================================
        let endpoint = ''
        let caption = ''

        if (cmd === 'asupan') {
            endpoint = `/random/asupan?apikey=${apikey}`
            caption = `✨ *R A N D O M   A S U P A N*`
        } else if (cmd === 'tiktokjkt48' || cmd === 'jkt48') {
            endpoint = `/random/tiktok/jkt48`
            caption = `✨ *R A N D O M   J K T 4 8*`
        } else if (cmd === 'tiktokmeme' || cmd === 'meme') {
            endpoint = `/random/tiktokmeme`
            caption = `✨ *R A N D O M   M E M E*`
        }

        let apiUrl = `https://api.ikyyxd.my.id${endpoint}`
        let apiRes = await axios.get(apiUrl, { responseType: 'arraybuffer' })
        let contentType = apiRes.headers['content-type']

        if (contentType && contentType.includes('application/json')) {
            // Kalau API malah balikin JSON, ambil URL-nya
            let json = JSON.parse(Buffer.from(apiRes.data).toString('utf-8'))
            let mediaUrl = json.result?.url || json.url || json.data
            
            if (!mediaUrl) throw new Error('Gagal dapetin URL media dari JSON server.')
            
            await conn.sendMessage(m.chat, { video: { url: mediaUrl }, caption: caption }, { quoted: m })
        } else {
            // Kalau API langsung nembak buffer video
            let mediaBuffer = Buffer.from(apiRes.data)
            await conn.sendMessage(m.chat, { video: mediaBuffer, caption: caption }, { quoted: m })
        }

        await m.react('✅')

    } catch (err) {
        console.error(`Error Random API (${command}):`, err.message)
        await m.react('❌')
        m.reply(`❌ *Gagal memproses permintaan.*\nError: ${err.message}`)
    }
}

handler.help = ['asupan', 'ppcouple', 'tiktokjkt48', 'tiktokmeme']
handler.tags = ['random']
handler.command = /^(asupan|ppcouple|ppcp|tiktokjkt48|jkt48|tiktokmeme|meme)$/i
handler.limit = true

export default handler