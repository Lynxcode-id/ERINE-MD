import fetch from 'node-fetch'
import FormData from 'form-data'

let handler = async (m, { conn, usedPrefix, command }) => {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''

    if (!mime.startsWith('image/')) {
        return m.reply(`Kirim gambar dengan caption *${usedPrefix + command}* atau reply gambar yang sudah dikirim untuk meningkatkan kualitas (HD3).`)
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

        // 1. Upload gambar ke Tmpfiles (Sangat stabil)
        const uploadImage = async (buffer) => {
            let form = new FormData()
            form.append('file', buffer, {
                filename: 'enhance_image.jpg',
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
                    // Mengubah URL view menjadi URL direct download
                    return json.data.url.replace('tmpfiles.org/', 'tmpfiles.org/dl/')
                }
                throw new Error('Respon Tmpfiles tidak sukses')
            } catch (e) {
                console.error('[UPLOAD ERROR RAW]:', text.slice(0, 100))
                throw new Error('Web uploader (tmpfiles) sedang down atau membalas dengan HTML.')
            }
        }

        console.log('[HD3] Mengupload gambar sementara...')
        let imageUrl = await uploadImage(media)

        if (!imageUrl || !/^https?:\/\//i.test(imageUrl)) {
            await react('❌')
            return m.reply('Gagal mengupload gambar sementara. Coba lagi nanti.')
        }

        console.log('[HD3] URL Gambar:', imageUrl)
        console.log('[HD3] Memproses gambar di API Varhad (Remini)...')
        
        // 2. Tembak API Varhad
        const apiUrl = `https://api-varhad.my.id/tools/remini?imageUrl=${encodeURIComponent(imageUrl)}`

        let apiRes = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'accept': 'image/webp,image/apng,image/*,*/*;q=0.8,application/json',
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36'
            }
        })

        if (!apiRes.ok) {
            await react('❌')
            let errorText = await apiRes.text()
            console.error('[HD3 API ERROR]:', apiRes.status, errorText.slice(0, 100))
            
            if (errorText.includes('422')) {
                return m.reply('API Varhad gagal memproses gambar ini dari pusatnya (Error 422). Mereka mungkin sedang maintenance.')
            }
            return m.reply(`API Varhad sedang bermasalah (HTTP ${apiRes.status}). Coba lagi nanti.`)
        }

        // 3. Cek respon
        let contentType = apiRes.headers.get('content-type') || ''
        let imageToSend

        if (contentType.includes('application/json')) {
            let rawJson = await apiRes.text() // Ambil teksnya dulu agar aman dari crash
            try {
                let json = JSON.parse(rawJson)
                let resultUrl = json?.url || json?.result?.url || json?.data || json?.result
                
                if (!resultUrl || typeof resultUrl !== 'string') {
                    await react('❌')
                    return m.reply('API Varhad merespons JSON, tapi tidak ada link gambarnya.')
                }
                imageToSend = { url: resultUrl }
            } catch (e) {
                await react('❌')
                console.error('[JSON PARSE ERROR]:', rawJson.slice(0, 100))
                return m.reply('API Varhad membalas dengan HTML, bukan data yang valid. Web mereka mungkin sedang error.')
            }
        } else {
            // Langsung ambil gambar mentah jika API membalas berupa file
            let buffer = Buffer.from(await apiRes.arrayBuffer())
            if (buffer.length === 0) {
                await react('❌')
                return m.reply('API Varhad mengembalikan file kosong (0 bytes).')
            }
            imageToSend = buffer
        }

        console.log('[HD3] Hasil didapatkan, sedang mengirim...')

        // 4. Kirim hasil ke User
        await conn.sendMessage(m.chat, {
            image: imageToSend,
            caption: '✨ *Gambar berhasil ditingkatkan 3Kali lebih halus*'
        }, { quoted: m })

        await react('✅')
        console.log('[HD3] Selesai dikirim!')
    } catch (e) {
        await react('❌')
        console.error('[HD3 ERROR LOG]:', e)
        m.reply(`❌ *Terjadi kesalahan:*\n${e?.message || e}`)
    }
}

handler.help = ['hd3', 'remini2']
handler.tags = ['ai', 'tools']
handler.command = /^(hd3|remini2)$/i
handler.limit = true
handler.register = false
handler.group = false

export default handler
