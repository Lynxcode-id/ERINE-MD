import fetch from 'node-fetch'

let handler = async (m, { conn, usedPrefix, command }) => {
    await m.react('⏳')

    try {
        let url = 'https://api.ryzumi.net/api/search/kurs-bca'
        let headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'application/json',
            'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
            'Referer': 'https://api.ryzumi.net/'
        }

        let res = await fetch(url, { method: 'GET', headers: headers })
        
        if (!res.ok) throw new Error(`HTTP Error! Status: ${res.status}`)
        
        let json = await res.json()

        if (!Array.isArray(json) || json.length === 0) {
            await m.react('❌')
            return m.reply('❌ Gagal mengambil data kurs atau format API berubah!')
        }

        let txt = `📊 *B C A  E X C H A N G E  R A T E S*\n`
        txt += `_Update terbaru data kurs Bank BCA_\n\n`
        
        json.forEach(v => {
            txt += `┌─〔 *${v.currency}* 〕\n`
            txt += `│ 📉 *Beli :* Rp ${v.beli}\n`
            txt += `│ 📈 *Jual :* Rp ${v.jual}\n`
            txt += `└──────────────────╼\n\n`
        })

        txt += `» ᴇʀɪɴᴇ-ᴍᴅ ᴍᴀɴᴀɢᴇᴍᴇɴᴛ «`

        await m.reply(txt.trim())
        await m.react('✅')

    } catch (e) {
        console.error(e)
        await m.react('❌')
        m.reply(`❌ *Error:* Gagal memproses data kurs.\n\`\`\`${e.message}\`\`\``)
    }
}

handler.help = ['kursbca']
handler.tags = ['tools', 'search']
handler.command = /^(kursbca|kurs-bca|bca-kurs)$/i
handler.limit = true

export default handler