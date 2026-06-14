/**
 * ───「 SCRAPER AUTHOR 」───
 * 👤 Original : KRYZEN team
 * 📝 Adapted  : Lynx Decode
 * ─────────────────────────
 */

import axios from 'axios';

const baseRes = { author_skrep: 'KRYZEN team', kesayangan: 'Fiony Alveria' };

export const getStickerLyPack = async (url, needRelation = true) => {
    try {
        const stickerIdMatch = url.match(/sticker\.ly\/s\/([A-Z0-9]+)/i) || url.match(/sticker\.ly\/([A-Z0-9]+)/i);    
        if (!stickerIdMatch) throw new Error('Invalid sticker.ly URL. Could not extract ID.');
        
        const stickerId = stickerIdMatch[1];
        
        const { data } = await axios.get(`https://api.sticker.ly/v4/stickerPack/${stickerId}`, {
            params: { needRelation },
            headers: {
                'User-Agent': 'androidapp.stickerly/3.31.0 (M2006C3LG; U; Android 29; in-ID; id;)'
            }
        });
        
        return { ...baseRes, status: true, result: data };
    } catch (e) {
        return { ...baseRes, status: false, error: e.response?.data || e.message };
    }
};

export const getSearchStickerLy = async (keyword = 'jokowi') => {
    try {
        const { data } = await axios.post(
            'https://api.sticker.ly/v4/stickerPack/smartSearch',
            {
                keyword,
                enabledKeywordSearch: true,
                filter: {
                    extendSearchResult: false,
                    sortBy: 'RECOMMENDED',
                    languages: ['ALL'],
                    minStickerCount: 5,
                    searchBy: 'ALL',
                    stickerType: 'ALL',
                },
            },
            {
                headers: {
                    'User-Agent': 'androidapp.stickerly/3.31.0 (M2006C3LG; U; Android 29; in-ID; id;)',
                    'Content-Type': 'application/json',
                },
            }
        );

        return { ...baseRes, status: true, result: data };
    } catch (e) {
        return { ...baseRes, status: false, error: e.response?.data || e.message };
    }
};