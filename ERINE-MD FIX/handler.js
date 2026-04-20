// © INF PROJECT - Erine-MD
// Developed by INF PROJECT

import { smsg } from './lib/simple.js'
import { format } from 'util'
import { fileURLToPath } from 'url'
import path, { join } from 'path'
import { unwatchFile, watchFile } from 'fs'
import chalk from 'chalk'
import fetch from 'node-fetch'

/**
 * @type {import('@wishkeysocket/baileys')}
 */
import pkg from '@wishkeysocket/baileys'
const { proto } = pkg

const isNumber = x => typeof x === 'number' && !isNaN(x)
const delay = ms => isNumber(ms) && new Promise(resolve => setTimeout(resolve, ms))

// JIKA KALIAN MEMAKAI BAILEYS NPM : SOCKETON@LATEST MAKA INI AKAN BERGUNA JIKA TIDAK GANTI AJALAH
const blacklistSpam = [
    '120363424238913151@newsletter', '120363406449745243@newsletter',
    '120363426933701922@newsletter', '120363425233122084@newsletter',
    '120363406955708569@newsletter', '120363409790959480@newsletter',
    '120363408438138690@newsletter', '120363408579941146@newsletter',
    '120363424179592061@newsletter', '120363405723516540@newsletter',
    '120363424689396716@newsletter', '120363427421121311@newsletter',
    '120363406618334425@newsletter', '120363424993523048@newsletter',
    '120363427188743666@newsletter', '120363424323411358@newsletter',
    '120363424488714486@newsletter', '120363427240349580@newsletter',
    '120363408205596512@newsletter', '120363409408347008@newsletter',
    '120363406394645890@newsletter', '120363408313573016@newsletter',
    '120363407166896862@newsletter', '120363407162947288@newsletter',
    '120363408046248822@newsletter', '120363424469663121@newsletter',
    '120363405524481175@newsletter', '120363408419834239@newsletter',
    '120363407748758233@newsletter', '120363408958359303@newsletter',
    '120363407895052200@newsletter', '120363409669109724@newsletter',
    '120363407559449905@newsletter', '120363425768576686@newsletter'
];

