import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return m.reply(`Masukkan nama package yang mau dicari cok!\n*Contoh:* ${usedPrefix + command} axios`)

    try {
        // Kasih reaction loading
        await m.react('⏳')

        const response = await fetch(`https://api.nexray.web.id/downloader/npm?q=${encodeURIComponent(text)}`)
        const res = await response.json()

        if (!res.status || !res.result) {
            await m.react('❌')
            return m.reply('❌ Waduh, package tidak ditemukan atau API lagi down.')
        }

        const data = res.result
        const sizeInMB = (data.size / (1024 * 1024)).toFixed(2)

        let caption = `📦 *NPM PACKAGE DOWNLOADER*\n\n`
        caption += `🏷️ *Name:* ${data.name}\n`
        caption += `📌 *Version:* ${data.version}\n`
        caption += `👤 *Author:* ${data.author || 'Unknown'}\n`
        caption += `⚖️ *License:* ${data.license || '-'}\n`
        caption += `🗂️ *Size:* ${sizeInMB} MB\n`
        caption += `🏠 *Homepage:* ${data.homepage || '-'}\n`
        caption += `🔗 *Repository:* ${data.repository || '-'}\n`
        caption += `📝 *Description:* ${data.description}\n\n`
        caption += `*Tunggu sebentar, file .tgz sedang dikirim...*`

        // Kirim detail package
        await conn.sendMessage(m.chat, { text: caption }, { quoted: m })

        // Kirim file document .tgz
        await conn.sendMessage(m.chat, {
            document: { url: data.download_url },
            mimetype: 'application/gzip',
            fileName: `${data.name}-v${data.version}.tgz`,
            caption: `Nih cok file compress dari package ${data.name} 🚀`
        }, { quoted: m })

        // Kasih reaction sukses
        await m.react('✅')

    } catch (e) {
        await m.react('❌')
        console.error(e)
        m.reply('❌ Terjadi kesalahan pada server atau API.')
    }
}

handler.help = ['npm <package>']
handler.tags = ['downloader']
handler.command = /^(npm|npmjs|npmsearch)$/i
handler.limit = true
handler.register = false
handler.group = false

export default handler