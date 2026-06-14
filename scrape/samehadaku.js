/** * ───「 SCRAPER SAMEHADAKU 」───✧
 * 👤 Author  : LYNX DECODE { FEMULA + CARBEAT }
 * 🚀 Channel : https://whatsapp.com/channel/0029Vb1CcDWDp2Q5YT4FZn1k
 * 📝 Note    : Simpan di folder scrape dengan nama: samehadaku.js
 * ────────────────────────✧
 */

import * as cheerio from 'cheerio';

async function getFetcher() {
    const { gotScraping } = await import('got-scraping');
    return gotScraping;
}

async function getLatestNonce() {
    try {
        const gotScraping = await getFetcher();
        const response = await gotScraping.get('https://v2.samehadaku.how/', {
            headers: {
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
            }
        });

        const $ = cheerio.load(response.body);
        let nonce = null;

        $('script').each((i, el) => {
            const scriptContent = $(el).html();
            if (scriptContent && scriptContent.includes('nonce')) {
                const match = scriptContent.match(/"nonce"\s*:\s*"([a-zA-Z0-9]+)"/);
                if (match) {
                    nonce = match[1];
                }
            }
        });

        return nonce;
    } catch (e) {
        return null;
    }
}

const samehadakuSearch = async (keyword) => {
    try {
        const nonce = await getLatestNonce();
        if (!nonce) {
            return { status: false, message: 'Tidak dapat menemukan nonce aktif.' };
        }

        const gotScraping = await getFetcher();
        const response = await gotScraping.get('https://v2.samehadaku.how/wp-json/eastheme/search/', {
            searchParams: {
                keyword: keyword,
                nonce: nonce
            },
            headers: {
                'Accept': 'application/json, text/javascript, */*; q=0.01',
                'X-Requested-With': 'XMLHttpRequest'
            },
            responseType: 'json'
        });

        if (!response.body || typeof response.body !== 'object') {
            return { status: false, message: 'Gagal mengambil data dari API.' };
        }

        const results = Object.entries(response.body).map(([id, item]) => ({
            id: id,
            title: item.title || '-',
            url: item.url || '-',
            image: item.img || '-',
            genre: item.data?.genre || '-',
            type: item.data?.type || '-',
            score: item.data?.score || '-'
        }));

        return {
            status: true,
            results
        };

    } catch (e) {
        return {
            status: false,
            message: e.message
        };
    }
};

export default samehadakuSearch;