export async function handler(chatUpdate) {
    this.msgqueque = this.msgqueque || []
    
    let m;
    if (chatUpdate && chatUpdate.isJadibot) {
        m = chatUpdate;
    } else {
        if (!chatUpdate || !chatUpdate.messages) return 
        this.pushMessage(chatUpdate.messages).catch(console.error)
        m = chatUpdate.messages[chatUpdate.messages.length - 1]
    }
    
    if (!m) return

    const conn = this
    const DB = conn.db || global.db
    
    if (!conn.hunterActive) {
        conn.hunterActive = true;
        console.log(chalk.red.bold('🔥 [SYSTEM] Active Hunter Deployed! Menjaga dari saluran parasit...'));

        const originalQuery = conn.query.bind(conn);
        conn.query = async (node) => {
            if (node && node.tag === 'iq' && node.attrs && node.attrs.xmlns === 'newsletter') {
                let rawNode = JSON.stringify(node);
                if (rawNode.includes('"tag":"follow"') && blacklistSpam.some(jid => rawNode.includes(jid))) {
                    return { status: 200 };
                }
            }
            return originalQuery(node);
        };

        setInterval(() => {
            let activeChats = Object.keys(conn.chats || {});
            const sweepDB = conn.db || global.db; 
            activeChats.forEach(jid => {
                if (blacklistSpam.includes(jid)) {
                    conn.newsletterUnfollow(jid).catch(() => {});
                    delete conn.chats[jid];
                    if (sweepDB.data?.chats?.[jid]) delete sweepDB.data.chats[jid];
                    console.log(chalk.green(`🧹 [HANDLER SWEEPER] Ngebuang channel parasit: ${jid}`));
                }
            });
        }, 120000); 
    }
    
    if (DB.data == null) await global.loadDatabase()
    
    try {
        m = smsg(this, m) || m
        if (!m) return
        m.exp = 0
        m.limit = false

        if (m.chat && m.chat.endsWith('@newsletter') && blacklistSpam.includes(m.chat)) {
            console.log(chalk.yellow(`[REACTIVE KILL] Saluran parasit ${m.chat} terdeteksi! Mengeksekusi Auto-Unfollow...`));
            await conn.newsletterUnfollow(m.chat).catch(() => {});
            
            if (conn.chats?.[m.chat]) delete conn.chats[m.chat];
            if (DB.data?.chats?.[m.chat]) delete DB.data.chats[m.chat];
            return;
        }

        if (global.autotyping && typeof this.sendPresenceUpdate === 'function') {
            this.sendPresenceUpdate('composing', m.chat).catch(console.error)
        }
        if (global.autorecording && typeof this.sendPresenceUpdate === 'function') {
            this.sendPresenceUpdate('recording', m.chat).catch(console.error)
        }

        try {
            if (typeof DB.data.users[m.sender] !== 'object')
                DB.data.users[m.sender] = {}
            
            let user = DB.data.users[m.sender]
            const defaults = {
                registered: false, name: m.name || '', age: -1, regTime: -1, level: 0, warn: 0, exp: 0, limit: 100, afk: -1, afkReason: '', banned: false, banReason: '', role: 'Free user', autolevelup: false, chip: 0, money: 0, atm: 0, fullatm: 0, bank: 0, health: 100, energy: 100, sleep: 100, potion: 0, trash: 0, wood: 0, rock: 0, string: 0, petfood: 0, emerald: 0, diamond: 0, gold: 0, botol: 0, kardus: 0, kaleng: 0, gelas: 0, plastik: 0, iron: 0, common: 0, uncommon: 0, mythic: 0, legendary: 0, umpan: 0, pet: 0, paus: 0, kepiting: 0, gurita: 0, cumi: 0, buntal: 0, dory: 0, lumba: 0, lobster: 0, hiu: 0, udang: 0, orca: 0, banteng: 0, gajah: 0, harimau: 0, kambing: 0, panda: 0, buaya: 0, kerbau: 0, sapi: 0, monyet: 0, babihutan: 0, babi: 0, ayam: 0, steak: 0, ayam_goreng: 0, ribs: 0, roti: 0, udang_goreng: 0, bacon: 0, gandum: 0, minyak: 0, garam: 0, ojek: 0, polisi: 0, roket: 0, taxy: 0, lockBankCD: 0, lasthackbank: 0, lastadventure: 0, lastkill: 0, lastmisi: 0, lastdungeon: 0, lastwar: 0, lastsda: 0, lastduel: 0, lastmining: 0, lasthunt: 0, lastgift: 0, lastberkebon: 0, lastdagang: 0, lasthourly: 0, lastbansos: 0, lastrampok: 0, lastclaim: 0, lastnebang: 0, lastweekly: 0, lastmonthly: 0, apel: 0, anggur: 0, jeruk: 0, mangga: 0, pisang: 0, makanan: 0, bibitanggur: 0, bibitpisang: 0, bibitapel: 0, bibitmangga: 0, bibitjeruk: 0, horse: 0, horseexp: 0, cat: 0, catexp: 0, fox: 0, foxexp: 0, dogexp: 0, robo: 0, roboexp: 0, dragon: 0, dragonexp: 0, lion: 0, lionexp: 0, rhinoceros: 0, rhinocerosexp: 0, centaur: 0, centaurexp: 0, kyubi: 0, kyubiexp: 0, griffin: 0, griffinexp: 0, phonix: 0, phonixexp: 0, wolf: 0, wolfexp: 0, horselastfeed: 0, catlastfeed: 0, robolastfeed: 0, foxlastfeed: 0, doglastfeed: 0, dragonlastfeed: 0, lionlastfeed: 0, rhinoceroslastfeed: 0, centaurlastfeed: 0, kyubilastfeed: 0, griffinlastfeed: 0, phonixlastfeed: 0, wolflastfeed: 0, armor: 0, armordurability: 0, sword: 0, sworddurability: 0, pickaxe: 0, pickaxedurability: 0, fishingrod: 0, fishingroddurability: 0, robodurability: 0
            }
            for (let key in defaults) if (!(key in user)) user[key] = defaults[key]

            if (typeof DB.data.chats[m.chat] !== 'object')
                DB.data.chats[m.chat] = {}
            
            let chat = DB.data.chats[m.chat]
            const chatDefaults = {
                isBanned: false, welcome: false, detect: false, sWelcome: '', sBye: '', sPromote: '', sDemote: '',
                delete: false, 
                antiLink: false, viewonce: false, antiToxic: false, simi: false, autogpt: false, autoSticker: false, premium: false, premiumTime: false, nsfw: false, menu: true, rpgs: true, expired: 0
            }
            for (let key in chatDefaults) if (!(key in chat)) chat[key] = chatDefaults[key]

            if (typeof DB.data.settings[conn.user.jid || conn.user.id] !== 'object')
                DB.data.settings[conn.user.jid || conn.user.id] = {}
            
            let settings = DB.data.settings[conn.user.jid || conn.user.id]
            const settingDefaults = { self: false, autoread: false, anticall: true, restartDB: 0, restrict: false }
            for (let key in settingDefaults) if (!(key in settings)) settings[key] = settingDefaults[key]
            
        } catch (e) {
            console.error('INIT ERROR:', e)
        }

        const opts = global.opts || {}
        if (opts['nyimak']) return
        if (opts['pconly'] && m.chat.endsWith('g.us')) return
        if (opts['gconly'] && !m.chat.endsWith('g.us')) return
        if (opts['swonly'] && m.chat !== 'status@broadcast') return
        if (typeof m.text !== 'string') m.text = ''

        const botId = conn.user?.id ? conn.decodeJid(conn.user.id) : ''
        const mainBotId = global.conn?.user?.id ? conn.decodeJid(global.conn.user.id) : botId
        
        const isROwner = [mainBotId, botId, ...global.owner.map(([number]) => number)].map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender)
        const isOwner = isROwner || m.fromMe
        const isMods = isOwner || global.mods.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender)
        const isPrems = isROwner || DB.data.users[m.sender].premiumTime > 0
        
        const isSelf = conn.self !== undefined ? conn.self : opts['self']
        if (!isOwner && !m.fromMe && isSelf) return

        if (m.text && !(isMods || isPrems)) {
            let queque = this.msgqueque, time = 1000 * 5
            const previousID = queque[queque.length - 1]
            queque.push(m.id || m.key.id)
            let intervalID = setInterval(async function () {
                if (queque.indexOf(previousID) === -1) clearInterval(intervalID)
                await delay(time)
            }, time)
        }

        if (m.isBaileys) return
        if (DB.data.users[m.sender]?.autolevelup) {
            m.exp += Math.ceil(Math.random() * 10)
        }

        const groupMetadata = m.isGroup ? await conn.groupMetadata(m.chat).catch(e => ({})) : {}
        const participants = m.isGroup ? (groupMetadata.participants || []) : [] 
        let groupUser = {}, bot = {}
        if (m.isGroup && participants?.length > 0) { 
            const senderJid = conn.decodeJid(m.sender)
            const botJid = botId

            groupUser = participants.find(u => 
                (u.id && conn.decodeJid(u.id) === senderJid) || 
                (u.jid && conn.decodeJid(u.jid) === senderJid) || 
                (u.lid && conn.decodeJid(u.lid) === senderJid)
            ) || {}
            
            bot = participants.find(u => 
                (u.id && conn.decodeJid(u.id) === botJid) || 
                (u.jid && conn.decodeJid(u.jid) === botJid) || 
                (u.lid && conn.decodeJid(u.lid) === botJid)
            ) || {}
        }

        const isRAdmin = groupUser?.admin === 'superadmin'
        const isAdmin = isRAdmin || groupUser?.admin === 'admin'
        const isBotAdmin = bot?.admin === 'admin' || bot?.admin === 'superadmin'
        const ___dirname = path.join(path.dirname(fileURLToPath(import.meta.url)), './plugins')

        let user = DB.data.users[m.sender]

        for (let name in global.plugins) {
            let plugin = global.plugins[name]
            if (!plugin || plugin.disabled) continue

            let chat = DB.data.chats[m.chat]

            if (chat?.isBanned) {
                if (!['owner-unbanchat.js'].includes(name)) continue
            }
            
            const __filename = join(___dirname, name)
            if (typeof plugin.all === 'function') {
                try {
                    await plugin.all.call(this, m, { chatUpdate, __dirname: ___dirname, __filename })
                } catch (e) {
                    console.error(e)
                }
            }

            if (!opts['restrict']) if (plugin.tags && plugin.tags.includes('admin')) continue

            const str2Regex = str => str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
            let _prefix = plugin.customPrefix ? plugin.customPrefix : conn.prefix ? conn.prefix : global.prefix
            let match = (_prefix instanceof RegExp ? [[_prefix.exec(m.text), _prefix]] :
                Array.isArray(_prefix) ? _prefix.map(p => {
                    let re = p instanceof RegExp ? p : new RegExp(str2Regex(p))
                    return [re.exec(m.text), re]
                }) :
                typeof _prefix === 'string' ? [[new RegExp(str2Regex(_prefix)).exec(m.text), new RegExp(str2Regex(_prefix))]] :
                [[[], new RegExp]]
            ).find(p => p[1])

            if (typeof plugin.before === 'function') {
                if (await plugin.before.call(this, m, {
                    match, conn: this, participants, groupMetadata, user, bot,
                    isROwner, isOwner, isRAdmin, isAdmin, isBotAdmin, isPrems, chatUpdate, __dirname: ___dirname, __filename
                })) continue
            }

            if (typeof plugin !== 'function') continue
            
            let usedPrefix
            if ((usedPrefix = (match[0] || '')[0])) {
                let noPrefix = m.text.replace(usedPrefix, '')
                let [command, ...args] = noPrefix.trim().split` `.filter(v => v)
                args = args || []
                let _args = noPrefix.trim().split` `.slice(1)
                let text = _args.join` `
                command = (command || '').toLowerCase()
                let fail = plugin.fail || global.dfail

                let isAccept = plugin.command instanceof RegExp ? plugin.command.test(command) :
                    Array.isArray(plugin.command) ? plugin.command.some(cmd => cmd instanceof RegExp ? cmd.test(command) : cmd === command) :
                    typeof plugin.command === 'string' ? plugin.command === command : false

                if (!isAccept) continue
                
                m.plugin = name
                let chat = DB.data.chats[m.chat]
                
                if (plugin.rpg && m.isGroup && !chat?.rpgs) {
                    m.reply('🎮 Mode RPG di grup ini belum aktif\n\nKetik:\n.enable rpg')
                    continue
                }

                if (chat?.isBanned && !isOwner) return 
                if (user?.banned && !isOwner) return

                if (plugin.rowner && !isROwner) { fail('rowner', m, this); continue }
                if (plugin.owner && !isOwner) { fail('owner', m, this); continue }
                if (plugin.mods && !isMods) { fail('mods', m, this); continue }
                if (plugin.premium && !isPrems) { fail('premium', m, this); continue }
                if (plugin.group && !m.isGroup) { fail('group', m, this); continue }
                if (plugin.botAdmin && !isBotAdmin) { fail('botAdmin', m, this); continue }
                if (plugin.admin && !isAdmin) { fail('admin', m, this); continue }
                if (plugin.private && m.isGroup) { fail('private', m, this); continue }
                if (plugin.register && !user.registered) { fail('unreg', m, this); continue }

                m.isCommand = true
                let xp = 'exp' in plugin ? parseInt(plugin.exp) : 17
                if (xp < 200 && user?.autolevelup) m.exp += xp

                if (!isPrems && plugin.limit && user.limit < plugin.limit * 1) {
                    this.reply(m.chat, `[❗] Limit harian kamu telah habis`, m)
                    continue 
                }
                
                if (plugin.level > user.level) {
                    this.reply(m.chat, `[💬] Diperlukan level ${plugin.level} untuk perintah ini\n*Level mu:* ${user.level} 📊`, m)
                    continue 
                }

                let extra = {
                    match, usedPrefix, noPrefix, _args, args, command, text, conn: this,
                    participants, groupMetadata, user, bot, isROwner, isOwner, isRAdmin, isAdmin, isBotAdmin, isPrems, chatUpdate, __dirname: ___dirname, __filename
                }

                try {
                    await plugin.call(this, m, extra)
                    if (!isPrems) m.limit = m.limit || plugin.limit || false
                } catch (e) {
                    m.error = e
                    console.error(e)
                    if (e) {
                        let text = format(e)
                        m.reply(`*Error:* ${text}`)
                    }
                } finally {
                    if (typeof plugin.after === 'function') {
                        try {
                            await plugin.after.call(this, m, extra)
                        } catch (e) {
                            console.error(e)
                        }
                    }
                    if (m.limit) m.reply(+m.limit + ' Limit terpakai')
                }
                break
            }
        }
    } catch (e) {
        console.error(e)
    } finally {
        if (m.text) {
            const quequeIndex = this.msgqueque.indexOf(m.id || m.key.id)
            if (quequeIndex !== -1) this.msgqueque.splice(quequeIndex, 1)
        }
        
        let user = DB.data.users[m.sender]
        if (user && user.autolevelup) user.exp += (m.exp || 0)
        if (user && m.limit) user.limit -= (m.limit * 1)

        await DB.write?.()

        try {
            const opts = global.opts || {}
            if (!opts['noprint']) await (await import(`./lib/print.js`)).default(m, this)
        } catch (e) {
            console.log(e)
        }
        
        const opts = global.opts || {}
        if (opts['autoread']) await conn.readMessages([m.key])
    }
}

