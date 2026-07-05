/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Author     :  Lynx Decode
 * 📞 Contact    : +62 882-5804-1396
 * 📢 Channel    : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * ⚠️ Note       : Keep credit to respect the creator!
 * ─────────────────────────
 * 📝 Plugin     : Papayang Image
 */

let handler = async (m, { conn }) => {
    await m.react("⏳");

    try {
        let imageUrl = `https://api.kyzzz.eu.cc/api/image/papayang?apikey=kyzz7847824970484`;
        
        await conn.sendMessage(m.chat, { 
            image: { url: imageUrl }, 
            caption: "✨ *PAPAYANG IMAGE*" 
        }, { quoted: m });
        
        await m.react("✅");
    } catch (e) {
        await m.react("❌");
        m.reply(`❌ Gagal: ${e.message}`);
    }
}

handler.help = ['papayang'];
handler.tags = ['random'];
handler.command = /^papayang$/i;
handler.limit = true;

export default handler;