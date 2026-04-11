import fetch from 'node-fetch'
import FormData from 'form-data'

let handler = async (m, { conn, usedPrefix, command }) => {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''

    if (!mime.startsWith('image/')) {
        return m.reply(`Kirim gambar dengan caption *${usedPrefix + command}* atau reply gambar yang sudah dikirim untuk meningkatkan kualitas (FHD).`)
    }

    const react = async (emoji) => {
        try {
            if (typeof m.react === 'function') await m.react(emoji)
        } catch {}
    }

    try {
        await react('🌟')

        let media = await q.download()
        if (!media || !Buffer.isBuffer(media) || media.length === 0) {
            await react('❌')
            return m.reply('Gagal membaca file gambar. Kirim ulang gambarnya.')
        }

        // 1. Upload ke Tmpfiles (Karena Catbox diblokir)
        const uploadImage = async (buffer) => {
            let form = new FormData()
            form.append('file', buffer, {
                filename: 'enhance.jpg',
                contentType: mime || 'image/jpeg'
            })

            let res = await fetch('https://tmpfiles.org/api/v1/upload', {
                method: 'POST',
                body: form,
                headers: form.getHeaders()
            })

            let text = await res.text()
            try {
                let json = JSON.parse(text)
                if (json.status === 'success') {
                    return json.data.url.replace('tmpfiles.org/', 'tmpfiles.org/dl/')
                }
                throw new Error('Upload gagal')
            } catch (e) {
                throw new Error('Web uploader (tmpfiles) sedang down.')
            }
        }

        console.log('[FHD] Mengupload gambar sementara ke Tmpfiles...')
        let imageUrl = await uploadImage(media)

        if (!imageUrl) {
            await react('❌')
            return m.reply('Gagal mengupload gambar sementara.')
        }

        console.log('[FHD] URL Tmpfiles:', imageUrl)
        console.log('[FHD] Menembak API Faa...')

        // 2. Tembak API Faa dengan header samaran maksimal (Bypass WAF attempt)
        const apiUrl = `https://api-faa.my.id/faa/hdv4?image=${encodeURIComponent(imageUrl)}`

        let apiRes = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                'accept-language': 'en-US,en;q=0.9,id;q=0.8',
                'cache-control': 'max-age=0',
                'sec-ch-ua': '"Google Chrome";v="123", "Not:A-Brand";v="8", "Chromium";v="123"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"Windows"',
                'sec-fetch-dest': 'document',
                'sec-fetch-mode': 'navigate',
                'sec-fetch-site': 'none',
                'sec-fetch-user': '?1',
                'upgrade-insecure-requests': '1',
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36'
            }
        })

        let rawText = await apiRes.text()

        // Cek jika kena blokir Cloudflare (403/503)
        if (!apiRes.ok) {
            await react('❌')
            console.error('[FHD API ERROR]:', apiRes.status, rawText.slice(0, 150))
            
            if (rawText.includes('<html') || apiRes.status === 403 || apiRes.status === 503) {
                return m.reply('⚠️ *Akses Ditolak Cloudflare*\n\nAPI Faa mendeteksi bot ini sebagai ancaman (Error 403/503). IP VPS kamu sudah diblokir oleh sistem keamanan API Faa. Ini tidak bisa di-bypass lewat kode.')
            }
            return m.reply(`API Faa sedang bermasalah (HTTP ${apiRes.status}).`)
        }

        // 3. Eksekusi Data JSON
        let resultUrl
        try {
            let json = JSON.parse(rawText)
            resultUrl = json?.result?.image_upscaled || json?.result?.url || json?.image_upscaled || json?.url
            
            if (!resultUrl || !/^https?:\/\//i.test(resultUrl)) {
                await react('❌')
                return m.reply('API Faa merespons, tapi tidak memberikan link gambar hasil yang valid.')
            }
        } catch (e) {
            await react('❌')
            console.error('[FHD JSON PARSE ERROR]:', rawText.slice(0, 100))
            return m.reply('API Faa membalas dengan HTML, web mereka mungkin sedang error atau meminta verifikasi Captcha.')
        }

        console.log('[FHD] Hasil didapatkan:', resultUrl)

        // 4. Kirim Hasil
        await conn.sendMessage(m.chat, {
            image: { url: resultUrl },
            caption: '✨ *Gambar berhasil ditingkatkan ke FHD (API Faa)!*'
        }, { quoted: m })

        await react('✅')
        console.log('[FHD] Selesai dikirim!')
    } catch (e) {
        await react('❌')
        console.error('[FHD FATAL ERROR]:', e)
        m.reply(`❌ *Terjadi kesalahan:*\n${e?.message || e}`)
    }
}

handler.help = ['fhd', 'enhance']
handler.tags = ['ai', 'tools']
handler.command = /^(fhd|enhance)$/i
handler.limit = true
handler.register = false
handler.group = false

export default handler
