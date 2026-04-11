import axios from "axios";
import FormData from "form-data";

let handler = async (m, { conn, text }) => {
    // 1. Tangkap teks dari pesan langsung atau dari pesan yang di-reply
    if (m.quoted && m.quoted.text && !text) {
        text = m.quoted.text;
    } else if (!text && !m.quoted) {
        return m.reply('Masukkan pertanyaan yang ingin diajukan pada DeepSeek!\nContoh: .deepseek siapa kamu');
    }

    try {
        await m.react('🌟');

        const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
        
        // 2. Scraper untuk mengambil Nonce terbaru secara otomatis
        let nonce = "43b50086d9"; 
        try {
            const { data: html } = await axios.get("https://chat-deep.ai/deepseek-chat/", { 
                headers: { "user-agent": UA } 
            });
            const match = html.match(/nonce["']?\s*[:=]\s*["']([a-f0-9]{10})["']/i);
            if (match && match[1]) {
                nonce = match[1];
            }
        } catch (err) {
            console.log("Gagal scrape nonce, mencoba menggunakan nonce default...");
        }

        // 3. Setup Form Data
        const form = new FormData();
        form.append("action", "deepseek_chat");
        form.append("message", text);
        form.append("model", "default");
        form.append("nonce", nonce);
        form.append("save_conversation", "0");
        form.append("session_only", "1");

        // 4. Eksekusi Request ke DeepSeek
        const { data } = await axios.post(
            "https://chat-deep.ai/wp-admin/admin-ajax.php",
            form,
            {
                headers: {
                    ...form.getHeaders(),
                    "user-agent": UA,
                    "origin": "https://chat-deep.ai",
                    "referer": "https://chat-deep.ai/deepseek-chat/",
                    "accept": "*/*",
                    "accept-language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7"
                },
                timeout: 30000
            }
        );

        // 5. Ekstrak balasan dan kirim pesan
        const responseText = data?.data?.response || data?.response || (typeof data === 'object' ? JSON.stringify(data, null, 2) : data);
        
        await conn.sendMessage(m.chat, { text: responseText }, { quoted: m });
        await m.react('✅');

    } catch (e) {
        await m.react('❌');
        const errorMsg = e?.response?.data || e.message;
        m.reply('Gagal mendapatkan balasan dari DeepSeek: ' + errorMsg);
    }
}

handler.help = ['deepseek <text>']
handler.tags = ['ai']
handler.command = /^(deepseek|ds)$/i
handler.limit = true
handler.register = false
handler.group = false

export default handler
