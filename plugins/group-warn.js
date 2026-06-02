let handler = async (m, { conn, args, usedPrefix, command }) => {
    let who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : false
    if (!who) return m.reply(`\`ᴇʀɪɴᴇ ᴍᴀɴᴀɢᴇᴍᴇɴᴛ ɢʀᴏᴜᴘ\`\n乂 *Status* : Gagal, target tidak ditemukan.\n\nTag atau balas pesan target!\n*Contoh:* ${usedPrefix + command} @user`)

    let isOwner = global.owner.map(v => v[0] + '@s.whatsapp.net').includes(who)
    if (isOwner) return m.reply(`\`ᴇʀɪɴᴇ ᴍᴀɴᴀɢᴇᴍᴇɴᴛ ɢʀᴏᴜᴘ\`\n乂 *Status* : Ditolak!\n\nTidak bisa memberikan warn kepada Owner.`)
    if (who === conn.user.jid) return m.reply(`\`ᴇʀɪɴᴇ ᴍᴀɴᴀɢᴇᴍᴇɴᴛ ɢʀᴏᴜᴘ\`\n乂 *Status* : Ditolak!\n\nTidak bisa memberikan warn kepada Bot.`)

    if (!(who in global.db.data.users)) global.db.data.users[who] = {}
    let user = global.db.data.users[who]
    if (!user.warn) user.warn = 0

    user.warn += 1
    let maxWarn = 4

    if (user.warn >= maxWarn) {
        user.warn = 0
        let cap = `\`ᴇʀɪɴᴇ ᴍᴀɴᴀɢᴇᴍᴇɴᴛ ɢʀᴏᴜᴘ\`\n乂 *Status* : Target dikeluarkan!\n\nTarget @${who.split('@')[0]} telah mencapai batas peringatan (${maxWarn}/${maxWarn}).`
        await conn.sendMessage(m.chat, { text: cap, mentions: [who] }, { quoted: m })
        await conn.groupParticipantsUpdate(m.chat, [who], 'remove')
    } else {
        let cap = `\`ᴇʀɪɴᴇ ᴍᴀɴᴀɢᴇᴍᴇɴᴛ ɢʀᴏᴜᴘ\`\n⚠️ Warn ${user.warn}/${maxWarn} untuk @${who.split('@')[0]}`
        await conn.sendMessage(m.chat, { text: cap, mentions: [who] }, { quoted: m })
    }
}

handler.help = ['warn @user']
handler.tags = ['group']
handler.command = /^(warn|warning)$/i
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler