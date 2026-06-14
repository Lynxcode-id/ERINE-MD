/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Scraper Original : BINTANG
 * 👤 Adapted for ESM  : Lynx Decode
 * ─────────────────────────
 * 📝 Scraper : TikTok Profile Stalker
 */

import https from 'https';
import * as cheerio from 'cheerio';

class TikTokInfo {
    constructor() {
        this.apiUrl = 'user.tikmatrix.com';
    }

    cleanText(text) {
        if (!text) return '';
        return text.replace(/\n/g, '').replace(/📋/g, '').replace(/\s+/g, ' ').trim();
    }

    async getProfile(username) {
        return new Promise((resolve) => {
            const options = {
                hostname: this.apiUrl,
                port: 443,
                path: `/?username=${encodeURIComponent(username)}`,
                method: 'GET',
                headers: {
                    'Accept': 'text/html,application/xhtml+xml',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36'
                }
            };

            const req = https.request(options, (res) => {
                let data = '';
                res.on('data', (chunk) => { data += chunk.toString(); });
                res.on('end', () => {
                    try {
                        const $ = cheerio.load(data);
                        
                        const fullname = this.cleanText($('.user-name').first().text());
                        const username_raw = this.cleanText($('.user-handle').first().text().replace('@', ''));
                        const avatar = $('.user-avatar').attr('src');
                        const bio = this.cleanText($('.user-bio p').first().text());
                        
                        const stats = { followers: 0, following: 0, hearts: '0', videos: 0, friends: 0 };
                        $('.stat-card').each((i, el) => {
                            const number = this.cleanText($(el).find('.stat-number').text()).replace(/,/g, '');
                            const label = this.cleanText($(el).find('.stat-label').text());
                            if (label.includes('Followers')) stats.followers = parseInt(number) || 0;
                            if (label.includes('Following')) stats.following = parseInt(number) || 0;
                            if (label.includes('Hearts')) stats.hearts = this.cleanText($(el).find('.stat-number').text());
                            if (label.includes('Videos')) stats.videos = parseInt(number) || 0;
                            if (label.includes('Friends')) stats.friends = parseInt(number) || 0;
                        });
                        
                        const details = { user_id: '', sec_uid: '', created_at: '' };
                        $('.detail-item').each((i, el) => {
                            const label = this.cleanText($(el).find('.detail-label').text().replace(':', ''));
                            const value = this.cleanText($(el).find('.detail-value').first().text());
                            if (label === 'User ID') details.user_id = value;
                            if (label === 'SecUID') details.sec_uid = value;
                            if (label === 'Account Created') details.created_at = value;
                        });
                        
                        let region = 'Unknown';
                        let language = 'Unknown';
                        $('.user-meta .meta-item').each((i, el) => {
                            const text = this.cleanText($(el).text());
                            if (text.length === 2 && /^[a-z]{2}$/i.test(text)) language = text;
                            if (text.includes('Indonesia')) region = 'Indonesia';
                            else if (text.includes('Malaysia')) region = 'Malaysia';
                            else if (text.includes('Singapore')) region = 'Singapore';
                            else if (text.includes('USA')) region = 'USA';
                            else if (text.includes('UK')) region = 'UK';
                        });
                        
                        resolve({
                            success: true,
                            author: 'BINTANG',
                            creator: 'BINTANG',
                            data: {
                                username: username_raw,
                                fullname: fullname,
                                user_id: details.user_id,
                                sec_uid: details.sec_uid,
                                profile_picture: avatar || '',
                                verified: 'No',
                                private: 'Public',
                                region: region,
                                language: language,
                                followers: stats.followers,
                                following: stats.following,
                                likes: stats.hearts,
                                videos: stats.videos,
                                friends: stats.friends,
                                bio: bio,
                                created_at: details.created_at
                            }
                        });
                    } catch(e) {
                        resolve({ success: false, author: 'BINTANG', creator: 'BINTANG', error: e.message });
                    }
                });
            });
            req.on('error', (error) => { resolve({ success: false, author: 'BINTANG', creator: 'BINTANG', error: error.message }); });
            req.end();
        });
    }
}

export default async function tiktokStalk(username) {
    const tiktok = new TikTokInfo();
    return await tiktok.getProfile(username);
}