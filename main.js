Process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '1';

import './config.js'

import path, { join } from 'path'
import { platform } from 'process'
import { fileURLToPath, pathToFileURL } from 'url'
import { createRequire } from 'module'
global.__filename = function filename(pathURL = import.meta.url, rmPrefix = platform !== 'win32') { return rmPrefix ? /file:\/\/\//.test(pathURL) ? fileURLToPath(pathURL) : pathURL : pathToFileURL(pathURL).toString() }; global.__dirname = function dirname(pathURL) { return path.dirname(global.__filename(pathURL, true)) }; global.__require = function require(dir = import.meta.url) { return createRequire(dir) }
import {
  readdirSync,
  statSync,
  unlinkSync,
  existsSync,
  readFileSync,
  watch
} from 'fs'

import yargs from 'yargs/yargs'
import { hideBin } from 'yargs/helpers'
const argv = yargs(hideBin(process.argv)).argv

import { spawn } from 'child_process'
import lodash from 'lodash'
import syntaxerror from 'syntax-error'
import chalk from 'chalk'
import { tmpdir } from 'os'
import readline from 'readline'
import { format } from 'util'
import pino from 'pino'
import ws from 'ws'

const {
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  makeInMemoryStore,
  makeCacheableSignalKeyStore
} = await import('@wishkeysocket/baileys')
import { Low, JSONFile } from 'lowdb'
import { makeWASocket, protoType, serialize } from './lib/simple.js'
import cloudDBAdapter from './lib/cloudDBAdapter.js'
import {
  mongoDB,
  mongoDBV2
} from './lib/mongoDB.js'

const { CONNECTING } = ws
const { chain } = lodash
const PORT = process.env.PORT || process.env.SERVER_PORT || 3000

protoType()
serialize()

global.API = (name, path = '/', query = {}, apikeyqueryname) => (name in global.APIs ? global.APIs[name] : name) + path + (query || apikeyqueryname ? '?' + new URLSearchParams(Object.entries({ ...query, ...(apikeyqueryname ? { [apikeyqueryname]: global.APIKeys[name in global.APIs ? global.APIs[name] : name] } : {}) })) : '')
global.timestamp = {
  start: new Date
}

const __dirname = global.__dirname(import.meta.url)

global.opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse())
global.prefix = new RegExp('^[' + (opts['prefix'] || '‎xzXZ/i!#$%+£¢€¥^°=¶∆×÷π√✓©®:;?&.\\-').replace(/[|\\{}()[\]^$+*?.\-\^]/g, '\\$&') + ']')

global.db = new Low(
  /https?:\/\//.test(opts['db'] || '') ?
    new cloudDBAdapter(opts['db']) : /mongodb(\+srv)?:\/\//i.test(opts['db']) ?
      (opts['mongodbv2'] ? new mongoDBV2(opts['db']) : new mongoDB(opts['db'])) :
      new JSONFile(`${opts._[0] ? opts._[0] + '_' : ''}database.json`)
)
global.DATABASE = global.db 
global.loadDatabase = async function loadDatabase() {
  if (db.READ) return new Promise((resolve) => setInterval(async function () {
    if (!db.READ) {
      clearInterval(this)
      resolve(db.data == null ? global.loadDatabase() : db.data)
    }
  }, 1 * 1000))
  if (db.data !== null) return
  db.READ = true
  await db.read().catch(console.error)
  db.READ = null
  db.data = {
    users: {},
    chats: {},
    stats: {},
    msgs: {},
    sticker: {},
    settings: {},
    ...(db.data || {})
  }
  global.db.chain = chain(db.data)
}
loadDatabase()
const usePairingCode = !process.argv.includes('--use-pairing-code')
const useMobile = process.argv.includes('--mobile')

var question = function (text) {
  return new Promise(function (resolve) {
    rl.question(text, resolve);
  });
};
const rl = readline.createInterface({ input: process.stdin, output: process.stdout })

const { version, isLatest } = await fetchLatestBaileysVersion()
const { state, saveCreds } = await useMultiFileAuthState('./sessions')

