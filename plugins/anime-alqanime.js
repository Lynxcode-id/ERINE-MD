/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Author     : Lynx Decode (INF Project)
 * 📞 Contact    : +62 859-7427-8171
 * 📢 Channel    : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * ⚠️ Note       : Keep credit to respect the creator!
 * ─────────────────────────
 * 📝 Plugin: Alqanime Scraper
 */

import axios from 'axios';
import * as cheerio from 'cheerio';

const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/119.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/119.0',
  'Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/119.0',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36 Edg/119.0.0.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
];

function getRandomUserAgent() {
  return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchPage(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': getRandomUserAgent(),
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
          'Sec-Fetch-Dest': 'document',
          'Sec-Fetch-Mode': 'navigate',
          'Sec-Fetch-Site': 'none',
          'Sec-Fetch-User': '?1',
          'Cache-Control': 'max-age=0',
        },
        timeout: 30000,
      });
      await sleep(500 + Math.random() * 1000);
      return response.data;
    } catch (e) {
      if (i === retries - 1) throw e;
      await sleep(1000 * (i + 1));
    }
  }
}

function parseListPage(html) {
  const $ = cheerio.load(html);
  const items = [];
  $('article.bs').each((i, el) => {
    const $el = $(el);
    const title = $el.find('.eggtitle').text().trim() || $el.find('.tt .ntitle').text().trim() || '';
    const url = $el.find('a[itemprop="url"]').attr('href') || '';
    const thumbnail = $el.find('img.ts-post-image').attr('src') || '';
    const status = $el.find('.status').text().trim() || 'Ongoing';
    const type = $el.find('.eggtype').text().trim() || $el.find('.typez').text().trim() || '';
    const ratingScore = $el.find('.numscore').text().trim() || '';
    const ratingPercent = $el.find('.rtb span').attr('style')?.match(/width:([^%]+)%/)?.[1] || '';
    const episode = $el.find('.eggepisode').text().trim() || $el.find('.ntitle').text().match(/Episode\s*\(?(\d+)\)?/)?.[1] || '';
    if (title || url) {
      items.push({ title, url, thumbnail, status, type, ratingScore, ratingPercent, episode });
    }
  });
  return items;
}

async function scrapeHome(page = 1) {
  const url = page === 1 ? 'https://alqanime.net/' : `https://alqanime.net/page/${page}/`;
  const html = await fetchPage(url);
  const data = parseListPage(html);
  return { creator: 'rynaqrtz', halaman: 'home', page, data };
}

async function scrapePopular(page = 1) {
  const url = page === 1 ? 'https://alqanime.net/popular/' : `https://alqanime.net/popular/page/${page}/`;
  const html = await fetchPage(url);
  const data = parseListPage(html);
  return { creator: 'rynaqrtz', halaman: 'popular', page, data };
}

async function scrapeTag(tag, page = 1) {
  const url = page === 1 ? `https://alqanime.net/tag/${tag}/` : `https://alqanime.net/tag/${tag}/page/${page}/`;
  const html = await fetchPage(url);
  const data = parseListPage(html);
  return { creator: 'rynaqrtz', halaman: 'tag', page, data, tag };
}

async function scrapeJadwal() {
  const url = 'https://alqanime.net/jadwal-rilis/';
  const html = await fetchPage(url);
  const $ = cheerio.load(html);
  const result = {};
  $('.bixbox').each((i, el) => {
    const $el = $(el);
    const day = $el.find('.releases h3').text().trim();
    const items = [];
    $el.find('.listupd article.bs').each((j, art) => {
      const $art = $(art);
      const title = $art.find('.eggtitle').text().trim() || $art.find('.tt .ntitle').text().trim() || '';
      const url = $art.find('a[itemprop="url"]').attr('href') || '';
      const thumbnail = $art.find('img.ts-post-image').attr('src') || '';
      const type = $art.find('.eggtype').text().trim() || $art.find('.typez').text().trim() || '';
      const episode = $art.find('.eggepisode').text().trim() || $art.find('.ntitle').text().match(/Episode\s*\(?(\d+)\)?/)?.[1] || $art.find('a[itemprop="url"]').attr('title')?.match(/Episode\s*\(?(\d+)\)?/)?.[1] || '';
      items.push({ title, url, thumbnail, type, episode });
    });
    if (day) result[day] = items;
  });
  return { creator: 'rynaqrtz', halaman: 'jadwal', data: result };
}

