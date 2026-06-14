let badwordRegex = /anj(k|g)|ajn?(g|k)|a?njin(g|k)|bajingan|b(a?n)?gsa?t|ko?nto?l|me?me?(k|q)|pe?pe?(k|q)|meki|titi(t|d)|pe?ler|tetek|toket|ngewe|go?blo?k|to?lo?l|idiot|(k|ng)e?nto?(t|d)|jembut|bego|dajj?al|janc(u|o)k|pantek|puki ?(mak)?|kimak|kampang|lonte|col(i|mek?)|pelacur|henceu?t|nigga|fuck|dick|bitch|tits|bastard|asshole|dontol|kontoi|ontol/i // tambahin sendiri

export function before(m, { isBotAdmin }) {
    if (m.isBaileys && m.fromMe) return !0
    
    // 🔥 FIX 1: Deteksi otomatis pakai DB bot utama atau DB Jadibot
    const DB = this.db || global.db
    
    // 🔥 FIX 2: Kasih fallback objek kosong {} biar kebal dari error undefined
    let chat = DB.data.chats[m.chat] || {}
    let user = DB.data.users[m.sender] || {}
    
    let isBadword = badwordRegex.exec(m.text)
    console.log(isBadword)

    if (chat.antiBadword && isBadword) {
        // 🔥 FIX 3: Cegah user.warning jadi NaN kalau atributnya belum ada
        if (!user.warning) user.warning = 0
        
        user.warning += 1
        m.reply('Jangan Toxic ya!!\n' + `kamu memiliki ${user.warning} warning` + '\nUntuk mematikan ketik *.disable antibadword*')
        if (user.warning >= 5) {
            user.banned = false
            user.warning = 0
            if (m.isGroup) {
                if (isBotAdmin) {
                    this.groupParticipantsUpdate(m.chat, [m.sender], "remove")
                    //this.groupSettingChange(m.chat, GroupSettingChange.messageSend, false)
                }
            }
        }
    }
    return !0
}
