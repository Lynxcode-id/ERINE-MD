/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Scraper    : JH a.k.a Dhika (Fiony Bot)
 * 👤 Integrator : Lynx Decode
 * 📞 Contact    : +62 882-5804-1396
 * 📢 Channel    : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * ⚠️ Note       : Keep credit to respect the creator!
 * ─────────────────────────
 * 📝 Plugin: Kusonime (Search, Latest, Detail)
 */

import axios from 'axios'
import * as cheerio from 'cheerio'

// --- CORE SCRAPER KUSONIME ---
async function JHKusonime(action = 'search', queryOrUrl = '') {
    const baseRes = { author_skrep: 'JH a.k.a Dhika', kesayangan: 'Fiony Alveria♡' };

    const jantung = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7'
    };

    const res = (status, payload) => {
        const out = { ...baseRes, status, action };
        if (status) out.data = payload; else out.error = payload;
        return out; 
    };

    try {
        if (action === 'search' || action === 'latest') {
            if (action === 'search' && !queryOrUrl) throw new Error('Query pencarian anime wajib diisi wak!');
            
            const targetUrl = action === 'search' 
                ? `https://kusonime.com/?s=${encodeURIComponent(queryOrUrl)}&post_type=post` 
                : 'https://kusonime.com/';
                
            const { data } = await axios.get(targetUrl, { headers: jantung });
            const $ = cheerio.load(data);
            const results = [];

            $('.venz ul .detpost').each((i, el) => {
                const title = $(el).find('h2.episodeye a').text().trim() || $(el).find('.content h2 a').text().trim();
                const url = $(el).find('h2.episodeye a').attr('href') || $(el).find('.content h2 a').attr('href') || $(el).find('a').first().attr('href');
                const thumb = $(el).find('.thumb img').attr('src');
                const date = $(el).find('.content p').first().text().trim();
                
                const genres = [];
                $(el).find('.content p a').each((j, a) => {
                    genres.push($(a).text().trim());
                });

                if (title && url) {
                    results.push({ title, thumb, date, genres: genres.join(', '), url });
                }
            });

            if (results.length === 0) throw new Error(action === 'search' ? 'Anime nggak ketemu wak!' : 'Gagal narik anime terbaru!');
            return res(true, results);
        }

        if (action === 'detail') {
            if (!queryOrUrl) throw new Error('URL atau Slug Kusonime wajib diisi wak!');
            
            let targetUrl = queryOrUrl.trim();
            if (!targetUrl.startsWith('http')) {
                if (targetUrl.includes('kusonime.com')) {
                    targetUrl = `https://${targetUrl}`;
                } else {
                    targetUrl = `https://kusonime.com/${targetUrl.replace(/^\/+|\/+$/g, '')}/`;
                }
            }
            
            const { data } = await axios.get(targetUrl, { headers: jantung });
            const $ = cheerio.load(data);

            // FIX: Diperketat murni ke `.jdlz` biar nggak nangkep text dari sidebar
            const title = $('.jdlz').first().text().trim() || $('.venser h1').first().text().trim();
            const thumb = $('.post-thumb img').first().attr('src') || $('.venser img').first().attr('src') || '';
            
            // Validasi URL error 404
            if (!title || title.includes('Updatan Terbaru')) {
                throw new Error('Gagal mengambil data. Pastikan URL yang lu masukin bener-bener link *Detail Post* Kusonime!');
            }
            
            let sinopsis = '';
            $('.lexot p').each((i, el) => {
                let text = $(el).text().trim();
                if (!$(el).find('b').length && !$(el).find('strong').length && text.length > 15) {
                    sinopsis += text + '\n\n';
                }
            });
            sinopsis = sinopsis.trim();

            const info = {};
            $('.info p').each((i, el) => {
                const bText = $(el).find('b').text().trim();
                const fullText = $(el).text().trim();
                if (bText && fullText.includes(':')) {
                    const key = bText.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z_]/g, '');
                    const val = fullText.substring(fullText.indexOf(':') + 1).trim();
                    info[key] = val;
                }
            });

            const downloads = [];
            // FIX: Tambahin .dlbox dan support struktur table Kusonime
            $('.smokeddlrh, .dlbod, .dlbox').each((i, el) => {
                const resTitle = $(el).find('.smokettlrh').text().trim() || $(el).find('b').first().text().trim() || 'Link Download';
                const linkGroups = [];
                
                $(el).find('.smokeurlrh, .smokeurl').each((j, row) => {
                    const resolution = $(row).find('strong').text().trim() || 'Res';
                    const links = [];
                    $(row).find('a').each((k, a) => {
                        links.push({ host: $(a).text().trim(), url: $(a).attr('href') });
                    });
                    if (links.length > 0) linkGroups.push({ resolution, links });
                });

                if (linkGroups.length > 0) downloads.push({ title: resTitle, list: linkGroups });
            });

            return res(true, { title, thumb, ...info, sinopsis, downloads });
        }

        throw new Error('Action nggak dikenali! Pilih: latest, search, detail');
    } catch (e) {
        let err = e.response?.data || e.message;
        if (Buffer.isBuffer(err)) err = err.toString('utf-8');
        return res(false, err);
    }
}

