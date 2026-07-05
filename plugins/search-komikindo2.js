/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Scraper    : rynaqrtz
 * 👤 Integrator : Lynx Decode
 * 📞 Contact    : +62 882-5804-1396
 * 📢 Channel    : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * ⚠️ Note       : Keep credit to respect the creator!
 * ─────────────────────────
 * 📝 Plugin: KomikIndo (Search, Detail, Read)
 */

import axios from 'axios';
import * as cheerio from 'cheerio';
import https from 'https';

// ==========================================
// 🚀 CORE SCRAPER KOMIKINDO (DO NOT MODIFY)
// ==========================================
const BASE_URL = 'https://komikindo.ch';
const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7; rv:133.0) Gecko/20100101 Firefox/133.0',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  'Mozilla/5.0 (X11; Linux x86_64; rv:133.0) Gecko/20100101 Firefox/133.0',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_6_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.6 Mobile/15E148 Safari/604.1',
  'Mozilla/5.0 (Linux; Android 14; SM-S921B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.6778.104 Mobile Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.2903.70'
];

function randomIp() {
  return Math.floor(Math.random() * 255) + 1 + '.' + Math.floor(Math.random() * 255) + '.' + Math.floor(Math.random() * 255) + '.' + Math.floor(Math.random() * 255);
}

function randomDelay(min = 500, max = 1500) {
  return new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * (max - min + 1)) + min));
}

let uaIndex = 0;
function getHeaders(ref) {
  const ua = USER_AGENTS[uaIndex % USER_AGENTS.length];
  uaIndex++;
  const fakeIp = randomIp();
  const isMobile = ua.includes('Mobile') || ua.includes('iPhone') || ua.includes('Android');
  const platform = ua.includes('Windows') ? 'Windows' : ua.includes('Mac') ? 'macOS' : 'Linux';
  const browser = ua.includes('Firefox') ? 'Firefox' : ua.includes('Edg') ? 'Edge' : 'Chrome';
  return {
    'User-Agent': ua,
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
    'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
    'Accept-Encoding': 'gzip, deflate, br',
    'Referer': ref || BASE_URL + '/',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    'DNT': '1',
    'Sec-Ch-Ua': browser === 'Chrome' ? '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"' : '"Firefox";v="133", "Not_A Brand";v="24"',
    'Sec-Ch-Ua-Mobile': isMobile ? '?1' : '?0',
    'Sec-Ch-Ua-Platform': `"${platform}"`,
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'same-origin',
    'Sec-Fetch-User': '?1',
    'Upgrade-Insecure-Requests': '1',
    'Connection': 'keep-alive',
    'X-Forwarded-For': fakeIp,
    'Client-IP': fakeIp,
    'X-Real-IP': fakeIp
  };
}

async function fetchHTML(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      await randomDelay(500, 1500);
      const response = await axios({
        url,
        method: 'GET',
        headers: getHeaders(url),
        timeout: 30000,
        httpsAgent: new https.Agent({ rejectUnauthorized: false, keepAlive: true }),
        maxRedirects: 5,
        decompress: true,
        validateStatus: status => status >= 200 && status < 400
      });
      const html = response.data;
      if (html && html.length > 500 && !html.includes('403 Forbidden') && !html.includes('Access to this resource')) {
        return html;
      }
      if (i < retries - 1) await randomDelay(2000, 4000);
    } catch (e) {
      if (i < retries - 1) await randomDelay(2000, 4000);
      else throw new Error('Gagal fetch: ' + e.message);
    }
  }
  throw new Error('Gagal fetch setelah retry');
}

function cleanText(text) {
  return text ? text.replace(/\s+/g, ' ').trim() : null;
}

function buildResponse(page, url, pagination, data) {
  const result = { creator: 'rynaqrtz', page, url };
  if (pagination && (pagination.total !== null || pagination.current !== 1 || pagination.hasNext)) {
    result.pagination = pagination;
  }
  result.data = data;
  return result;
}

