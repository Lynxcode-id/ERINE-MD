// © INF PROJECT - Jemima-MD
// Developed by INF PROJECT

import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `⚠️ *Mau nanya apa cuy?*\n\n💡 Contoh penggunaan:\n*${usedPrefix + command}* cara membuat kopi yang enak`

  await m.react('⏳')

  try {
    const res = await fetch("https://api.rhnx.xyz/api/ai/chatGPT", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "question": text,
        "apikey": "rhnx_lnF2qvam3"
      })
    })

    const data = await res.json()

    // Sesuai respon JSON yang lu kasih: data.data.answer
    if (!data.status || !data.data || !data.data.answer) {
        throw new Error('Jawaban kosong atau format API berubah.')
    }

    await m.reply(data.data.answer)
    await m.react('✅')

  } catch (err) {
    console.error('ChatGPT Error:', err.message)
    await m.react('❌')
    m.reply(`❌ Maaf cuy, sistem AI sedang bermasalah.\n\n💡 Error: ${err.message}`)
  }
}

handler.help = ['ai <pertanyaan>']
handler.tags = ['ai']
handler.command = /^(ai|chatgpt|gpt)$/i 
handler.limit = true 

export default handler