async function scrapeGenre() {
  const url = 'https://alqanime.net/genre/';
  const html = await fetchPage(url);
  const $ = cheerio.load(html);
  const genres = [];
  $('.blix ul li a').each((i, el) => {
    genres.push($(el).text().trim());
  });
  return { creator: 'rynaqrtz', halaman: 'genre', data: genres };
}

async function scrapeDetail(slug) {
  const url = `https://alqanime.net/${slug}/`;
  const html = await fetchPage(url);
  const $ = cheerio.load(html);
  const title = $('.infox h1').text().trim() || '';
  const thumbnail = $('.thumb img').attr('src') || '';
  const sinopsis = $('.entry-content p').text().trim() || '';
  const info = {};
  $('.spe span').each((i, el) => {
    const text = $(el).text().trim();
    const parts = text.split(':');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const value = parts.slice(1).join(':').trim();
      info[key] = value;
    }
  });
  const genres = [];
  $('.genxed a').each((i, el) => {
    genres.push($(el).text().trim());
  });
  const casts = [];
  $('.casts').each((i, el) => {
    casts.push($(el).text().trim());
  });
  const episodes = [];
  $('.soraddl').each((i, el) => {
    const $el = $(el);
    const titleEp = $el.find('.sorattl h3').text().trim() || '';
    const links = [];
    $el.find('.slink a').each((j, a) => {
      const href = $(a).attr('href');
      const label = $(a).text().trim();
      if (href) links.push({ label, url: href });
    });
    if (titleEp || links.length) {
      episodes.push({ title: titleEp, links });
    }
  });
  const iframeSrc = $('iframe[src*="acefile.co/player/"]').attr('src') || $('.soraddl iframe[src*="acefile.co/player/"]').attr('src') || '';
  return { creator: 'rynaqrtz', halaman: 'detail', data: { title, thumbnail, sinopsis, info, genres, casts, episodes, iframeSrc } };
}