function parsePagination($) {
  const result = { current: 1, total: null, hasNext: false };
  const active = $('.pagination .page-numbers.current');
  if (active.length) {
    const t = active.text().trim();
    if (/^\d+$/.test(t)) result.current = parseInt(t);
  }
  const allPages = $('.pagination .page-numbers:not(.dots):not(.next):not(.prev)');
  let maxPage = 0;
  allPages.each((i, el) => {
    const t = $(el).text().trim();
    if (/^\d+$/.test(t)) {
      const num = parseInt(t);
      if (num > maxPage) maxPage = num;
    }
  });
  if (maxPage > 0) {
    result.total = maxPage;
    result.hasNext = result.current < maxPage;
  }
  const nextLink = $('.pagination .next.page-numbers');
  if (nextLink.length && !result.hasNext) {
    result.hasNext = true;
  }
  return result;
}

function parseComicItem($el) {
  const item = {};
  const title = $el.find('.tt h3').text().trim() || $el.find('.poster-title').text().trim();
  if (title) item.title = title;
  const link = $el.find('a[href^="/komik/"]').first().attr('href') || $el.find('a').first().attr('href');
  if (link) item.url = link.startsWith('http') ? link : BASE_URL + link;
  const poster = $el.find('.limit img').attr('src') || $el.find('.limit img').attr('data-src') || $el.find('img').attr('src') || $el.find('img').attr('data-src');
  if (poster) item.poster = poster;
  const rating = $el.find('.rating i').text().trim() || $el.find('.rtg i').text().trim() || $el.find('.archiveanime-rating i').text().trim();
  if (rating) item.rating = parseFloat(rating);
  const type = $el.find('.typeflag').text().trim() || $el.find('.type-flag').text().trim();
  if (type) item.type = type;
  const format = $el.find('.warnalabel').text().trim();
  if (format) item.format = format;
  const status = $el.find('.status-skroep').text().trim();
  if (status) item.status = status;
  const latestChapter = $el.find('.lsch a').first().attr('href');
  if (latestChapter) item.latestChapter = latestChapter.startsWith('http') ? latestChapter : BASE_URL + latestChapter;
  const latestChapterTitle = $el.find('.lsch a').first().text().trim();
  if (latestChapterTitle) item.latestChapterTitle = latestChapterTitle;
  const date = $el.find('.datech').text().trim();
  if (date) item.date = date;
  return item;
}

function parseComicList($, selector = '.animepost') {
  const items = [];
  $(selector).each((i, el) => {
    const item = parseComicItem($(el));
    if (item.title && item.url) items.push(item);
  });
  if (items.length === 0) {
    $('.film-list .animepost').each((i, el) => {
      const item = parseComicItem($(el));
      if (item.title && item.url) items.push(item);
    });
  }
  if (items.length === 0) {
    $('.listupd .animepost').each((i, el) => {
      const item = parseComicItem($(el));
      if (item.title && item.url) items.push(item);
    });
  }
  return items;
}

function parseDetailInfo($) {
  const info = {};
  $('.spe span').each((i, el) => {
    const text = cleanText($(el).text());
    if (text && text.includes(':')) {
      const parts = text.split(':');
      const key = cleanText(parts[0]);
      const value = cleanText(parts.slice(1).join(':'));
      if (key && value) info[key] = value;
    }
  });
  return info;
}

function parseGenres($) {
  const genres = [];
  $('.genre-info a').each((i, el) => {
    const text = cleanText($(el).text());
    if (text) genres.push(text);
  });
  return genres;
}

