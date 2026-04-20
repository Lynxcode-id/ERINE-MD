// © INF PROJECT - Erine-MD
// Developed by INF PROJECT

import yts from "yt-search";
import pkg from '@wishkeysocket/baileys';
const { generateWAMessageFromContent, proto } = pkg;
import axios from 'axios';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `🔎 Mau cari apa di YouTube?\nContoh: *${usedPrefix + command}* everything u are hindia`
    
    await m.react('⏳')

    try {
        let results = await yts(text)
        let tes = results.all
        
        if (!tes || tes.length === 0) throw '❌ Hasil tidak ditemukan.'

        let teks = results.all.map(v => {
            switch (v.type) {
                case "video":
                    return `
📹 *ᴛʏᴘᴇ:* ${v.type}
🔗 *ᴜʀʟ:* ${v.url}
📺 *ᴛɪᴛʟᴇ:* ${v.title}
⏱️ *ᴛɪᴍᴇ sᴛᴀᴍᴘ:* ${v.timestamp}
⌚ *ᴀɢᴏ:* ${v.ago}
👀 *ᴠɪᴇᴡs:* ${formatNumber(v.views)}
👤 *ᴀᴜᴛʜᴏʀ:* ${v.author.name}

📥 ᴅᴏᴡɴʟᴏᴀᴅᴇʀ ʙʏ ᴇʀɪɴᴇ ᴘʀᴏᴊᴇᴄᴛ
   `.trim()
                case "canal":
                    return `
🔖 *${v.name}* (${v.url})
⚡ ${v.subCountLabel} sᴜʙsᴄʀɪʙᴇ
📽️ ${v.videoCount} ᴠɪᴅᴇᴏ
`.trim()
            }
        }).filter(v => v).join("\n\n________________________\n\n")

        // Ambil thumbnail dengan cara yang lebih aman buat Node 22
        let ytthumb = Buffer.alloc(0)
        try {
            const thumbRes = await axios.get(tes[0].thumbnail, { responseType: 'arraybuffer' })
            ytthumb = Buffer.from(thumbRes.data)
        } catch (e) {
            console.error('Gagal ambil thumbnail:', e)
        }

        let msg = await generateWAMessageFromContent(m.chat, {
            extendedTextMessage: {
                text: teks,
                jpegThumbnail: ytthumb,
                contextInfo: {
                    mentionedJid: [m.sender],
                    externalAdReply: {
                        title: 'Y O U T U B E  S E A R C H',
                        body: `Hasil pencarian untuk: ${text}`,
                        thumbnail: ytthumb,
                        sourceUrl: tes[0].url
                    }
                }
            }
        }, { quoted: m })

        await conn.relayMessage(m.chat, msg.message, { messageId: m.key.id })
        await m.react('✅')

    } catch (e) {
        console.error(e)
        await m.react('❌')
        m.reply('❌ Terjadi kesalahan saat mencari di YouTube.')
    }
}

handler.help = ["yts <pencarian>"]
handler.tags = ["tools"]
handler.command = /^y(outubesearch|ts(earch)?)$/i
handler.register = true
handler.limit = true

export default handler

function formatNumber(num) {
  if (!num) return '0'
  const suffixes = ['', 'k', 'M', 'B', 'T'];
  const numString = Math.abs(num).toString();
  const numDigits = numString.length;

  if (numDigits <= 3) return numString;

  const suffixIndex = Math.floor((numDigits - 1) / 3);
  let formattedNum = (num / Math.pow(1000, suffixIndex)).toFixed(1);
  
  if (formattedNum.endsWith('.0')) {
    formattedNum = formattedNum.slice(0, -2);
  }

  return formattedNum + suffixes[suffixIndex];
}
