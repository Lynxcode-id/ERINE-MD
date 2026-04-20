// © INF PROJECT - Erine-MD
// Developed by INF PROJECT

import path from 'path'
import fs from 'fs'
import pino from 'pino'
import { makeWASocket } from '../lib/simple.js'
import pkg from '@wishkeysocket/baileys'
const {
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
  useMultiFileAuthState,
  DisconnectReason
} = pkg

const delay = ms => new Promise(res => setTimeout(res, ms))

const ROOT = path.join(process.cwd(), 'session', 'jadibot')
const sessions = global.jadibotSessions ??= new Map()
const reconnect = new Map()

if (!fs.existsSync(ROOT)) fs.mkdirSync(ROOT, { recursive: true })

function getPath(jid) {
  return path.join(ROOT, jid.replace(/@.+/, ''))
}

export function isActive(jid) {
  return sessions.has(jid.replace(/@.+/, ''))
}

export async function startJadibot(conn, m, jid, isReconnect = false) {
  const id = jid.replace(/@.+/, '')

  if (sessions.has(id) && !isReconnect) throw '❌ Jadibot lu udah aktif, Bang!'

  const sessionPath = getPath(jid)
  if (!fs.existsSync(sessionPath)) fs.mkdirSync(sessionPath, { recursive: true })

  const { state, saveCreds } = await useMultiFileAuthState(sessionPath)
  const { version } = await fetchLatestBaileysVersion()

  const child = makeWASocket({
    version,
    logger: pino({ level: 'silent' }),
    printQRInTerminal: false,
    browser: [ 'Erine-MD', 'Safari', '2.0.0' ],
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' }))
    }
  })

  if (!state.creds.registered && !isReconnect) {
    if (child.requestPairingCode) {
        await delay(3000)
        const code = await child.requestPairingCode(id)
        const pairing = code?.match(/.{1,4}/g)?.join('-') || code

        await conn.sendMessage(m.chat, {
          text: `🔗 *PAIRING CODE JADIBOT*\n\n` +
                `📱 Masuk ke Perangkat Tertaut → Tautkan Perangkat → Tautkan dengan nomor telepon saja.\n\n` +
                `*CODE:* \`${pairing}\`\n\n` +
                `⚠️ _Berlaku 2 menit. Jangan kasih tau siapa-siapa!_`
        }, { quoted: m })
    }
  }

  child.ev.on('creds.update', saveCreds)
  child.ev.on('connection.update', async ({ connection, lastDisconnect }) => {
    if (connection === 'open') {
        sessions.set(id, child)
        const botNumber = child.user.id.split(':')[0] + '@s.whatsapp.net'
        
        await conn.sendMessage(m.chat, {
            text: `✅ *Jadibot Berhasil Aktif!*\n\nUser: @${id}\nID: ${botNumber}`,
            mentions: [jid]
        }, { quoted: m })

        const ownerNumber = '6288258041396@s.whatsapp.net'
        await child.sendMessage(ownerNumber, {
            text: `👋 *Jadibot Connected*\n\nUser: @${id}\nStatus: Online 🟢`
        }, { mentions: [jid] })
    }

    if (connection === 'close') {
      const reason = lastDisconnect?.error?.output?.statusCode
      sessions.delete(id)

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

  child.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return
    for (let msg of messages) {
      if (!msg.message) continue
      try {
        const { handler } = await import(`../handler.js?update=${Date.now()}`)
        await handler.call(child, msg, { sessions })
      } catch (e) {
        console.error('Jadibot Handler Error:', e)
      }
    }
  })
}

export async function stopJadibot(jid, deleteSession = false) {
  const id = jid.replace(/@.+/, '')
  const child = sessions.get(id)

  if (child) {
    child.ws.close()
    sessions.delete(id)
    if (deleteSession) {
      const sessionPath = getPath(jid)
      fs.rmSync(sessionPath, { recursive: true, force: true })
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