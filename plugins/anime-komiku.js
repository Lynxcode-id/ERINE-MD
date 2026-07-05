import * as cheerio from 'cheerio';
import axios from 'axios';
import fs from 'fs';
import PDFDocument from 'pdfkit';
import { finished } from 'stream/promises';
import sharp from 'sharp';
import { generateWAMessageFromContent, prepareWAMessageMedia, proto } from '@whiskeysockets/baileys';

const TMP_DIR = './tmp';
if (!fs.existsSync(TMP_DIR)) fs.mkdirSync(TMP_DIR);

const KOMIKU_HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
    'Accept-Language': 'id-ID,id;q=0.9,en;q=0.8',
    'Referer': 'https://komiku.org/',
    'Origin': 'https://komiku.org'
};

const SIGNATURE = Buffer.from([0x4B, 0x79, 0x7A, 0x7A, 0x20, 0x67, 0x61, 0x20, 0x73, 0x75, 0x6B, 0x61, 0x20, 0x64, 0x69, 0x20, 0x63, 0x6C, 0x61, 0x69, 0x6D]);

const injectSignature = async (imagePath) => {
    try {
        const imgBuffer = await fs.promises.readFile(imagePath);
        const separator = Buffer.from([0xFF, 0xFE, 0xFD, 0xFC]);
        const newBuffer = Buffer.concat([imgBuffer, separator, SIGNATURE]);
        await fs.promises.writeFile(imagePath, newBuffer);
        return true;
    } catch {
        return false;
    }
};

const injectMetaSignature = async (pdfPath) => {
    try {
        const pdfBuffer = await fs.promises.readFile(pdfPath);
        const marker = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
        const hidden = Buffer.concat([marker, SIGNATURE]);
        const newBuffer = Buffer.concat([pdfBuffer, hidden]);
        await fs.promises.writeFile(pdfPath, newBuffer);
        return true;
    } catch {
        return false;
    }
};

class KomikuAPI {
    constructor() {
        this.baseUrl = "https://komiku.org";
        this.apiUrl = "https://api.komiku.org";
    }

    async search(keyword, page = 1) {
        try {
            const searchUrl = `${this.apiUrl}/?post_type=manga&s=${encodeURIComponent(keyword)}&page=${page}`;
            const response = await axios.get(searchUrl, {
                headers: KOMIKU_HEADERS,
                timeout: 30000
            });
            const $ = cheerio.load(response.data);
            const items = [];
            $('.bge').each((i, el) => {
                const title = $(el).find('.kan h3').text().trim();
                const mangaUrl = $(el).find('.bgei a').first().attr('href');
                const image = $(el).find('.bgei img').attr('src');
                const type = $(el).find('.tpe1_inf b').text().trim();
                const genre = $(el).find('.tpe1_inf').text().trim().replace(type, '').trim();
                const update = $(el).find('.kan p').text().trim();
                const latestChapterUrl = $(el).find('.new1:last a').attr('href');
                const latestChapterText = $(el).find('.new1:last a span:last-child').text().trim();
                if (title) {
                    items.push({
                        title: title,
                        url: mangaUrl ? (mangaUrl.startsWith('http') ? mangaUrl : this.baseUrl + mangaUrl) : null,
                        image: image,
                        type: type,
                        genre: genre,
                        latest_update: update,
                        latest_chapter: {
                            title: latestChapterText,
                            url: latestChapterUrl ? this.baseUrl + latestChapterUrl : null
                        }
                    });
                }
            });
            return { status: true, data: items, total: items.length };
        } catch (error) {
            return { status: false, message: error.message };
        }
    }

