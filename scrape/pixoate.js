/**
 * ───「 SCRAPER AUTHOR 」───
 * 👤 Original : Nimzz
 * 📝 Adapted  : Lynx Decode
 * ─────────────────────────
 */

import axios from 'axios';
import FormData from 'form-data';
import https from 'https';

const httpsAgent = new https.Agent({ family: 4 });
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';
const API = 'https://api.pixoate.com';

async function upload(buffer) {
    const form = new FormData();
    form.append('image', buffer, 'image.jpg');
    const { data } = await axios.post(`${API}/upload`, form, {
        headers: { 'User-Agent': UA, ...form.getHeaders() },
        httpsAgent, 
        timeout: 30000,
    });
    return data;
}

async function executeFunction(fileId, functionName, params = {}) {
    const { data } = await axios.post(`${API}/execute-function`, {
        fileId, functionName, ...params
    }, {
        headers: { 'User-Agent': UA, 'Content-Type': 'application/json' },
        httpsAgent, 
        timeout: 120000,
    });
    return data;
}

async function downloadResult(processedFileId) {
    const res = await axios.get(`${API}/processed/${processedFileId}`, {
        responseType: 'arraybuffer', 
        headers: { 'User-Agent': UA }, 
        httpsAgent, 
        timeout: 30000,
    });
    return Buffer.from(res.data);
}

export async function upscale(buffer, scale = '2x') {
    const up = await upload(buffer);
    if (!up.success) throw new Error('Upload gagal di sisi server.');
    
    let fileId = up.fileId;

    if (scale === '4x' || scale === '4k') {
        const r = await executeFunction(fileId, 'resizeImage', { width: 4000, height: 4000 });
        if (r.success) fileId = r.processedFileId;
    } else if (scale === '8x' || scale === '8k') {
        const r = await executeFunction(fileId, 'resizeImage', { width: 8000, height: 8000 });
        if (r.success) fileId = r.processedFileId;
    }

    const ai = await executeFunction(fileId, 'applyAIUpscale');
    if (!ai.success) throw new Error('Proses AI Upscale gagal.');

    return await downloadResult(ai.processedFileId);
}