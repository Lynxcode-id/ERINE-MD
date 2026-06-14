import fetch from 'node-fetch'

let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) return m.reply(`Contoh: ${usedPrefix + command} https://vt.tiktok.com/ZSQNMkhym/ 50\n\n*Pilihan target:* 10, 20, 30, 50, 100`)

    const url = args[0]
    const target = args[1] || '50' // Otomatis target 50 kalau lu cuma masukin link

    if (!['10', '20', '30', '50', '100'].includes(target)) {
        return m.reply('⚠️ Target tidak valid. Pilihan target yang tersedia: *10, 20, 30, 50, 100*')
    }

    await m.react('⏳')

    try {
        // Balikin ke URL asli bawaan lu karena ternyata endpoint tools ini wajib pake /docs/ dan .php
        const apiUrl = `https://api-nanzz.my.id/docs/api/tools/tiktok-boost.php?url=${encodeURIComponent(url)}&target=${target}`
        
        const res = await fetch(apiUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        })
        
        if (!res.ok) throw new Error(`Status ${res.status}: ${res.statusText}`)
        
        const json = await res.json()
        if (!json.status || !json.result) throw new Error('Data tidak valid dari server API.')

        const { target: resTarget, sessions, success, failed, message } = json.result

        let caption = `┌˚₊ ๑│ ᴇ ʀ ɪ ɴ ᴇ  ᴍ ᴅ │๑˚₊ 🚀
┇ ⚡ › ᴛ ɪ ᴋ ᴛ ᴏ ᴋ  ʙ ᴏ ᴏ s ᴛ
└˚₊ ๑ s ᴛ ᴀ ᴛ ᴜ s  ɪ ɴ ꜰ ᴏ ๑˚₊ 📈

┌˚ · ๑୧ ᴅ ᴇ ᴛ ᴀ ɪ ʟ s
┇ 🎯 ⁞ ᴛᴀʀɢᴇᴛ : ${resTarget}
┇ 🔄 ⁞ sᴇssɪᴏɴs : ${sessions}
┇ ✅ ⁞ sᴜᴄᴄᴇss : ${success}
┇ ❌ ⁞ ꜰᴀɪʟᴇᴅ : ${failed}
└˚₊ ๑୧

📝 *Pesan:*
_${message}_`

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
        console.error('[TT BOOST ERROR]', e)
        await m.react('❌')
        m.reply(`❌ Gagal memproses boost.\n> *Detail:* ${e.message}`)
    }
}

handler.help = ['ttboost <url> <target>']
handler.tags = ['tools']
handler.command = /^(ttboost|tiktokboost|boosttt)$/i
handler.limit = true

export default handler