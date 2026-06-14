/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx Decode
 * ─────────────────────────
 * 📝 Plugin: Read View Once (Anti-1x)
 */

let handler = async (m, { conn }) => {
    if (!m.quoted) return m.reply('❌ Reply ke pesan media (View Once)!')

    const q = m.quoted
    const mime = q.mimetype || ''

    // Pengecekan barbar: Kalo gak ada mimetype, tolak. Kalo ada, gas sedot!
    if (!mime) {
        return m.reply('❌ Pesan yang dibalas tidak mengandung media!')
    }

    await m.react('⏳')

    try {
        // Pake q.download() karena udah terbukti work di base lu (kaya fitur toimg)
        const media = await q.download()
        
        if (!media) throw new Error('Gagal mendownload media.')

        let txt = q.text ? `\n\n» *Caption:* ${q.text}` : ''
        let caption = `⚡ *A N T I - V I E W O N C E* ⚡${txt}\n\n> _Berhasil diekstrak oleh sistem_`

        if (/video/.test(mime)) {
            await conn.sendMessage(m.chat, { video: media, caption: caption }, { quoted: m })
        } else if (/image/.test(mime)) {
            await conn.sendMessage(m.chat, { image: media, caption: caption }, { quoted: m })
        } else if (/audio/.test(mime)) {
            await conn.sendMessage(m.chat, { audio: media, mimetype: mime, ptt: false }, { quoted: m })
        } else {
            await conn.sendFile(m.chat, media, 'media', caption, m)
        }

        await m.react('✅')
    } catch (e) {
        console.error('[RVO ERROR]', e)
        await m.react('❌')
        m.reply(`⚠️ *System Error:*\n${e.message || 'Gagal mengekstrak media.'}`)
    }
}

handler.help = ['rvo']
handler.tags = ['tools']
handler.command = /^(rvo|readviewonce)$/i
handler.limit = true
handler.admin = true

export default handler