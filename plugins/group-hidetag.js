// © INF PROJECT - Erine-MD
// Developed by INF PROJECT

import pkg from '@whiskeysocket/baileys'
const { areJidsSameUser } = pkg

let handler = async (m, { conn, participants }) => {
    if (!m.mentionedJid || m.mentionedJid.length === 0) {
        return m.reply('❌ Tag orang yang mau diturunkan jabatannya!\nContoh: .demote @user')
    }

    let users = m.mentionedJid.filter(u => !areJidsSameUser(u, conn.user.id))
    
    if (users.length === 0) return m.reply('❌ Target tidak valid atau lu mau demote diri sendiri?')

    await m.react('⏳')

    try {
        for (let user of users) {
            let participant = participants.find(v => areJidsSameUser(v.id, user))
            if (participant && (participant.admin || participant.isCommunityAdmin)) {
                await conn.groupParticipantsUpdate(m.chat, [user], 'demote')
                await new Promise(resolve => setTimeout(resolve, 1000))
            }
        }
        
        await m.react('✅')
        m.reply('✅ *Success:* Jabatan admin telah dicabut untuk target yang di-tag.')
        
    } catch (e) {
        console.error(e)
        await m.react('❌')
        m.reply('❌ Gagal menurunkan jabatan. Pastikan bot adalah admin tertinggi.')
    }
}

handler.help = ['demote @tag']
handler.tags = ['group']
handler.command = /^(demote)$/i

handler.admin = true
handler.group = true
handler.botAdmin = true

export default handler