    async getDetail(url) {
        try {
            const response = await axios.get(url, {
                headers: KOMIKU_HEADERS,
                timeout: 30000
            });
            const $ = cheerio.load(response.data);
            const thumbnail = $('.ims img').attr('src');
            const judul = $('h1 span').text().trim();
            const judulAlternatif = $('.j2').text().trim();
            const tipe = $('.inftable td').eq(5).text().trim();
            const tema = $('.inftable td').eq(7).text().trim();
            const genre = [];
            $('.genre li a span').each((i, el) => {
                genre.push($(el).text().trim());
            });
            const author = $('.inftable td').eq(11).text().trim();
            const status = $('.inftable td').eq(13).text().trim();
            const rating = $('.inftable td').eq(15).text().trim();
            const sinopsis = $('.desc').text().trim();
            const chapters = [];
            $('#Daftar_Chapter tbody tr').each((i, el) => {
                const chapterLink = $(el).find('td.judulseries a').attr('href');
                const chapterTitle = $(el).find('td.judulseries a span').text().trim();
                const date = $(el).find('td.tanggalseries').text().trim();
                if (chapterLink && chapterTitle) {
                    chapters.push({
                        chapter_number: chapterTitle,
                        url: this.baseUrl + chapterLink,
                        date: date
                    });
                }
            });
            return {
                status: true,
                thumbnail: thumbnail,
                title: judul,
                alternative_title: judulAlternatif,
                type: tipe,
                theme: tema,
                genres: genre,
                author: author,
                status: status,
                rating: rating,
                synopsis: sinopsis,
                total_chapters: chapters.length,
                chapters: chapters.reverse()
            };
        } catch (error) {
            return { status: false, message: error.message };
        }
    }

    async getChapterImages(chapterUrl) {
        try {
            const response = await axios.get(chapterUrl, {
                headers: KOMIKU_HEADERS,
                timeout: 30000
            });
            const $ = cheerio.load(response.data);
            let chapterData = {};
            const scriptMatch = response.data.match(/var chapterData = ({[\s\S]*?});/);
            if (scriptMatch) {
                try {
                    chapterData = eval('(' + scriptMatch[1] + ')');
                } catch (e) {}
            }
            const images = [];
            $('#Baca_Komik img').each((i, el) => {
                const src = $(el).attr('src');
                if (src && !src.includes('lazy.jpg')) {
                    images.push(src);
                }
            });
            const seriesTitle = $('.breadcrumb a').eq(1).text().trim() || chapterData.series;
            const chapterTitle = $('h1').first().text().trim();
            return {
                status: true,
                series: seriesTitle,
                chapter: chapterTitle,
                chapter_number: chapterData.chapter,
                total_pages: images.length,
                image_urls: images,
                has_next_chapter: chapterData.hasNext || false,
                next_chapter_url: chapterData.hasNext ? chapterData.link.replace(/[^/]+$/, '') + (parseInt(chapterData.chapter) + 1) + '/' : null
            };
        } catch (error) {
            return { status: false, message: error.message };
        }
    }
}

const downloadImageFast = async (url, path) => {
    const response = await axios({
        method: 'GET',
        url: url,
        responseType: 'stream',
        headers: KOMIKU_HEADERS,
        timeout: 60000,
        maxRedirects: 5
    });
    
    const writer = fs.createWriteStream(path);
    response.data.pipe(writer);
    
    return new Promise((resolve, reject) => {
        writer.on('finish', async () => {
            await injectSignature(path);
            resolve();
        });
        writer.on('error', reject);
    });
};

const getBufferFast = async (url) => {
    try {
        const response = await axios.get(url, {
            headers: KOMIKU_HEADERS,
            responseType: 'arraybuffer',
            timeout: 30000,
            maxRedirects: 5
        });
        return Buffer.from(response.data);
    } catch {
        return null;
    }
};

const komiku = new KomikuAPI();

