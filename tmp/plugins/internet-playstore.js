import axios from 'axios'
import cheerio from 'cheerio'

async function PlayStore(search) {
    return new Promise(async (resolve, reject) => {
        try {
            const { data } = await axios.get(`https://play.google.com/store/search?q=${search}&c=apps`)
            const hasil = []
            const $ = cheerio.load(data)
            
            $('.ULeU3b > .VfPpkd-WsjYwc.VfPpkd-WsjYwc-OWXEXe-INsAgc.KC1dQ.Usd1Ac.AaN0Dd.Y8RQXd > .VfPpkd-aGsRMb > .VfPpkd-EScbFb-JIbuQc.TAQqTe > a').each((i, u) => {
                const linkk = $(u).attr('href')
                const nama = $(u).find('.j2FCNc > .cXFu1 > .ubGTjb > .DdYX5').text()
                const developer = $(u).find('.j2FCNc > .cXFu1 > .ubGTjb > .wMUdtb').text()
                const rate = $(u).find('.j2FCNc > .cXFu1 > .ubGTjb > div').attr('aria-label')
                const rate2 = $(u).find('.j2FCNc > .cXFu1 > .ubGTjb > div > span.w2kbF').text()
                const link = `https://play.google.com${linkk}`

                hasil.push({
                    link: link,
                    nama: nama || 'No name',
                    developer: developer || 'No Developer',
                    img: 'https://files.catbox.moe/dklg5y.jpg', 
                    rate: rate || 'No Rate',
                    rate2: rate2 || 'No Rate',
                    link_dev: `https://play.google.com/store/apps/developer?id=${developer.split(" ").join('+')}`
                })
            })
            
            if (hasil.length === 0) return resolve({ mess: 'Tidak ada hasil yang ditemukan' })
            
            resolve(hasil.slice(0, Math.max(3, Math.min(5, hasil.length)))) 
        } catch (err) {
            console.error(err)
            reject(err)
        }
    })
}

const handler = async (m, { conn, text }) => {
    const search = text.trim()
    if (!search) return m.reply('Masukkan query pencarian!')
    
    try {
        await m.react('⏳')
        const results = await PlayStore(search)
        if (results.mess) {
            await m.react('❌')
            return m.reply(results.mess)
        }
        
        let txt = `┌˚₊ ๑│ ᴇ ʀ ɪ ɴ ᴇ  ᴍ ᴅ │๑˚₊ 🎀
┇ 🔍 › ᴘʟᴀʏsᴛᴏʀᴇ sᴇᴀʀᴄʜ
┇ 🌸 › sᴀꜰᴇ & ᴛʀᴜsᴛᴇᴅ ᴀssɪsᴛᴀɴᴛ
└˚₊ ๑ ʀ ᴇ s ᴜ ʟ ᴛ s ๑˚₊ 🍓\n\n`

        for (let app of results) {
            txt += `┌˚ · ๑୧ ᴀ ᴘ ᴘ  ɪ ɴ ꜰ ᴏ\n`
            txt += `┇ 📱 ⁞ ɴᴀᴍᴀ : ${app.nama}\n`
            txt += `┇ 👤 ⁞ ᴅᴇᴠᴇʟᴏᴘᴇʀ : ${app.developer}\n`
            txt += `┇ ⭐ ⁞ ʀᴀᴛɪɴɢ : ${app.rate2} (${app.rate})\n`
            txt += `┇ 🔗 ⁞ ʟɪɴᴋ : ${app.link}\n`
            txt += `└˚₊ ๑୧\n\n`
        }
        
        txt += `© ᴇʀɪɴᴇ ᴍᴅ x ᴊᴋᴛ𝟺𝟾 ᴠɪʙᴇ`

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
                    vcard: `BEGIN:VCARD\nVERSION:3.0\nN:XL;${wm},;;;\nFN:${wm}\nitem1.TEL;waid=${senderNumber}:${senderNumber}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
                }
            }
        }
        
        await conn.sendMessage(m.chat, { 
            image: { url: 'https://files.catbox.moe/dklg5y.jpg' },
            caption: txt,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterName: `「 🐣 ᴇʀɪɴᴇ-ᴍᴅ ɪɴғᴏʀᴍᴀᴛɪᴏɴ 🐣 」`,
                    newsletterJid: "120363400612665352@newsletter"
                }
            }
        }, { quoted: fkontak })
        
        await m.react('✅')
    } catch (e) {
        console.error(e)
        await m.react('❌')
        m.reply('Terjadi kesalahan saat melakukan pencarian')
    }
}

handler.help = ['playstore'].map(v => v + ' <query>')
handler.command = /^(playstore|ps)$/i
handler.limit = false
handler.tags = ['internet']

export default handler
