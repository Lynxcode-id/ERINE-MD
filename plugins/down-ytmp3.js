import axios from 'axios'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return m.reply(`Masukan URL YouTube!\n\nContoh: *${usedPrefix + command}* https://youtube.com/watch?v=8AeG7hbXFE4`)

    let msg = await conn.sendMessage(m.chat, { text: '🎬 [ 0% ] Menyiapkan permintaan...' }, { quoted: m })
    let key = msg.key

    const loadingAnimation = async () => {
        const steps = [
            { t: '📡 [ 20% ] Menghubungkan ke API Ryzumi...' },
            { t: '📥 [ 45% ] Mengambil metadata YouTube...' },
            { t: '⚙️ [ 70% ] Mengunduh stream audio ke buffer...' },
            { t: '📦 [ 90% ] Membungkus paket audio...' },
            { t: '✅ [ 100% ] Siap dikirim!' }
        ]
        for (let step of steps) {
            await new Promise(resolve => setTimeout(resolve, 800))
            await conn.sendMessage(m.chat, { text: step.t, edit: key }).catch(() => {}) 
        }
    }

    const fetchAndDownload = async () => {
        const endpoint = 'https://api.ryzumi.net/api/downloader/ytmp3'

        const res = await axios.get(endpoint, {
            params: { url: text },
            headers: { 'accept': 'application/json' }
        })

        const yt = res.data

        if (!yt || !yt.url) throw new Error('Data atau link audio gak ditemuin dari server Ryzumi.')

        try {
            const audioRes = await axios.get(yt.url, {
                responseType: 'arraybuffer',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                }
            })
            yt.audioBuffer = Buffer.from(audioRes.data)
            return yt
        } catch (err) {
            console.log('Error Download Buffer Ryzumi:', err.message)
            throw new Error('Gagal mengunduh file audio ke buffer. Kemungkinan server pengunduh lagi sibuk/limit.')
        }
    }

    try {
        const [_, yt] = await Promise.all([loadingAnimation(), fetchAndDownload()])

        let caption = `
乂  *Y O U T U B E  -  M P 3*

    ◦  *Judul* : ${yt.title || 'Tidak diketahui'}
    ◦  *Channel* : ${yt.author || '-'}
    ◦  *Durasi* : ${yt.lengthSeconds ? yt.lengthSeconds + ' detik' : '-'}
    ◦  *Views* : ${yt.views ? yt.views.toLocaleString('id-ID') : '-'}
    ◦  *Upload* : ${yt.uploadDate || '-'}
    ◦  *Kualitas* : ${yt.quality || '128kbps'}

_Audio sedang dikirim ke chat ini..._`

        await conn.sendMessage(m.chat, { text: caption, edit: key })

        await conn.sendMessage(m.chat, { 
            audio: yt.audioBuffer, 
            mimetype: 'audio/mpeg', 
            fileName: `${yt.title}.mp3`,
            contextInfo: {
                isForwarded: true,
                forwardingScore: 9999,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: "120363400612665352@newsletter",
                    newsletterName: "🌟 ᴇʀɪɴᴇ-ᴍᴅ ɪɴғᴏʀᴍᴀᴛɪᴏɴ",
                    serverMessageId: -1
                }
            }
        }, { quoted: m })

    } catch (e) {
        console.error(e)
        try {
            await conn.sendMessage(m.chat, { text: `❌ Gagal: ${e.message}`, edit: key })
        } catch (err) {
            m.reply(`❌ Gagal: ${e.message}`)
        }
    }
}

handler.help = ['ytmp3']
handler.tags = ['downloader']
handler.command = /^(ytmp3|yta)$/i

export default handler
