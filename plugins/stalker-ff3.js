import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return m.reply(`Contoh: ${usedPrefix + command} 3238006990`)

    await m.react('⏳')

    try {
        const apiUrl = `https://api.theresav.biz.id/stalk/ff?uid=${text}&apikey=x34J0`
        const res = await fetch(apiUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        })
        
        if (!res.ok) throw new Error(`Status ${res.status}: ${res.statusText}`)
        
        const json = await res.json()
        if (!json.status || !json.result) throw new Error('Data tidak ditemukan atau UID salah.')

        const { 
            nickname, accountId, region, level, exp, 
            liked, brRank, csRank, createAt, lastLogin, 
            clan, signature 
        } = json.result

        let caption = `┌˚₊ ๑│ ᴇ ʀ ɪ ɴ ᴇ  ᴍ ᴅ │๑˚₊ 🚀
┇ 🎮 › ꜰ ʀ ᴇ ᴇ  ꜰ ɪ ʀ ᴇ  s ᴛ ᴀ ʟ ᴋ
└˚₊ ๑ ᴀ ᴄ ᴄ ᴏ ᴜ ɴ ᴛ  ɪ ɴ ꜰ ᴏ ๑˚₊ 🛸

┌˚ · ๑୧ ᴅ ᴇ ᴛ ᴀ ɪ ʟ s
┇ 👤 ⁞ ɴɪᴄᴋɴᴀᴍᴇ : ${nickname}
┇ 🆔 ⁞ ᴜɪᴅ : ${accountId}
┇ 🌍 ⁞ ʀᴇɢɪᴏɴ : ${region}
┇ 📊 ⁞ ʟᴇᴠᴇʟ : ${level}
┇ ✨ ⁞ ᴇxᴘ : ${exp.toLocaleString()}
┇ ❤️ ⁞ ʟɪᴋᴇs : ${liked.toLocaleString()}
┇ 🏆 ⁞ ʙʀ ʀᴀɴᴋ : ${brRank}
┇ 🥇 ⁞ ᴄs ʀᴀɴᴋ : ${csRank}
┇ 🛡️ ⁞ ᴄʟᴀɴ/ɢᴜɪʟᴅ : ${clan || '-'}
┇ 📅 ⁞ ᴅɪʙᴜᴀᴛ : ${createAt}
┇ 🕒 ⁞ ʟᴀsᴛ ʟᴏɢɪɴ : ${lastLogin}
└˚₊ ๑୧

📝 *Signature:*
_${signature || '-'}_`

        await conn.sendMessage(m.chat, { 
            text: caption,
            contextInfo: {
                isForwarded: true,
                forwardingScore: 9999,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: "120363400612665352@newsletter",
                    newsletterName: "🌟 ᴇʀɪɴᴇ-ᴍᴅ ɪɴғᴏʀᴍᴀᴛɪᴏɴ",
                    serverMessageId: -1
                }
            }
        }, { quoted: m })

        await m.react('✅')
    } catch (e) {
        console.error('[FF STALK ERROR]', e)
        await m.react('❌')
        m.reply(`❌ Gagal stalking akun FF.\n> *Detail:* ${e.message}`)
    }
}

handler.help = ['stalkff3 <uid>']
handler.tags = ['stalker']
handler.command = /^(stalkff3|ffstalk3)$/i
handler.limit = true

export default handler