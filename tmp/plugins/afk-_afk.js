// 🔥 FIX 1: Ganti 'Let' jadi 'let'
let handler = m => m

// 🔥 FIX 2: Ganti arrow function (m =>) jadi function biasa biar 'this' bisa dibaca
handler.before = function (m) {
  
  // 🔥 FIX 3: Deteksi otomatis pakai DB bot utama atau DB Jadibot
  const DB = this.db || global.db
  
  let user = DB.data.users[m.sender]
  
  // 🔥 FIX 4: Mencegah crash kalau user belum terdaftar di database
  if (!user) return true

  if (user.afk > -1) {
    m.reply(`
Kamu berhenti AFK${user.afkReason ? ' setelah ' + user.afkReason : ''}
Selama ${(new Date - user.afk).toTimeString()}
`.trim())
    user.afk = -1
    user.afkReason = ''
  }
  
  let jids = [...new Set([...(m.mentionedJid || []), ...(m.quoted ? [m.quoted.sender] : [])])]
  for (let jid of jids) {
    let taggedUser = DB.data.users[jid]
    if (!taggedUser) continue
    
    let afkTime = taggedUser.afk
    if (!afkTime || afkTime < 0) continue
    
    let reason = taggedUser.afkReason || ''
    m.reply(`
Jangan tag dia!
Dia sedang AFK ${reason ? 'dengan alasan ' + reason : 'tanpa alasan'}
Selama ${(new Date - afkTime).toTimeString()}
`.trim())
  }
  return true
}

export default handler
