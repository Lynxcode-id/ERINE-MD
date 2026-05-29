import axios from 'axios'
import uploadImage from '../lib/uploadImage.js'

let handler = async (m, { conn, usedPrefix, command }) => {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''
    
    if (!/image\/(jpe?g|png)/.test(mime)) {
        return m.reply(`📸 Kirim atau reply gambar dengan caption *${usedPrefix + command}*`)
    }

    await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })
    m.reply('⏳ _Sedang memproses gambar (Nano Banana 2 ➔ UHD Upscaler). Proses ini memakan waktu cukup lama karena sistem antrean, harap tunggu..._')

    try {
        let mediaBuffer = await q.download?.() || await conn.downloadMediaMessage(q)
        if (!mediaBuffer) throw new Error('Gagal mendownload media dari pesan.')

        let imageUrl = await uploadImage(mediaBuffer)
        if (!imageUrl) throw new Error('Gagal mengupload gambar ke server temporary.')

        const promptText = "Ultra-high-resolution 4K enhancement based strictly on the provided reference image. Absolute fidelity to original facial anatomy, proportions, and identity. Preserve expression, gaze, pose, camera angle, framing, and perspective with zero deviation. Clothing, hair, skin, and background elements must remain unchanged in structure, placement, and design. Recover fine-grain detail with natural realism. Enhance pores, fine lines, hair strands, eyelashes, fabric weave, seams, and material edges without introducing stylization. Maintain original color science, white balance, and tonal relationships exactly as captured. Lighting direction, intensity, contrast, and shadow behavior must match the source image precisely, with only improved clarity and expanded dynamic range. No relighting, no reshaping. Remove any grain. Apply controlled sharpening and high-frequency detail reconstruction. Remove compression artifacts and noise while retaining authentic texture. No smoothing, no plastic skin, no artificial gloss. Facial features must remain consistent across the entire image with coherent anatomy and clean, stable edges. Negative constraints: no warping, no facial drift, no added or missing anatomy, no altered hands, no distortions, no perspective shift, no text or graphics, no hallucinated detail, no stylized rendering. Output must read as a true-to-life, photorealistic upscale that matches the reference exactly, only clearer, sharper, and higher resolution."

        // 1. Inisiasi Task Nano Banana 2
        const initReq = `https://omegatech-api.dixonomega.tech/api/ai/nano-banana2?prompt=${encodeURIComponent(promptText)}&image=${encodeURIComponent(imageUrl)}`
        const { data: initRes } = await axios.get(initReq)

        if (!initRes.success || !initRes.task_id) throw new Error('Gagal menginisiasi task Nano Banana.')

        const taskId = initRes.task_id
        const fp = initRes.fp
        let resultUrlNano = null
        let attempts = 0

        // 2. Polling Loop buat ngecek hasil dari Nano Banana
        while (!resultUrlNano && attempts < 30) {
            await new Promise(r => setTimeout(r, 5000)) // Jeda 5 detik tiap ngecek
            const checkReq = `https://omegatech-api.dixonomega.tech/api/ai/nano-banana2-result?task_id=${taskId}${fp ? `&fp=${fp}` : ''}`
            const { data: check } = await axios.get(checkReq)

            if (check.status === 'completed' && check.image_url) {
                resultUrlNano = check.image_url
                break
            }
            if (check.status === 'failed') throw new Error('Gagal memproses gambar di server Nano Banana.')
            attempts++
        }

        if (!resultUrlNano) throw new Error('Waktu tunggu Nano Banana habis (Timeout).')

        // 3. Eksekusi Nexray UHD Upscaler 16x
        let uhdApiUrl = `https://api.nexray.web.id/tools/upscale?url=${encodeURIComponent(resultUrlNano)}&resolusi=16`

        let resUhd = await axios.get(uhdApiUrl, {
            responseType: 'arraybuffer',
            timeout: 120000 
        })

        if (!resUhd.data || resUhd.data.length < 1000) {
            throw new Error('API UHD Upscale gagal atau merespon kosong.')
        }

        // 4. Kirim Hasil Final
        await conn.sendMessage(m.chat, { 
            image: Buffer.from(resUhd.data), 
            caption: `✅ *UHD BERHASIL!*\n\nGambar telah di-enhancement menggunakan Nano Banana 2 dan ditingkatkan resolusinya ke UHD (16x).` 
        }, { quoted: m })

        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })

    } catch (e) {
        console.error('ERROR EDIT2 UHD:', e)
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
        m.reply(`❌ Waduh, gagal memproses gambar cuy.\n*Error:* ${e.message}`)
    }
}

handler.help = ['ultrahd']
handler.tags = ['maker', 'tools']
handler.command = /^(ultrahd)$/i
handler.limit = true

export default handler