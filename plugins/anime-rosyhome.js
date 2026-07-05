/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Integrator : Lynx Decode
 * 📞 Contact    : +62 882-5804-1396
 * 📢 Channel    : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * ⚠️ Note       : Keep credit to respect the creator!
 * ─────────────────────────
 * 📝 Plugin     : RosyScans Manga Downloader & Search
 * 🎨 UI         : ERINE-AI Custom Style
 */

import axios from 'axios'
import cheerio from 'cheerio'

async function scrapeRosyScans() {
    const url = 'https://cors.caliph.my.id/https://rosyscans.id'
    try {
        const { data: htmlContent } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
            }
        })
        const $ = cheerio.load(htmlContent)
        const scrapedData = { popularToday: [], projectUpdate: [], latestUpdates: [] }

        $('.popularslider .bsx').each((_, el) => {
            scrapedData.popularToday.push({
                title: $(el).find('.tt').text().trim(),
                chapter: $(el).find('.epxs').text().trim(),
                url: $(el).find('a').attr('href'),
                image: $(el).find('img').attr('src'),
                type: $(el).find('.limit .type').attr('class')?.replace('type ', '').trim() || 'Unknown'
            })
        })

        $('.bixbox').each((_, box) => {
            const sectionTitle = $(box).find('.releases h2').text().trim()
            if (sectionTitle === 'Project Update') {
                $(box).find('.bsx').each((_, el) => {
                    const chapters = []
                    $(el).find('.chfiv li').each((_, ch) => {
                        chapters.push({
                            chapter: $(ch).find('.fivchap').text().trim(),
                            timeUploaded: $(ch).find('.fivtime').text().trim(),
                            url: $(ch).find('a').attr('href')
                        })
                    })
                    scrapedData.projectUpdate.push({
                        title: $(el).find('.tt a').text().trim(),
                        url: $(el).find('.tt a').attr('href'),
                        image: $(el).find('img').attr('src'),
                        type: $(el).find('.limit .type').attr('class')?.replace('type ', '').trim() || 'Unknown',
                        chapters: chapters
                    })
                })
            }
            if (sectionTitle === 'Latest Update') {
                $(box).find('.uta').each((_, el) => {
                    const chapters = []
                    $(el).find('.luf ul li').each((_, ch) => {
                        chapters.push({
                            chapter: $(ch).find('a').text().trim(),
                            timeUploaded: $(ch).find('span').text().trim(),
                            url: $(ch).find('a').attr('href')
                        })
                    })
                    scrapedData.latestUpdates.push({
                        title: $(el).find('.luf h4').text().trim(),
                        url: $(el).find('.luf a.series').attr('href'),
                        image: $(el).find('.imgu img').attr('src'),
                        chapters: chapters
                    })
                })
            }
        })
        return scrapedData
    } catch (error) {
        return null
    }
}

async function searchManga(keyword) {
    const query = encodeURIComponent(keyword)
    const url = `https://cors.caliph.my.id/https://rosyscans.id/?s=${query}`
    try {
        const { data: htmlContent } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
            }
        })
        const $ = cheerio.load(htmlContent)
        const searchResults = []
        $('.postbody .listupd .bsx').each((_, el) => {
            const typeClass = $(el).find('.limit .type').attr('class') || ''
            const type = typeClass.replace('type ', '').trim()
            searchResults.push({
                title: $(el).find('.tt').text().trim(),
                chapter: $(el).find('.epxs').text().trim(),
                url: $(el).find('a').attr('href'),
                image: $(el).find('img').attr('src'),
                type: type || 'Unknown'
            })
        })
        return searchResults
    } catch (error) {
        return null
    }
}

