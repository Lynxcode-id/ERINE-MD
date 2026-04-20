import fetch from 'node-fetch'

let handler = async (m, { text, usedPrefix, command }) => {
    if (!text) {
        return m.reply(`Mau ngobrol apa cuy?\n\n*Contoh:* ${usedPrefix + command} pweh 🗿`)
    }

    await m.reply('Bentar cuy, Copilot (GPT-5) lagi mikir... 🗿')

    try {
        const baseUrl = 'https://api.lexcode.biz.id/api/ai/copilot'
        
        // 1. Setting bahasa Indo biar natural
        let promptText = `Tolong jawab menggunakan bahasa Indonesia yang santai dan natural. Pertanyaan/Pesan: ${text}`
        
        // 2. Setting model ke gpt-5 sesuai rikues lu
        let model = 'gpt-5'
        
        // 3. Hit API dengan parameter prompt dan model
        let res = await fetch(`${baseUrl}?prompt=${encodeURIComponent(promptText)}&model=${model}`)
        
        if (!res.ok) throw new Error('API down atau limit')
        
        let json = await res.json()

        // 4. Cek sukses dan ambil result.text (karena strukturnya beda sama Claude)
        if (!json.success || !json.result || !json.result.text) {
            return m.reply('Waduh, gagal dapet respon dari API Copilot-nya cuy.')
        }

        // 5. Ekstrak teks balasan
        let answer = json.result.text

        // 6. Kirim hasil
        m.reply(answer.trim())

    } catch (e) {
        console.error(e)
        m.reply('Error cuy! Servernya lagi ngambek atau API key-nya mokad 🗿')
    }
}

// Konfigurasi command
handler.help = ['copilot <teks>']
handler.tags = ['ai']
handler.command = /^(copilot|cp|gpt5)$/i // Bisa dipanggil pakai .copilot, .cp, atau .gpt5

handler.limit = true 

export default handler