import pkg from '@wishkeysocket/baileys';
const { generateWAMessageFromContent, proto } = pkg;

// --- HELPER UI (Native Flow List) ---
async function sendInteractive(conn, jid, title, text, footer, buttonText, sections, quoted) {
    let msg = generateWAMessageFromContent(jid, {
        viewOnceMessage: {
            message: {
                interactiveMessage: proto.Message.InteractiveMessage.fromObject({
                    body: { text },
                    footer: { text: footer },
                    header: { title, hasMediaAttachment: false },
                    nativeFlowMessage: {
                        buttons: [{
                            name: "single_select",
                            buttonParamsJson: JSON.stringify({ title: buttonText, sections })
                        }]
                    }
                })
            }
        }
    }, { quoted });
    return await conn.relayMessage(jid, msg.message, { messageId: msg.key.id });
}

let handler = async (m, { conn, usedPrefix, command, args, isOwner, isAdmin, isROwner }) => {
    let isEnable = /true|enable|(turn)?on|1/i.test(command)
    let chat = global.db.data.chats[m.chat]
    let user = global.db.data.users[m.sender]
    let type = (args[0] || '').toLowerCase()
    let isAll = false
    let isUser = false

    // Emoji Helper
    const getS = (v) => v ? '⚡' : '🌟'

    switch (type) {
        case 'welcome':
            if (m.isGroup && !isAdmin) return global.dfail('admin', m, conn)
            chat.welcome = isEnable
            break
        case 'detect':
            if (m.isGroup && !isAdmin) return global.dfail('admin', m, conn)
            chat.detect = isEnable
            break
        case 'delete':
            if (m.isGroup && !(isAdmin || isOwner)) return global.dfail('admin', m, conn)
            chat.delete = isEnable
            break
        case 'antidelete':
            if (m.isGroup && !(isAdmin || isOwner)) return global.dfail('admin', m, conn)
            chat.delete = !isEnable
            break
        case 'autobio':
            if (m.isGroup && !(isAdmin || isOwner)) return global.dfail('admin', m, conn)
            chat.autoBio = isEnable
            break
        case 'antilink':
            if (m.isGroup && !(isAdmin || isOwner)) return global.dfail('admin', m, conn)
            chat.antiLink = isEnable
            break
        case 'antisticker':
            if (m.isGroup && !(isAdmin || isOwner)) return global.dfail('admin', m, conn)
            chat.antiSticker = isEnable
            break
        case 'autosticker':
            if (m.isGroup && !(isAdmin || isOwner)) return global.dfail('admin', m, conn)
            chat.stiker = isEnable
            break
        case 'antibadword':
            if (m.isGroup && !(isAdmin || isOwner)) return global.dfail('admin', m, conn)
            chat.antiBadword = isEnable
            break
        case 'nsfw':
            if (m.isGroup && !(isAdmin || isOwner)) return global.dfail('admin', m, conn)
            chat.nsfw = isEnable
            break
        case 'rpg':
            if (m.isGroup && !(isAdmin || isOwner)) return global.dfail('admin', m, conn)
            chat.rpgs = isEnable
            break
        case 'autolevelup':
            isUser = true
            user.autolevelup = isEnable
            break
        case 'public':
            isAll = true
            if (!isROwner) return global.dfail('rowner', m, conn)
            global.opts['self'] = !isEnable
            break
        case 'autoread':
            isAll = true
            if (!isROwner) return global.dfail('rowner', m, conn)
            global.opts['autoread'] = isEnable
            break
        case 'pconly':
            isAll = true
            if (!isROwner) return global.dfail('rowner', m, conn)
            global.opts['pconly'] = isEnable
            break
        case 'gconly':
            isAll = true
            if (!isROwner) return global.dfail('rowner', m, conn)
            global.opts['gconly'] = isEnable
            break
        case 'swonly':
            isAll = true
            if (!isROwner) return global.dfail('rowner', m, conn)
            global.opts['swonly'] = isEnable
            break

        default:
            // --- GENERATE DYNAMIC ROWS ---
            let gOptions = [
                { n: 'welcome', s: chat.welcome },
                { n: 'detect', s: chat.detect },
                { n: 'delete', s: chat.delete },
                { n: 'antidelete', s: !chat.delete },
                { n: 'antilink', s: chat.antiLink },
                { n: 'antisticker', s: chat.antiSticker },
                { n: 'autosticker', s: chat.stiker },
                { n: 'antibadword', s: chat.antiBadword },
                { n: 'nsfw', s: chat.nsfw },
                { n: 'rpg', s: chat.rpgs },
                { n: 'autobio', s: chat.autoBio }
            ].map(v => ({
                title: `${getS(v.s)} ${v.n.toUpperCase()}`,
                id: `${usedPrefix}${v.s ? 'disable' : 'enable'} ${v.n}`
            }));

            let oOptions = [
                { n: 'public', s: !global.opts['self'] },
                { n: 'autoread', s: global.opts['autoread'] },
                { n: 'pconly', s: global.opts['pconly'] },
                { n: 'gconly', s: global.opts['gconly'] },
                { n: 'swonly', s: global.opts['swonly'] }
            ].map(v => ({
                title: `${getS(v.s)} ${v.n.toUpperCase()}`,
                id: `${usedPrefix}${v.s ? 'disable' : 'enable'} ${v.n}`
            }));

            let sections = [
                { title: "👥 GROUP SETTINGS", rows: gOptions },
                { title: "👑 OWNER SETTINGS", rows: oOptions }
            ];

            return await sendInteractive(
                conn, m.chat, "⚙️ SETTINGS MANAGER",
                `Halo @${m.sender.split('@')[0]}\n\nBerikut status fitur saat ini:\n⚡ = *Aktif*\n🌟 = *Mati*\n\nKlik tombol di bawah untuk mengubah status fitur secara instan!`,
                "» ᴇʀɪɴᴇ ᴘʀᴏᴊᴇᴄᴛ ᴍᴀɴᴀɢᴇᴍᴇɴᴛ «",
                "PILIH OPSI 🔍",
                sections, m
            );
    }

    m.reply(`
╭───╼「 *SUCCESS UPDATE* 」
│
│  ✨ *Fitur:* ${type}
│  ⚙️ *Status:* ${isEnable ? 'AKTIF' : 'NONAKTIF'}
│  📊 *Scope:* ${isAll ? 'Global Bot' : isUser ? 'User' : 'Chat Group'}
│  💡 *Indikator:* ${isEnable ? '⚡' : '🌟'}
│
╰─────────────────────────╼
`.trim())
}

handler.help = ['enable', 'disable']
handler.tags = ['group', 'owner']
handler.command = /^((en|dis)able|(tru|fals)e|(turn)?o(n|ff)|[01])$/i

export default handler