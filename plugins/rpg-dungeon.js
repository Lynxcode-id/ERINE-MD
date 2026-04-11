// © INF PROJECT - Erine-MD
// Developed by INF PROJECT

import pkg from '@wishkeysocket/baileys'
const { generateWAMessageFromContent, proto, prepareWAMessageMedia } = pkg
import fs from 'fs'

let handler = async (m, { conn, usedPrefix, command, text }) => {
    conn.dungeon = conn.dungeon ? conn.dungeon : {}
    let user = global.db.data.users[m.sender]
    
    let SWORD = (user.sword || 0) < 1
    let ARMOR = (user.armor || 0) < 1
    let HEALT = (user.health || 0) < 90
    
    if (SWORD || ARMOR || HEALT) {
        let requirements = getRequirements(user.sword * 1, user.armor * 1, user.health * 1, usedPrefix)
        return conn.reply(m.chat, requirements, m)
    }

    if (Object.values(conn.dungeon).find(room => room.id.startsWith('dungeon') && [room.game.player1, room.game.player2, room.game.player3, room.game.player4].includes(m.sender))) {
        return m.reply('❌ Kamu masih berada di dalam Dungeon, Bang!')
    }

    let timing = (new Date - (user.lastdungeon || 0)) * 1
    if (timing < 600000) return m.reply(`*––––––『 COOLDOWN 』––––––*\nʏᴏᴜ ʜᴀᴠᴇ ɢᴏɴᴇ ᴛᴏ ᴛʜᴇ ᴅᴜɴɢᴇᴏɴ, please wait...\n➞ ${clockString(600000 - timing)}`)

    let room = Object.values(conn.dungeon).find(room => room.state === 'WAITING' && (text ? room.name === text : true))
    
    if (room) {
        if (!room.game.player2) {
            room.player2 = m.chat
            room.game.player2 = m.sender
        } else if (!room.game.player3) {
            room.player3 = m.chat
            room.game.player3 = m.sender
        } else if (!room.game.player4) {
            room.player4 = m.chat
            room.game.player4 = m.sender
            room.state = 'PLAYING'
        }

        let waitStatus = `${!room.game.player4 ? `[• • •] ᴡᴀɪᴛɪɴɢ ${!room.game.player3 && !room.game.player4 ? '2' : '1'} ᴘʟᴀʏᴇʀ ᴀɢᴀɪɴ... ${room.name ? `\n➞ Ketik: *${usedPrefix}${command} ${room.name}* untuk join` : ''}` : 'ᴀʟʟ ᴘʟᴀʏᴇʀ ᴀʀᴇ ᴄᴏᴍᴘʟᴇᴛᴇ...'}`
        m.reply(`*––––––『 DUNGEON 』––––––* \n ${waitStatus}`)

        if (room.game.player1 && room.game.player2 && room.game.player3 && room.game.player4) {
            let p1 = room.game.player1, p2 = room.game.player2, p3 = room.game.player3, p4 = room.game.player4
            let chats = [room.player1, room.player2, room.player3, room.player4]

            room.price.money += Math.floor(Math.random() * 10000)
            room.price.exp += Math.floor(Math.random() * 5001)
            room.price.iron += pickRandom([0, 1, 0, 1])
            room.price.diamond += pickRandom([0, 0, 1, 0, 0, 1])
            room.price.trash += Math.floor(Math.random() * 1001)

            let str = `➞ *ʀᴏᴏᴍ ɪᴅ:* ${room.id}\n👩‍🏫 *ᴘʟᴀʏᴇʀs:*\n▸ ${M(p1)}\n▸ ${M(p2)}\n▸ ${M(p3)}\n▸ ${M(p4)}`.trim()

            for (let jid of [...new Set(chats)]) {
                await conn.reply(jid, str, null, { mentions: [p1, p2, p3, p4] })
            }

            setTimeout(async () => {
                let users = global.db.data.users
                let players = [p1, p2, p3, p4]
                let { health, sword } = room.less
                let { exp, money, trash, potion, diamond, iron, wood, rock, string, common, uncommon, mythic, legendary, pet, petfood } = room.price

                let resultStr = `👩‍🏫 *ᴘʟᴀʏᴇʀs:*
• ${M(p1)}
• ${M(p2)}
• ${M(p3)}
• ${M(p4)}
- - - - - - - - - - - -
❤️ *ʜᴇᴀʟᴛʜ:* -${health}
⚔️ *ᴅᴜʀᴀʙɪʟɪᴛʏ sᴡᴏʀᴅ:* -${sword}

*- ʀ ᴇ ᴡ ᴀ ʀ ᴅ -*
➞ ᴇxᴘ: ${exp * 4}
➞ ᴍᴏɴᴇʏ: ${money * 4}
➞ ᴛʀᴀsʜ: ${trash * 4}${potion ? '\n➞ ᴘᴏᴛɪᴏɴ: ' + (potion * 4) : ''}${diamond ? '\n➞ ᴅɪᴀᴍᴏɴᴅ: ' + (diamond * 4) : ''}${common ? '\n➞ ᴄᴏᴍᴍᴏɴ: ' + (common * 4) : ''}
`.trim()

                // Update Data Semua Player
                for (let p of players) {
                    let u = users[p]
                    u.health -= health
                    u.sworddurability -= sword
                    u.money += money
                    u.exp += exp
                    u.trash += trash
                    u.diamond += diamond
                    u.lastdungeon = new Date * 1
                    
                    if (u.health < 0) u.health = 0
                    if (u.sworddurability < 1) {
                        u.sword -= 1
                        u.sworddurability = (u.sword > 0 ? u.sword * 50 : 0)
                    }
                }

                let dungimg = ['./media/dungeon1.jpg', './media/dungeon2.jpg']
                let randomImg = dungimg[Math.floor(Math.random() * dungimg.length)]
                let imgBuffer = fs.existsSync(randomImg) ? fs.readFileSync(randomImg) : Buffer.alloc(0)

                for (let jid of [...new Set(chats)]) {
                    await conn.sendFile(jid, imgBuffer, 'dungeon.jpg', resultStr, null, false, { mentions: players })
                }

                delete conn.dungeon[room.id]
            }, pickRandom([5000, 8000, 10000]))
        }
    } else {
        room = {
            id: 'dungeon-' + (+ new Date),
            player1: m.chat, player2: '', player3: '', player4: '',
            state: 'WAITING',
            game: { player1: m.sender, player2: '', player3: '', player4: '' },
            price: {
                money: Math.floor(Math.random() * 1001),
                exp: Math.floor(Math.random() * 3001),
                trash: Math.floor(Math.random() * 1001),
                potion: pickRandom([0, 1, 0, 2, 0]),
                diamond: pickRandom([0, 0, 1, 0]),
                iron: 0, wood: 0, rock: 0, string: 0,
                common: pickRandom([0, 1, 2, 0]),
                uncommon: 0, mythic: 0, legendary: 0, pet: 0, petfood: 0
            },
            less: {
                health: Math.floor(Math.random() * 51) + 20,
                sword: Math.floor(Math.random() * 30) + 10
            }
        }
        if (text) room.name = text
        let waitMsg = `[ • • • ] ᴡᴀɪᴛɪɴɢ ᴘʟᴀʏᴇʀ... ${text ? `\n➞ Ketik: *${usedPrefix}${command} ${text}*` : ''}\nAtau tunggu orang lain bergabung.`
        m.reply(`*––––––『 DUNGEON 』––––––* \n${waitMsg}`)
        conn.dungeon[room.id] = room
    }
}

handler.help = ['dungeon']
handler.tags = ['rpg']
handler.command = /^(dungeon)$/i
handler.level = 15
handler.group = true
handler.rpg = true

export default handler

function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)]
}

function getRequirements(sword, armor, health, usedPrefix) {
    let sw = sword < 1, a = armor < 1, h = health < 90
    return `
${sw ? '➞ Kamu belum punya Pedang (Sword)! ' : ''}${a ? '➞ Kamu belum punya Armor! ' : ''}${h ? '➞ Darahmu kurang dari 90! ' : ''}
- - - - - - - - - - - - - - -
${sw ? `\n🗡️ *Craft Sword:* ${usedPrefix}craft sword` : ''}${a ? `\n🥼 *Craft Armor:* ${usedPrefix}craft armor` : ''}${h ? `\n❤️ *Heal:* ${usedPrefix}heal` : ''}
`.trim()
}

function M(jid) {
    return '@' + jid.split('@')[0]
}

function clockString(ms) {
    let h = Math.floor(ms / 3600000) % 24
    let m = Math.floor(ms / 60000) % 60
    let s = Math.floor(ms / 1000) % 60
    return `${h}h ${m}m ${s}s`
}
