let handler = async (m, { conn }) => {
    const kataPedes = [
        "Lu kira ini grup jual beli lele? Ketik 'P' doang. Salam kek sesuai agama lu!",
        "Jari lu kepotong kah? Ngetik salam aja males banget cuma huruf 'P'. Ucapin salam woi!",
        "Ngetik 'P' doang emang ngirit kuota? Minimal salam kek, punya agama kan?",
        "Kalo mau chat tuh salam, bukan P P P. Lu kata gua apaan? Assalamu'alaikum kek, Shalom kek!",
        "P P P pala lu peyang! Ketik salam yang bener, diajarin sopan santun nggak sih?",
        "Tombol keyboard lu ilang semua sisa huruf P doang? Gak usah sok asik, salam dulu!",
        "P = Pungut? Salam bang, punya agama kan? Minimal 'Halo' kek, P doang dikira burung hantu.",
        "Ketik P lagi gua blokir lu. Biasain ucap salam sesuai agama, jangan kayak orang gak beradab.",
        "Sehat bang? Cuma bisa ngetik P? Ucapin salam sesuai kepercayaan masing-masing ngapa.",
        "Lu ngetik P buat ngecek ping apa gimana? Ini bot canggih, kasih salam yang beradab dikit!"
    ]

    const emotes = ['🤬', '👎', '🗿', '😤', '🙄', '🔪', '🤦‍♀️', '😒']
    
    let pickPedes = kataPedes[Math.floor(Math.random() * kataPedes.length)]
    let pickEmote = emotes[Math.floor(Math.random() * emotes.length)]

    const headerUI = `┌˚₊ ๑│ ᴇ ʀ ɪ ɴ ᴇ  ᴀ ɪ │๑˚₊ ${pickEmote}`
    const hrUI = "└˚₊ ๑ ────────────── ๑˚₊"
    const footerUI = "> © ERINE-AI | ANTI P"

    let text = `${headerUI}\n` +
               `┇ \n` +
               `│ ⚠️ *HEH! JAGA SIKAP LU!*\n` +
               `│ ${pickPedes}\n` +
               `│ \n` +
               `│ 💡 *Harusnya:* Assalamu'alaikum, Shalom, \n` +
               `│ Om Swastiastu, Namo Buddhaya, atau \n` +
               `│ Salam Kebajikan.\n` +
               `┇ \n` +
               `${hrUI}\n` +
               `${footerUI}`

    await m.react(pickEmote)
    await conn.reply(m.chat, text, m)
}

handler.customPrefix = /^(p)$/i
handler.command = new RegExp

export default handler