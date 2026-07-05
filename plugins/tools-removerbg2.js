/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Scraper    : ONLym-Api
 * 👤 Integrator : Lynx Decode
 * 📢 Channel    : https://whatsapp.com/channel/0029VbAj9Sd47XeLArtDqO3X
 * ─────────────────────────
 * 📝 Plugin: Removal AI (Remove Background)
 */

import axios from 'axios'
import FormData from 'form-data'

const baseHeaders = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
    'Accept': '*/*',
    'Accept-Language': 'en-US,en;q=0.9',
    'Origin': 'https://removal.ai',
    'Referer': 'https://removal.ai/upload/',
    'X-Requested-With': 'XMLHttpRequest'
}

function cleanCookies(cookieHeaders) {
    if (!cookieHeaders || !cookieHeaders.length) return ''
    return cookieHeaders
        .map(c => c.split(';')[0])
        .filter(c => c.trim().length > 0)
        .join('; ')
}

async function getwebtoken() {
    const session = await axios.get('https://removal.ai/upload/', { headers: baseHeaders })
    const rawCookies = session.headers['set-cookie']
    const cookies = cleanCookies(rawCookies)

    const nonceMatch = session.data.match(/"ajax_nonce"\s*:\s*"([^"]+)"/) || session.data.match(/security\s*=\s*"([^"]+)"/)
    const securityNonce = nonceMatch ? nonceMatch[1] : "f84d58eda0"

    const r = await axios.get('https://removal.ai/wp-admin/admin-ajax.php', {
        headers: {
            ...baseHeaders,
            'Cookie': cookies
        },
        params: {
            action: 'ajax_get_webtoken',
            security: securityNonce
        }
    })

    if (!r.data || !r.data.success || !r.data.data?.webtoken) {
        throw new Error("Gagal mengamankan valid Web-Token dari server : " + JSON.stringify(r.data))
    }

    return {
        token: r.data.data.webtoken,
        cookies: cookies
    }
}

async function removebg(buffer, mime) {
    try {
        const { token, cookies } = await getwebtoken()

        const form = new FormData()
        form.append('image_file', buffer, {
            filename: `upload_${Date.now()}.jpg`,
            contentType: mime || 'image/jpeg'
        })

        const r = await axios.post('https://api.removal.ai/3.0/remove', form, {
            headers: {
                ...baseHeaders,
                ...form.getHeaders(),
                'Web-Token': token,
                'Cookie': cookies
            },
        })

        const resData = r.data

        return {
            status: true,
            creator: "ONLym-Api",
            data: {
                width: resData.original_width || null,
                height: resData.original_height || null,
                original_url: resData.original || null,
                result_url: resData.url || resData.low_resolution || null
            }
        }
    } catch (error) {
        return {
            status: false,
            creator: "ONLym-Api",
            message: error.response ? `Request failed [${error.response.status}] - ${JSON.stringify(error.response.data)}` : error.message
        }
    }
}

let handler = async (m, { conn, usedPrefix, command }) => {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''

    if (!mime.includes('image')) {
        return m.reply(`┌˚₊ ๑│ ʀ ᴇ ᴍ ᴏ ᴠ ᴇ  ʙ ɢ │๑˚₊ ✂️\n┇ \n│ ❌ *Fotonya mana cuy?*\n│ \n│ 📌 *Cara pakai:*\n│ Balas (reply) foto yang mau dihapus background-nya, lalu ketik:\n│ ❦ ${usedPrefix + command}\n┇ \n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`)
    }

    await m.react('⏳')

    try {
        let media = await q.download()
        
        let res = await removebg(media, mime)

        if (!res.status || !res.data || !res.data.result_url) {
            throw new Error(res.message || 'Gagal menghapus background dari server.')
        }

        let caption = `┌˚₊ ๑│ ʀ ᴇ ᴍ ᴏ ᴠ ᴇ  ʙ ɢ │๑˚₊ ✂️\n┇ \n`
        caption += `│ ✅ *Berhasil menghapus background!*\n`
        caption += `│ 📏 *Resolusi:* ${res.data.width}x${res.data.height}\n`
        caption += `┇ \n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`

        await conn.sendMessage(m.chat, { 
            image: { url: res.data.result_url }, 
            caption: caption 
        }, { quoted: m })

        await m.react('✅')
    } catch (error) {
        console.error('[REMOVEBG ERROR]', error)
        await m.react('❌')
        m.reply(`┌˚₊ ๑│ ꜱ ʏ ꜱ ᴛ ᴇ ᴍ  ᴇ ʀ ʀ ᴏ ʀ │๑˚₊ ❌\n┇ Gagal memproses gambar.\n┇ \n┇ *Detail:*\n┇ ${error.message || String(error)}\n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`)
    }
}

handler.help = ['removebg2', 'rmbg2', 'nobg2']
handler.tags = ['tools']
handler.command = /^(removebg2|rmbg2|nobg2)$/i
handler.limit = true

export default handler