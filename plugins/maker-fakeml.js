import { createRequire } from 'module';
import uploadImage from '../lib/uploadImage.js';
import { promises as fs } from 'fs';

const require = createRequire(import.meta.url);
const generateCard = require('fake-ml');

let handler = async (m, { conn, text, prefix, command }) => {
    // Kalo text kosong, langsung tembak panduan
    if (!text) {
        return m.reply(`⚠️ *Format Salah!*\n\n*Cara Penggunaan:*\n${prefix + command} <nama> | <rank> | <border>\n\n*Contoh:*\n${prefix + command} Lynx | imo | 11\n\n*List Rank:* epic, glory, gm, honor, imo, legend, mawi\n*List Border:* 0 - 16\n\n_(Catatan: Kirim gambar dengan caption atau balas pesan gambar dengan command di atas)_`);
    }

    await m.react('⚡');
    
    try {
        let q = m.quoted ? m.quoted : m;
        let mime = (q.msg || q).mimetype || '';
        let avatarUrl = '';

        if (mime && mime.includes('image')) {
            let imgBuffer = await q.download();
            avatarUrl = await uploadImage(imgBuffer);
        } else {
            let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.sender;
            avatarUrl = await conn.profilePictureUrl(who, 'image').catch(() => 'https://i.ibb.co/1s8T3sY/48f7ce63c7aa.jpg');
        }

        let [username, rank, border] = text.split('|').map(v => v ? v.trim() : '');
        
        username = username ? username.substring(0, 15) : (m.pushName || 'Player').substring(0, 15);
        
        const validRanks = ['epic', 'glory', 'gm', 'honor', 'imo', 'legend', 'mawi'];
        rank = (rank && validRanks.includes(rank.toLowerCase())) ? rank.toLowerCase() : 'imo';
        
        border = parseInt(border);
        border = isNaN(border) || border < 0 || border > 16 ? 0 : border;

        const result = await generateCard({
            avatar: avatarUrl,
            username: username,
            rank: rank,
            border: border
        });

        if (!result || !result.result) {
            throw new Error('Gagal memproses gambar dari package fake-ml.');
        }

        let imageBuffer = await fs.readFile(result.result);
        
        await conn.sendMessage(m.chat, { 
            image: imageBuffer, 
            caption: `✨ *Fake ML Card*\n\n👤 *Name:* ${username}\n🌟 *Rank:* ${rank.toUpperCase()}\n🖼️ *Border:* ${border}` 
        }, { quoted: m });
        
        await fs.unlink(result.result).catch(() => {});
        await m.react('✅');

    } catch (err) {
        console.error("Error Fake-ML:", err);
        await m.react('❌');
        m.reply(`❌ *Terjadi Kesalahan:*\n${err.message}`);
    }
};

handler.help = ['fakeml <nama|rank|border>'];
handler.tags = ['tools'];
handler.command = /^(fakeml|mlcard)$/i;
handler.limit = true;

export default handler;