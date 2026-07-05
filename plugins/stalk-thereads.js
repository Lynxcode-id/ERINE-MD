/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Integrator : Lynx Decode
 * 📞 Contact    : +62 882-5804-1396
 * 📢 Channel    : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * ⚠️ Note       : Keep credit to respect the creator!
 * ─────────────────────────
 * 📝 Plugin     : Threads Stalker
 * 🎨 UI         : ERINE-AI Custom Style
 */

import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    const header = (title, emoji) => `┌˚₊ ๑│ ${title} │๑˚₊ ${emoji}\n┇ \n`
    const footer = () => `\n┇ \n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`

    if (!text) {
        return m.reply(header('THREADS STALK', '🔍') + `│ ❌ *Username-nya mana cuy?*\n│ *Contoh:* ${usedPrefix + command} google` + footer())
    }

    await m.react('⏳')

    try {
        let res = await fetch(`https://api.siputzx.my.id/api/stalk/threads?q=${encodeURIComponent(text)}`)
        let json = await res.json()

        if (!json.status || !json.data) {
            throw new Error('User tidak ditemukan atau server sedang gangguan.')
        }

        let data = json.data
        let links = data.links && data.links.length > 0 ? data.links.join(', ') : '-'
        
        let teks = header('THREADS STALK', '🔍')
        teks += `│ 👤 *Name      :* ${data.name || '-'}\n`
        teks += `│ 🏷️ *Username  :* @${data.username || '-'}\n`
        teks += `│ 🆔 *ID        :* ${data.id || '-'}\n`
        teks += `│ ✅ *Verified  :* ${data.is_verified ? 'Ya' : 'Tidak'}\n`
        teks += `│ 👥 *Followers :* ${data.followers ? data.followers.toLocaleString('id-ID') : '0'}\n`
        teks += `│ 📝 *Bio       :* ${data.bio || '-'}\n`
        teks += `│ 🔗 *Links     :* ${links}\n`
        teks += footer()

        await conn.sendMessage(m.chat, {
            image: { url: data.hd_profile_picture || data.profile_picture },
            caption: teks
        }, { quoted: m })

        await m.react('✨')

    } catch (e) {
        console.error(e)
        await m.react('❌')
        m.reply(header('STALK ERROR', '❌') + `│ ❌ *Terjadi kesalahan:*\n│ ${e.message}` + footer())
    }
}

handler.help = ['threadstalk <username>']
handler.tags = ['stalker']
handler.command = /^(threadstalk|stalkthreads)$/i
handler.limit = true

export default handler