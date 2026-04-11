// © INF PROJECT - Erine-MD
// Developed by INF PROJECT

import pkg from '@wishkeysocket/baileys'
const { areJidsSameUser } = pkg

let handler = async (m, { conn, participants }) => {
    if (!m.mentionedJid || m.mentionedJid.length === 0) {
        return m.reply('❌ Tag orang yang mau diturunkan jabatannya!\nContoh: .demote @user')
    }

    let users = m.mentionedJid.filter(u => !areJidsSameUser(u, conn.user.id))
    
    for (let user of users) {
        try {
            let participant = participants.find(v => areJidsSameUser(v.id, user))
            if (participant && (participant.admin || participant.isCommunityAdmin)) {
                await conn.groupParticipantsUpdate(m.chat, [user], 'demote')
                await delay(1000)
            }
        } catch (e) {
            console.error(`Gagal demote ${user}:`, e)
        }
    }

    m.reply('✅ *Success:* Jabatan admin telah dicabut untuk user yang di-tag.')
}

handler.help = ['demote @tag']
handler.tags = ['group']
handler.command = /^(demote)$/i

handler.admin = true
handler.group = true
handler.botAdmin = true

export default handler

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
