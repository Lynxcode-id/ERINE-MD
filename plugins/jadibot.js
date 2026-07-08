import {
    startJadibot,
    stopJadibot,
    isActive,
    requestCloneJadibot
} from '../lib/jadibot.js'

function onlyNumber(text = '') {
    return String(text || '').replace(/[^0-9]/g, '')
}

function parseJadibotArgs(text = '', sender = '') {
    const parts = String(text || '').trim().split(/\s+/).filter(Boolean)
    let target = onlyNumber(sender)
    let mode = 'regular'

    for (const part of parts) {
        const p = part.toLowerCase()
        if (['regular', 'reg', 'free'].includes(p)) mode = 'regular'
        else if (['premium', 'prem', 'vip'].includes(p)) mode = 'premium'
        else if (['clone', 'full', 'clonefull', 'acc'].includes(p)) mode = 'clone'
        else if (/^\d{8,16}$/.test(onlyNumber(part))) target = onlyNumber(part)
    }

    return { target, mode }
}

let handler = async (m, { conn, text, usedPrefix, command, isOwner }) => {
    if (conn.isJadibot) return m.reply('❌ Perintah ini tidak bisa dipakai di dalam sesi jadibot.')

    const user = global.db.data.users[m.sender] || {}
    const senderNum = onlyNumber(m.sender)

    if (command === 'stopjadibot') {
        const { target } = parseJadibotArgs(text, m.sender)
        const jid = `${(isOwner && target) ? target : senderNum}@s.whatsapp.net`

        if (!isActive(jid)) return m.reply('❌ Sesi jadibot tidak ditemukan.')

        await m.react('⏳')
        await stopJadibot(jid, true)
        await m.react('✅')
        return m.reply(`✅ Sesi jadibot ${jid} berhasil dihentikan.`)
    }

    const { target, mode } = parseJadibotArgs(text, m.sender)
    const targetJid = `${target}@s.whatsapp.net`

    if (!isOwner && target !== senderNum) {
        return m.reply('❌ Kamu hanya bisa membuat jadibot untuk nomormu sendiri.')
    }

    if (isActive(targetJid)) {
        return m.reply(`❌ Nomor ${target} sudah memiliki sesi jadibot yang aktif.`)
    }

    if (mode === 'premium' && (!user.premium || (user.premiumTime && user.premiumTime < Date.now()))) {
        return m.reply('❌ Jadibot Premium hanya dapat digunakan oleh user premium yang aktif.')
    }

    if (mode === 'clone') {
        const req = requestCloneJadibot({
            target,
            requester: m.sender,
            requesterName: m.pushName || '',
            chat: m.chat,
            note: `request clone via ${command}`
        })

        const ownerList = (global.owner || []).map(v => Array.isArray(v) ? v[0] : v)
        if (global.nomorown) ownerList.push(global.nomorown)
        const ownerTargets = [...new Set(ownerList.map(v => onlyNumber(v)).filter(Boolean))]

        for (const own of ownerTargets) {
            await conn.sendMessage(`${own}@s.whatsapp.net`, {
                text:
                    `🧩 *REQUEST JADIBOT CLONE*\n\n` +
                    `Target : ${req.target}\n` +
                    `Requester : ${req.requester}\n` +
                    `Nama : ${req.requesterName || '-'}\n` +
                    `Waktu : ${new Date(req.createdAt).toLocaleString('id-ID')}\n\n` +
                    `Ketik:\n` +
                    `\`${usedPrefix}accjadibotclone ${req.target}\``
            }).catch(() => {})
        }

        return m.reply(
            `🧩 Request clone untuk *${target}* berhasil dikirim ke owner.\n` +
            `Mohon tunggu persetujuan dari owner.`
        )
    }

    await m.react('⏳')
    try {
        await startJadibot(conn, m, targetJid, false, mode)
        await m.react('✅')
    } catch (e) {
        await m.react('❌')
        return m.reply(`❌ Gagal memulai jadibot: ${e.message || String(e)}`)
    }
}

handler.help = ['jadibot', 'jadibotprem', 'jadibotclone', 'stopjadibot']
handler.tags = ['main', 'jadibot']
handler.command = /^(jadibot|jadibotprem|jadibotclone|stopjadibot)$/i
handler.owner = false

export default handler