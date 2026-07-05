let handler = async (m, { conn, text, usedPrefix, command }) => {
    let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text ? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : ''
    
    if (!who) throw `Tag orangnya atau balas pesannya cuy!\n\n*Contoh:* ${usedPrefix + command} @user`
    if (who === m.sender) throw `Loh, masa ngerodok diri sendiri bre? Sadar cuy 🗿`
    if (who === conn.user.jid) throw `Ampun bang, jangan rodok botnya 😭🙏`
    
    await m.react('🥵')

    let thumbJomok = 'https://files.catbox.moe/h30nb4.jpg' 

    let kataKata = [
        `🥵 *SREEEETTT!*\n\n@${m.sender.split('@')[0]} baru saja merodok @${who.split('@')[0]} dengan kecepatan cahaya!\nKena mental plus dapet asupan jomok! 💦🗿`,
        `💥 *BAMMM!*\n\nTanpa ampun, @${m.sender.split('@')[0]} mengeluarkan jurus rodok maut ke arah @${who.split('@')[0]}!\nLangsung kayang di tempat anjir 😭🤸‍♂️`,
        `🥶 *AWAS COK!*\n\n@${who.split('@')[0]} cuma bisa pasrah kena rodok brutal dari @${m.sender.split('@')[0]}!\nRasanya ah mantap 🥵🔥`,
        `🏃‍♂️💨 *NGENGGGG!*\n\n@${m.sender.split('@')[0]} nge-dash dari belakang terus ngerodok @${who.split('@')[0]} pake kekuatan meme!\nSakitnya gak seberapa, malunya itu lho 🗿😭`,
        `🌚 *TARGET LOCK!*\n\n@${who.split('@')[0]} terciduk! Langsung dieksekusi dan di-rodok tanpa sisa oleh @${m.sender.split('@')[0]} 😰👉👌`
    ]
    
    let randomKata = kataKata[Math.floor(Math.random() * kataKata.length)]

    await conn.sendMessage(m.chat, {
        image: { url: thumbJomok },
        caption: randomKata,
        mentions: [m.sender, who],
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
}

handler.help = ['rodok @user']
handler.tags = ['fun']
handler.command = /^(rodok)$/i
handler.group = true

export default handler
