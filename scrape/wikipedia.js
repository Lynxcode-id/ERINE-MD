import axios from "axios";
import * as cheerio from "cheerio";

class WikipediaScraper {
  constructor() {
    this.LANG = "id";
    this.LIMIT = 5;
    this.BASE = `https://${this.LANG}.wikipedia.org`;
    this.API = `${this.BASE}/w/api.php`;
    this.UA = "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36";
  }

  decodeHtml(text) {
    return String(text || "")
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")
      .replace(/&#39;/g, "'")
      .replace(/&amp;/g, "&")
      .replace(/&nbsp;/g, " ")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">");
  }

  cleanText(text) {
    return this.decodeHtml(text)
      .replace(/<\/?[^>]+>/g, "")
      .replace(/\[\d+\]/g, "")
      .replace(/\[[a-z]\]/gi, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  cleanBlock(text) {
    return this.decodeHtml(text)
      .replace(/<\/?[^>]+>/g, "")
      .replace(/\[\d+\]/g, "")
      .replace(/\[[a-z]\]/gi, "")
      .replace(/[ \t]+/g, " ")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  }

  fixUrl(url) {
    if (!url) return null;
    if (url.startsWith("//")) return `https:${url}`;
    if (url.startsWith("/")) return `${this.BASE}${url}`;
    return url;
  }

  uniqueBy(array, key) {
    return array.filter((item, index, self) => self.findIndex(x => x[key] === item[key]) === index);
  }

  async search(query) {
    const { data, status } = await axios.get(this.API, {
      params: {
        action: "query",
        list: "search",
        srsearch: query,
        srlimit: this.LIMIT,
        format: "json",
        origin: "*"
      },
      headers: {
        "user-agent": this.UA,
        "accept-language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7"
      }
    });

    return {
      code: status,
      results: data?.query?.search || []
    };
  }

  async getArticle(title) {
    const pagePath = `/wiki/${encodeURIComponent(title.replaceAll(" ", "_"))}`;
    const pageUrl = `${this.BASE}${pagePath}`;

    const { data, status } = await axios.get(pageUrl, {
      headers: {
        "user-agent": this.UA,
        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
        "accept-language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
        "referer": "https://www.wikipedia.org/"
      }
    });

    const $ = cheerio.load(data);

    $("script, style, noscript, sup.reference, .mw-editsection, .navbox, .metadata, .ambox, .hatnote, .toc, #toc, table.vertical-navbox").remove();

    const pageTitle = this.cleanText($("#firstHeading").text()) || title;
    const description = this.cleanText($(".tagline").first().text()) || null;

    const introParagraphs = [];

    $(".mw-parser-output > section").first().find("p").each((_, el) => {
      const text = this.cleanBlock($(el).text());
      if (text.length > 40) introParagraphs.push(text);
    });

    if (!introParagraphs.length) {
      $(".mw-parser-output > p").each((_, el) => {
        const text = this.cleanBlock($(el).text());
        if (text.length > 40) introParagraphs.push(text);
      });
    }

    const sections = [];

    $(".mw-parser-output > section").each((_, section) => {
      const heading = this.cleanText($(section).find("h2, h3").first().text());

      if (!heading || heading.toLowerCase() === "daftar isi") return;

      const texts = [];

      $(section).find("p, ul, ol").each((_, el) => {
        const text = this.cleanBlock($(el).text());
        if (text.length > 40) texts.push(text);
      });

      if (texts.length) {
        sections.push({
          Title: heading,
          Text: texts.join("\n\n")
        });
      }
    });

    const infobox = {};

    $(".infobox tr").each((_, tr) => {
      const key = this.cleanText($(tr).find("th").first().text());
      const value = this.cleanText($(tr).find("td").first().text());

      if (key && value && key.length < 100) {
        infobox[key] = value;
      }
    });

    const images = [];

    $(".mw-parser-output img").each((_, img) => {
      const src = this.fixUrl($(img).attr("src"));
      const alt = this.cleanText($(img).attr("alt"));

      if (!src) return;
      if (src.includes("static/images")) return;
      if (src.includes("Semi-protection")) return;
      if (src.includes("OOjs_UI")) return;

      images.push({
        Alt: alt || null,
        Url: src
      });
    });

    return {
      code: status,
      article: {
        Title: pageTitle,
        Description: description,
        Url: pageUrl,
        Extract: introParagraphs.join("\n\n") || null,
        Sections: sections,
        Infobox: infobox,
        Images: this.uniqueBy(images, "Url")
      }
    };
  }

  async detail(query) {
    const searchRes = await this.search(query);
    if (!searchRes.results.length) {
      throw new Error("Artikel tidak ditemukan");
    }
    const first = searchRes.results[0];
    const detailRes = await this.getArticle(first.title);
    
    return {
      Selected: {
        Title: first.title,
        Page_id: first.pageid,
        Snippet: this.cleanText(first.snippet)
      },
      Result: detailRes.article
    };
  }
}

export default new WikipediaScraper();