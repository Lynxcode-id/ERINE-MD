/*
---------------------------------------------------------------

• Fitur Cek Update Script
• Creator - Pembuat Code ini : @Lynx decode
• Saluran Saya : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
• Rilis : 26 April 2026
• Notes : Jangan hapus wm! - jangan hapus credit ini hargai pembuat - creator !!

---------------------------------------------------------------
*/

import fs from 'fs'
import path from 'path'
import axios from 'axios'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

let handler = async (m, { conn }) => {
    m.reply('🔍 *Checking update...*\nSedang mengecek versi terbaru ke GitHub Erine-MD.')
    
    try {
        const pkgPath = path.join(__dirname, '..', 'package.json')
        const localPkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))

        const botName = global.namebot || localPkg.name || 'Unknown Bot'
        const localVersion = global.version || localPkg.version

        const url = 'https://raw.githubusercontent.com/Lynxcode-id/ERINE-MD/main/package.json'
        const { data: remotePkg } = await axios.get(url)

        const remoteVersion = remotePkg.version

        let txt = `🤖 *Bot Kamu :* ${botName}\n📦 *Versi Script :* v${localVersion}\n\n`

        if (remoteVersion !== localVersion) {
            txt += `⚠️ *[ UPDATE TERSEDIA ]*\nVersi terbaru script Erine : *v${remoteVersion}*\n\nGabung ke sini untuk update:\nhttps://chat.whatsapp.com/CSMhBRB2DoICQwyy61txr0`
        } else {
            txt += `✅ *[ UP TO DATE ]*\nBot sudah versi terbaru.`
        }

        await m.reply(txt)

    } catch (err) {
        console.error(err)
        m.reply(`❌ *[ ERROR ]* Gagal cek update: ${err.message}`)
    }
}

handler.help = ['cekupdate', 'update']
handler.tags = ['owner', 'info']
handler.command = /^(cekupdate|update)$/i

handler.owner = true // Fitur khusus owner

export default handler