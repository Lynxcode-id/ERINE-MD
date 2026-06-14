/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx Decode
 * 🏢 Store     : Lynx Store x Trisha Project
 * 📢 Channel   : https://whatsapp.com/channel/0029Vb6eyvOJUM2caRIktb2L
 * ─────────────────────────
 * 📝 Plugin: Store Menu (Erine-MD)
 * 🎨 Theme : Cyber-Neon Futuristic
 */

import { generateWAMessageFromContent } from '@whiskeysockets/baileys'
import fetch from 'node-fetch'

let handler = async (m, { conn, usedPrefix }) => {
    await m.react('🛒')

    try {
        let res = await fetch('https://i.imgur.com/QqcH5rc.jpeg')
        let thumb = Buffer.from(await res.arrayBuffer())

        const storeLink = 'https://wa.me/p/26604511355826071/6285143688664'
        const mainChannel = 'https://whatsapp.com/channel/0029Vb6eyvOJUM2caRIktb2L'
        const hiddenSpace = String.fromCharCode(8206).repeat(4000)

        let storeMenu = `${storeLink}\n${hiddenSpace}
*⚡ ───「 𝗟𝗬𝗡𝗫 𝗦𝗧𝗢𝗥𝗘  𝗫 𝗘𝗥𝗜𝗡𝗘 𝗠𝗗 」─── ⚡*

💠 *CYBER DIGITAL SERVICES & AUTOMATION* 💠

🌐 *A. PANEL PTERODACTYL HOSTING*
├ 🚀 Server High Performance (Anti-Delay)
├ ⚡ Cocok untuk Bot WhatsApp MD
└ 🛠️ Full Akses File Manager & Console

🤖 *B. CLONE BOT WHATSAPP*
├ 🧬 Clone Erine-MD (Smart AI)
├ 🧬 Clone Jemima-MD (Advanced Tools)
└ 🧬 Clone Takina-MD (Utility Bot)

⚙️ *C. SCRIPT FIX & INSTALLATION*
├ 🔧 Fix Error Script (ESM & Baileys)
├ 🔄 Migrasi Library (ex: Baileys to Socketon)
└ 📦 Pemasangan Script Custom & API

🎭 *D. JKT48 AUTOMATION TOOLS*
├ 📡 Sistem Live Checker (Showroom/IDN)
└ 🔔 Fitur Watchdog Notifikasi JKT48

🎨 *E. DIGITAL ASSETS & DESIGN*
├ 🌠 Cyber-Modern GFX Thumbnails
└ 🌌 Siber-Neon Logo & UI Designs

━━━━━━━━━━━━━━━━━━━━━━
💳 *PAYMENT:* QRIS ALL PAYMENT
👤 *OWNER:* Lynx Decode
🔗 *STORE CHANNEL:* ${mainChannel}
━━━━━━━━━━━━━━━━━━━━━━

💡 *Cara Pemesanan:*
Ketik *${usedPrefix}owner* untuk menghubungi saya, atau balas pesan ini dengan rincian pesanan.

> © 𝗘𝗥𝗜𝗡𝗘 𝗣𝗥𝗢𝗝𝗘𝗖𝗧 - 𝗦𝗧𝗔𝗬 𝗔𝗛𝗘𝗔𝗗
`.trim()

        let msg = await generateWAMessageFromContent(m.chat, {
            extendedTextMessage: {
                text: storeMenu,
                matchedText: storeLink,
                title: '⚡ LYNX STORE | DIGITAL ASSETS',
                description: 'Cyber-Modern Bot Services',
                jpegThumbnail: thumb,
                previewType: 0,
                linkPreviewMetadata: {
                    socialMediaPostType: 1,
                    linkInlineVideoMuted: false
                },
                contextInfo: {
                    mentionedJid: [m.sender]
                }
            }
        }, { quoted: m })

        await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
        await m.react('✅')
    } catch (e) {
        console.error(e)
        await m.react('❌')
        m.reply(`❌ *Terjadi Kesalahan:* Sistem gagal memuat katalog Lynx Store.`)
    }
}

handler.help = ['store', 'liststore']
handler.tags = ['main']
handler.command = /^(store|liststore|lynxstore|jualan)$/i

export default handler