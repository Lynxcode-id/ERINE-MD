import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return m.reply(`Contoh: ${usedPrefix + command} Gw tuh sebenarnya ultramen`)

    await m.react('⏳')

    try {
        // Pake URL asli dari lu (bisa diganti ke yg nggak ada .php /docs/ nya kalo ntar 404)
        const apiUrl = `https://api-nanzz.my.id/docs/api/maker/fake-ngl.php?text=${encodeURIComponent(text)}`
        
        // Tambahin User-Agent biar gak dikira bot spammer sama server API-nya
        const res = await fetch(apiUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        })
        
        if (!res.ok) throw new Error(`Status ${res.status}: ${res.statusText}`)
            
        // Cek apakah API ngasih JSON atau langsung Gambar
        const contentType = res.headers.get('content-type')
        if (contentType && contentType.includes('application/json')) {
            const json = await res.json()
            const imgUrl = json.result || json.url || json.data
            
            if (!imgUrl) throw new Error('URL Gambar tidak ditemukan di respon JSON')
            
            await conn.sendMessage(m.chat, { 
                image: { url: imgUrl }, 
                caption: `✅ Fake NGL berhasil dibuat.` 
            }, { quoted: m })
            
        } else {
            // Kalau API langsung ngasih gambar (Buffer)
            const buffer = Buffer.from(await res.arrayBuffer())
            await conn.sendMessage(m.chat, { 
                image: buffer, 
                caption: `✅ Fake NGL berhasil dibuat.` 
            }, { quoted: m })
        }

        await m.react('✅')
    } catch (e) {
        console.error('[FAKE NGL ERROR]', e)
        await m.react('❌')
        // Sekarang kalo error ketahuan gara-gara apa
        m.reply(`❌ Gagal membuat gambar NGL.\n> *Detail:* ${e.message}`)
    }
}

handler.help = ['fakengl <teks>']
handler.tags = ['maker']
handler.command = /^(fakengl|ngl)$/i
handler.limit = true

export default handler