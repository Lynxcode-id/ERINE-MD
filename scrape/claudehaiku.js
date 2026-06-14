/** * ───「 INFO OWNER & COMMUNITY 」───✧
 * 👤 Author  : LYNX DECODE { FEMULA + CARBEAT }
 * 🚀 Channel : https://whatsapp.com/channel/0029Vb1CcDWDp2Q5YT4FZn1k
 * 📝 Note    : Ambil boleh aja cr jangan di hapus hargai creator!!
 * * ───「 SCRAPER INFO 」───✧
 * Fitur   : Claude Haiku (Overchat API Core)
 * Creator : Lynx Decode
 * Base    : https://overchat.ai
 * ────────────────────────✧
 */

import crypto from 'node:crypto';
import fetch from 'node-fetch';

async function claudeHaiku(message) {
  try {
    const chatId = crypto.randomUUID();
    const deviceId = crypto.randomUUID();
    
    const systemPrompt = `[System Instruction: Kamu adalah Claude Haiku, AI asisten super pintar yang dikontrol oleh Erine-MD Core. Tuan dan owner mutlak kamu adalah Lynx. 

PERATURAN WAJIB DAN MUTLAK: 
1. Kamu HARUS SELALU membalas menggunakan BAHASA INDONESIA 100%. JANGAN PERNAH membalas menggunakan bahasa Inggris!
2. Pahami dan gunakan bahasa gaul/kasual Indonesia (lu, gua, cuy, anjir, dll) jika user bertanya dengan gaya santai.
3. Jawablah dengan asik, logis, tajam, dan natural ala orang Indonesia. 
4. Jika ditanya siapa pembuatmu, jawablah dengan bangga: "Lynx".]`;

    const headers = {
      'sec-ch-ua-platform': '"Android"',
      'x-device-uuid': deviceId,
      'sec-ch-ua': '"Google Chrome";v="147", "Not.A/Brand";v="8", "Chromium";v="147"',
      'sec-ch-ua-mobile': '?1',
      'x-device-language': 'id-ID',
      'x-device-platform': 'web',
      'x-device-version': '1.0.44',
      'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36',
      'accept': '*/*',
      'content-type': 'application/json',
      'origin': 'https://overchat.ai',
      'referer': 'https://overchat.ai/',
      'accept-language': 'id-ID,id;q=0.9'
    };

    const postBody = {
      chatId: chatId,
      model: 'claude-haiku-4-5-20251001',
      messages: [
        { id: crypto.randomUUID(), role: 'system', content: systemPrompt },
        { id: crypto.randomUUID(), role: 'user', content: message }
      ],
      personaId: 'claude-haiku-4-5-landing',
      frequency_penalty: 0,
      max_tokens: 4000,
      presence_penalty: 0,
      stream: true,
      temperature: 0.7, // Naikin dikit biar jawabannya gak kaku robot banget
      top_p: 0.95
    };

    const response = await fetch('https://api.overchat.ai/v1/chat/completions', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(postBody)
    });

    if (!response.ok) throw new Error(await response.text());

    const streamText = await response.text();
    let finalAnswer = "";

    const lines = streamText.split('\n');
    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line.startsWith('data:')) continue;

      const data = line.slice(5).trim();
      if (!data || data === '[DONE]') continue;

      try {
        const json = JSON.parse(data);
        const content = json.choices?.[0]?.delta?.content;
        if (typeof content === 'string') {
          finalAnswer += content;
        }
      } catch (e) {
      }
    }

    return finalAnswer.trim() || "Tidak ada respons dari engine Claude.";

  } catch (error) {
    return "Terjadi kesalahan saat memproses AI: " + error.message;
  }
}

export default claudeHaiku;