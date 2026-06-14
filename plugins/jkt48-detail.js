/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx Decode
 * ─────────────────────────
 * 📝 Plugin: JKT48 Member Detail
 */

import memberDetail from '../scrape/jkt48live.js'
import axios from 'axios'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return m.reply(`❌ Masukkan nama panggilan member!\n\n*Contoh:* ${usedPrefix + command} freya`)

    await m.react('⏳')

    try {
        const res = await memberDetail(text)
        
        if (!res.status) throw new Error(res.error)
        
        const mData = res.result
        const image = mData.img_alt || mData.img
        
        let socials = ''
        if (mData.socials && Array.isArray(mData.socials)) {
            socials = mData.socials.map(s => `• ${s.title || s.name || s.url}: ${s.url}`).join('\n│  ')
        } else if (mData.socials && typeof mData.socials === 'object') {
            socials = Object.entries(mData.socials).map(([k, v]) => `• ${k.toUpperCase()}: ${v}`).join('\n│  ')
        }

        let caption = `
╭───「 𝐉𝐊𝐓𝟒𝟖 𝐌𝐞𝐦𝐛𝐞𝐫 𝐃𝐞𝐭𝐚𝐢𝐥 」───🎀
│ 
│  👤 𝐍𝐚𝐦𝐚      : ${mData.fullname || mData.name || '-'}
│  🎀 𝐏𝐚𝐧𝐠𝐠𝐢𝐥𝐚𝐧 : ${mData.nickname || text}
│  🏷️ 𝐆𝐞𝐧𝐞𝐫𝐚𝐬𝐢  : ${mData.generation || '-'}
│  🩸 𝐆𝐨𝐥. 𝐃𝐚𝐫𝐚𝐡: ${mData.bloodType || '-'}
│  📏 𝐓𝐢𝐧𝐠𝐠𝐢    : ${mData.height || '-'}
│  🎂 𝐔𝐥𝐭𝐚𝐡     : ${mData.birthdate || '-'}
│  🏫 𝐒𝐭𝐚𝐭𝐮𝐬    : ${mData.is_graduate ? 'Lulus' : 'Aktif'}
│
│  🗣️ 𝐉𝐢𝐤𝐨𝐬𝐡𝐨𝐮𝐤𝐚𝐢:
│  _${mData.jikosokai || '-'}_
│
│  📱 𝐒𝐨𝐜𝐢𝐚𝐥 𝐌𝐞𝐝𝐢𝐚:
│  ${socials || '-'}
│
╰──────────────────────────✨
`.trim()

        let imageBuf = null;
        if (image) {
            try {
                const imgRes = await axios.get(image, {
                    responseType: 'arraybuffer',
                    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
                })
                imageBuf = Buffer.from(imgRes.data)
            } catch (err) {
                console.log('[WARNING] Gagal download gambar kabesha JKT48')
            }
        }

        if (imageBuf) {
            await conn.sendMessage(m.chat, {
                image: imageBuf,
                caption: caption
            }, { quoted: m })
        } else {
            await conn.sendMessage(m.chat, { text: caption }, { quoted: m })
        }

        await m.react('✅')

    } catch (e) {
        console.error('[JKT48 DETAIL ERROR]', e)
        await m.react('❌')
        m.reply(`⚠️ *System Error:*\n_${e.message || 'Member tidak ditemukan.'}_`)
    }
}

handler.help = ['detailjkt48 <nama>']
handler.tags = ['jkt48']
handler.command = /^(memberjkt48|detailjkt48)$/i
handler.limit = true

export default handler