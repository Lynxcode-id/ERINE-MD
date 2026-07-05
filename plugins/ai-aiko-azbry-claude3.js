/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Scraper    : hazeloffc
 * 👤 Integrator : Lynx Decode
 * 📢 Channel    : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * ─────────────────────────
 * 📝 Plugin: Azbry AI Chatbot (Aiko & Claude)
 */

import axios from 'axios'

async function azbryChat(message, model = 'aiko') {
    const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    const API_BASE = 'https://chat.azbry.com'

    const MODELS = {
        aiko: {
            name: 'Aiko',
            endpoint: '/api/ai/aiko',
            system: 'You are Aiko, a helpful AI assistant from chat.azbry.com. You are powered by Llama 3.3 70B Versatile model. You were developed by febry.is-a.dev. Always respond in Bahasa Indonesia unless the user writes in another language. Be friendly, concise, and helpful.'
        },
        claude: {
            name: 'Claude',
            endpoint: '/api/ai/claude',
            system: 'You are Claude, a helpful AI assistant from chat.azbry.com. You are powered by Claude 3 Haiku model. You were developed by febry.is-a.dev. Always respond in Bahasa Indonesia unless the user writes in another language. Be analytical, detailed, and thorough.'
        }
    }

    if (!MODELS[model]) {
        throw new Error(`Model "${model}" tidak tersedia. Pilih: aiko, claude`)
    }

    const tokenResponse = await axios.get(`${API_BASE}/api/token`, {
        headers: { 'User-Agent': UA }
    })

    const token = tokenResponse.data.token
    if (!token) throw new Error('Gagal mendapatkan token dari server Azbry')

    const config = MODELS[model]
    const fullPrompt = `${config.system}\n\nUser: ${message}`

    const response = await axios.get(`${API_BASE}${config.endpoint}`, {
        params: {
            q: fullPrompt,
            token: token
        },
        headers: {
            'User-Agent': UA,
            'Accept': 'application/json'
        }
    })

    return response.data.response || response.data.result || 'Tidak ada respons dari AI.'
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        return m.reply(`┌˚₊ ๑│ ᴀ ᴢ ʙ ʀ ʏ  ᴀ ɪ │๑˚₊ 🤖\n┇ \n│ ❌ *Mau nanya apa cuy?*\n│ \n│ 📌 *Cara pakai:*\n│ ❦ ${usedPrefix + command} halo kamu siapa?\n┇ \n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`)
    }

    await m.react('⏳')

    try {
        let modelType = command.toLowerCase() === 'claude' ? 'claude' : 'aiko'
        const result = await azbryChat(text.trim(), modelType)

        let caption = `┌˚₊ ๑│ ᴀ ᴢ ʙ ʀ ʏ  ᴀ ɪ │๑˚₊ 🤖\n┇ \n`
        caption += `│ 👤 *Model:* ${modelType.toUpperCase()}\n`
        caption += `│ 💬 *Jawaban:*\n│ ${result.replace(/\n/g, '\n│ ')}\n`
        caption += `┇ \n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`

        await conn.sendMessage(m.chat, { 
            text: caption.trim() 
        }, { quoted: m })

        await m.react('✅')
    } catch (error) {
        console.error('[AZBRY AI ERROR]', error)
        await m.react('❌')
        m.reply(`┌˚₊ ๑│ ꜱ ʏ ꜱ ᴛ ᴇ ᴍ  ᴇ ʀ ʀ ᴏ ʀ │๑˚₊ ❌\n┇ Gagal memproses permintaan AI.\n┇ \n┇ *Detail:*\n┇ ${error.message || String(error)}\n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`)
    }
}

handler.help = ['aiko <teks>', 'claude <teks>']
handler.tags = ['ai']
handler.command = /^(aiko|claude3|azbry)$/i
handler.limit = true

export default handler