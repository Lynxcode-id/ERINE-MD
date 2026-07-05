/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx Decode
 * ─────────────────────────
 * 📝 Plugin : PTV Search (TikTok) + Next Result (Azbry API)
 */

import axios from 'axios';
import { generateWAMessageFromContent, proto } from '@whiskeysockets/baileys';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        return m.reply(`┌˚₊ ๑│ ᴘ ᴛ ᴠ  s ᴇ ᴀ ʀ ᴄ ʜ │๑˚₊ 🔍\n┇ \n│ Masukkan kata kunci pencarian!\n│ *Contoh:* ${usedPrefix + command} oline jkt48\n┇ \n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-MD X LYNX DECODE`);
    }

    let [query, indexStr] = text.split('|');
    let index = indexStr ? parseInt(indexStr) : 0;
    query = query.trim();

    await m.react('⏳');

    try {
        const apiUrl = `https://api.azbry.com/api/search/ttsearch?q=${encodeURIComponent(query)}`;
        
        const res = await axios.get(apiUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
                'Accept': 'application/json, text/plain, */*'
            }
        });
        
        if (!res.data || !res.data.status || !res.data.result || res.data.result.length === 0) {
            throw new Error('Video tidak ditemukan atau API sedang limit/down.');
        }

        let results = res.data.result;
        
        if (index >= results.length) {
            index = 0; 
            await m.reply('🔄 Menampilkan kembali dari hasil pertama...');
        }

        let vidData = results[index];
        // Jaga-jaga kalau strukturnya ganti, ambil link mana aja yang ada
        let vidUrl = vidData.play || vidData.link || vidData.watermark_link;

        // FIX: Bersihin link typo bawaan dari API (Double HTTPS)
        if (vidUrl && vidUrl.includes('https://tikwm.comhttps://')) {
            vidUrl = vidUrl.replace('https://tikwm.comhttps://', 'https://');
        }

        const vidBuffer = await axios.get(vidUrl, { 
            responseType: 'arraybuffer',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
            }
        }).then(r => Buffer.from(r.data));

        let isChannel = command.toLowerCase().endsWith('ch');
        let targetJid = isChannel ? (global.chId || '120363400612665352@newsletter') : m.chat;

        await conn.sendMessage(targetJid, {
            video: vidBuffer,
            mimetype: 'video/mp4',
            ptv: true
        }, isChannel ? {} : { quoted: m });

        if (!isChannel) {
            let nextIndex = index + 1;
            let btnCmd = `${usedPrefix}${command} ${query}|${nextIndex}`;
            
            let caption = `┌˚₊ ๑│ ᴘ ᴛ ᴠ  ʀ ᴇ s ᴜ ʟ ᴛ │๑˚₊ 🎬\n┇ \n│ 📝 *Judul:* ${vidData.title || 'Tanpa Judul'}\n│ 👤 *Author:* ${vidData.author?.nickname || 'Unknown'}\n│ ❤️ *Likes:* ${vidData.stats?.likes || vidData.digg_count || 0}\n│ 📊 *Hasil ke:* ${index + 1} dari ${results.length}\n┇ \n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-MD X LYNX DECODE`;

            const buttons = [
                {
                    name: "quick_reply",
                    buttonParamsJson: JSON.stringify({
                        display_text: "⏭️ Cari Lagi",
                        id: btnCmd
                    })
                }
            ];

            let msg = generateWAMessageFromContent(m.chat, {
                viewOnceMessage: {
                    message: {
                        messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 },
                        interactiveMessage: proto.Message.InteractiveMessage.create({
                            body: proto.Message.InteractiveMessage.Body.create({ text: caption }),
                            footer: proto.Message.InteractiveMessage.Footer.create({ text: "Klik tombol di bawah untuk melihat hasil selanjutnya ⬇️" }),
                            header: proto.Message.InteractiveMessage.Header.create({
                                title: "",
                                hasMediaAttachment: false
                            }),
                            nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                                buttons: buttons
                            })
                        })
                    }
                }
            }, { quoted: m });

            await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
        } else {
            await m.reply(`✅ *Sukses mengunggah PTV Search ke Channel!*`);
        }

        await m.react('✅');

    } catch (e) {
        console.error('[PTV Search Error]', e);
        await m.react('❌');
        m.reply(`┌˚₊ ๑│ s ʏ s ᴛ ᴇ ᴍ  ᴇ ʀ ʀ ᴏ ʀ │๑˚₊ ❌\n┇ Gagal mencari PTV:\n┇ ${e.message}\n└˚₊ ๑ ────────────── ๑˚₊`);
    }
}

handler.help = ['ptvs', 'ptvsearch', 'ptvsch', 'ptvsearchch'];
handler.tags = ['tools'];
handler.command = /^(ptvs|ptvsearch|ptvsch|ptvsearchch)$/i;
handler.limit = true; 

export default handler;