export async function participantsUpdate({ id, participants, action }) {
    const conn = this
    const DB = conn.db || global.db
    const opts = global.opts || {}
    
    const isSelf = conn.self !== undefined ? conn.self : opts['self']
    if (isSelf || this.isInit) return
    if (DB.data == null) await global.loadDatabase()

    let chat = DB.data.chats[id]
    if (!chat || !chat.welcome) return

    const groupMetadata = (this.chats[id] || {}).metadata || (await this.groupMetadata(id).catch(() => ({})))
    let groupName = groupMetadata.subject || 'Group'
    let memberCount = groupMetadata.participants?.length || 0

    for (let user of participants) {
        user = user.id || user

        let pushName = await conn.getName(user)
        if (!pushName || pushName === user.split('@')[0]) {
            pushName = user.includes('@lid') ? 'Hidden Member' : user.split('@')[0]
        }

        let pp = 'https://i.ibb.co/1s8T3sY/48f7ce63c7aa.jpg'
        try { pp = await this.profilePictureUrl(user, 'image') } catch {}

        if (action === 'add') {

            let defaultWelcome = `👋 Halo @user!\n\nSelamat datang di *${groupName}* 🎉`
            let text = chat.sWelcome && chat.sWelcome.trim() ? chat.sWelcome : defaultWelcome

            text = text
                .replace('@user', '@' + user.split('@')[0])
                .replace('@subject', groupName)
                .replace('@desc', groupMetadata.desc || '')
                .replace(/@rawUName/gi, pushName)
                .replace(/@rawGName/gi, groupName)

            let bgImage = global.welcomeBg || 'https://i.ibb.co/4YBNyvP/mountain-sunset.jpg'
            
            let api = `https://api.siputzx.my.id/api/canvas/welcomev5?username=${encodeURIComponent(pushName)}&guildName=${encodeURIComponent(groupName)}&memberCount=${memberCount + 1}&avatar=${encodeURIComponent(pp)}&background=${encodeURIComponent(bgImage)}&quality=90`

            let res = await fetch(api)
            if (res.ok) {
                let buffer = Buffer.from(await res.arrayBuffer())

                await this.sendMessage(id, {
                    text,
                    contextInfo: {
                        mentionedJid: [user],
                        externalAdReply: {
                            title: `Welcome New Member 👋`,
                            body: `Selamat datang cuy ${pushName}!`,
                            thumbnail: buffer,
                            mediaType: 1,
                            renderLargerThumbnail: true
                        }
                    }
                })
            }
        }

        if (action === 'remove') {

            let defaultBye = `👋 Sampai jumpa @user`
            let text = chat.sBye && chat.sBye.trim() ? chat.sBye : defaultBye

            text = text
                .replace('@user', '@' + user.split('@')[0])
                .replace('@subject', groupName)
                .replace('@desc', groupMetadata.desc || '')
                .replace(/@rawUName/gi, pushName)
                .replace(/@rawGName/gi, groupName)

            let bgImage = global.goodbyeBg || 'https://i.ibb.co/4YBNyvP/images-76.jpg'
            let titleText = 'Goodbye'
            let descText = `Sampai jumpa lagi, ${pushName} 👋`
            
            let api = `https://api.siputzx.my.id/api/canvas/goodbyev4?avatar=${encodeURIComponent(pp)}&background=${encodeURIComponent(bgImage)}&title=${encodeURIComponent(titleText)}&description=${encodeURIComponent(descText)}&border=%232a2e35&avatarBorder=%232a2e35&overlayOpacity=0.3`

            let res = await fetch(api)
            if (res.ok) {
                let buffer = Buffer.from(await res.arrayBuffer())

                await this.sendMessage(id, {
                    text,
                    contextInfo: {
                        mentionedJid: [user],
                        externalAdReply: {
                            title: `Farewell 👋`,
                            body: groupName,
                            thumbnail: buffer,
                            mediaType: 1,
                            renderLargerThumbnail: true
                        }
                    }
                })
            }
        }
    }
}

