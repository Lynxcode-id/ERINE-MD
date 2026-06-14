import { createHash } from 'crypto'

// 🔥 FIX 1: Tambahin 'conn' di parameter biar 'conn.sendMessage' di bawah nggak error
let handler = async (m, { conn, text, usedPrefix }) => {

    // 🔥 FIX 2: Deteksi otomatis pakai DB bot utama atau DB Jadibot
    const DB = conn.db || global.db;
    
    let user = DB.data.users[m.sender]
    
    // 🔥 FIX 3: Mencegah crash kalau user belum terdaftar di database
    if (!user) return;

    if(user.registered !== false) throw 'Kamu Sudah mendaftar!!\nIngin daftar ulang? ketik unreg'
    
    user.registered = true
    let sn = createHash('md5').update(m.sender).digest('hex')
    let p = `*Selamat Kamu sudah Mendaftar ✅*\n•Ketik Menu Untuk Melanjutkan\n\n•Sn Kamu: *${sn}*`
    const arr = [
        { text: `*[ V ]*\n\n${p}`, timeout: 100 },
        { text:  `*[ V E ]*\n\n${p}`, timeout: 100 },
        { text:  `*[ V E R ]*\n\n${p}`, timeout: 100 },
        { text:  `*[ V E R I ]*\n\n${p}`, timeout: 100 },
        { text:  `*[ V E R I F ]*\n\n${p}`, timeout: 100 },
        { text:  `*[ V E R I F Y ]*\n\n${p}`, timeout: 100 },
        { text:  `*[ V E R I F Y   S ]*\n\n${p}`, timeout: 100 },
        { text:  `*[ V E R I F Y   S U ]*\n\n${p}`, timeout: 100 },
        { text:  `*[ V E R I F Y   S U C ]*\n\n${p}`, timeout: 100 },
        { text:  `*[ V E R I F Y   S U C C ]*\n\n${p}`, timeout: 100 },
        { text:  `*[ V E R I F Y   S U C C E ]*\n\n${p}`, timeout: 100 },
        { text:  `*[ V E R I F Y   S U C C E S ]*\n\n${p}`, timeout: 100 },
        { text:  `*[ V E R I F Y   S U C C E S S ]*\n\n${p}`, timeout: 100 },
    ];

    const lll = await conn.sendMessage(m.chat, { text: 'Sedang menverifikasi....' }, { quoted: m });

    for (let i = 0; i < arr.length; i++) {
        await new Promise(resolve => setTimeout(resolve, arr[i].timeout));
        await conn.relayMessage(m.chat, {
            protocolMessage: {
                key: lll.key,
                type: 14,
                editedMessage: {
                    conversation: arr[i].text
                }
            }
        }, {});
    }
}

handler.help = ['@verify']
handler.tags = ['main']
handler.customPrefix = /^(@verify)$/i
handler.command = new RegExp

export default handler