// --- HANDLER PLUGIN ERINE ---
let handler = async (m, { conn, text, usedPrefix, command }) => {
    let [action, ...args] = text.split(' ')
    let query = args.join(' ')

    if (!action || !['search', 'latest', 'detail'].includes(action.toLowerCase())) {
        return m.reply(`┌˚₊ ๑│ ᴋ ᴜ ꜱ ᴏ ɴ ɪ ᴍ ᴇ │๑˚₊ 🎌\n┇ \n│ ❌ *Format salah cuy!*\n│ \n│ 📌 *Cara pakai:*\n│ ❦ ${usedPrefix + command} search <judul>\n│ ❦ ${usedPrefix + command} latest\n│ ❦ ${usedPrefix + command} detail <url_kusonime>\n┇ \n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`)
    }

    await m.react('⏳')

    try {
        let result = await JHKusonime(action.toLowerCase(), query)

        if (!result.status) {
            throw new Error(result.error)
        }

        let resData = result.data
        let caption = ''

        if (action.toLowerCase() === 'search' || action.toLowerCase() === 'latest') {
            caption = `┌˚₊ ๑│ ᴋ ᴜ ꜱ ᴏ ɴ ɪ ᴍ ᴇ - ${action.toUpperCase()} │๑˚₊ 🎌\n┇ \n`
            
            resData.slice(0, 10).forEach((anime, i) => {
                caption += `│ *${i + 1}. ${anime.title}*\n`
                caption += `│ 📅 *Rilis:* ${anime.date}\n`
                caption += `│ 🏷️ *Genre:* ${anime.genres}\n`
                caption += `│ 🔗 *Link:* ${anime.url}\n`
                caption += `│ \n`
            })
            
            caption += `┇ \n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`
            
            if (resData[0]?.thumb) {
                await conn.sendMessage(m.chat, { image: { url: resData[0].thumb }, caption }, { quoted: m })
            } else {
                await conn.sendMessage(m.chat, { text: caption }, { quoted: m })
            }
            
        } else if (action.toLowerCase() === 'detail') {
            caption = `┌˚₊ ๑│ ᴋ ᴜ ꜱ ᴏ ɴ ɪ ᴍ ᴇ - ᴅ ᴇ ᴛ ᴀ ɪ ʟ │๑˚₊ 🎌\n┇ \n`
            caption += `│ 📌 *Judul:* ${resData.title}\n`
            
            if (resData.japanese) caption += `│ 🇯🇵 *Japanese:* ${resData.japanese}\n`
            if (resData.producers) caption += `│ 🎬 *Producer:* ${resData.producers}\n`
            if (resData.type) caption += `│ 📺 *Type:* ${resData.type}\n`
            if (resData.status) caption += `│ 📈 *Status:* ${resData.status}\n`
            if (resData.total_episode) caption += `│ 🎞️ *Episodes:* ${resData.total_episode}\n`
            if (resData.score) caption += `│ ⭐ *Score:* ${resData.score}\n`
            caption += `│ \n│ 📜 *Sinopsis:*\n│ ${resData.sinopsis.substring(0, 500)}...\n│ \n`
            
            caption += `│ 📥 *Link Download:*\n`
            
            if (resData.downloads.length > 0) {
                resData.downloads.forEach(dl => {
                    caption += `│ 📦 *${dl.title}*\n`
                    dl.list.forEach(res => {
                        caption += `│ ┠ ⚙️ *${res.resolution}*\n`
                        res.links.forEach(link => {
                            caption += `│ ┠ 🔗 [${link.host}](${link.url})\n`
                        })
                    })
                    caption += `│ \n`
                })
            } else {
                caption += `│ ❌ *Link download tidak ditemukan/belum tersedia!*\n`
            }

            caption += `┇ \n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`

            if (resData.thumb) {
                await conn.sendMessage(m.chat, { image: { url: resData.thumb }, caption }, { quoted: m })
            } else {
                await conn.sendMessage(m.chat, { text: caption }, { quoted: m })
            }
        }

        await m.react('✅')
    } catch (error) {
        console.error('[KUSONIME ERROR]', error)
        await m.react('❌')
        m.reply(`┌˚₊ ๑│ ꜱ ʏ ꜱ ᴛ ᴇ ᴍ  ᴇ ʀ ʀ ᴏ ʀ │๑˚₊ ❌\n┇ Terjadi kesalahan.\n┇ *Detail:* ${error.message || String(error)}\n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`)
    }
}

handler.help = ['kusonime search <query>', 'kusonime latest', 'kusonime detail <url>']
handler.tags = ['anime']
handler.command = /^(kusonime|kuso)$/i
handler.limit = true

export default handler