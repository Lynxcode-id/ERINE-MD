import fs from 'fs'
import moment from 'moment-timezone'
import fetch from 'node-fetch'

const fallbackThumb = "https://files.catbox.moe/4kl4dn.jpg"

let handler = m => m

handler.all = async function (m) {
    global.wm = 'ᴇʀɪɴᴇ ᴘʀᴏᴊᴇᴄᴛ - ᴍᴜʟᴛɪ ᴅᴇᴠɪᴄᴇ'

    let thumb
    try {
        thumb = fs.readFileSync('./thumbnail.jpg')
    } catch {
        thumb = Buffer.from(await (await fetch(fallbackThumb)).arrayBuffer())
    }

    global.adReply = {
        contextInfo: {
            forwardingScore: 999,
            isForwarded: false,
            forwardedNewsletterMessageInfo: {
                newsletterName: `「 🐣 ᴇʀɪɴᴇ-ᴍᴅ ɪɴғᴏʀᴍᴀᴛɪᴏɴ 🐣 」`,
                newsletterJid: "120363400612665352@newsletter"
            },
            externalAdReply: {
                title: `ᴇʀɪɴᴇ ᴘʀᴏᴊᴇᴄᴛ - ᴍᴜʟᴛɪ ᴅᴇᴠɪᴄᴇ`,
                body: `${momentGreeting()}`,
                previewType: "PHOTO",
                thumbnail: thumb
            }
        }
    }

    // === Fake STATUS ===
    global.fstatus = {
        key: {
            participant: '0@s.whatsapp.net',
            remoteJid: 'status@broadcast',
            fromMe: false,
            id: 'Erine Project'
        },
        message: {
            locationMessage: {
                name: 'Erine MD',
                jpegThumbnail: thumb
            }
        }
    }

    // === fkontak ===
    global.fkontak = {
        key: {
            fromMe: false,
            participant: `0@s.whatsapp.net`
        },
        message: {
            contactMessage: {
                displayName: global.wm,
                vcard: `BEGIN:VCARD\nVERSION:3.0\nN:XL;${wm},;;;\nFN:${wm}\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`,
                jpegThumbnail: thumb,
            }
        }
    }

    // === Fake VN ===
    global.fvn = {
        key: {
            fromMe: false,
            participant: `0@s.whatsapp.net`
        },
        message: {
            audioMessage: {
                mimetype: "audio/ogg; codecs=opus",
                seconds: "999999",
                ptt: true
            }
        }
    }

    // === Fake Text ===
    global.ftextt = {
        key: {
            fromMe: false,
            participant: `0@s.whatsapp.net`
        },
        message: {
            extendedTextMessage: {
                text: wm,
                title: wm,
                jpegThumbnail: thumb
            }
        }
    }

    // === Fake Gif ===
    global.fgif = {
        key: {
            fromMe: false,
            participant: `0@s.whatsapp.net`
        },
        message: {
            videoMessage: {
                title: wm,
                h: "Hmm",
                seconds: "999",
                gifPlayback: true,
                caption: wm,
                jpegThumbnail: thumb
            }
        }
    }

    // === Fake Toko ===
    global.ftoko = {
        key: {
            fromMe: false,
            participant: `0@s.whatsapp.net`
        },
        message: {
            productMessage: {
                product: {
                    productImage: {
                        mimetype: "image/jpeg",
                        jpegThumbnail: thumb
                    },
                    title: wm,
                    description: "Simple Bot Esm",
                    currencyCode: "IDR",
                    priceAmount1000: "20000000",
                    retailerId: "Erine Project",
                    productImageCount: 1
                },
                businessOwnerJid: `0@s.whatsapp.net`
            }
        }
    }

    // === Fake Document ===
    global.fdocs = {
        key: { participant: '0@s.whatsapp.net' },
        message: {
            documentMessage: {
                title: wm,
                jpegThumbnail: thumb
            }
        }
    }

    // === Fake Group Invite ===
    global.fgclink = {
        key: {
            fromMe: false,
            participant: "0@s.whatsapp.net",
        },
        message: {
            groupInviteMessage: {
                groupJid: "120363427740570717@g.us",
                inviteCode: "null",
                groupName: "Erine project community",
                caption: wm,
                jpegThumbnail: thumb
            }
        }
    }
}

export default handler

function momentGreeting() {
    const hour = moment.tz('Asia/Makassar').hour()
    
    if (hour >= 18) return 'Selamat Malam 🌙'
    if (hour >= 15) return 'Selamat Sore 🌅'
    if (hour >= 11) return 'Selamat Siang ☀️'
    if (hour >= 4)  return 'Selamat Pagi ☕'
    return 'Selamat Malam / Selamat Beristirahat 🛌'
}