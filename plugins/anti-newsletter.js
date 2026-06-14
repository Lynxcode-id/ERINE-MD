/** * ───「 INFO OWNER & COMMUNITY 」───✧
 * 👤 Author  : LYNX DECODE
 * 📝 Note    : Anti-Spam Channel with Whitelist
 * ────────────────────────✧
 */

const allowedChannels = [
    '120363400612665352@newsletter', // INF PROJECT / LYNX
    '120363426757759585@newsletter', 
    '120363422358946360@newsletter', 
    '120363404569528126@newsletter'  
];

let handler = m => m

handler.before = async function (m, { conn }) {
    // Cek apakah m.chat adalah saluran
    if (m.chat && m.chat.endsWith('@newsletter')) {
        
        // Loloskan kalau masuk whitelist
        if (allowedChannels.includes(m.chat)) return;

        console.log(`[ANTI-NEWSLETTER] Mendeteksi bot terseret ke saluran ilegal: ${m.chat}`);
        try {
            await conn.newsletterUnfollow(m.chat);
            console.log(`[ANTI-NEWSLETTER] ✅ Berhasil menendang saluran gaje: ${m.chat}`);
        } catch (e) {
            console.log(`[ANTI-NEWSLETTER] ❌ Gagal auto-unfollow saluran: ${e}`);
        }
    }
}

export default handler;