class KomikIndoScraper {
  constructor() {
    this.base = BASE_URL;
  }
  async home() {
    const url = this.base + '/';
    const html = await fetchHTML(url);
    const $ = cheerio.load(html);
    const popular = parseComicList($, '.listupd.customslider .animepost');
    const latest = parseComicList($, '.chapterbaru .animepost');
    if (latest.length === 0) {
      const alt = parseComicList($, '.widget-body .animepost');
      if (alt.length > 0) latest.push(...alt);
    }
    const pagination = { current: 1, total: null, hasNext: false };
    return buildResponse('home', url, pagination, { popular, latest });
  }
  async komikTerbaru(page = 1) {
    const url = page === 1 ? this.base + '/komik-terbaru/' : this.base + `/komik-terbaru/page/${page}/`;
    const html = await fetchHTML(url);
    const $ = cheerio.load(html);
    const items = parseComicList($, '.film-list .animepost');
    const pagination = parsePagination($);
    return buildResponse('komik-terbaru', url, pagination, items);
  }
  async komikPopuler(page = 1) {
    const url = page === 1 ? this.base + '/komik-populer/' : this.base + `/komik-populer/page/${page}/`;
    const html = await fetchHTML(url);
    const $ = cheerio.load(html);
    const items = parseComicList($, '.film-list .animepost');
    const pagination = parsePagination($);
    return buildResponse('komik-populer', url, pagination, items);
  }
  async komikBerwarna(page = 1) {
    const url = page === 1 ? this.base + '/komik-berwarna/' : this.base + `/komik-berwarna/page/${page}/`;
    const html = await fetchHTML(url);
    const $ = cheerio.load(html);
    const items = parseComicList($, '.film-list .animepost');
    const pagination = parsePagination($);
    return buildResponse('komik-berwarna', url, pagination, items);
  }
  async manhwa(page = 1) {
    const url = page === 1 ? this.base + '/manhwa/' : this.base + `/manhwa/page/${page}/`;
    const html = await fetchHTML(url);
    const $ = cheerio.load(html);
    const items = parseComicList($, '.film-list .animepost');
    const pagination = parsePagination($);
    return buildResponse('manhwa', url, pagination, items);
  }
  async manga(page = 1) {
    const url = page === 1 ? this.base + '/manga/' : this.base + `/manga/page/${page}/`;
    const html = await fetchHTML(url);
    const $ = cheerio.load(html);
    const items = parseComicList($, '.film-list .animepost');
    const pagination = parsePagination($);
    return buildResponse('manga', url, pagination, items);
  }
  async daftarManga(filters = {}, page = 1) {
    const query = new URLSearchParams();
    if (filters.status) query.append('status', filters.status);
    if (filters.type) query.append('type', filters.type);
    if (filters.format) query.append('format', filters.format);
    if (filters.order) query.append('order', filters.order);
    if (filters.title) query.append('title', filters.title);
    if (filters.genre && Array.isArray(filters.genre)) {
      filters.genre.forEach(g => query.append('genre[]', g));
    }
    if (filters.demografis && Array.isArray(filters.demografis)) {
      filters.demografis.forEach(d => query.append('demografis[]', d));
    }
    if (filters.konten && Array.isArray(filters.konten)) {
      filters.konten.forEach(k => query.append('konten[]', k));
    }
    if (filters.tema && Array.isArray(filters.tema)) {
      filters.tema.forEach(t => query.append('tema[]', t));
    }
    const baseUrl = this.base + '/daftar-manga/';
    const pageUrl = page > 1 ? `page/${page}/` : '';
    const queryStr = query.toString();
    const url = baseUrl + pageUrl + (queryStr ? '?' + queryStr : '');
    const html = await fetchHTML(url);
    const $ = cheerio.load(html);
    const items = parseComicList($, '.film-list .animepost');
    const pagination = parsePagination($);
    return buildResponse('daftar-manga', url, pagination, items);
  }
  async search(query, page = 1) {
    const url = this.base + `/?s=${encodeURIComponent(query)}${page > 1 ? `&page=${page}` : ''}`;
    const html = await fetchHTML(url);
    const $ = cheerio.load(html);
    const items = parseComicList($, '.film-list .animepost');
    const pagination = parsePagination($);
    if (items.length > 0 && pagination.total === null) {
      const lastPageLink = $('.pagination .page-numbers:not(.dots):not(.next):not(.prev)').last();
      if (lastPageLink.length) {
        const t = lastPageLink.text().trim();
        if (/^\d+$/.test(t)) pagination.total = parseInt(t);
      }
      const nextLink = $('.pagination .next.page-numbers');
      if (nextLink.length && !pagination.hasNext) pagination.hasNext = true;
    }
    return buildResponse('search', url, pagination, items);
  }
  async detail(slug) {
    const url = this.base + '/komik/' + slug.replace(/^\/+/, '');
    const html = await fetchHTML(url);
    const $ = cheerio.load(html);
    const title = cleanText($('.entry-title').text()) || cleanText($('h1.entry-title').text()) || cleanText($('h1').first().text()) || null;
    const ratingText = cleanText($('.rtg i').text()) || cleanText($('.rating i').text()) || cleanText($('.archiveanime-rating i').text());
    const rating = ratingText ? parseFloat(ratingText) : null;
    const poster = $('.thumb img').attr('src') || $('.thumb img').attr('data-src') || $('img[itemprop="image"]').attr('src') || null;
    const synopsis = cleanText($('.entry-content p').text()) || cleanText($('.shortcsc.sht2 p').text()) || cleanText($('.desc p').text()) || null;
    const info = parseDetailInfo($);
    const genres = parseGenres($);
    const chapters = [];
    $('.eps_lst .listeps ul li').each((i, el) => {
      const $el = $(el);
      const link = $el.find('.lchx a').attr('href');
      const chapter = $el.find('chapter').text().trim() || $el.find('.lchx a').text().trim().replace(/Chapter\s*/i, '').trim() || null;
      const date = $el.find('.dt a').text().trim() || $el.find('.dt').text().trim() || null;
      if (link && chapter) {
        chapters.push({
          chapter: chapter,
          url: link.startsWith('http') ? link : this.base + link,
          date: date || null
        });
      }
    });
    if (chapters.length === 0) {
      $('.listeps ul li').each((i, el) => {
        const $el = $(el);
        const link = $el.find('a').attr('href');
        const chapter = $el.find('chapter').text().trim() || $el.find('a').text().trim().replace(/Chapter\s*/i, '').trim() || null;
        const date = $el.find('.dt').text().trim() || null;
        if (link && chapter) {
          chapters.push({
            chapter: chapter,
            url: link.startsWith('http') ? link : this.base + link,
            date: date || null
          });
        }
      });
    }
    const related = [];
    $('.miripmanga .serieslist li').each((i, el) => {
      const $el = $(el);
      const link = $el.find('.imgseries a').attr('href') || $el.find('a').first().attr('href');
      const title = cleanText($el.find('.leftseries h3 a').text()) || cleanText($el.find('.leftseries h3').text()) || null;
      const poster = $el.find('.imgseries img').attr('src') || $el.find('.imgseries img').attr('data-src') || null;
      if (link && title) {
        related.push({
          title: title,
          url: link.startsWith('http') ? link : this.base + link,
          poster: poster || null
        });
      }
    });
    const data = { title, rating, poster, synopsis, info, genres, chapters, related };
    const pagination = { current: 1, total: null, hasNext: false };
    return buildResponse('detail', url, pagination, data);
  }
  async chapter(slug) {
    const url = this.base + '/' + slug.replace(/^\/+/, '');
    const html = await fetchHTML(url);
    const $ = cheerio.load(html);
    const title = cleanText($('.entry-title').text()) || cleanText($('h1.entry-title').text()) || cleanText($('h1').first().text()) || null;
    const images = [];
    $('#chimg-auh img').each((i, el) => {
      const src = $(el).attr('src');
      if (src) images.push(src);
    });
    if (images.length === 0) {
      $('.chapter-image img, .img-landmine img, #Baca_Komik img').each((i, el) => {
        const src = $(el).attr('src');
        if (src) images.push(src);
      });
    }
    const nav = { daftarChapter: null, next: null, prev: null };
    $('.navig .nextprev a, .nextprev a').each((i, el) => {
      const text = cleanText($(el).text());
      const href = $(el).attr('href');
      if (text && href) {
        if (text.includes('Daftar Chapter') || text.includes('Daftar') || text.includes('Chapter List')) {
          nav.daftarChapter = href.startsWith('http') ? href : this.base + href;
        } else if (text.includes('Chapter Selanjutnya') || text.includes('Next') || text.includes('Selanjutnya')) {
          nav.next = href.startsWith('http') ? href : this.base + href;
        } else if (text.includes('Chapter Sebelumnya') || text.includes('Prev') || text.includes('Sebelumnya')) {
          nav.prev = href.startsWith('http') ? href : this.base + href;
        }
      }
    });
    const data = { title, images, navigation: nav };
    const pagination = { current: 1, total: null, hasNext: !!nav.next };
    return buildResponse('chapter', url, pagination, data);
  }
}

