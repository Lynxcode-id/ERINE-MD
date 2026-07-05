import fetch from 'node-fetch'

let handler = async (m, { text, usedPrefix, command }) => {
    if (!text) {
        return m.reply(`Mau ngobrol apa cuy?\n\n*Contoh:* ${usedPrefix + command} pweh 🗿`)
    }

    await m.reply('Bentar cuy, Copilot (GPT-5) lagi mikir... 🗿')

    try {
        const baseUrl = 'https://api.lexcode.biz.id/api/ai/copilot'
        let promptText = `Tolong jawab menggunakan bahasa Indonesia yang santai dan natural. Pertanyaan/Pesan: ${text}`
        let model = 'gpt-5'
        let res = await fetch(`${baseUrl}?prompt=${encodeURIComponent(promptText)}&model=${model}`)
        
        if (!res.ok) throw new Error('API down atau limit')
        
        let json = await res.json()
        if (!json.success || !json.result || !json.result.text) {
            return m.reply('Waduh, gagal dapet respon dari API Copilot-nya cuy.')
        }
        
        let answer = json.result.text
        m.reply(answer.trim())

    } catch (e) {
        console.error(e)
        m.reply('Error cuy! Servernya lagi ngambek atau API key-nya mokad 🗿')
    }
}

handler.help = ['copilot <teks>']
handler.tags = ['ai']
handler.command = /^(copilot|cp|gpt5)$/i

handler.limit = true 

export default handler