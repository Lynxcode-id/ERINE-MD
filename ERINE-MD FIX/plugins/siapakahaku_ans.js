import similarity from 'similarity'
const threshold = 0.72

export async function before(m, { conn }) {
    let id = m.chat
    // Cek apakah user mereply pesan bot yang mengandung kata kunci game
    if (!m.quoted || !m.quoted.fromMe || !m.quoted.isBaileys || !m.text || !/S I A P A K A H   A K U/i.test(m.quoted.text) || /.*hint|.*surrender/i.test(m.text))
        return !0

    conn.siapakahaku = conn.siapakahaku ? conn.siapakahaku : {}
    
    if (!(id in conn.siapakahaku)) return m.reply('Soal itu telah berakhir')

    if (m.quoted.id == conn.siapakahaku[id][0].id) {
        let correctAnswer = conn.siapakahaku[id][1].toLowerCase().trim()
        let isSurrender = /^((me)?nyerah|surr?ender)$/i.test(m.text)

        // Kalau user nyerah
        if (isSurrender) {
            clearTimeout(conn.siapakahaku[id][3])
            delete conn.siapakahaku[id]
            return m.reply(`Menyerah!\nJawabannya adalah: *${correctAnswer}*`)
        }

        // Cek jawaban
        if (m.text.toLowerCase() == correctAnswer) {
            global.db.data.users[m.sender].exp += conn.siapakahaku[id][2]
            m.reply(`✅ *Benar!*\n+${conn.siapakahaku[id][2]} XP`)
            clearTimeout(conn.siapakahaku[id][3])
            delete conn.siapakahaku[id]
        } else if (similarity(m.text.toLowerCase(), correctAnswer) >= threshold) {
            m.reply(`❗ *Dikit Lagi!*`)
        } else {
            m.reply(`❌ *Salah!*`)
        }
    }
    return !0
}