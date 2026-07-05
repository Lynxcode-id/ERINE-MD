/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Integrator : Lynx Decode
 * 📞 Contact    : +62 882-5804-1396
 * 📢 Channel    : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * ⚠️ Note       : Keep credit to respect the creator!
 * ─────────────────────────
 * 📝 Plugin     : Fake Lobby FF Squad
 * 🎨 UI         : ERINE-AI Custom Style
 */

let handler = async (m, { conn, text, usedPrefix, command }) => {
    const header = (title, emoji) => `┌˚₊ ๑│ ${title} │๑˚₊ ${emoji}\n┇ \n`
    const footer = () => `\n┇ \n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`

    if (!text) {
        return m.reply(header('FAKE LOBBY FF', '🎮') + `│ ❌ *Namanya mana cuy?*\n│ *Gunakan pemisah tanda | untuk 4 nama*\n│ *Contoh:* ${usedPrefix + command} Nanzz|Azzam|Rizky|Budi` + footer())
    }

    let [nama1, nama2, nama3, nama4] = text.split('|')

    if (!nama1 || !nama2 || !nama3 || !nama4) {
        return m.reply(header('FAKE LOBBY FF', '🎮') + `│ ❌ *Format salah!*\n│ *Harus memasukkan 4 nama yang dipisah dengan tanda |*\n│ *Contoh:* ${usedPrefix + command} Nanzz|Azzam|Rizky|Budi` + footer())
    }

    await m.react('⏳')

    try {
        let apiUrl = `https://api-nanzz.my.id/docs/api/maker/fake-lobby-ff-squad.php?nama1=${encodeURIComponent(nama1.trim())}&nama2=${encodeURIComponent(nama2.trim())}&nama3=${encodeURIComponent(nama3.trim())}&nama4=${encodeURIComponent(nama4.trim())}`

        let teks = header('FAKE LOBBY FF', '🎮')
        teks += `│ ✅ *Fake Lobby berhasil dibuat!*\n`
        teks += `│ 👤 *Player 1 :* ${nama1.trim()}\n`
        teks += `│ 👤 *Player 2 :* ${nama2.trim()}\n`
        teks += `│ 👤 *Player 3 :* ${nama3.trim()}\n`
        teks += `│ 👤 *Player 4 :* ${nama4.trim()}`
        teks += footer()

        await conn.sendMessage(m.chat, {
            image: { url: apiUrl },
            caption: teks
        }, { quoted: m })

        await m.react('✨')

    } catch (e) {
        console.error(e)
        await m.react('❌')
        m.reply(header('MAKER ERROR', '❌') + `│ ❌ *Terjadi kesalahan:*\n│ Gagal membuat gambar atau server sedang gangguan.` + footer())
    }
}

handler.help = ['ffsquad <nama1|nama2|nama3|nama4>']
handler.tags = ['maker']
handler.command = /^ffsquad$/i
handler.limit = true

export default handler