let handler = async (m, { args, conn }) => {
    const subcommand = (args[0] || '').toLowerCase();

    if (subcommand === 'search') {
        const keyword = args.slice(1).join(' ');
        if (!keyword) return m.reply('✖️ *Masukkan judul manga/manhwa/manhua*\n\nContoh: .komiku search one piece');

        await m.reply('🔍 *Mencari...*');

        const result = await komiku.search(keyword);
        if (!result.status || !result.data.length) return m.reply('❌ *Tidak ditemukan*\n\nCoba dengan kata kunci lain');

        const rows = result.data.map(v => ({
            header: `📖 ${v.type || 'Manga'}`,
            title: v.title.length > 50 ? v.title.substring(0, 47) + '...' : v.title,
            description: `🎭 ${(v.genre || '-').substring(0, 50)} | 📌 ${v.latest_chapter.title || 'No chapter'}`,
            id: `.komiku detail ${encodeURIComponent(v.url)}`
        }));

        const sections = [];
        for (let i = 0; i < rows.length; i += 10) {
            sections.push({
                title: `📑 Hasil ${i + 1} - ${Math.min(i + 10, rows.length)}`,
                rows: rows.slice(i, i + 10)
            });
        }

        const msg = generateWAMessageFromContent(m.chat, {
            viewOnceMessage: {
                message: {
                    interactiveMessage: proto.Message.InteractiveMessage.fromObject({
                        body: { text: `📚 *HASIL PENCARIAN: ${keyword.toUpperCase()}*\n└  *Total:* ${result.total} ditemukan\n\n📌 *Klik tombol di bawah untuk lihat detail*` },
                        footer: { text: 'Pilih series yang ingin kamu lihat' },
                        header: { hasMediaAttachment: false },
                        nativeFlowMessage: {
                            buttons: [{
                                name: "single_select",
                                buttonParamsJson: JSON.stringify({
                                    title: "🔍 Pilih Series",
                                    sections: sections
                                })
                            }]
                        }
                    })
                }
            }
        }, { quoted: m });

        await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
        return;
    }

    if (subcommand === 'detail') {
        let url = args[1];
        if (!url) return m.reply('✖️ *Link tidak valid*\n\nMasukkan URL yang benar');
        url = decodeURIComponent(url);

        await m.reply('📖 *Mengambil detail...*');

        const detail = await komiku.getDetail(url);
        if (!detail.status) return m.reply('❌ *Gagal mengambil detail*\n\nMungkin URL rusak atau server error');

        let teks = `📛 *${detail.title || '-'}*\n\n`;
        teks += `┌  📌 *Judul Alternatif:* ${detail.alternative_title || '-'}\n`;
        teks += `├  🎭 *Tipe:* ${detail.type || '-'}\n`;
        teks += `├  🏷️ *Genre:* ${detail.genres?.join(', ') || '-'}\n`;
        teks += `├  ✍️ *Author:* ${detail.author || '-'}\n`;
        teks += `├  📊 *Status:* ${detail.status || '-'}\n`;
        teks += `├  ⭐ *Rating:* ${detail.rating || '-'}\n`;
        teks += `└  📚 *Total Chapter:* ${detail.total_chapters || 0}\n\n`;
        teks += `📝 *SINOPSIS:*\n${(detail.synopsis || '-').substring(0, 400)}${(detail.synopsis || '').length > 400 ? '...' : ''}\n\n`;
        teks += `✨ *Klik tombol di bawah untuk pilih chapter*`;

        const thumbBuffer = await getBufferFast(detail.thumbnail);

        if (!detail.chapters?.length) {
            return conn.sendMessage(m.chat, {
                ...(thumbBuffer ? { image: thumbBuffer } : {}),
                caption: teks + '\n\n⚠️ *Tidak ada chapter tersedia*'
            }, { quoted: m });
        }

        const rows = detail.chapters.slice(0, 50).map(ch => ({
            id: `.komiku download ${encodeURIComponent(ch.url)}`,
            title: ch.chapter_number.length > 50 ? ch.chapter_number.substring(0, 47) + '...' : ch.chapter_number,
            description: `📅 ${ch.date || 'No date'}`
        }));

        const sections = [];
        for (let i = 0; i < rows.length; i += 10) {
            sections.push({
                title: `📑 Chapter ${i + 1} - ${Math.min(i + 10, rows.length)}`,
                rows: rows.slice(i, i + 10)
            });
        }

        let mediaHeader = { hasMediaAttachment: false };
        if (thumbBuffer) {
            let media = await prepareWAMessageMedia({ image: thumbBuffer }, { upload: conn.waUploadToServer });
            mediaHeader = { hasMediaAttachment: true, ...media };
        }

        const msg = generateWAMessageFromContent(m.chat, {
            viewOnceMessage: {
                message: {
                    interactiveMessage: proto.Message.InteractiveMessage.fromObject({
                        body: { text: teks },
                        header: mediaHeader,
                        footer: { text: `📖 Total ${detail.chapters.length} Chapter` },
                        nativeFlowMessage: {
                            buttons: [{
                                name: "single_select",
                                buttonParamsJson: JSON.stringify({
                                    title: "📥 Pilih Chapter",
                                    sections: sections
                                })
                            }]
                        }
                    })
                }
            }
        }, { quoted: m });

        await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
        return;
    }

    if (subcommand === 'download') {
        let url = args[1];
        if (!url || !url.startsWith('http')) return m.reply('✖️ *Link tidak valid*\n\nMasukkan URL chapter yang benar');
        url = decodeURIComponent(url);

        const statusMsg = await m.reply('📥 *Mengambil gambar & membuat PDF...*');

        const imgPaths = [];
        let pdfPath = `${TMP_DIR}/${Date.now()}.pdf`;

        try {
            const chapterData = await komiku.getChapterImages(url);
            if (!chapterData.status || !chapterData.image_urls.length) return m.reply('❌ *Gagal ambil gambar*\n\nMungkin chapter tidak tersedia');

            const images = chapterData.image_urls;
            const cleanName = (chapterData.series || 'komiku').replace(/[^\w\s]/gi, '').replace(/\s+/g, '-');

            await conn.sendMessage(m.chat, { text: `🖼️ *Mengunduh ${images.length} halaman...*`, edit: statusMsg.key });

            const limit = 10;
            for (let i = 0; i < images.length; i += limit) {
                const batch = images.slice(i, i + limit);
                const downloadPromises = batch.map((img, idx) => {
                    const path = `${TMP_DIR}/${Date.now()}-${i + idx}.jpg`;
                    return downloadImageFast(img, path).then(() => path);
                });
                const results = await Promise.all(downloadPromises);
                imgPaths.push(...results);
                await conn.sendMessage(m.chat, { text: `✅ *${imgPaths.length}/${images.length} halaman terunduh*`, edit: statusMsg.key });
            }

            if (!imgPaths.length) return m.reply('❌ *Semua gambar gagal diunduh*\n\nCoba lagi nanti');

            await conn.sendMessage(m.chat, { text: '📄 *Membuat PDF...*', edit: statusMsg.key });

            const doc = new PDFDocument({ autoFirstPage: false, margin: 0 });
            const stream = fs.createWriteStream(pdfPath);
            doc.pipe(stream);

            for (const img of imgPaths) {
                try {
                    const meta = await sharp(img).metadata();
                    doc.addPage({ size: [meta.width, meta.height], margin: 0 });
                    doc.image(img, 0, 0, { width: meta.width, height: meta.height });
                } catch (e) {}
                try { fs.unlinkSync(img); } catch (e) {}
            }

            doc.end();
            await finished(stream);
            
            await injectMetaSignature(pdfPath);

            await conn.sendMessage(m.chat, {
                document: fs.readFileSync(pdfPath),
                mimetype: 'application/pdf',
                fileName: `${cleanName}-${chapterData.chapter_number || 'chapter'}.pdf`,
                caption: `📖 *${chapterData.series}*\n📑 *${chapterData.chapter}*\n📄 *Total:* ${chapterData.total_pages} halaman\n\n✨ *Enjoy reading!*`
            }, { quoted: m });

            await conn.sendMessage(m.chat, { text: '✅ *Selesai! PDF berhasil dibuat*', edit: statusMsg.key });

        } catch (e) {
            console.error('DOWNLOAD ERROR:', e.message);
            m.reply(`❌ *Error:* ${e.message}\n\nCoba lagi nanti`);
        } finally {
            try { if (fs.existsSync(pdfPath)) fs.unlinkSync(pdfPath); } catch (e) {}
            for (const img of imgPaths) {
                try { if (fs.existsSync(img)) fs.unlinkSync(img); } catch (e) {}
            }
        }
        return;
    }

    m.reply(
        `📚 *KOMIKU*\n\n` +
        `┌  🔍 *.komiku search <judul>*\n` +
        `│  └  Mencari manga/manhwa/manhua\n` +
        `│\n` +
        `├  📖 *.komiku detail <url>*\n` +
        `│  └  Lihat detail & daftar chapter\n` +
        `│\n` +
        `└  📥 *.komiku download <url_chapter>*\n` +
        `   └  Download chapter ke PDF\n\n` +
        `📌 *Contoh:*\n` +
        `   .komiku search one piece\n` +
        `   .komiku detail https://komiku.org/manga/one-piece/\n` +
        `   .komiku download https://komiku.org/chapter/one-piece-chapter-1/`
    );
};

handler.command = /^(komiku)$/i;
handler.help = ['komiku'];
handler.tags = ['anime'];
handler.limit = true;
handler.register = true;

export default handler;