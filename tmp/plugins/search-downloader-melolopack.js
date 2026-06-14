/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx Decode
 * ─────────────────────────
 * 📝 Plugin: Melolo All-in-One (Home, Search, Category, Detail, Downloader)
 */

import axios from 'axios'

// Helper untuk download image jadi buffer biar anti "Failed to fetch stream"
async function fetchImageBuffer(url) {
    try {
        if (!url) return null;
        const res = await axios.get(url, {
            responseType: 'arraybuffer',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });
        return Buffer.from(res.data);
    } catch (e) {
        return null; // Kalau link mati, kembalikan null
    }
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
    const apikey = 'cuki-x'
    const baseUrl = 'https://api.cuki.biz.id/api/movie'

    await m.react('⏳')

    try {
        // 1. MELOLO HOME
        if (command === 'melolohome') {
            let { data: res } = await axios.get(`${baseUrl}/melolo-home?apikey=${apikey}`)
            if (!res.success || !res.data) throw new Error('Gagal mengambil data Home.')

            let caption = `⚡ ＭＥＬＯＬＯ ＨＯＭＥ ⚡\n\n`
            let featured = res.data.content.featured.slice(0, 5)
            
            caption += `*🔥 FEATURED DRAMAS*\n`
            for (let item of featured) {
                caption += `» Title : ${item.title}\n» Eps   : ${item.episodes || '-'}\n» Link  : ${item.url}\n\n`
            }

            // Ubah gambar ke buffer
            let imageBuf = await fetchImageBuffer(featured[0].image)
            let msgOpt = imageBuf ? { image: imageBuf, caption: caption.trim() } : { text: caption.trim() }

            await conn.sendMessage(m.chat, msgOpt, { quoted: m })
        }

        // 2. MELOLO SEARCH
        else if (command === 'melolosearch') {
            if (!text) return m.reply(`❌ Masukkan judul!\n\n*Contoh:* ${usedPrefix + command} ceo`)
            
            let { data: res } = await axios.get(`${baseUrl}/melolo-search?apikey=${apikey}&query=${encodeURIComponent(text)}`)
            if (!res.success || !res.data.results || res.data.results.length === 0) throw new Error('Drama tidak ditemukan.')

            let caption = `⚡ ＭＥＬＯＬＯ ＳＥＡＲＣＨ ⚡\n\n`
            let items = res.data.results.slice(0, 5)

            for (let item of items) {
                caption += `» Title : ${item.title}\n» Type  : ${item.type}\n» Link  : ${item.url}\n\n`
            }
            caption += `> _Gunakan ${usedPrefix}melolodetail <link> untuk info lengkap._`

            let imageBuf = await fetchImageBuffer(items[0].image)
            let msgOpt = imageBuf ? { image: imageBuf, caption: caption.trim() } : { text: caption.trim() }

            await conn.sendMessage(m.chat, msgOpt, { quoted: m })
        }

        // 3. MELOLO CATEGORY
        else if (command === 'melolocategory') {
            if (!text) return m.reply(`❌ Masukkan URL Kategori!\n\n*Contoh:* ${usedPrefix + command} https://melolo.com/category/romance`)
            
            let { data: res } = await axios.get(`${baseUrl}/melolo-category?apikey=${apikey}&category_url=${encodeURIComponent(text)}`)
            if (!res.success || !res.data.content.allDramas) throw new Error('Kategori tidak ditemukan.')

            let caption = `⚡ ＭＥＬＯＬＯ ＣＡＴＥＧＯＲＹ ⚡\n\n`
            let items = res.data.content.allDramas.slice(0, 5)

            for (let item of items) {
                caption += `» Title : ${item.title}\n» Tags  : ${item.category || '-'}\n» Link  : ${item.url}\n\n`
            }

            let imageBuf = await fetchImageBuffer(items[0].image)
            let msgOpt = imageBuf ? { image: imageBuf, caption: caption.trim() } : { text: caption.trim() }

            await conn.sendMessage(m.chat, msgOpt, { quoted: m })
        }

        // 4. MELOLO DETAIL
        else if (command === 'melolodetail') {
            if (!text) return m.reply(`❌ Masukkan URL Drama!\n\n*Contoh:* ${usedPrefix + command} https://melolo.com/dramas/becoming-the-wolf`)
            
            let { data: res } = await axios.get(`${baseUrl}/melolo-detail?apikey=${apikey}&url=${encodeURIComponent(text)}`)
            if (!res.success || !res.data) throw new Error('Detail drama tidak ditemukan.')

            let meta = res.data.metadata
            let overview = res.data.overview
            
            let caption = `⚡ ＭＥＬＯＬＯ ＤＥＴＡＩＬ ⚡

» Title  : ${meta.title}
» Type   : ${overview.type}
» Status : ${overview.status}
» Eps    : ${overview.totalEpisodes}

> _${overview.description}_

> _Ketik ${usedPrefix}melolodl <link_episode> untuk mengunduh._`.trim()

            let imageBuf = await fetchImageBuffer(overview.coverImage)
            let msgOpt = imageBuf ? { image: imageBuf, caption: caption } : { text: caption }

            await conn.sendMessage(m.chat, msgOpt, { quoted: m })
        }

        // 5. MELOLO DOWNLOADER
        else if (command === 'melolodl') {
            if (!text) return m.reply(`❌ Masukkan URL Episode!\n\n*Contoh:* ${usedPrefix + command} https://melolo.com/dramas/phoenis-bargain-the-ceos-unexpected-vow/ep1`)
            
            let { data: res } = await axios.get(`${baseUrl}/melolo-download?apikey=${apikey}&url=${encodeURIComponent(text)}`)
            if (!res.success || !res.data.download) throw new Error('Gagal mengambil link download.')

            let dl = res.data.download.links.find(v => v.quality === '720p' || v.direct) || res.data.download.links[0]
            let videoUrl = dl.url.replace(/\\+$/, '')

            let caption = `⚡ ＭＥＬＯＬＯ ＤＯＷＮＬＯＡＤ ⚡

» Title   : ${res.data.episode.title}
» Quality : ${dl.quality || 'Unknown'}
» Size    : ${dl.sizeFormatted || 'Unknown'}

🔗 *Link Download:*
${videoUrl}

> _Silakan klik link di atas untuk mengunduh atau menonton langsung._`.trim()

            await conn.sendMessage(m.chat, { text: caption }, { quoted: m })
        }

        await m.react('✅')

    } catch (e) {
        console.error('[MELOLO AIO ERROR]', e)
        await m.react('❌')
        m.reply(`⚠️ *System Error:*\n_${e?.response?.data?.message || e.message || e}_`)
    }
}

handler.help = [
    'melolohome',
    'melolosearch <query>',
    'melolocategory <url>',
    'melolodetail <url>',
    'melolodl <url>'
]
handler.tags = ['search', 'downloader']
handler.command = /^(melolohome|melolosearch|melolocategory|melolodetail|melolodl)$/i
handler.limit = true

export default handler