/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Author     : Lynx Decode
 * 📝 Plugin     : Discord Stalker
 * 🎨 UI         : ERINE-AI Style
 * ─────────────────────────
 */

import fetch from 'node-fetch'

let handler = async (m, { conn, args, usedPrefix, command }) => {
    const header = (title, emoji) => `┌˚₊ ๑│ ${title} │๑˚₊ ${emoji}\n┇ \n`
    const footer = () => `\n┇ \n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`

    if (!args[0]) {
        let helpText = header('DISCORD STALK', '👾') +
            `│ ❌ *Masukkan ID Discord yang valid!*\n` +
            `│ *Contoh:* ${usedPrefix + command} 546512570694107157` +
            footer()
        return m.reply(helpText)
    }

    await m.react('⏳')

    try {
        let res = await fetch(`https://anabot.my.id/api/tools/stalkDiscord?id=${args[0]}&apikey=freeApikey`)
        let json = await res.json()

        if (!json.success || !json.data || !json.data.result) {
            throw new Error('User tidak ditemukan atau ID tidak valid.')
        }

        let data = json.data.result

        let teks = header('DISCORD STALK', '👾')
        teks += `│ 📌 *Global Name :* ${data.global_name || '-'}\n`
        teks += `│ 👤 *Username    :* ${data.username || '-'}\n`
        teks += `│ 🆔 *ID          :* ${data.id || '-'}\n`
        teks += `│ 📅 *Dibuat Pada :* ${data.created_at ? data.created_at.split('T')[0] : '-'}\n`
        teks += `│ ⏳ *Umur Akun   :* ${data.accountAge || '-'}\n`
        teks += `│ 💎 *Premium     :* ${data.premium_type || 'None'}\n`
        
        if (data.badges && data.badges.length > 0) {
            teks += `│ 🏅 *Badges      :* ${data.badges.join(', ')}\n`
        }

        teks += footer()

        if (data.avatar && data.avatar.link) {
            await conn.sendFile(m.chat, data.avatar.link, 'avatar.jpg', teks, m)
        } else {
            await m.reply(teks)
        }

        await m.react('✨')

    } catch (e) {
        console.error(e)
        await m.react('❌')
        m.reply(header('DISCORD STALK', '❌') + `│ ❌ *Terjadi kesalahan:*\n│ ${e.message}` + footer())
    }
}

handler.help = ['stalkdiscord <id>']
handler.tags = ['stalk']
handler.command = /^(stalkdiscord|discordstalk)$/i
handler.limit = true

export default handler