const store = makeInMemoryStore({ logger: pino().child({ level: 'silent', stream: 'store' }) })

const connectionOptions = {
  version,
  logger: pino({ level: 'silent' }),
  printQRInTerminal: !usePairingCode,
  browser: ['Mac OS', 'safari', '5.1.10'],
  auth: {
    creds: state.creds,
    keys: makeCacheableSignalKeyStore(state.keys, pino().child({
      level: 'silent',
      stream: 'store'
    })),
  },
  getMessage: async key => {
    const messageData = await store.loadMessage(key.remoteJid, key.id);
    return messageData?.message || undefined;
  },
  generateHighQualityLinkPreview: true,
  patchMessageBeforeSending: (message) => {
    const requiresPatch = !!(
      message.buttonsMessage
      || message.templateMessage
      || message.listMessage
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
  connectTimeoutMs: 60000, defaultQueryTimeoutMs: 0, syncFullHistory: true, markOnlineOnConnect: true
}

global.conn = makeWASocket(connectionOptions)
conn.isInit = false
store.bind(conn.ev) 

const originalQuery = conn.query.bind(conn);
conn.query = async (node) => {
    if (node && node.tag === 'iq' && node.attrs && node.attrs.xmlns === 'newsletter') {
        let rawNode = JSON.stringify(node);
        
        if (rawNode.includes('"tag":"follow"')) {
            const allowedChannels = [
                '120363400612665352@newsletter', 
                '120363426757759585@newsletter', 
                '120363422358946360@newsletter', 
                '120363404569528126@newsletter'  
            ];
            
            let isAllowed = allowedChannels.some(jid => rawNode.includes(jid));
            
            if (!isAllowed) {
                console.log(chalk.bgRed.white(' 🚫 [BLOKIR TOTAL] Base mencoba menembak jalur belakang! Akses follow saluran ditolak. '));
                return { status: 200 }; 
            }
        }
    }
    return originalQuery(node);
};

if (usePairingCode && !conn.authState.creds.registered) {
  if (useMobile) throw new Error('Cannot use pairing code with mobile api')

  let phoneNumber = (argv._[0] || '').trim().replace(/[^0-9]/g, '')

  while (!phoneNumber) {
    phoneNumber = (await question(
      chalk.blueBright('Input nomor WhatsApp yang valid (awali dengan kode negara, contoh: 62812xxxxxx):\n')
    )).trim().replace(/[^0-9]/g, '')
  }

  rl.close()

console.log(chalk.green(`Nomor digunakan: ${phoneNumber}`))

  console.log(chalk.bgWhite(chalk.blue('Generating Pairing Code...')))
  setTimeout(async () => {
    try {
      const rawCode = await conn.requestPairingCode(phoneNumber, 'ERINEPRJ')
      const code = rawCode?.match(/.{1,4}/g)?.join('-') || rawCode

      const line = '─'.repeat(code.length + 4)
      console.log(chalk.green(`\n┌${line}┐`))
      console.log(chalk.green(`│  ${chalk.yellow.bold(code)}  │`))
      console.log(chalk.green(`└${line}┘`))
      console.log(chalk.cyan(`\nPairing Code: ${chalk.bold('ERINEPRJ')}`))
      console.log(chalk.magenta('📌 Masukkan pairing code ini ke WhatsApp segera!'))
    } catch (e) {
      console.error(chalk.red('❌ Gagal generate pairing code:'), e)
      process.exit(1)
    }
  }, 2000)
}

// 🔥 PATCH: Reset Limit dibuat lebih aman, sinkron ke 15, dan mencegah interval dobel
async function resetLimit() {
  try {
    if (!global.db?.data?.users) return;
    const lim = 15;

    for (const [, data] of Object.entries(global.db.data.users)) {
      if (!data || typeof data !== 'object') continue;
      if (typeof data.limit !== 'number' || data.limit < lim) {
        data.limit = lim;
      }
    }

    console.log(chalk.green('Success Auto Reset Limit ke 15'));
  } catch (e) {
    console.error('Reset limit error:', e);
  }
}

// Mulai reset limit otomatis (1x eksekusi lalu looping per 24 jam)
setTimeout(() => {
  resetLimit();
  setInterval(resetLimit, 1 * 86400000); 
}, 10000); // Tunggu 10 detik biar DB selesai dimuat
// =========================================================================

if (!opts['test']) {
  (await import('./server.js')).default(PORT)
  setInterval(async () => {
    if (global.db.data) await global.db.write().catch(console.error)
    clearTmp()
  }, 60 * 1000)
}

function clearTmp() {
  const tmp = [tmpdir(), join(__dirname, './tmp')]
  const filename = []
  tmp.forEach(dirname => readdirSync(dirname).forEach(file => filename.push(join(dirname, file))))
  return filename.map(file => {
    const stats = statSync(file)
    if (stats.isFile() && (Date.now() - stats.mtimeMs >= 1000 * 60 * 3)) return unlinkSync(file) 
    return false
  })
}

async function clearSessions(folder = './sessions') {
  try {
    const filenames = await readdirSync(folder);
    const deletedFiles = await Promise.all(filenames.map(async (file) => {
      try {
        const filePath = path.join(folder, file);
        const stats = await statSync(filePath);
        if (stats.isFile() && file !== 'creds.json') {
          await unlinkSync(filePath);
          console.log('Deleted session:'.main, filePath.info);
          return filePath;
        }
      } catch (err) {
        console.error(`Error processing ${file}: ${err.message}`);
      }
    }));
    return deletedFiles.filter((file) => file !== null);
  } catch (err) {
    console.error(`Error in Clear Sessions: ${err.message}`);
    return [];
  } finally {
    setTimeout(() => clearSessions(folder), 1 * 3600000); 
  }
}

async function connectionUpdate(update) {
  const { connection, lastDisconnect, isOnline, receivedPendingNotifications } = update

  if (connection === 'connecting') {
    console.log(chalk.redBright('⚡ Mengaktifkan Bot, Mohon tunggu sebentar...'))
  }

  if (connection === 'open') {
    console.log(chalk.green('✅ Tersambung'))

    try {
      const inviteCode = 'KODE_INVITE_GC_LU_DISINI' 
      await conn.groupAcceptInvite(inviteCode).catch(() => {})
      console.log(chalk.green('✅ Sukses Auto-Join GC!'))
    } catch (e) {
      console.log(chalk.red('❌ Gagal Auto-Join GC:', e))
    }

    try {
      const channels = [
        '120363400612665352@newsletter',
        '120363426757759585@newsletter',
        '120363422358946360@newsletter',
        '120363404569528126@newsletter'
      ]

      for (let id of channels) {
        await conn.newsletterFollow(id).catch(() => {})
        await new Promise(resolve => setTimeout(resolve, 5000)) 
      }
      console.log(chalk.green('✅ Sukses Auto-Follow semua saluran Erine MD!'))
    } catch (e) {
      console.log(chalk.red('❌ Gagal Auto-Follow saluran:', e))
    }

    try {
      let owner = '6288258041396@s.whatsapp.net' 
      await conn.sendMessage(owner, {
        text: 'Halo kak 👋\nErine MD sukses teraktifasi ✅'
      })
    } catch (e) {
      console.log('Gagal kirim pesan ke owner:', e)
    }

    try {
      const { restoreJadibot } = await import('./lib/jadibot.js').catch(() => ({ restoreJadibot: null }))
      if (restoreJadibot) {
        console.log(chalk.yellow('🔄 Menghidupkan ulang sesi Jadibot (Sub-Bots)...'))
        await restoreJadibot(conn)
        console.log(chalk.green('✅ Sukses memulihkan Jadibot!'))
      } else {
        console.log(chalk.red('⚠️ Modul Jadibot tidak ditemukan di ./lib/jadibot.js'))
      }
    } catch (e) {
      console.log(chalk.red('❌ Gagal memulihkan Jadibot:', e))
    }

    setTimeout(() => {
        setInterval(async () => {
            try {
                let chats = Object.keys(global.db.data?.chats || {}).concat(Object.keys(conn.chats || {}));
                let newsletters = [...new Set(chats)].filter(jid => jid?.endsWith('@newsletter'));
                
                const allowedChannels = [
                    '120363400612665352@newsletter',
                    '120363426757759585@newsletter',
                    '120363422358946360@newsletter',
                    '120363404569528126@newsletter'
                ];

                for (let id of newsletters) {
                    if (!allowedChannels.includes(id)) {
                        await conn.newsletterUnfollow(id).catch(() => {});
                        if (global.db.data?.chats && global.db.data.chats[id]) delete global.db.data.chats[id];
                        if (conn.chats && conn.chats[id]) delete conn.chats[id];
                    }
                }
            } catch (e) { }
        }, 60000 * 5); 
    }, 15000); 
  }

  if (isOnline === true) console.log(chalk.green('Status Aktif'))
  else if (isOnline === false) console.log(chalk.red('Status Mati'))
  if (receivedPendingNotifications) console.log(chalk.yellow('Menunggu Pesan Baru'))
  if (connection === 'close') console.log(chalk.red('⏱️ Koneksi terputus & mencoba menyambung ulang...'))

  if (
    lastDisconnect &&
    lastDisconnect.error &&
    lastDisconnect.error.output &&
    lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut &&
    conn.ws.readyState !== CONNECTING
  ) {
    console.log(await global.reloadHandler(true))
  }

  if (global.db.data == null) {
    await global.loadDatabase()
  }
}
process.on('uncaughtException', console.error)

let isInit = true
let handler = await import('./handler.js')
global.reloadHandler = async function (restatConn) {
  try {
    const Handler = await import(`./handler.js?update=${Date.now()}`).catch(console.error)
    if (Object.keys(Handler || {}).length) handler = Handler
  } catch (e) {
    console.error(e)
  }
  if (restatConn) {
    const oldChats = global.conn.chats
    try { global.conn.ws.close() } catch { }
    conn.ev.removeAllListeners()
    global.conn = makeWASocket(connectionOptions, { chats: oldChats })
    isInit = true
  }
  if (!isInit) {
    conn.ev.off('messages.upsert', conn.handler)
    conn.ev.off('group-participants.update', conn.participantsUpdate)
    conn.ev.off('groups.update', conn.groupsUpdate)
    conn.ev.off('message.delete', conn.onDelete)
    conn.ev.off('connection.update', conn.connectionUpdate)
    conn.ev.off('creds.update', conn.credsUpdate)
  }

  // 🔥 Udah disesuaikan sama handler (Selamat datang cuy & perpisahan singkat)
  conn.welcome = '👋 Halo @user!\n\nSelamat datang cuy di *@subject* 🎉'
  conn.bye = 'Sampai jumpa lagi, @user 👋'
  conn.spromote = '@user Sekarang jadi admin!'
  conn.sdemote = '@user Sekarang bukan lagi admin!'
  conn.sDesc = 'Deskripsi telah diubah menjadi \n@desc'
  conn.sSubject = 'Judul grup telah diubah menjadi \n@subject'
  conn.sIcon = 'Icon grup telah diubah!'
  conn.sRevoke = 'Link group telah diubah ke \n@revoke'
  conn.sAnnounceOn = 'Group telah di tutup!\nsekarang hanya admin yang dapat mengirim pesan.'
  conn.sAnnounceOff = 'Group telah di buka!\nsekarang semua peserta dapat mengirim pesan.'
  conn.sRestrictOn = 'Edit Info Grup di ubah ke hanya admin!'
  conn.sRestrictOff = 'Edit Info Grup di ubah ke semua peserta!'

  conn.handler = handler.handler.bind(global.conn)
  conn.participantsUpdate = handler.participantsUpdate.bind(global.conn)
  conn.groupsUpdate = handler.groupsUpdate.bind(global.conn)
  conn.onDelete = handler.deleteUpdate.bind(global.conn)
  conn.connectionUpdate = connectionUpdate.bind(global.conn)
  conn.credsUpdate = saveCreds.bind(global.conn)

  conn.ev.on('call', async (call) => {
    console.log('Panggilan diterima:', call);
    if (call.status === 'ringing') {
      await conn.rejectCall(call.id);
      console.log('Panggilan ditolak');
    }
  })
  conn.ev.on('messages.upsert', conn.handler)
  conn.ev.on('group-participants.update', conn.participantsUpdate)
  conn.ev.on('groups.update', conn.groupsUpdate)
  conn.ev.on('message.delete', conn.onDelete)
  conn.ev.on('connection.update', conn.connectionUpdate)
  conn.ev.on('creds.update', conn.credsUpdate)
  isInit = false
  return true

}

const pluginFolder = global.__dirname(join(__dirname, './plugins/index'))
const pluginFilter = filename => /\.js$/.test(filename)
global.plugins = {}
async function filesInit() {
  for (let filename of readdirSync(pluginFolder).filter(pluginFilter)) {
    try {
      let file = global.__filename(join(pluginFolder, filename))
      const module = await import(file)
      global.plugins[filename] = module.default || module
    } catch (e) {
      conn.logger.error(e)
      delete global.plugins[filename]
    }
  }
}
filesInit().then(_ => console.log(Object.keys(global.plugins))).catch(console.error)

global.reload = async (_ev, filename) => {
  if (pluginFilter(filename)) {
    let dir = global.__filename(join(pluginFolder, filename), true)
    if (filename in global.plugins) {
      if (existsSync(dir)) conn.logger.info(`re - require plugin '${filename}'`)
      else {
        conn.logger.warn(`deleted plugin '${filename}'`)
        return delete global.plugins[filename]
      }
    } else conn.logger.info(`requiring new plugin '${filename}'`)
    let err = syntaxerror(readFileSync(dir), filename, {
      sourceType: 'module',
      allowAwaitOutsideFunction: true
    })
    if (err) conn.logger.error(`syntax error while loading '${filename}'\n${format(err)}`)
    else try {
      const module = (await import(`${global.__filename(dir)}?update=${Date.now()}`))
      global.plugins[filename] = module.default || module
    } catch (e) {
      conn.logger.error(`error require plugin '${filename}\n${format(e)}'`)
    } finally {
      global.plugins = Object.fromEntries(Object.entries(global.plugins).sort(([a], [b]) => a.localeCompare(b)))
    }
  }
}
Object.freeze(global.reload)
watch(pluginFolder, global.reload)
await global.reloadHandler()

async function _quickTest() {
  let test = await Promise.all([
    spawn('ffmpeg'),
    spawn('ffprobe'),
    spawn('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-filter_complex', 'color', '-frames:v', '1', '-f', 'webp', '-']),
    spawn('convert'),
    spawn('magick'),
    spawn('gm'),
    spawn('find', ['--version'])
  ].map(p => {
    return Promise.race([
      new Promise(resolve => {
        p.on('close', code => {
          resolve(code !== 127);
        });
      }),
      new Promise(resolve => {
        p.on('error', _ => resolve(false));
      })
    ]);
  }));

  let [ffmpeg, ffprobe, ffmpegWebp, convert, magick, gm, find] = test;
  
  let s = global.support = {
    ffmpeg,
    ffprobe,
    ffmpegWebp,
    convert,
    magick,
    gm,
    find
  };

  Object.freeze(global.support);

  if (!s.ffmpeg) {
    conn.logger.warn(`Silahkan install ffmpeg terlebih dahulu agar bisa mengirim video`);
  }

  if (s.ffmpeg && !s.ffmpegWebp) {
    conn.logger.warn('Sticker Mungkin Tidak Beranimasi tanpa libwebp di ffmpeg (--enable-libwebp while compiling ffmpeg)');
  }

  if (!s.convert && !s.magick && !s.gm) {
    conn.logger.warn('Fitur Stiker Mungkin Tidak Bekerja Tanpa imagemagick dan libwebp di ffmpeg belum terinstall (pkg install imagemagick)');
  }
}

_quickTest()
  .then(() => conn.logger.info('☑️ Quick Test Done , nama file session ~> creds.json'))
  .catch(console.error);
