import axios from 'axios'
import FormData from 'form-data'

/*
- HARGAI WOY JANGAN DIHAPUS!
- Skrep by *JH a.k.a DHIKA - FIONY BOT*
- Rombak to Buffer Input by *Lynx Decode*
- Kesayangan: Fiony Alveria
*/

export default async function resizeImage(buffer, targetLebarPixels = "1080") {
    const pageUrl = "https://www.iloveimg.com/resize-image";

    const jantung = (token = null, extra = {}) => ({
        "authorization": token ? `Bearer ${token}` : undefined,
        "accept": "application/json",
        "origin": "https://www.iloveimg.com",
        "referer": pageUrl,
        "user-agent": "Mozilla/5.0 (Linux; Android 13; 23021RAA2Y Build/TKQ1.221114.001) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.7727.55 Mobile Safari/537.36",
        "accept-language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
        ...extra
    });

    try {
        const { data: html } = await axios.get(pageUrl, {
            headers: jantung(null, { accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" }),
            timeout: 60000
        });

        const configRaw = html.match(/var\s+ilovepdfConfig\s*=\s*(\{[\s\S]*?\});/);
        const taskRaw = html.match(/ilovepdfConfig\.taskId\s*=\s*['"]([^'"]+)['"]/);
        if (!configRaw || !taskRaw) throw new Error("Gagal ngambil ilovepdfConfig atau taskId.");

        const config = JSON.parse(configRaw[1]);
        config.taskId = taskRaw[1];
        if (!config.token || !config.servers || !config.servers.length) throw new Error("Token atau servers kagak ketemu.");

        let apiBase = config.servers[0];
        if (!apiBase.startsWith("http")) {
            apiBase = apiBase.includes(".") ? `https://${apiBase}` : `https://${apiBase}.iloveimg.com`;
        }

        const filename = "image_jh.jpg";
        const formUp = new FormData();
        formUp.append("name", filename);
        formUp.append("chunk", "0");
        formUp.append("chunks", "1");
        formUp.append("task", config.taskId);
        formUp.append("preview", "1");
        formUp.append("pdfinfo", "0");
        formUp.append("pdfforms", "0");
        formUp.append("pdfresetforms", "0");
        formUp.append("v", "web.0");
        
        // Pake buffer langsung dari Baileys
        formUp.append("file", buffer, { filename, contentType: "image/jpeg", knownLength: buffer.length });

        const upRes = await axios.post(`${apiBase}/v1/upload`, formUp, {
            headers: jantung(config.token, formUp.getHeaders()),
            timeout: 120000,
            maxBodyLength: Infinity,
            maxContentLength: Infinity
        });

        if (!upRes.data?.server_filename) throw new Error("Upload gagal anjir, ga dapet server_filename.");

        const formProc = new FormData();
        formProc.append("resize_mode", "pixels");
        formProc.append("maintain_ratio", "true");
        formProc.append("no_enlarge_if_smaller", "false");
        formProc.append("pixels_width", targetLebarPixels.toString());
        formProc.append("task", config.taskId);
        formProc.append("tool", "resizeimage");
        formProc.append("packaged_filename", "iloveimg-resized");
        formProc.append("files[0][server_filename]", upRes.data.server_filename);
        formProc.append("files[0][filename]", filename);

        await axios.post(`${apiBase}/v1/process`, formProc, {
            headers: jantung(config.token, formProc.getHeaders()),
            timeout: 180000,
            maxBodyLength: Infinity,
            maxContentLength: Infinity
        });

        const dlRes = await axios.get(`${apiBase}/v1/download/${config.taskId}`, {
            headers: jantung(config.token, { accept: "image/*, application/pdf, */*" }),
            responseType: "arraybuffer",
            timeout: 180000
        });

        const outBuffer = Buffer.from(dlRes.data);
        if (!outBuffer.length) throw new Error("Hasil resizenya kosong blong.");

        return {
            success: true,
            buffer: outBuffer,
            size_awal: buffer.length,
            size_akhir: outBuffer.length
        };

    } catch (e) {
        return { success: false, error: e.message };
    }
}