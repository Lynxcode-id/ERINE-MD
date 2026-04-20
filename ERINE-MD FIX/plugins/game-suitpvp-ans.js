/*
wa.me/6282285357346
github: https://github.com/sadxzyq
Instagram: https://instagram.com/tulisan.ku.id
ini wm gw cok jan di hapus
*/

let handler = m => m

// 🔥 Hapus { conn } dari parameter, kita ambil dari 'this' biar aman buat main bot & Jadibot
handler.before = async function (m) {
  let conn = this // 🔥 Ini kuncinya!

  conn.suit = conn.suit ? conn.suit : {}
  if (global.db.data.users[m.sender].suit < 0) global.db.data.users[m.sender].suit = 0
  
  let room = Object.values(conn.suit).find(room => room.id && room.status && [room.p, room.p2].includes(m.sender))
  if (room) {
    let win = ''
    let tie = false
    if (m.sender == room.p2 && /^(acc(ept)?|terima|gas|oke?|tolak|gamau|nanti|ga(k.)?bisa)/i.test(m.text) && m.isGroup && room.status == 'wait') {
      if (/^(tolak|gamau|nanti|ga(k.)?bisa)/i.test(m.text)) {
        conn.reply(m.chat, `@${room.p2.split`@`[0]} menolak suit, suit dibatalkan`, m)
        delete conn.suit[room.id]
        return !0
      }
      room.status = 'play'
      room.asal = m.chat
      clearTimeout(room.waktu)
      
      m.reply(`Suit telah dikirimkan ke chat
@${room.p.split`@`[0]} dan 
@${room.p2.split`@`[0]}

Silahkan pilih suit di chat masing"
klik wa.me/${conn.user.jid.split`@`[0]}`, m.chat, {
        contextInfo: {
          mentionedJid: [room.p, room.p2]
        }
      })

      if (!room.pilih) conn.send3But(room.p, 'Silahkan pilih', `Menang +${room.poin}XP\nKalah -${room.poin_lose}XP`, 'Batu🗿', 'Batu', 'Kertas📄', 'Kertas', 'Gunting✂️', 'Gunting', m)
      if (!room.pilih2) conn.send3But(room.p2, 'Silahkan pilih', `Menang +${room.poin}XP\nKalah -${room.poin_lose}XP`, 'Batu🗿', 'Batu', 'Kertas📄', 'Kertas', 'Gunting✂️', 'Gunting', m)
      
      room.waktu_milih = setTimeout(() => {
        if (!room.pilih && !room.pilih2) conn.reply(m.chat, `Kedua pemain tidak niat main,\nSuit dibatalkan`)
        else if (!room.pilih || !room.pilih2) {
          win = !room.pilih ? room.p2 : room.p
          conn.reply(m.chat, `@${(room.pilih ? room.p2 : room.p).split`@`[0]} tidak memilih suit, game berakhir`, m)
          global.db.data.users[win == room.p ? room.p : room.p2].exp += room.poin
          global.db.data.users[win == room.p ? room.p2 : room.p].exp -= room.poin_lose
        }
        delete conn.suit[room.id]
        return !0
      }, room.timeout)
    }
    
    let jwb = m.sender == room.p
    let jwb2 = m.sender == room.p2
    let g = /gunting/i
    let b = /batu/i
    let k = /kertas/i
    let reg = /^(gunting|batu|kertas)/i
    
    if (jwb && reg.test(m.text) && !room.pilih && !m.isGroup) {
      room.pilih = reg.exec(m.text.toLowerCase())[0]
      room.text = m.text
      m.reply(`Kamu telah memilih ${m.text} ${!room.pilih2 ? `\n\nMenunggu lawan memilih` : ''}`)
      if (!room.pilih2) conn.reply(room.p2, '_Lawan sudah memilih_\nSekarang giliran kamu', 0)
    }
    
    if (jwb2 && reg.test(m.text) && !room.pilih2 && !m.isGroup) {
      room.pilih2 = reg.exec(m.text.toLowerCase())[0]
      room.text2 = m.text
      m.reply(`Kamu telah memilih ${m.text} ${!room.pilih ? `\n\nMenunggu lawan memilih` : ''}`)
      if (!room.pilih) conn.reply(room.p, '_Lawan sudah memilih_\nSekarang giliran kamu', 0)
    }
    
    let stage = room.pilih
    let stage2 = room.pilih2
    
    if (room.pilih && room.pilih2) {
      clearTimeout(room.waktu_milih)
      if (b.test(stage) && g.test(stage2)) win = room.p
      else if (b.test(stage) && k.test(stage2)) win = room.p2
      else if (g.test(stage) && k.test(stage2)) win = room.p
      else if (g.test(stage) && b.test(stage2)) win = room.p2
      else if (k.test(stage) && b.test(stage2)) win = room.p
      else if (k.test(stage) && g.test(stage2)) win = room.p2
      else if (stage == stage2) tie = true
      
      conn.reply(room.asal, `
_*Hasil Suit*_${tie ? '\nSERI' : ''}

@${room.p.split`@`[0]} (${room.text}) ${tie ? '' : room.p == win ? ` Menang \n+${room.poin}XP` : ` Kalah \n-${room.poin_lose}XP`}
@${room.p2.split`@`[0]} (${room.text2}) ${tie ? '' : room.p2 == win ? ` Menang \n+${room.poin}XP` : ` Kalah \n-${room.poin_lose}XP`}
`.trim(), m, { contextInfo: { mentionedJid: [room.p, room.p2] } })
      
      if (!tie) {
        global.db.data.users[win == room.p ? room.p : room.p2].exp += room.poin
        global.db.data.users[win == room.p ? room.p2 : room.p].exp += room.poin_lose
      }
      delete conn.suit[room.id]
    }
  }
  return !0
}

handler.exp = 0
export default handler

function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}