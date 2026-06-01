/** * ───「 INFO OWNER & COMMUNITY 」───✧
 * 👤 Author  : LYNX DECODE { FEMULA + CARBEAT }
 * 🚀 Channel : https://whatsapp.com/channel/0029Vb1CcDWDp2Q5YT4FZn1k
 * 📝 Note  : Ambil boleh aja cr jangan di hapus hargai creator!!
 * ────────────────────────✧
 */

const normalizeJid = (conn, jid = '') => {
    jid = String(jid || '').trim()
    if (!jid) return ''

    jid = typeof conn?.decodeJid === 'function' ? conn.decodeJid(jid) : jid
    if (jid.endsWith('@lid') && typeof conn?.getJid === 'function') {
        const resolved = conn.getJid(jid)
        if (resolved && !resolved.endsWith('@lid')) jid = resolved
    }

    if (/^\d+$/.test(jid)) jid = `${jid}@s.whatsapp.net`
    return jid
}

const sameUser = (conn, a, b) => {
    const jidA = normalizeJid(conn, a)
    const jidB = normalizeJid(conn, b)
    if (!jidA || !jidB) return false
    if (typeof globalThis.areJidsSameUser === 'function') return globalThis.areJidsSameUser(jidA, jidB)
    return jidA.replace(/[^0-9]/g, '') === jidB.replace(/[^0-9]/g, '')
}

let handler = async (m, { conn, text, command, participants, isOwner, usedPrefix }) => {
    let prtps = Array.isArray(participants) ? participants : []
    if (!prtps.length) {
        const meta = await conn.groupMetadata(m.chat).catch(() => ({})) || {}
        prtps = meta.participants || []
    }

    const senderJid = normalizeJid(conn, m.sender)
    const senderNumber = senderJid.split('@')[0].split(':')[0].replace(/[^0-9]/g, '')
    const ownerNumbers = (global.owner || [])
        .map(v => Array.isArray(v) ? v[0] : v)
        .map(v => String(v).replace(/[^0-9]/g, ''))
        .filter(Boolean)

    const isUserAdmin = prtps.some(p => {
        const jid = normalizeJid(conn, p?.id || p?.jid || p?.lid || p?.participant || p?.phoneNumber)
        const role = String(p?.admin || '').toLowerCase()
        return sameUser(conn, jid, senderJid) && (role === 'admin' || role === 'superadmin')
    })

    const isBotOwner = isOwner || ownerNumbers.includes(senderNumber)
    if (!isUserAdmin && !isBotOwner) return m.reply('❌ HANYA ADMIN YANG DAPAT MENGAKSES FITUR INI')

    const target = m.quoted
        ? normalizeJid(conn, m.quoted.sender)
        : m.mentionedJid?.[0]
            ? normalizeJid(conn, m.mentionedJid[0])
            : text
                ? normalizeJid(conn, `${text.replace(/[^0-9]/g, '')}@s.whatsapp.net`)
                : null

    const cmdWithTarget = ['add', 'kick', 'promote', 'demote']
    if (cmdWithTarget.includes(command) && !target) return m.reply('❌ Reply/tag siapa yang ingin di proses.')

    const findGroupParticipant = jid => prtps.find(p => sameUser(conn, normalizeJid(conn, p?.id || p?.jid || p?.lid || p?.participant || p?.phoneNumber), jid)) || null
    const inGc = !!findGroupParticipant(target)
    const botJid = normalizeJid(conn, conn.user?.jid || conn.user?.id || '')

    try {
        switch (command) {
            case 'add': {
                if (inGc) return m.reply('❌ User sudah ada didalam grup!')
                const response = await conn.groupParticipantsUpdate(m.chat, [target], 'add')
                const jpegThumbnail = await conn.profilePictureUrl(m.chat, 'image').catch(_ => null)

                for (const participant of response || []) {
                    const jid = normalizeJid(conn, participant.content?.attrs?.phone_number || participant.content?.attrs?.jid || target)
                    const status = participant.status

                    if (status === '408') {
                        m.reply(`❌ Tidak dapat menambahkan @${jid.split('@')[0]}!\nMungkin dia baru keluar dari grup ini atau dikick.`)
                    } else if (status === '403') {
                        const inviteCode = participant.content?.content?.[0]?.attrs?.code
                        const inviteExp = participant.content?.content?.[0]?.attrs?.expiration
                        if (inviteCode) {
                            await m.reply(`⏳ Mengundang @${jid.split('@')[0]} menggunakan link invite...`)
                            await conn.sendGroupV4Invite(m.chat, jid, inviteCode, inviteExp, 'Grup', 'Undangan untuk bergabung ke grup WhatsApp', jpegThumbnail)
                        }
                    } else {
                        m.reply(`✅ Berhasil menambahkan @${jid.split('@')[0]}`)
                    }
                }
                break
            }

            case 'kick':
                if (!inGc) return m.reply('❌ User tidak ada dalam grup.')
                if (sameUser(conn, target, botJid)) return m.reply('❌ Gak bisa kick bot sendiri anjir!')
                await conn.groupParticipantsUpdate(m.chat, [findGroupParticipant(target)?.id || target], 'remove')
                m.reply(`✅ Berhasil kick: @${target.split('@')[0]}`, null, { mentions: [target] })
                break

            case 'promote':
                if (!inGc) return m.reply('❌ User tidak berada dalam grup!')
                await conn.groupParticipantsUpdate(m.chat, [findGroupParticipant(target)?.id || target], 'promote')
                m.reply(`✅ Promote: @${target.split('@')[0]}`, null, { mentions: [target] })
                break

            case 'demote':
                if (!inGc) return m.reply('❌ User tidak berada dalam grup!')
                await conn.groupParticipantsUpdate(m.chat, [findGroupParticipant(target)?.id || target], 'demote')
                m.reply(`✅ Demote: @${target.split('@')[0]}`, null, { mentions: [target] })
                break

            case 'closegc':
            case 'mute':
                await conn.groupSettingUpdate(m.chat, 'announcement')
                m.reply('✅ Grup berhasil ditutup (hanya admin yang bisa chat).')
                break

            case 'opengc':
            case 'unmute':
                await conn.groupSettingUpdate(m.chat, 'not_announcement')
                m.reply('✅ Grup berhasil dibuka (semua member bisa chat).')
                break

            default:
                return m.reply('Perintah tidak dikenal.')
        }
    } catch (error) {
        console.error(error)
        m.reply('❌ Gagal mengeksekusi perintah!\n\n_Pastikan bot sudah diangkat menjadi Admin Grup._')
    }
}

handler.help = ['warn @user']
handler.tags = ['group']
handler.command = /^(warn|warning)$/i
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler
