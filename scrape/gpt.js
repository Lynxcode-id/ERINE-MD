/** * ───「 INFO OWNER & COMMUNITY 」───✧
 * 👤 Author  : LYNX DECODE { FEMULA + CARBEAT }
 * 🚀 Channel : https://whatsapp.com/channel/0029Vb1CcDWDp2Q5YT4FZn1k
 * 📝 Note    : Ambil boleh aja cr jangan di hapus hargai creator!!
 * * ───「 SCRAPER INFO 」───✧
 * Fitur   : AI GPT-3.5
 * Creator : Nath
 * Base    : https://chatopenai.id
 * ────────────────────────✧
 */

import fetch from "node-fetch";
import FormData from "form-data";

const client_id = () => Math.random().toString(36).slice(2, 12);

async function getNonce() {
  const res = await fetch("https://chatopenai.id/", {
    headers: {
      "user-agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36",
      "accept-language": "id-ID,id;q=0.9",
    }
  });
  const html = await res.text();
  const match = html.match(/data-nonce="([^"]+)"/);
  if (!match) throw new Error("Nonce tidak ditemukan");
  return match[1];
}

async function chatGpt(message, history = []) {
  try {
      const nonce = await getNonce();
      
      // 🔥 FIX: Paksa AI biar jawab pake bahasa Indonesia yang natural
      const indoPrompt = `Jawablah menggunakan bahasa Indonesia yang santai, asik, dan natural.\n\nPertanyaan: ${message}`;

      const form = new FormData();
      form.append("_wpnonce", nonce);
      form.append("post_id", "2");
      form.append("url", "https://chatopenai.id");
      form.append("action", "wpaicg_chat_shortcode_message");
      form.append("message", indoPrompt);
      form.append("bot_id", "0");
      form.append("chatbot_identity", "shortcode");
      form.append("wpaicg_chat_client_id", client_id());
      form.append("wpaicg_chat_history", JSON.stringify(history));

      const res = await fetch("https://chatopenai.id/wp-admin/admin-ajax.php", {
        method: "POST",
        headers: {
          ...form.getHeaders(),
          "accept": "*/*",
          "accept-language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
          "cache-control": "no-cache",
          "origin": "https://chatopenai.id",
          "referer": "https://chatopenai.id/",
          "user-agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36",
        },
        body: form,
      });

      const json = await res.json();
      if (json.status !== "success" || !json.data) throw new Error(JSON.stringify(json));
      return json.data;
  } catch (error) {
      throw new Error(error.message);
  }
}

export default chatGpt;
