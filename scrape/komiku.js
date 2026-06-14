/** * ───「 SCRAPER KOMIKU
 * ────────────────────────✧
 */

import axios from "axios";
import * as cheerio from "cheerio";

const BASE_URL = "https://komiku.org";
const headers = {
  "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
  "accept-language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
  "cache-control": "no-cache",
  "user-agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36"
};

export async function komikuHomepage() {
  const res = await axios.get(BASE_URL, { headers });
  const $ = cheerio.load(res.data);
  
  const rankings = { mingguan: [], harian: [], total: [] };
  
  $(".rank-panel").each((i, panel) => {
    const type = i === 0 ? "mingguan" : i === 1 ? "harian" : "total";
    $(panel).find("article.ls4").each((j, el) => {
      rankings[type].push({
        rank: j + 1,
        title: $(el).find("h4 a").text().trim(),
        url: BASE_URL + $(el).find("h4 a").attr("href"),
        image: $(el).find(".ls4v img").attr("data-src") || $(el).find(".ls4v img").attr("src"),
        genre: $(el).find(".ls4s").text().trim(),
        chapter: $(el).find(".ls24").text().trim(),
        chapter_url: BASE_URL + ($(el).find(".ls24").attr("href") || "")
      });
    });
  });
  
  const popular = [];
  $("#ls12-populer article.ls2").each((i, el) => {
    popular.push({
      title: $(el).find("h3 a").text().trim(),
      url: BASE_URL + $(el).find("h3 a").attr("href"),
      image: $(el).find(".ls2v img").attr("data-src") || $(el).find(".ls2v img").attr("src"),
      type: $(el).find(".flag").attr("src")?.includes("jp.png") ? "Manga" : $(el).find(".flag").attr("src")?.includes("kr.png") ? "Manhwa" : "Manhua",
      views: $(el).find(".ls2t").text().trim(),
      chapter: $(el).find(".ls2l").text().trim(),
      chapter_url: BASE_URL + ($(el).find(".ls2l").attr("href") || "")
    });
  });
  
  const latest = [];
  $(".ls2-wrap article.ls2").each((i, el) => {
    latest.push({
      title: $(el).find("h3 a").text().trim(),
      url: BASE_URL + $(el).find("h3 a").attr("href"),
      image: $(el).find(".ls2v img").attr("data-src") || $(el).find(".ls2v img").attr("src"),
      type: $(el).find(".flag").attr("src")?.includes("jp.png") ? "Manga" : $(el).find(".flag").attr("src")?.includes("kr.png") ? "Manhwa" : "Manhua",
      time: $(el).find(".ls2t").text().trim(),
      chapter: $(el).find(".ls2l").text().trim(),
      chapter_url: BASE_URL + ($(el).find(".ls2l").attr("href") || "")
    });
  });
  
  const genres = [];
  $("#Filter select[name='genre'] option").each((i, el) => {
    const value = $(el).attr("value");
    const text = $(el).text().trim();
    if (value && value !== "") {
      genres.push({ value, name: text });
    }
  });
  
  return { success: true, data: { rankings, popular: popular.slice(0, 10), latest: latest.slice(0, 10), total_comics: "7.230", total_chapters: "384.926", genres } };
}

export async function komikuPustaka(params = {}) {
  const queryParams = new URLSearchParams();
  if (params.orderby) queryParams.append("orderby", params.orderby);
  if (params.tipe) queryParams.append("tipe", params.tipe);
  if (params.genre) queryParams.append("genre", params.genre);
  if (params.genre2) queryParams.append("genre2", params.genre2);
  if (params.status) queryParams.append("status", params.status);
  
  const url = `${BASE_URL}/pustaka/${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
  const res = await axios.get(url, { headers });
  const $ = cheerio.load(res.data);
  
  const comics = [];
  $(".ls2").each((i, el) => {
    const title = $(el).find("h3 a").text().trim();
    if (title) {
      comics.push({
        title,
        url: BASE_URL + $(el).find("h3 a").attr("href"),
        image: $(el).find(".ls2v img").attr("data-src") || $(el).find(".ls2v img").attr("src"),
        type: $(el).find(".flag").attr("src")?.includes("jp.png") ? "Manga" : $(el).find(".flag").attr("src")?.includes("kr.png") ? "Manhwa" : $(el).find(".flag").attr("src")?.includes("cn.png") ? "Manhua" : "Unknown",
        views: $(el).find(".ls2t").text().trim(),
        chapter: $(el).find(".ls2l").text().trim(),
        chapter_url: BASE_URL + ($(el).find(".ls2l").attr("href") || "")
      });
    }
  });
  
  return { success: true, data: { total_comics: comics.length, comics } };
}

export async function komikuDetail(url) {
  const fullUrl = url.startsWith("http") ? url : BASE_URL + url;
  const res = await axios.get(fullUrl, { headers });
  const $ = cheerio.load(res.data);
  
  const title = $("h1").first().text().trim();
  const image = $(".ims img").attr("src") || $(".thumb img").attr("src") || $(".thumb img").attr("data-src");
  
  const info = {};
  $(".inftable tr").each((i, el) => {
    const key = $(el).find("th").text().trim().replace(":", "");
    const value = $(el).find("td").text().trim();
    if (key && value) info[key] = value;
  });
  
  const genreLinks = [];
  $(".inftable .genre li a").each((i, el) => {
    genreLinks.push({ name: $(el).text().trim(), url: BASE_URL + $(el).attr("href") });
  });
  info.Genre = genreLinks;
  
  const sinopsis = $(".desc").text().trim();
  
  const chapters = [];
  $("#daftarChapter tr").each((i, el) => {
    const chapterLink = $(el).find("td.judulseries a");
    const chapterTitle = chapterLink.text().trim();
    const chapterUrl = chapterLink.attr("href");
    const date = $(el).find("td.tanggalseries").text().trim();
    if (chapterTitle && chapterUrl) {
      chapters.push({
        chapter: chapterTitle,
        url: chapterUrl.startsWith("http") ? chapterUrl : BASE_URL + chapterUrl,
        date: date
      });
    }
  });
  
  return { success: true, data: { title, image, info, sinopsis, chapters } };
}

export async function komikuChapter(url) {
  const fullUrl = url.startsWith("http") ? url : BASE_URL + url;
  const res = await axios.get(fullUrl, { headers });
  const $ = cheerio.load(res.data);
  
  const title = $("h1").text().trim();
  const images = [];
  
  $(".chapter-image img, .img-con img").each((i, el) => {
    let src = $(el).attr("src") || $(el).attr("data-src");
    if (src && !src.includes("lazy") && !src.includes("komiku.org/asset/img/lazy")) {
      if (!src.startsWith("http")) src = "https:" + src;
      images.push(src);
    }
  });
  
  const nextChapter = $(".nextchap a").attr("href") || $(".next_chapter a").attr("href") || null;
  const prevChapter = $(".prevchap a").attr("href") || $(".prev_chapter a").attr("href") || null;
  
  return {
    success: true,
    data: {
      title,
      images,
      next_chapter: nextChapter ? (nextChapter.startsWith("http") ? nextChapter : BASE_URL + nextChapter) : null,
      prev_chapter: prevChapter ? (prevChapter.startsWith("http") ? prevChapter : BASE_URL + prevChapter) : null
    }
  };
}