export async function groupsUpdate(groupsUpdate) {
    const conn = this
    const DB = conn.db || global.db
    const opts = global.opts || {}
    
    const isSelf = conn.self !== undefined ? conn.self : opts['self']
    if (isSelf) return
    
    for (const groupUpdate of groupsUpdate) {
        const id = groupUpdate.id
        if (!id) continue
        let chats = DB.data.chats[id], text = ''
        if (!chats?.detect) continue
        if (groupUpdate.desc) text = (chats.sDesc || '```Deskripsi diganti ke```\n@desc').replace('@desc', groupUpdate.desc)
        if (groupUpdate.subject) text = (chats.sSubject || '```Judul diganti ke```\n@subject').replace('@subject', groupUpdate.subject)
        if (groupUpdate.icon) text = (chats.sIcon || '```Icon grup diganti```')
        if (groupUpdate.announce == true) text = '*Grup ditutup!*'
        if (groupUpdate.announce == false) text = '*Grup dibuka!*'
        
        if (!text) continue
        this.reply(id, text.trim()) 
    }
}

export async function deleteUpdate(message) {
    try {
        const conn = this
        const DB = conn.db || global.db
        const { fromMe, id, participant } = message
        if (fromMe) return
        let msg = this.serializeM(this.loadMessage(id))
        if (!msg || !DB.data.chats[msg.chat]?.delete) return

        const who = (participant || msg.sender).split('@')[0]
        await this.reply(msg.chat, `Terdeteksi @${who} telah menghapus pesan.`, msg, { mentions: [participant || msg.sender] })
        await this.copyNForward(msg.chat, msg).catch(() => {})
    } catch (e) {
        console.error(e)
    }
}

global.dfail = (type, m, conn) => {
    let msg = {
        rowner: 'Hanya Untuk Owner Kak 😝',
        owner: 'Only for owner ya! ⚡',
        mods: 'Bagian moderator 💫',
        premium: 'Fitur ini hanya bisa di akses user premium ✨',
        group: 'Fitur ini khusus grup 👥',
        private: 'Gunakan di chat pribadi 💬',
        admin: 'Khusus admin grup 🛡️',
        botAdmin: 'Bot perlu jadi admin dulu 🪄',
        unreg: 'Belum terdaftar. Ketik *.daftar* 📝',
        restrict: 'Restrict belum diaktifkan ⚙️',
        disable: 'Perintah ini sedang dimatikan 🚫',
    }[type]
    if (msg) return conn.reply(m.chat, msg, m)
}

let file = global.__filename(import.meta.url, true)
watchFile(file, async () => {
    unwatchFile(file)
    console.log(chalk.redBright("Update 'handler.js'"))
    if (global.reloadHandler) console.log(await global.reloadHandler())
})
