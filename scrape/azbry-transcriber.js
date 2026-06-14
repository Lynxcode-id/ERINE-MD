import axios from 'axios';

const azbryTranscriber = async (url, lang = 'id') => {
    try {
        const res = await axios.get(`https://api.azbry.com/api/tools/transcriber`, {
            params: { url, lang },
            timeout: 180000 
        });

        if (!res.data || !res.data.status) {
            throw new Error(res.data?.message || "Gagal melakukan transcribe di server Azbry.");
        }

        return res.data;
    } catch (e) {
        throw new Error(e.response?.data?.message || e.message || String(e));
    }
};

export default azbryTranscriber;