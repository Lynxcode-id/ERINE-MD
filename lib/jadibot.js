// © INF PROJECT - Erine-MD
// Developed by INF PROJECT

import path from 'path'
import fs from 'fs'
import pino from 'pino'
import { makeWASocket } from '../lib/simple.js'
import * as baileys from '@whiskeysockets/baileys'
import * as handlerModule from '../handler.js'
import NodeCache from 'node-cache'

const {
    fetchLatestBaileysVersion,
    makeCacheableSignalKeyStore,
    useMultiFileAuthState,
    DisconnectReason,
    jidNormalizedUser,
    makeInMemoryStore
} = baileys

const delay = ms => new Promise(res => setTimeout(res, ms))

const ROOT = path.join(process.cwd(), 'session', 'jadibot')
const sessions = global.jadibotSessions ??= new Map()
const reconnect = new Map()

if (!fs.existsSync(ROOT)) fs.mkdirSync(ROOT, { recursive: true })

function getJid(jid) {
    return jid ? jid.split('@')[0] : ''
}

function getPath(jid) {
    return path.join(ROOT, getJid(jid))
}

export function isActive(jid) {
    return sessions.has(getJid(jid))
}

export async function startJadibot(conn, m, jid, isReconnect = false) {
    const id = getJid(jid)

    if (sessions.has(id) && !isReconnect) throw '❌ Jadibot lu udah aktif, Bang!'

    const sessionPath = getPath(jid)
    if (!fs.existsSync(sessionPath)) fs.mkdirSync(sessionPath, { recursive: true })

    const { state, saveCreds } = await useMultiFileAuthState(sessionPath)
    const { version } = await fetchLatestBaileysVersion()

    const store = makeInMemoryStore({ logger: pino().child({ level: 'silent', stream: 'store' }) })
    
    // --- PENYESUAIAN CACHE BAILEYS V7 KHUSUS JADIBOT ---
    const msgRetryCounterCache = new NodeCache()
    const groupCache = new NodeCache({stdTTL: 5 * 60, useClones: false})

    const child = makeWASocket({
        version,
        logger: pino({ level: 'silent' }),
        printQRInTerminal: false,
        browser: ['Ubuntu', 'Chrome', '20.0.04'],
        markOnlineOnConnect: true,
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' }))
        },
        msgRetryCounterCache,
        cachedGroupMetadata: async (groupId) => groupCache.get(groupId),
        patchMessageBeforeSending: (message) => {
            const requiresPatch = !!(
                message.buttonsMessage ||
                message.templateMessage ||
                message.listMessage ||
                message.interactiveMessage
            );
            if (requiresPatch) {
                message = {
                    viewOnceMessage: {
                        message: {
                            messageContextInfo: {
                                deviceListMetadataVersion: 2,
                                deviceListMetadata: {},
                            },
                            ...message,
                        },
                    },
                };
            }
            return message;
        },
        getMessage: async (key) => {
            if (store) {
                const normalizedJid = jidNormalizedUser(key.remoteJid)
                const msg = await store.loadMessage(normalizedJid, key.id)
                return msg?.message || undefined
            }
            return { conversation: 'Erine-MD Jadibot Message' }
        }
    })

    store.bind(child.ev)

    // Update Cache otomatis biar ga error "undefined metadata"
    child.ev.on('groups.update', async ([event]) => {
        if(event && event.id) {
            const metadata = await child.groupMetadata(event.id).catch(() => null)
            if(metadata) groupCache.set(event.id, metadata)
        }
    })
    child.ev.on('group-participants.update', async (event) => {
        if(event && event.id) {
            const metadata = await child.groupMetadata(event.id).catch(() => null)
            if(metadata) groupCache.set(event.id, metadata)
        }
    })

    child.isJadibot = true
    child.public = true
    child.self = false

    const dbPath = path.join(sessionPath, 'database_jadibot.json')
    if (!fs.existsSync(dbPath)) {
        const dbAwal = { users: {}, chats: {}, settings: {}, msgs: {}, sticker: {}, game: {} }
        fs.writeFileSync(dbPath, JSON.stringify(dbAwal, null, 2))
    }
    
    // Database Isolation - Punya Dunia Sendiri
    child.db = {
        data: JSON.parse(fs.readFileSync(dbPath)),
        write: async () => {
            try {
                await fs.promises.writeFile(dbPath, JSON.stringify(child.db.data, null, 2))
            } catch (e) {
                console.error('Gagal save database jadibot:', e)
            }
        }
    }

    const dbSaveInterval = setInterval(async () => {
        if (sessions.has(id) && child.db) {
            await child.db.write()
            try { await child.sendPresenceUpdate('available') } catch (e) {}
        } else {
            clearInterval(dbSaveInterval)
        }
    }, 60 * 1000)

    if (!state.creds.registered && !isReconnect) {
        if (child.requestPairingCode) {
            await delay(3000)
            const code = await child.requestPairingCode(id)
            const pairing = code?.match(/.{1,4}/g)?.join('-') || code

            await conn.sendMessage(m.chat, {
                text: `🔗 *PAIRING CODE JADIBOT*\n\n` +
                      `📱 Masuk ke Perangkat Tertaut → Tautkan Perangkat → Tautkan dengan nomor telepon saja.\n\n` +
                      `*CODE:* \`${pairing}\`\n\n` +
                      `⚠️ _Berlaku 2 menit.. Bila kamu gagal pairing maka tidak akan bisa jadibot lagi!_`
            }, { quoted: m })
        }
    }

    child.ev.on('creds.update', saveCreds)

    child.ev.on('connection.update', async ({ connection, lastDisconnect }) => {
        if (connection === 'open') {
            sessions.set(id, child)
            const botNumber = jidNormalizedUser(child.user.id)
            
            try { await child.sendPresenceUpdate('available') } catch (e) {}
            
            if (!isReconnect && m?.chat && m.chat !== botNumber) {
                await conn.sendMessage(m.chat, {
                    text: `✅ *Jadibot Berhasil Aktif!*\n\nUser: @${id}\nID: ${botNumber}`,
                    mentions: [jid]
                }, { quoted: m })
            }
        }

        if (connection === 'close') {
            const reason = lastDisconnect?.error?.output?.statusCode
            sessions.delete(id)
            clearInterval(dbSaveInterval)

            if (reason === DisconnectReason.loggedOut) {
                fs.rmSync(sessionPath, { recursive: true, force: true })
                reconnect.delete(id)
                return
            }

            const attempt = reconnect.get(id) || 0
            if (attempt < 3) {
                reconnect.set(id, attempt + 1)
                setTimeout(() => startJadibot(conn, m, jid, true), 10000)
            } else {
                reconnect.delete(id)
            }
        }
    })

    child.ev.on('group-participants.update', async (room) => {
        try {
            if (handlerModule.participantsUpdate) {
                await handlerModule.participantsUpdate.call(child, room)
            }
        } catch (e) {}
    })

    child.ev.on('groups.update', async (room) => {
        try {
            if (handlerModule.groupsUpdate) {
                await handlerModule.groupsUpdate.call(child, room)
            }
        } catch (e) {}
    })

    child.ev.on('messages.upsert', async (chatUpdate) => {
        if (chatUpdate.type !== 'notify') return
        
        await child.pushMessage(chatUpdate.messages).catch(() => {})

        for (let msg of chatUpdate.messages) {
            if (!msg.message) continue
            try {
                chatUpdate.isJadibot = true;
                
                const prevDb = global.db.data;
                global.db.data = child.db.data;
                
                await handlerModule.handler.call(child, chatUpdate);
                
                global.db.data = prevDb;
            } catch (e) {
                console.error('🔥 Jadibot Handler Error:', e)
            }
        }
    })
}

export async function stopJadibot(jid, deleteSession = false) {
    const id = getJid(jid)
    const child = sessions.get(id)

    if (child) {
        child.ws.close()
        sessions.delete(id)
        if (deleteSession) {
            const sessionPath = getPath(jid)
            if (fs.existsSync(sessionPath)) {
                fs.rmSync(sessionPath, { recursive: true, force: true })
            }
        }
    }
}

export async function restoreJadibot(conn) {
    if (!fs.existsSync(ROOT)) return
    const dirs = fs.readdirSync(ROOT)

    for (let dir of dirs) {
        const jid = dir + '@s.whatsapp.net'
        const fakeMsg = { sender: jid, chat: jid }
        startJadibot(conn, fakeMsg, jid, true)
        await delay(5000)
    }
}
