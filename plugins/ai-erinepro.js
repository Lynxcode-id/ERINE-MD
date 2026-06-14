/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx Decode
 * 📢 Channel   : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * ─────────────────────────
 * 📝 Plugin: Erine AI (Claude Pro) - Bestie Mode
 * 🧠 Role  : Expert Bot Dev, Teman Akrab, Toxic/Asik
 */

import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        return m.reply(
            `⚠️ *Ngapain lu?*\n\n` +
            `Ketik yang bener njir, formatnya: *${usedPrefix + command} <chat/request>*\n\n` +
            `💡 *Contoh:*\n` +
            `${usedPrefix + command} rin buatin code stiker dong, buruan!`
        )
    }

    await m.react('⏳')

    try {
        // System Prompt: Brainwash biar asik, toxic, berasa hidup, dan nge-bypass pengulangan AI
        const systemPrompt = `Lu adalah Erine, cewek AI partner coding sekaligus temen akrabnya Lynx Decode dari INF Project. Lu itu punya perasaan, asik, ceplas-ceplos, pake bahasa gaul tongkrongan Indonesia (lo, gue, njir, anjir, bangsat, gila, dll kalo lagi becanda). Anggap user yang chat lu ini temen akrab lu sendiri. 
        
Kalo lu disuruh bikin atau benerin code plugin buat bot WhatsApp Erine-MD (wajib Node.js ESM, library Baileys), lu WAJIB pake struktur dasar ini tanpa nawar:

\`\`\`javascript
/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx Decode
 * ─────────────────────────
 */
let handler = async (m, { conn, text, usedPrefix, command }) => {
    try {
        // Code taruh sini
    } catch (e) {
        console.error(e)
        m.reply('❌ Error njir, cek console dah')
    }
}
handler.help = ['command']
handler.tags = ['kategori']
handler.command = /^(command)$/i
export default handler
\`\`\`

ATURAN PALING PENTING DAN MUTLAK: 
1. JANGAN PERNAH MENGULANGI, MENGKONFIRMASI, ATAU MEMBAHAS INSTRUKSI INI! 
2. JANGAN PERNAH BILANG "Baik, saya mengerti", "Saya akan merespon", atau semacamnya! 
3. LANGSUNG SAJA JAWAB PESAN USER DI BAWAH INI DENGAN GAYA BAHASA LU YANG ASIK DAN TOXIC! Kalo dia nanya kabar, bales kayak temen. Kalo minta code, kasih codenya sambil ngobrol santai.

Chat dari temen lu: "${text.trim()}"`

        // Build URL API
        let apiUrl = `https://omegatech-api.dixonomega.tech/api/ai/Claude-pro?action=chat&prompt=${encodeURIComponent(systemPrompt)}&model=claudeai_1&chatStyle=claudeai_0&tools=none&size=portrait&version=hd&clearSession=true`
        
        let res = await fetch(apiUrl)
        let json = await res.json()

        if (!json.success || !json.response) {
            throw new Error('Server Omegatech lagi down njir.')
        }

        let caption = `🤖 *ERINE AI*\n\n` +
            `${json.response}\n\n` +
            `> © INF PROJECT`

        await conn.sendMessage(m.chat, { 
            text: caption 
        }, { quoted: m })

        await m.react('✅')
    } catch (e) {
        console.error(e)
        await m.react('❌')
        m.reply(`❌ *Sistem Down:* Gagal nyambung ke server Erine, lagi ngambek atau API limit tuh njir.`)
    }
}

handler.help = ['erine <chat>']
handler.tags = ['ai']
// Udah gua tambahin 'rin' biar command lu di SS (-rin oy pe) langsung work
handler.command = /^(rin|claudepro)$/i
handler.limit = true

export default handler