// © INF PROJECT - Erine-MD
// Developed by INF PROJECT

let handler = async (m, { conn, text, participants, usedPrefix, command }) => {
  if (!text) throw `⚠️ Masukkan nomor yang ingin ditambahkan!\n\n📌 Contoh:\n${usedPrefix + command} 628xxxx`

  await m.react('⏳')

  // Ambil nomor yang diketik user
  let input = text.split(',')
    .map(v => v.replace(/[^0-9]/g, ''))
    .filter(v => v.length > 4 && v.length < 20)

  if (input.length === 0) {
    await m.react('❌')
    return m.reply('❌ Nomor tidak valid.')
  }

  // Filter biar gak nambahin orang yang udah ada di grup
  let _participants = participants.map(user => user.id)
  let usersToInvite = []

  for (let num of input) {
    let jid = num + '@s.whatsapp.net'
    // Cek apakah nomor tersebut terdaftar di WhatsApp
    let onWa = await conn.onWhatsApp(jid)
    if (onWa[0]?.exists && !_participants.includes(jid)) {
      usersToInvite.push(jid)
    }
  }

  if (usersToInvite.length === 0) {
    await m.react('❌')
    return m.reply('❌ Nomor tidak terdaftar di WhatsApp atau sudah ada di dalam grup.')
  }

  let successCount = 0
  let failedCount = 0
  let inviteList = []

  // Eksekusi penambahan member pakai fungsi NATIVE Baileys (Lebih Aman)
  for (let jid of usersToInvite) {
    try {
      const response = await conn.groupParticipantsUpdate(m.chat, [jid], 'add')
      
      // Cek respon dari WA, apakah berhasil ditambahkan atau kena limit/privasi
      let status = response[0]?.status
      
      if (status === '403') {
        // Status 403 = Privasi user tidak mengizinkan ditambahkan langsung, harus via link invite
        inviteList.push(jid)
      } else if (status === '408') {
        // Status 408 = User baru saja keluar/kick dari grup, gak bisa dimasukin lagi
        await conn.reply(m.chat, `⚠️ Tidak dapat menambahkan @${jid.split('@')[0]} karena dia baru saja keluar atau di-kick dari grup ini.`, m, { mentions: [jid] })
        failedCount++
      } else if (status === '200' || !status) { // 200 atau tanpa status biasanya berhasil
        successCount++
      }
    } catch (e) {
      console.error(`Gagal menambahkan ${jid}:`, e)
      failedCount++
    }
  }

  // Jika ada member yang privasinya nutup (Status 403), kirim link undangan
  if (inviteList.length > 0) {
    let txt = `📨 Mengundang ${inviteList.length} pengguna menggunakan link undangan karena privasi akun mereka...\n\n`
    for (let jid of inviteList) {
        txt += `• @${jid.split('@')[0]}\n`
    }
    await m.reply(txt, null, { mentions: inviteList })

    // Bikin link invite grup
    try {
        let code = await conn.groupInviteCode(m.chat)
        let link = `https://chat.whatsapp.com/${code}`
        
        for (let jid of inviteList) {
             await conn.sendMessage(jid, { 
                text: `Halo!\nKamu diundang untuk bergabung ke grup *${await conn.getName(m.chat)}*.\n\nKlik link di bawah untuk bergabung:\n${link}` 
             })
        }
        successCount += inviteList.length
    } catch (e) {
        console.log("Gagal bikin/kirim link invite:", e)
    }
  }

  await m.react('✅')
  m.reply(`🎯 *Selesai!*\n\n✔️ Berhasil diproses: ${successCount}\n❌ Gagal: ${failedCount}`)
}

handler.help = ['add', '+'].map(v => v + ' <nomor>')
handler.tags = ['group']
handler.command = /^(add|\+)$/i
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler