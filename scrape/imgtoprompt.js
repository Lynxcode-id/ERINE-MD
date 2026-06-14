/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Scraper Original : BINTANG
 * 👤 Adapted for ESM  : Lynx Decode
 * ─────────────────────────
 * 📝 Scraper : ImgToPrompt AI (Buffer Support)
 */

import axios from 'axios';

const BASE_URL = "https://aiconvert.online/api";
const USER_AGENT = "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36";

class ImgToPrompt {
  constructor() {
    this.taskId = null;
  }

  encodeImageToBase64(buffer) {
    return buffer.toString("base64");
  }

  async kirimGambar(buffer, mimeType) {
    if (!buffer) {
      return {
        sukses: false,
        author: "BINTANG",
        kode: 404,
        pesan: "Buffer gambar tidak ditemukan"
      };
    }

    const base64Gambar = this.encodeImageToBase64(buffer);
    const mime = mimeType || "image/jpeg";

    const payload = {
      imageData: base64Gambar,
      mimeType: mime,
      language: "en",
      promptType: "nano-banana-pro"
    };

    try {
      const response = await axios.post(`${BASE_URL}/submit-prompt-job`, payload, {
        headers: {
          "Content-Type": "application/json",
          "User-Agent": USER_AGENT,
          "Referer": "https://aiconvert.online/prompt-generator"
        },
        timeout: 30000
      });

      if (response.data && response.data.taskId) {
        this.taskId = response.data.taskId;
        return {
          sukses: true,
          author: "BINTANG",
          task_id: this.taskId,
          pesan: "Gambar diterima, sedang diproses"
        };
      } else {
        return {
          sukses: false,
          author: "BINTANG",
          pesan: response.data?.message || "Gagal submit gambar"
        };
      }
    } catch (error) {
      return {
        sukses: false,
        author: "BINTANG",
        pesan: error.message
      };
    }
  }

  async cekStatus() {
    if (!this.taskId) {
      return {
        sukses: false,
        author: "BINTANG",
        pesan: "Task ID tidak ditemukan"
      };
    }

    try {
      const response = await axios.get(`${BASE_URL}/check-status-kv`, {
        params: { taskId: this.taskId },
        headers: {
          "User-Agent": USER_AGENT,
          "Referer": "https://aiconvert.online/prompt-generator"
        },
        timeout: 10000
      });

      const data = response.data;
      
      if (data.status === "SUCCESS" && data.result) {
        return {
          sukses: true,
          author: "BINTANG",
          task_id: this.taskId,
          prompt: data.result.generatedPrompt,
          pesan: "Prompt berhasil digenerate"
        };
      } else if (data.status === "PENDING" || data.status === "PROCESSING") {
        return {
          sukses: false,
          author: "BINTANG",
          task_id: this.taskId,
          pesan: "Masih diproses"
        };
      } else {
        return {
          sukses: false,
          author: "BINTANG",
          task_id: this.taskId,
          pesan: data.message || "Gagal mendapatkan prompt"
        };
      }
    } catch (error) {
      return {
        sukses: false,
        author: "BINTANG",
        pesan: error.message
      };
    }
  }

  async generate(buffer, mimeType) {
    const submit = await this.kirimGambar(buffer, mimeType);
    
    if (!submit.sukses) {
      return submit;
    }
    
    let maxCoba = 35;
    let jeda = 2000;

    for (let i = 0; i < maxCoba; i++) {
      const hasil = await this.cekStatus();
      
      if (hasil.sukses) {
        return hasil;
      }
      
      if (i < maxCoba - 1) {
        await this.tunggu(jeda);
      }
    }

    return {
      sukses: false,
      author: "BINTANG",
      task_id: this.taskId,
      pesan: "Waktu habis, prompt tidak kunjung selesai"
    };
  }

  tunggu(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default async function imgToPrompt(buffer, mimeType) {
  const ai = new ImgToPrompt();
  return await ai.generate(buffer, mimeType);
}