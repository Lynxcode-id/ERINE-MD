/*
📌 Nama Fitur: Kudeta group
🏷️ Type : Plugin ESM
🔗 Sumber : https://whatsapp.com/channel/0029VbB7ffQGk1Fm9QDRsq3e
✍️ Convert By ZenzXD
*/

let sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

let handler = async (m, { conn, participants }) => {
  const resolveJid = (jid = '') => {
    jid = String(jid || '')
    if (!jid) return ''
    jid = typeof conn?.decodeJid === 'function' ? conn.decodeJid(jid) : (jid.decodeJid?.() || jid)
    if (jid.endsWith('@lid') && typeof conn?.getJid === 'function') {
      const resolved = conn.getJid(jid)
      if (resolved && !resolved.endsWith('@lid')) jid = resolved
    }
    if (/^\d+$/.test(jid)) jid = `${jid}@s.whatsapp.net`
    return jid
  }

  const botNumber = resolveJid(conn.user?.jid || conn.user?.id || '')
  const senderNumber = resolveJid(m.sender)

  let adminFilter = (participants || [])
    .filter(v => v.admin && ![botNumber, senderNumber].some(x => x && resolveJid(v.id || v.jid || v.lid) === x))
    .map(v => resolveJid(v.id || v.jid || v.lid))
    .filter(Boolean)

  if (adminFilter.length < 1)
    return m.reply('Gaada atmin yang mau di kick')

  await m.reply(`Kudeta Grup akan di mulai BERSIAPLAH 🔥🔥🔥`)

  for (let i of adminFilter) {
    await conn.groupParticipantsUpdate(m.chat, [i], 'remove').catch(err => {
      console.log(`Gagal mengeluarkan ${i}:`, err)
    })
    await sleep(1000)
  }

  await m.reply("Kudeta group berhasil 🔥👑")
};

handler.help = ["kudeta", "kudetagc"];
handler.tags = ["group"];
handler.command = /^kudeta(gc)?$/i;
handler.group = true;
handler.owner = true;
handler.botAdmin = true;

export default handler