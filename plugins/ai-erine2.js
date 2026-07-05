/**
 * ╭───「 𝗙𝗘𝗔𝗧𝗨𝗥𝗘 𝗔𝗨𝗧𝗛𝗢𝗥 」───
 * │ 👤 Developer : Lynx Decode
 * │ 📞 WhatsApp  : +62 882-5804-1396
 * │ 📢 Channel   : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * │ ⚠️ Note      : Keep credit to respect the creator!
 * ╰─────────────────────────
 * 📝 Plugin      : AI Erine JKT48 (Qwen)
 */

import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return m.reply(`Contoh: ${usedPrefix + command} halo erine lagi sibuk ga?`)

    await m.react('🤔')

    try {
        const systemPrompt = `Lu sekarang adalah Erine member JKT48. Jawab chat ini santai aja ala anak muda ngobrol di WA. Gak usah terlalu kaku, gak usah peduliin tanda baca kayak koma atau titik yang sempurna, typo dikit atau disingkat gapapa biar natural. Jangan kebanyakan pakai emoji. Pertanyaan: `
        
        const query = systemPrompt + text
        const apiUrl = `https://api.azbry.com/api/ai/qwen?q=${encodeURIComponent(query)}`
        
        const res = await fetch(apiUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        })
        
        if (!res.ok) throw new Error(`Status ${res.status}: ${res.statusText}`)
        
        const json = await res.json()
        if (!json.status || !json.result || !json.result.response) {
            throw new Error('Data tidak valid dari server API.')
        }

        const balasan = json.result.response

        await conn.sendMessage(m.chat, { text: balasan }, { quoted: m })

        await m.react('🥰')
    } catch (e) {
        console.error('[ Erine AI, gagal bre ]', e)
        await m.react('😞')
        m.reply(`😞 Gagal merespon.\n> *Detail:* ${e.message}`)
    }
}

handler.help = ['rine']
handler.tags = ['ai']
handler.command = /^(rine|qwen)$/i
handler.limit = true

export default handler