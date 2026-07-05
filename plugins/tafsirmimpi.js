import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return m.reply(`Mimpi apa lu semalem cuy?\n\n*Contoh Penggunaan:*\n${usedPrefix + command} bertemu`)

    m.reply('⏳ *Menerawang arti mimpi...*')

    try {
        let res = await fetch(`https://api.siputzx.my.id/api/primbon/tafsirmimpi?mimpi=${encodeURIComponent(text)}`)
        let json = await res.json()

        if (!json.status || !json.data || json.data.hasil.length === 0) {
            return m.reply('❌ Tafsir mimpi tidak ditemukan. Coba pakai kata kunci yang lebih singkat.')
        }

        let { keyword, hasil, solusi } = json.data

        let caption = `乂 *T A F S I R   M I M P I*\n\n`
        caption += `🔑 *Keyword:* ${keyword}\n\n`
        
        // Dibatasi 10 hasil biar chat nggak spam/kepanjangan
        let limitHasil = hasil.slice(0, 10)
        
        limitHasil.forEach((v, i) => {
            caption += `*${i + 1}. ${v.mimpi}*\n`
            caption += `↳ _${v.tafsir}_\n\n`
        })

        if (hasil.length > 10) {
            caption += `_(Menampilkan 10 dari ${hasil.length} hasil pencarian...)_\n\n`
        }

        // Ngebersihin spasi/enter berlebih dari API biar rapi
        let cleanSolusi = solusi.replace(/\n\s+/g, '\n').trim()
        
        caption += `📌 *Solusi (Bila Mimpi Buruk):*\n${cleanSolusi}\n\n`
        caption += `_Jemima Bot_`

        await conn.reply(m.chat, caption, m)

    } catch (e) {
        console.error(e)
        m.reply('❌ Terjadi kesalahan sistem saat mengambil data.')
    }
}

handler.help = ['tafsirmimpi <keyword>']
handler.tags = ['primbon']
handler.command = /^(tafsirmimpi|artimimpi|primbonmimpi)$/i
handler.limit = true

export default handler