// ==========================================
// 🤖 BOT HANDLER INTEGRATION
// ==========================================

let handler = async (m, { conn, args, usedPrefix, command }) => {
    let action = args[0] ? args[0].toLowerCase() : ''
    let query = args.slice(1).join(' ')
    const scraper = new KomikIndoScraper()

    const menuMsg = `┌˚₊ ๑│ ᴋ ᴏ ᴍ ɪ ᴋ ɪ ɴ ᴅ ᴏ │๑˚₊ 📚\n` +
                    `┇ \n` +
                    `│ ❌ *Sub-command tidak valid atau kosong!*\n` +
                    `│ \n` +
                    `│ 📌 *Daftar Perintah:*\n` +
                    `│ ❦ \`${usedPrefix + command} search <judul>\`\n` +
                    `│    (Untuk mencari komik)\n` +
                    `│ \n` +
                    `│ ❦ \`${usedPrefix + command} detail <slug>\`\n` +
                    `│    (Untuk melihat detail info & list chapter)\n` +
                    `│ \n` +
                    `│ ❦ \`${usedPrefix + command} read <slug-chapter>\`\n` +
                    `│    (Untuk membaca komik dari chapter tertentu)\n` +
                    `┇ \n` +
                    `└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`

    if (!action) return m.reply(menuMsg)

    await m.react('⏳')

    try {
        if (action === 'search' || action === 'cari') {
            if (!query) throw new Error('Masukkan judul komik yang mau dicari!')
            
            const res = await scraper.search(query)
            if (!res.data || res.data.length === 0) throw new Error('Komik tidak ditemukan!')

            let caption = `┌˚₊ ๑│ ᴋ ᴏ ᴍ ɪ ᴋ ɪ ɴ ᴅ ᴏ │๑˚₊ 🔍\n┇ \n`
            res.data.slice(0, 10).forEach((v, i) => {
                // Ekstrak slug komik dari URL aslinya biar user gampang copy
                let slug = v.url.replace(BASE_URL + '/komik/', '').replace(/\/$/, '')
                caption += `│ ${i + 1}. *${v.title}*\n`
                caption += `│ 🏷️ *Tipe:* ${v.type || '-'}\n`
                caption += `│ 🌟 *Rating:* ${v.rating || '-'}\n`
                caption += `│ 🔗 *Slug:* \`${slug}\`\n│\n`
            })
            caption += `└˚₊ ๑ ────────────── ๑˚₊\n> *Note:* Gunakan slug di atas untuk mengecek detail komik.`

            await m.reply(caption.trim())

        } else if (action === 'detail' || action === 'info') {
            if (!query) throw new Error('Masukkan slug komik yang valid! (Contoh: mato-seihei-no-slave)')
            
            const res = await scraper.detail(query)
            if (!res.data) throw new Error('Detail komik tidak ditemukan. Pastikan slug-nya benar.')

            let data = res.data
            let caption = `┌˚₊ ๑│ ᴋ ᴏ ᴍ ɪ ᴋ ɪ ɴ ᴅ ᴏ │๑˚₊ 📖\n┇ \n`
            caption += `│ 📌 *Judul:* ${data.title}\n`
            caption += `│ 🌟 *Rating:* ${data.rating || 'N/A'}\n`
            caption += `│ 🎭 *Genre:* ${data.genres.join(', ')}\n`
            caption += `│ \n│ 📝 *Sinopsis:*\n│ ${data.synopsis ? data.synopsis.substring(0, 200) + '...' : 'Tidak ada sinopsis.'}\n`
            caption += `┇ \n│ 📚 *List Chapter (Terbaru):*\n`
            
            // Ambil 5 chapter terbaru buat ngasih liat slug-nya
            data.chapters.slice(0, 5).forEach(c => {
                let chSlug = c.url.replace(BASE_URL + '/', '').replace(/\/$/, '')
                caption += `│ 🔹 ${c.chapter} -> \`${chSlug}\`\n`
            })
            
            caption += `┇ \n└˚₊ ๑ ────────────── ๑˚₊\n> *Note:* Gunakan slug chapter di atas untuk membaca komik.`

            if (data.poster) {
                await conn.sendMessage(m.chat, { image: { url: data.poster }, caption: caption.trim() }, { quoted: m })
            } else {
                await m.reply(caption.trim())
            }

        } else if (action === 'read' || action === 'baca') {
            if (!query) throw new Error('Masukkan slug chapter yang valid! (Contoh: mato-seihei-no-slave-chapter-137)')
            
            const res = await scraper.chapter(query)
            if (!res.data || !res.data.images || res.data.images.length === 0) {
                throw new Error('Gagal mengambil gambar chapter. Mungkin server sedang melarang akses bot.')
            }

            let data = res.data
            await m.reply(`┌˚₊ ๑│ ᴋ ᴏ ᴍ ɪ ᴋ ɪ ɴ ᴅ ᴏ │๑˚₊ 🖼️\n┇ \n│ ✅ Berhasil mengambil *${data.images.length} halaman* dari chapter tersebut.\n│ Tunggu sebentar, sedang mengirim gambar...\n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`)

            // Mengirim 10 gambar pertama buat ngurangin resiko spam/banned WhatsApp
            let limitImages = data.images.slice(0, 10)
            for (let i = 0; i < limitImages.length; i++) {
                await conn.sendMessage(m.chat, { 
                    image: { url: limitImages[i] },
                    caption: `Halaman ${i + 1} dari ${data.images.length}`
                }, { quoted: m })
                await randomDelay(1000, 2000) // Delay aman antar pengiriman pesan
            }
            
            if (data.images.length > 10) {
                await m.reply(`*Limit Pengiriman!* Karena batasan sistem WhatsApp, bot hanya mengirimkan 10 halaman pertama.\n\n🔗 *Baca selengkapnya di browser:* ${res.url}`)
            }

        } else {
            await m.reply(menuMsg)
        }

        await m.react('✅')
    } catch (e) {
        console.error('[KOMIKINDO ERROR]', e)
        await m.react('❌')
        m.reply(`┌˚₊ ๑│ ꜱ ʏ ꜱ ᴛ ᴇ ᴍ  ᴇ ʀ ʀ ᴏ ʀ │๑˚₊ ❌\n┇ Gagal memproses permintaan.\n┇ \n┇ *Detail:*\n┇ ${e.message || String(e)}\n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`)
    }
}

handler.help = ['komikindo2 <cmd> <query>']
handler.tags = ['anime']
handler.command = /^komikindo2$/i
handler.limit = true

export default handler