let handler = async (m, { conn, args, usedPrefix, command }) => {
  let action = args[0] ? args[0].toLowerCase() : '';
  
  if (!['home', 'popular', 'tag', 'jadwal', 'genre', 'detail'].includes(action)) {
    return m.reply(`┌˚₊ ๑│ ᴀ ʟ ǫ ᴀ ɴ ɪ ᴍ ᴇ │๑˚₊ 📺
┇ 
│ 📌 *Daftar Perintah:*
│ ${usedPrefix + command} home [page]
│ ${usedPrefix + command} popular [page]
│ ${usedPrefix + command} genre
│ ${usedPrefix + command} jadwal
│ ${usedPrefix + command} tag <nama_tag> [page]
│ ${usedPrefix + command} detail <slug_url>
┇ 
└˚₊ ๑ ────────────── ๑˚₊
> © ERINE-AI`);
  }

  await m.react('⏳');

  try {
    if (action === 'home' || action === 'popular') {
      let page = parseInt(args[1]) || 1;
      let res = action === 'home' ? await scrapeHome(page) : await scrapePopular(page);
      
      if (!res.data || res.data.length === 0) throw new Error('Data tidak ditemukan.');
      
      let txt = `┌˚₊ ๑│ ᴀ ʟ ǫ ᴀ ɴ ɪ ᴍ ᴇ (${action.toUpperCase()}) │๑˚₊ 📺\n┇ \n│ 📄 *Halaman:* ${page}\n┇ \n`;
      res.data.slice(0, 10).forEach((v, i) => {
        txt += `│ ${i + 1}. *${v.title}*\n`;
        txt += `│ 🏷️ Type: ${v.type || '-'}\n`;
        txt += `│ 🎬 Status: ${v.status || '-'}\n`;
        txt += `│ ⭐ Rating: ${v.ratingScore || '-'}\n`;
        txt += `│ 🔗 Url: ${v.url}\n│ \n`;
      });
      txt += `└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`;
      await conn.sendMessage(m.chat, { text: txt }, { quoted: m });
    } 
    
    else if (action === 'genre') {
      let res = await scrapeGenre();
      let txt = `┌˚₊ ๑│ ᴀ ʟ ǫ ᴀ ɴ ɪ ᴍ ᴇ (GENRE) │๑˚₊ 📺\n┇ \n│ ` + res.data.join(', ') + `\n┇ \n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`;
      await m.reply(txt);
    } 
    
    else if (action === 'jadwal') {
      let res = await scrapeJadwal();
      let txt = `┌˚₊ ๑│ ᴀ ʟ ǫ ᴀ ɴ ɪ ᴍ ᴇ (JADWAL) │๑˚₊ 📺\n┇ \n`;
      for (let day in res.data) {
        txt += `│ 📅 *${day.toUpperCase()}*\n`;
        res.data[day].slice(0, 5).forEach(v => {
          txt += `│ └ ${v.title} (Ep: ${v.episode || '-'})\n`;
        });
        txt += `│ \n`;
      }
      txt += `└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`;
      await m.reply(txt);
    } 
    
    else if (action === 'tag') {
      if (!args[1]) throw new Error('Harap masukkan nama tag.');
      let tag = args[1];
      let page = parseInt(args[2]) || 1;
      let res = await scrapeTag(tag, page);
      
      let txt = `┌˚₊ ๑│ ᴀ ʟ ǫ ᴀ ɴ ɪ ᴍ ᴇ (TAG) │๑˚₊ 📺\n┇ \n│ 🏷️ *Tag:* ${tag}\n│ 📄 *Halaman:* ${page}\n┇ \n`;
      res.data.slice(0, 10).forEach((v, i) => {
        txt += `│ ${i + 1}. *${v.title}*\n`;
        txt += `│ 🔗 Url: ${v.url}\n│ \n`;
      });
      txt += `└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`;
      await m.reply(txt);
    } 
    
    else if (action === 'detail') {
      if (!args[1]) throw new Error('Harap masukkan slug url animenya.\nContoh: boku-no-hero-academia-season-7');
      let slug = args[1].replace('https://alqanime.net/', '').replace('/', '');
      let res = await scrapeDetail(slug);
      let d = res.data;
      
      let txt = `┌˚₊ ๑│ ᴀ ʟ ǫ ᴀ ɴ ɪ ᴍ ᴇ (DETAIL) │๑˚₊ 📺\n┇ \n`;
      txt += `│ 🎬 *Judul:* ${d.title || '-'}\n`;
      for (let key in d.info) {
        txt += `│ 📌 *${key}:* ${d.info[key]}\n`;
      }
      txt += `│ 🎭 *Genre:* ${d.genres.join(', ') || '-'}\n`;
      txt += `│ 📖 *Sinopsis:* ${d.sinopsis ? d.sinopsis.substring(0, 200) + '...' : '-'}\n┇ \n`;
      
      if (d.episodes.length > 0) {
        txt += `│ 📥 *Link Download Terakhir:*\n`;
        let lastEp = d.episodes[0];
        txt += `│ └ ${lastEp.title}\n`;
        lastEp.links.slice(0, 3).forEach(l => {
          txt += `│    » ${l.label}: ${l.url}\n`;
        });
      }
      txt += `┇ \n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`;
      
      if (d.thumbnail) {
        await conn.sendMessage(m.chat, { image: { url: d.thumbnail }, caption: txt }, { quoted: m });
      } else {
        await m.reply(txt);
      }
    }

    await m.react('✅');
  } catch (e) {
    console.error(e);
    await m.react('❌');
    m.reply(`┌˚₊ ๑│ s ʏ s ᴛ ᴇ ᴍ  ᴇ ʀ ʀ ᴏ ʀ │๑˚₊ ❌\n┇ Terjadi kesalahan:\n┇ ${e.message || e}\n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`);
  }
};

handler.help = ['alqanime <opsi>'];
handler.tags = ['anime', 'scraper'];
handler.command = /^(alqanime|alq)$/i;
handler.limit = true;

export default handler;