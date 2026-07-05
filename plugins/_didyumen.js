import didyoumean from 'didyoumean'
import similarity from 'similarity'
import fs from 'fs'
import sharp from 'sharp'

let handler = m => m

handler.before = async function (m, { match, usedPrefix }) {
    if (!m.text) return
    if ((usedPrefix = (match[0] || '')[0])) {
        
        let commandWithArgs = m.text.slice(1).trim()
        if (!commandWithArgs) return

        let commandOnly = commandWithArgs.split(/\s+/)[0].toLowerCase()

        let isCommandValid = Object.values(global.plugins).some(plugin => {
            if (plugin.disabled) return false
            if (plugin.command instanceof RegExp) return plugin.command.test(commandOnly)
            if (Array.isArray(plugin.command)) return plugin.command.includes(commandOnly)
            if (typeof plugin.command === 'string') return plugin.command === commandOnly
            return false
        })

        if (isCommandValid) return

        let cmdMap = {}
        Object.values(global.plugins).forEach(plugin => {
            if (plugin.disabled || !plugin.help) return
            
            let helps = Array.isArray(plugin.help) ? plugin.help : [plugin.help]
            
            helps.forEach(helpItem => {
                if (typeof helpItem !== 'string') return
                let cmdName = helpItem.trim().split(/\s+/)[0].toLowerCase()
                
                if (!cmdMap[cmdName]) cmdMap[cmdName] = helpItem.trim() 
            })
        })

        let availableCommands = Object.keys(cmdMap)
        if (availableCommands.includes(commandOnly)) return

        let mean = didyoumean(commandOnly, availableCommands)
        if (!mean) return

        let sim = similarity(commandOnly, mean)
        let similarityPercentage = Math.round(sim * 100)
        if (mean && commandOnly !== mean) {
            
            let fullCommand = cmdMap[mean]

            let text = `❓ *Sepertinya kamu nyari command ini?*\n\n` +
                       `✨ commandnya - cmd : *${usedPrefix + fullCommand}*\n` +
                       `📊 akurasi kemiripan : *${similarityPercentage}%*`

            let imgBuffer = fs.readFileSync('./media/erine.jpg')

            let resizedThumb = await sharp(imgBuffer)
                .resize(300, 300, { fit: 'cover' })
                .jpeg({ quality: 80 })
                .toBuffer()

            let wm = global.wm || "Erine System"
            let senderNumber = m.sender.split('@')[0]

            let fkontak = {
                key: {
                    fromMe: false,
                    participant: `0@s.whatsapp.net`
                },
                message: {
                    contactMessage: {
                        displayName: wm,
                        vcard: `BEGIN:VCARD\nVERSION:3.0\nN:XL;${wm},;;;\nFN:${wm}\nitem1.TEL;waid=${senderNumber}:${senderNumber}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`,
                        jpegThumbnail: resizedThumb
                    }
                }
            }

            await this.sendMessage(
                m.chat,
                {
                    document: imgBuffer,
                    mimetype: 'image/png',
                    fileLength: 9999,
                    fileName: 'ᴇʀɪɴᴇ-ᴍᴅ ᴘʀᴏᴊᴇᴄᴛ',
                    caption: text,
                    jpegThumbnail: resizedThumb
                },
                {
                    quoted: fkontak
                }
            )
        }
    }
}

export default handler