/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Author     : Lynx Decode
 * 📞 Contact    : +62 882-5804-1396
 * 📢 Channel    : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * ⚠️ Note       : Keep credit to respect the creator!
 * ─────────────────────────
 * 📝 Plugin: YouTube AI Summary (Metube.io)
 */

import https from "https";
import { randomUUID } from "crypto";

const BASE = "metube.io";
const UA = "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Mobile Safari/537.36";

const _req = (method, path, body, extra = {}) =>
  new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const opts = {
      hostname: BASE,
      path,
      method,
      headers: {
        "User-Agent": UA,
        Accept: "application/json, text/plain, */*",
        "Accept-Language": "en-US,en;q=0.9",
        "Content-Type": "application/json",
        Referer: `https://${BASE}/`,
        Origin: `https://${BASE}`,
        ...extra,
      },
    };
    if (payload) opts.headers["Content-Length"] = Buffer.byteLength(payload);

    const req = https.request(opts, (res) => {
      let raw = "";
      res.on("data", (c) => (raw += c));
      res.on("end", () => {
        try {
          resolve(JSON.parse(raw));
        } catch {
          resolve(raw);
        }
      });
    });
    req.on("error", reject);
    if (payload) req.write(payload);
    req.end();
  });

const _sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const _headers = (visitorId) => ({
  "x-visitor-id": visitorId,
  Cookie: `Next-Locale=en; sy_visitor_id=${visitorId}`,
});

const _get = (path, vid) => _req("GET", path, null, _headers(vid));
const _post = (path, body, vid) => _req("POST", path, body, _headers(vid));

const _pollTask = async (taskId, vid) => {
  let i = 0;
  while (true) {
    const r = await _get(`/api/v1/tasks/${taskId}`, vid).then((x) => x?.data);
    if (r?.status === "SUCCESS") return r;
    if (r?.status === "FAILED") throw new Error("Task gagal: " + r.error_message);
    await _sleep(4000);
    if (++i > 30) throw new Error("Timeout memproses video.");
  }
};

const _pollNotes = async (videoId, language, vid) => {
  let i = 0;
  while (true) {
    const r = await _get(
      `/api/v1/videos/${videoId}/generated-notes?output_language=${language}&limit=20`,
      vid
    ).then((x) => x?.data);

    if (r?.items?.length > 0 && r?.active_task === null) return r;

    await _sleep(5000);
    if (++i > 60) throw new Error("Timeout generate summary.");
  }
};

const summarize = async (url, language = "id") => {
  const vid = randomUUID();

  const processRes = await _post(
    "/api/v1/videos/process",
    { url, language },
    vid
  );

  if (!processRes?.data?.id) {
    throw new Error("Gagal memproses video. Pastikan link valid dan video memiliki subtitle/suara yang jelas.");
  }

  const { id: taskId, related_id: videoId, status, parameters } = processRes.data;

  if (status !== "SUCCESS") {
    await _pollTask(taskId, vid);
  }

  const notes = await _pollNotes(videoId, language, vid);

  const [summaryRes] = await Promise.all([
    _get(`/api/v1/videos/${videoId}/summary?language=${language}&limit=20`, vid)
  ]);

  const note = notes.items?.[0];

  return {
    title: summaryRes?.data?.title ?? "Unknown Title",
    model_used: note?.model_used ?? "Unknown Model",
    content_markdown: note?.content_markdown ?? "Gagal mendapatkan ringkasan.",
  };
};

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        return m.reply(`┌˚₊ ๑│ ʏ ᴛ  s ᴜ ᴍ ᴍ ᴀ ʀ ʏ │๑˚₊ ⚠️\n┇ \n│ ❌ *Link YouTube kosong!*\n│ \n│ 📌 *Cara pakai:*\n│ ${usedPrefix + command} https://youtu.be/xxx\n┇ \n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`);
    }

    const ytRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?/i;
    if (!ytRegex.test(text)) {
        return m.reply('❌ Link YouTube tidak valid cuy!');
    }

    await m.react('⏳');
    
    // Kirim pesan loading agar user tahu bot sedang bekerja (proses ini bisa makan waktu lumayan lama)
    let loadingMsg = await conn.sendMessage(m.chat, { text: '⏳ _Sedang memproses video dan membuat ringkasan AI, mohon tunggu beberapa saat..._' }, { quoted: m });

    try {
        // Panggil fungsi summarize, default bahasa di set 'id'
        const result = await summarize(text.trim(), "id");

        let caption = `┌˚₊ ๑│ ʏ ᴛ  s ᴜ ᴍ ᴍ ᴀ ʀ ʏ │๑˚₊ 🤖\n` +
                      `┇ \n` +
                      `│ 🎬 *Title:* ${result.title}\n` +
                      `│ 🧠 *Model:* ${result.model_used}\n` +
                      `┇ \n` +
                      `└˚₊ ๑ ────────────── ๑˚₊\n\n` +
                      `${result.content_markdown}\n\n` +
                      `> © ERINE-AI`;

        await conn.sendMessage(m.chat, { text: caption, edit: loadingMsg.key });
        await m.react('✅');

    } catch (error) {
        console.error('[METUBE ERROR]', error);
        await m.react('❌');
        
        let errMsg = error.message || String(error);
        if (errMsg.length > 500) errMsg = errMsg.substring(0, 500) + '... (cek console)';

        let errFormat = `┌˚₊ ๑│ s ʏ s ᴛ ᴇ ᴍ  ᴇ ʀ ʀ ᴏ ʀ │๑˚₊ ❌\n┇ Terjadi kesalahan sistem.\n┇ *Detail:* ${errMsg}\n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`;
        await conn.sendMessage(m.chat, { text: errFormat, edit: loadingMsg.key });
    }
}

handler.help = ['ytsummary <url>'];
handler.tags = ['tools', 'ai'];
handler.command = /^ytsummary$/i;
handler.limit = true;

export default handler;