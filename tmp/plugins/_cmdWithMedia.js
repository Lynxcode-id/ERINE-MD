import { areJidsSameUser } from '@whiskeysockets/baileys'

export async function before(m, { conn }) {
    if (m.isBaileys || !m.msg || !m.msg.fileSha256) return false

    let rawSha = m.msg.fileSha256
    let hash = Buffer.isBuffer(rawSha) || rawSha instanceof Uint8Array 
        ? Buffer.from(rawSha).toString('hex') 
        : typeof rawSha === 'string' 
            ? Buffer.from(rawSha, 'base64').toString('hex') 
            : ''

    const DB = conn.db || global.db
    const stickerDb = DB?.data?.sticker || {}

    let activeHash = ''
    if (hash in stickerDb) activeHash = hash
    else {
        let hashB64 = Buffer.isBuffer(rawSha) || rawSha instanceof Uint8Array ? Buffer.from(rawSha).toString('base64') : rawSha
        let doubleB64 = Buffer.from(hashB64).toString('base64') 
        
        if (hashB64 in stickerDb) activeHash = hashB64
        else if (doubleB64 in stickerDb) activeHash = doubleB64
        else return false
    }

    let { text, mentionedJid } = stickerDb[activeHash]

    m.text = text
    if (mentionedJid && mentionedJid.length > 0) m.mentionedJid = mentionedJid
    m.isCommand = true

    let routes = Object.values(global.plugins).filter(p => p.command && !p.disabled)
    let matchedPlugin = null

    for (let plugin of routes) {
        if (plugin.command instanceof RegExp && plugin.command.test(text)) {
            matchedPlugin = plugin
            break
        } else if (Array.isArray(plugin.command) && plugin.command.some(cmd => text.startsWith(cmd))) {
            matchedPlugin = plugin
            break
        } else if (typeof plugin.command === 'string' && text.startsWith(plugin.command)) {
            matchedPlugin = plugin
            break
        }
    }

    if (matchedPlugin && typeof matchedPlugin.handler === 'function') {
        try {
            let camel = text.trim().split(/ +/)
            let cmd = camel.shift().toLowerCase()
            let args = camel
            let str = camel.join(' ')

            await matchedPlugin.handler.call(this, m, {
                conn,
                text: str,
                args,
                command: cmd,
                usedPrefix: '/'
            })
        } catch (err) {
            console.error('[STICKER CMD EXEC ERROR]', err)
        }

        delete m.text
        m.isCommand = false
    }

    return false 
}