async function getMangaDetail(mangaUrl) {
    const proxyUrl = `https://cors.caliph.my.id/${mangaUrl}`
    try {
        const { data: htmlContent } = await axios.get(proxyUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
            }
        })
        const $ = cheerio.load(htmlContent)
        const detailData = {}
        detailData.title = $('.entry-title[itemprop="name"]').text().trim()
        detailData.alternativeTitle = $('.alternative').text().trim()
        detailData.coverImage = $('.info-left .thumb img').attr('src')
        detailData.synopsis = $('.entry-content[itemprop="description"] p').text().trim()
        detailData.genres = []
        $('.wd-full .mgen a').each((_, el) => {
            detailData.genres.push($(el).text().trim())
        })
        detailData.status = $('.imptdt:contains("Status") i').text().trim()
        detailData.type = $('.imptdt:contains("Type") a').text().trim()
        detailData.author = $('.imptdt:contains("Posted By") i[itemprop="name"]').text().trim()
        detailData.postedOn = $('.imptdt:contains("Posted On") time').text().trim()
        detailData.updatedOn = $('.imptdt:contains("Updated On") time').text().trim()
        detailData.chapters = []
        $('#chapterlist ul li').each((_, el) => {
            detailData.chapters.push({
                chapter: $(el).find('.chapternum').text().trim(),
                date: $(el).find('.chapterdate').text().trim(),
                url: $(el).find('a').attr('href')
            })
        })
        return detailData
    } catch (error) {
        return null
    }
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
    const header = (title, emoji) => `┌˚₊ ๑│ ${title} │๑˚₊ ${emoji}\n┇ \n`
    const footer = () => `\n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`

    if (command === 'rosyhome') {
        await m.react('⏳')
        let data = await scrapeRosyScans()
        if (!data) return m.reply(header('ROSY SCANS', '❌') + `│ ❌ *Gagal mengambil data Home.*` + footer())
        
        let teks = header('ROSY SCANS HOME', '🏠')
        teks += `│ 🌟 *Popular Today:*\n`
        data.popularToday.slice(0, 5).forEach((v, i) => {
            teks += `│ ${i + 1}. ${v.title} (${v.chapter}) - ${v.type}\n`
            teks += `│ 🔗 ${v.url}\n`
        })
        teks += `┇ \n│ 🔄 *Latest Updates:*\n`
        data.latestUpdates.slice(0, 5).forEach((v, i) => {
            teks += `│ ${i + 1}. ${v.title}\n`
            if (v.chapters.length > 0) teks += `│ 📖 ${v.chapters[0].chapter} (${v.chapters[0].timeUploaded})\n`
            teks += `│ 🔗 ${v.url}\n`
        })
        teks += footer()
        await m.reply(teks)
        await m.react('✨')
    }

    else if (command === 'rosysearch') {
        if (!text) return m.reply(header('ROSY SEARCH', '🔍') + `│ ❌ *Masukkan judul manga yang dicari!*\n│ *Contoh:* ${usedPrefix + command} accidental` + footer())
        
        await m.react('⏳')
        let data = await searchManga(text)
        if (!data || data.length === 0) return m.reply(header('ROSY SEARCH', '❌') + `│ ❌ *Manga "${text}" tidak ditemukan.*` + footer())

        let teks = header('ROSY SEARCH', '🔍')
        teks += `│ ✅ *Ditemukan ${data.length} hasil untuk "${text}":*\n┇ \n`
        data.slice(0, 10).forEach((v, i) => {
            teks += `│ *${i + 1}. ${v.title}*\n`
            teks += `│ 📖 ${v.chapter}\n`
            teks += `│ 🏷️ Type: ${v.type}\n`
            teks += `│ 🔗 ${v.url}\n┇ \n`
        })
        teks += `│ 💡 *Gunakan ${usedPrefix}rosydetail <link> untuk melihat detail*` + footer()
        
        await conn.sendMessage(m.chat, {
            image: { url: data[0].image },
            caption: teks
        }, { quoted: m })
        await m.react('✨')
    }

    else if (command === 'rosydetail') {
        if (!text || !text.includes('rosyscans.id')) {
            return m.reply(header('ROSY DETAIL', 'ℹ️') + `│ ❌ *Masukkan link manga dari RosyScans!*\n│ *Contoh:* ${usedPrefix + command} https://rosyscans.id/manga/accidental-love/` + footer())
        }
        
        await m.react('⏳')
        let data = await getMangaDetail(text)
        if (!data) return m.reply(header('ROSY DETAIL', '❌') + `│ ❌ *Gagal mengambil detail manga.*` + footer())

        let teks = header('ROSY DETAIL', '📖')
        teks += `│ 📌 *Judul:* ${data.title}\n`
        if (data.alternativeTitle) teks += `│ 🔖 *Alternatif:* ${data.alternativeTitle}\n`
        teks += `│ 👤 *Author:* ${data.author}\n`
        teks += `│ 🎭 *Genre:* ${data.genres.join(', ')}\n`
        teks += `│ 🏷️ *Tipe:* ${data.type}\n`
        teks += `│ 📊 *Status:* ${data.status}\n`
        teks += `│ 📅 *Update:* ${data.updatedOn}\n┇ \n`
        teks += `│ 💬 *Sinopsis:*\n│ ${data.synopsis.substring(0, 300)}...\n┇ \n`
        
        teks += `│ 📚 *List Chapter (Terbaru):*\n`
        data.chapters.slice(0, 5).forEach(v => {
            teks += `│ 📖 ${v.chapter} - ${v.date}\n│ 🔗 ${v.url}\n`
        })
        teks += footer()

        await conn.sendMessage(m.chat, {
            image: { url: data.coverImage },
            caption: teks
        }, { quoted: m })
        await m.react('✨')
    }
}

handler.help = ['rosyhome', 'rosysearch <query>', 'rosydetail <link>']
handler.tags = ['manga']
handler.command = /^(rosyhome|rosysearch|rosydetail)$/i
handler.limit = true

export default handler