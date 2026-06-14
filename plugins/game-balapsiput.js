/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx
 * ─────────────────────────
 * 📝 Plugin: Game Balap Siput (One-Shot Race)
 */

let handler = async (m, { conn, text, usedPrefix, command }) => {
    let valid = ['merah', 'biru', 'hijau', 'kuning']
    
    if (!text || !valid.includes(text.toLowerCase().trim())) {
        return m.reply(`⚠️ *Pilih warna andalan lu cuk!*\n\nKetik: *${usedPrefix + command} <warna>*\nPilihan: *merah, biru, hijau, kuning*\n\nContoh: *${usedPrefix + command} merah*`)
    }

    await m.react('🏁')

    let jagoan = text.toLowerCase().trim()
    let peserta = [
        { nama: 'merah', emoji: '🔴', skor: Math.floor(Math.random() * 100) + 1 },
        { nama: 'biru', emoji: '🔵', skor: Math.floor(Math.random() * 100) + 1 },
        { nama: 'hijau', emoji: '🟢', skor: Math.floor(Math.random() * 100) + 1 },
        { nama: 'kuning', emoji: '🟡', skor: Math.floor(Math.random() * 100) + 1 }
    ]

    peserta.sort((a, b) => b.skor - a.skor)

    let juara = peserta[0].nama
    let isWin = jagoan === juara

    let caption = `🏁 *B A L A P   S I P U T* 🏁\n\n`
    caption += `Jagoan lu: *${jagoan.toUpperCase()}*\n\n`
    
    caption += `*Hasil Balapan:*\n`
    peserta.forEach((v, i) => {
        let trackLength = Math.floor(v.skor / 10)
        let track = '-'.repeat(trackLength) + '🐌'
        
        caption += `${i + 1}. ${v.emoji} ${v.nama.toUpperCase()} \n   ${track} (${v.skor})\n`
    })

    caption += `\n${isWin ? '🎉 *LU MENANG BRAY!* Jagoan lu finish duluan.' : '💀 *LU KALAH NJIR!* Jagoan lu ampas.'}\n\n`
    caption += `> © INF PROJECT`

    await m.react(isWin ? '🎉' : '💀')
    await conn.sendMessage(m.chat, { text: caption }, { quoted: m })
}

handler.help = ['balapsiput <warna>']
handler.tags = ['game']
handler.command = /^(balap|balapsiput|siput)$/i
handler.limit = true
handler.group = true

export default handler