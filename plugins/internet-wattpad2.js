/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Author     : Lynx Decode
 * 📞 Contact    : +62 882-5804-1396
 * 📢 Channel    : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * ⚠️ Note       : Keep credit to respect the creator!
 * ─────────────────────────
 * 📝 Plugin: Wattpad lengkap - entahlah ga tau juga :v
 * 📦 Module : npm install node-fetch
 */

import fetch from 'node-fetch'

let handler = async (m, { conn, args, usedPrefix, command }) => {
    let action = args[0]?.toLowerCase()
    let query = args.slice(1).join(' ')

    const header = (title, emoji) => `┌˚₊ ๑│ ${title} │๑˚₊ ${emoji}\n┇ \n`
    const footer = () => `\n┇ \n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`
    
    if (!action || !['home', 'search', 'detail', 'read'].includes(action)) {
        let helpText = header('WATTPAD MENU', '📚') +
            `│ ❌ *Format salah atau perintah tidak dikenali!*\n` +
            `│ \n` +
            `│ *PANDUAN PENGGUNAAN:*\n` +
            `│ ◦ *${usedPrefix + command} home*\n` +
            `│   (Melihat daftar cerita populer)\n` +
            `│ ◦ *${usedPrefix + command} search <judul>*\n` +
            `│   (Mencari cerita wattpad)\n` +
            `│ ◦ *${usedPrefix + command} detail <url_cerita>*\n` +
            `│   (Melihat detail & daftar chapter)\n` +
            `│ ◦ *${usedPrefix + command} read <url_chapter>*\n` +
            `│   (Membaca isi chapter cerita)` +
            footer()
        return m.reply(helpText)
    }

    await m.react('⏳')

    try {
        if (action === 'home') {
            let res = await fetch(`https://bintangapi.my.id/api/baca/wattpad-home`)
            let json = await res.json()
            if (!json.success) throw new Error('Gagal mengambil data Home Wattpad.')

            let teks = header('WATTPAD HOME', '🏠')
            let stories = json.data.stories.slice(0, 7) 

            for (let [i, v] of stories.entries()) {
                teks += `│ *${i + 1}. ${v.title}*\n`
                teks += `│ 👤 Author : ${v.author}\n`
                teks += `│ 👁️ Reads  : ${v.reads} | ⭐ Votes: ${v.votes}\n`
                teks += `│ 🔗 Link   : ${v.url}\n`
                teks += i === stories.length - 1 ? '' : `│ ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n`
            }
            teks += footer()
            
            let coverUrl = stories[0]?.cover || ''
            if (coverUrl) {
                await conn.sendFile(m.chat, coverUrl, 'cover.jpg', teks, m)
            } else {
                await m.reply(teks)
            }
        } 
        
        else if (action === 'search') {
            if (!query) return m.reply(header('WATTPAD SEARCH', '🔍') + `│ ❌ *Masukkan judul yang ingin dicari!*\n│ *Contoh:* ${usedPrefix + command} search Girls` + footer())
            
            let res = await fetch(`https://bintangapi.my.id/api/baca/wattpad-searc?q=${encodeURIComponent(query)}`)
            let json = await res.json()
            if (!json.success || json.data.stories.length === 0) throw new Error('Cerita tidak ditemukan.')

            let teks = header('WATTPAD SEARCH', '🔍')
            teks += `│ 🔎 *Hasil pencarian untuk:* ${query}\n│ \n`
            
            let stories = json.data.stories.slice(0, 5) 
            for (let [i, v] of stories.entries()) {
                teks += `│ *${i + 1}. ${v.title}*\n`
                teks += `│ 👤 Author : ${v.author}\n`
                teks += `│ 👁️ Reads  : ${v.reads} | ⭐ Votes: ${v.votes}\n`
                teks += `│ 🔗 Link   : ${v.url}\n`
                teks += i === stories.length - 1 ? '' : `│ ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n`
            }
            teks += footer()

            let coverUrl = stories[0]?.cover || ''
            if (coverUrl) {
                await conn.sendFile(m.chat, coverUrl, 'cover.jpg', teks, m)
            } else {
                await m.reply(teks)
            }
        }

        else if (action === 'detail') {
            if (!query || !query.includes('wattpad.com')) return m.reply(header('WATTPAD DETAIL', '📖') + `│ ❌ *Masukkan URL cerita Wattpad yang valid!*\n│ *Contoh:* ${usedPrefix + command} detail https://www.wattpad.com/story/...` + footer())

            let res = await fetch(`https://bintangapi.my.id/api/baca/wattpad-det?url=${encodeURIComponent(query)}`)
            let json = await res.json()
            if (!json.success) throw new Error('Gagal mengambil detail cerita. Pastikan URL valid.')

            let data = json.data
            let teks = header('WATTPAD DETAIL', '📖')
            teks += `│ 📌 *Judul:* ${data.title}\n`
            teks += `│ 👤 *Author:* ${data.author}\n`
            teks += `│ 🎭 *Genre:* ${data.genre}\n`
            teks += `│ 📊 *Status:* ${data.status}\n`
            teks += `│ 👁️ *Reads:* ${data.stats.reads} | ⭐ *Votes:* ${data.stats.votes}\n`
            teks += `│ 📑 *Total Bab:* ${data.stats.parts}\n│ \n`
            teks += `│ 📝 *Deskripsi:*\n│ ${data.description.substring(0, 300)}... [Lebih Lanjut di Web]\n│ \n`
            
            teks += `│ 📚 *Daftar Chapter (Awal):*\n`
            let chapters = data.chapters.slice(0, 3) 
            for (let [i, c] of chapters.entries()) {
                teks += `│ ◦ ${c.title || `Chapter ${i + 1}`}\n│   ${c.url}\n`
            }
            if (data.chapters.length > 3) {
                teks += `│ ◦ ...dan ${data.chapters.length - 3} chapter lainnya.\n`
            }
            teks += footer()

            await conn.sendFile(m.chat, data.cover, 'cover.jpg', teks, m)
        }

        else if (action === 'read') {
            if (!query || !query.includes('wattpad.com')) return m.reply(header('WATTPAD BACA', '📚') + `│ ❌ *Masukkan URL chapter Wattpad yang valid!*\n│ *Contoh:* ${usedPrefix + command} read https://www.wattpad.com/...` + footer())

            let res = await fetch(`https://bintangapi.my.id/api/baca/wattpad-baca?url=${encodeURIComponent(query)}`)
            let json = await res.json()
            if (!json.success) throw new Error('Gagal membaca isi chapter. Pastikan URL chapter valid.')

            let data = json.data
            let contentText = data.content.join('\n\n') 

            let teks = header('WATTPAD BACA', '📖')
            teks += `│ 📌 *Story:* ${data.story_title}\n`
            teks += `│ 📑 *Chapter:* ${data.chapter_title}\n`
            teks += `│ 👤 *Author:* ${data.author}\n`
            teks += footer()
            
            await m.reply(teks)
            
            setTimeout(async () => {
                await m.reply(contentText)
            }, 1000)
        }

        await m.react('✨')

    } catch (e) {
        console.error(e)
        await m.react('❌')
        m.reply(header('WATTPAD ERROR', '❌') + `│ ❌ *Terjadi kesalahan:*\n│ ${e.message}` + footer())
    }
}

handler.help = ['wattpad2 <opsi> <query>']
handler.tags = ['internet']
handler.command = /^wattpad2$/i
handler.limit = true

export default handler