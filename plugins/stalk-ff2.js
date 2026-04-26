/*
---------------------------------------------------------------

• Fitur Stalk Free Fire
• Creator - Pembuat Code ini : @Lynx decode
• Saluran Saya : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
• Rilis : 26 April 2026
• Notes : Jangan hapus wm! - jangan hapus credit ini hargai pembuat - creator !!

---------------------------------------------------------------
*/

import axios from 'axios'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return m.reply(`❌ Masukkan ID Free Fire nya cuy!\n*Contoh:* ${usedPrefix + command} 3238006990`)

    m.reply('⏳ Sedang mencari data akun, tunggu sebentar cuy...')

    try {
        const url = `https://www.neoapis.xyz/api/stalk/ff?id=${text}`
        const response = await axios.get(url)
        const result = response.data

        if (!result.status) {
            return m.reply("❌ Gagal mendapatkan data. Pastikan ID Free Fire benar atau API sedang gangguan.")
        }

        const extraData = result.data.extra
        const basic = extraData.basicInfo
        const clan = extraData.clanBasicInfo
        const pet = extraData.petInfo
        const social = extraData.socialInfo
        
        const createDate = new Date(basic.createAt * 1000).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })
        const lastLogin = new Date(basic.lastLoginAt * 1000).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })

        const hasilStalk = `
🎮 *FREE FIRE ACCOUNT STALK* 🎮

👤 *Nickname:* ${basic.nickname || 'Tidak diketahui'}
🆔 *ID Akun:* ${basic.accountId}
🌍 *Region:* ${basic.region}
📈 *Level:* ${basic.level}
✨ *EXP:* ${basic.exp.toLocaleString('id-ID')}
❤️ *Likes:* ${basic.liked.toLocaleString('id-ID')}
🔥 *Credit Score:* ${extraData.creditScoreInfo.creditScore}

🏆 *RANK INFO*
• *Rank BR:* ${basic.rank} (Max: ${basic.maxRank})
• *Rank CS:* ${basic.csRank} (Max: ${basic.csMaxRank})

🛡️ *GUILD / CLAN*
• *Nama:* ${clan.clanName || 'Tidak ada'}
• *Level:* ${clan.clanLevel || '-'}
• *Member:* ${clan.memberNum || 0}/${clan.capacity || 0}

🐾 *PET*
• *Nama Pet:* ${pet.name || 'Tidak ada'}
• *Level Pet:* ${pet.level || '-'}

📅 *LOG AKTIVITAS*
• *Akun Dibuat:* ${createDate}
• *Terakhir Login:* ${lastLogin}

📝 *BIO / SIGNATURE*
_"${social.signature || 'Tidak ada bio'}"_
`.trim()

        await m.reply(hasilStalk)

    } catch (error) {
        console.error("Error fetching data:", error.message)
        return m.reply("❌ Terjadi kesalahan pada server saat mengambil data stalk FF.")
    }
}

handler.help = ['stalkff2 <id>']
handler.tags = ['search', 'tools']
handler.command = /^(stalkff2|ffstalk2|ff2)$/i

export default handler