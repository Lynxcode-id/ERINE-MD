// File: ../scrape/animequotes.js
// © INF PROJECT - Erine-MD
// Developed by INF PROJECT

import fetch from 'node-fetch';

class AnimeQuotes {
  constructor() {
    this.API = "https://raw.githubusercontent.com/Ditzzx-vibecoder/Assets/main/anime-quotes.json";
    this.headers = {
      "User-Agent": "Mozilla/5.0",
      "Accept": "application/json,text/plain,*/*"
    };
  }

  normalizeQuotes(data) {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.quotes)) return data.quotes;
    if (Array.isArray(data.result)) return data.result;
    if (Array.isArray(data.data)) return data.data;
    return [];
  }

  pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)];
  }

  async getRandomQuote() {
    try {
      const res = await fetch(this.API, { headers: this.headers });
      const text = await res.text();

      if (!res.ok) {
        throw new Error(`HTTP Error: ${res.status}`);
      }

      const data = JSON.parse(text);
      const quotes = this.normalizeQuotes(data);
      const selected = this.pickRandom(quotes);

      if (!selected) {
        throw new Error("Tidak ada quote yang ditemukan");
      }

      return {
        success: true,
        quote: selected.quote || selected.text || selected.kata || "-",
        character: selected.character || selected.char || selected.name || selected.tokoh || "Unknown",
        anime: selected.anime || selected.title || selected.source || "Unknown"
      };
    } catch (error) {
      throw new Error(error.message || "Invalid JSON / Fetch Error");
    }
  }
}

export default new AnimeQuotes();