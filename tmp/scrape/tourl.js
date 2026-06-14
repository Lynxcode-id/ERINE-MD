/** * ───「 SCRAPER SILENT UPLOADER 」───✧
 * 👤 Author  : LYNX DECODE { FEMULA + CARBEAT }
 * 🚀 Channel : https://whatsapp.com/channel/0029Vb1CcDWDp2Q5YT4FZn1k
 * 📝 Note    : Simpan di folder scrape dengan nama: silentupload.js
 * ────────────────────────✧
 */

import axios from 'axios';
import FormData from 'form-data';

const silentUpload = async (buffer, filename = 'file') => {
    try {
        const formData = new FormData();
        formData.append('file', buffer, { filename });

        const response = await axios.post('https://x.silentphantom-uploader.workers.dev/api/upload', formData, {
            headers: {
                'accept': '*/*',
                'origin': 'https://x.silentphantom-uploader.workers.dev',
                'referer': 'https://x.silentphantom-uploader.workers.dev/',
                'user-agent': 'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36',
                ...formData.getHeaders()
            }
        });

        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || error.message);
    }
};

export default silentUpload;