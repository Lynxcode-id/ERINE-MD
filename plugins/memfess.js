let handler = async (m, { conn, text, usedPrefix, command }) => {
    conn.menfess = conn.menfess ? conn.menfess : {}
    if (!text) throw `*Cara penggunaan :*\n\n${usedPrefix + command} nomor|nama pengirim|pesan\n\n*Note:* nama pengirim boleh nama samaran atau anonymous.\n\n*Contoh:* ${usedPrefix + command} ${m.sender.split`@`[0]}|Anonymous|Hai.`;
    
    let [jid, name, pesan] = text.split('|');
    if ((!jid || !name || !pesan)) throw `*Cara penggunaan :*\n\n${usedPrefix + command} nomor|nama pengirim|pesan\n\n*Note:* nama pengirim boleh nama samaran atau anonymous.\n\n*Contoh:* ${usedPrefix + command} ${m.sender.split`@`[0]}|Anonymous|Hai.`;
    
    jid = jid.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
    let data = (await conn.onWhatsApp(jid))[0] || {};
    if (!data.exists) throw 'Nomer tidak terdaftar di whatsapp.';
    if (jid == m.sender) throw 'Tidak bisa mengirim pesan menfess ke diri sendiri.'
    
    let mf = Object.values(conn.menfess).find(mf => mf.status === true)
    if (mf) return !0
    
    let id = + new Date

    let teks = `┌˚₊ ๑│ ᴇ ʀ ɪ ɴ ᴇ  ᴍ ᴅ │๑˚₊ 🎀
┇ 💌 › sᴇᴄʀᴇᴛ ᴍᴇɴꜰᴇss
┇ 🌸 › sᴀꜰᴇ & ᴛʀᴜsᴛᴇᴅ ᴀssɪsᴛᴀɴᴛ
└˚₊ ๑ ᴍ ᴇ s s ᴀ ɢ ᴇ ๑˚₊ 🍓

Hai @${data.jid.split("@")[0]}, kamu menerima pesan Menfess nih!

┌˚ · ๑୧ ᴅ ᴇ ᴛ ᴀ ɪ ʟ s
┇ 👤 ⁞ ᴅᴀʀɪ : *${name}*
└˚₊ ๑୧

📝 ⁞ ᴘᴇsᴀɴ :
${pesan}

_Mau balas pesan ini? Bisa kok kak! Tinggal balas/reply pesan ini lalu ketik pesannya, nanti Erine sampaikan ke *${name}*._
© ᴇʀɪɴᴇ ᴍᴅ x ᴊᴋᴛ𝟺𝟾 ᴠɪʙᴇ`.trim();

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

    await conn.sendMessage(data.jid, {
        text: teks,
        mentions: [data.jid],
        contextInfo: {
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterName: `「 🐣 ᴇʀɪɴᴇ-ᴍᴅ ɪɴғᴏʀᴍᴀᴛɪᴏɴ 🐣 」`,
                newsletterJid: "120363400612665352@newsletter"
            }
        }
    }, { quoted: fkontak }).then(() => {
        m.reply('✅ Berhasil mengirim pesan menfess.')
        conn.menfess[id] = {
            id,
            dari: m.sender,
            nama: name,
            penerima: data.jid,
            pesan: pesan,
            status: false
        }
        return !0
    })
}

handler.tags = ['memfess']
handler.help = ['menfess', 'menfes', 'confess', 'confes', 'memfess']
handler.command = /^(menfess|menfes|confess|confes)$/i
handler.private = true

export default handler
