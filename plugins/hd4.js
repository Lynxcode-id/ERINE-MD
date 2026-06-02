import fetch from 'node-fetch'
import FormData from 'form-data'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  try {
    const q = m.quoted ? m.quoted : m
    const mime = (q.msg || q).mimetype || q.mediaType || ''

    let imageUrl = text?.trim()

    if (!imageUrl) {
      if (!mime || !/image/.test(mime)) {
        return m.reply(
          `⚠️ Balas/kirim foto atau masukkan URL gambar.\n\n` +
          `Contoh:\n${usedPrefix + command} https://example.com/ubed.jpg`
        )
      }

      await conn.sendMessage(m.chat, {
        react: { text: '⏳', key: m.key }
      })

      const buffer = await q.download().catch(() => null)

      if (!buffer) {
        throw new Error('Gagal mengunduh gambar.')
      }

      const form = new FormData()

      form.append('file', buffer, {
        filename: `ubed-${Date.now()}.jpg`
      })

      const uploadRes = await fetch(
        'https://storeapi.ubet.my.id/api/tourl?apikey=ubedpanel',
        {
          method: 'POST',
          body: form,
          headers: form.getHeaders()
        }
      )

      const uploadData = await uploadRes.json()

      if (!uploadData.success || !uploadData.url) {
        throw new Error(uploadData.error || 'Upload gagal')
      }

      imageUrl = uploadData.url
    }

    await conn.sendMessage(m.chat, {
      react: { text: '🖼️', key: m.key }
    })

    // Ambil JSON upscale dulu
    const apiUrl =
      `https://storeapi.ubet.my.id/api/upscale?apikey=ubedpanel&url=${encodeURIComponent(imageUrl)}`

    const apiRes = await fetch(apiUrl)

    if (!apiRes.ok) {
      const err = await apiRes.text().catch(() => '')
      throw new Error(err || `API Error ${apiRes.status}`)
    }

    const apiData = await apiRes.json()

    if (!apiData.success || !apiData.result) {
      throw new Error(apiData.error || 'Upscale gagal')
    }

    // Kirim hasil HD dari URL result
    await conn.sendMessage(m.chat, {
      image: { url: apiData.result },
      caption:
        `✅ *Berhasil HD / Upscale*\n\n` +
        `🔗 *Source:* ${imageUrl}\n\n` +
        `> Powered by Ubed API`
    }, { quoted: m })

    await conn.sendMessage(m.chat, {
      react: { text: '✅', key: m.key }
    })

  } catch (e) {
    console.error(e)

    await conn.sendMessage(m.chat, {
      react: { text: '❌', key: m.key }
    })

    m.reply(`❌ *Gagal HD gambar:*\n${e.message || e}`)
  }
}

handler.help = ['hd4 <url/reply image>']
handler.tags = ['tools']
handler.command = /^(hd4)$/i
handler.limit = true

export default handler