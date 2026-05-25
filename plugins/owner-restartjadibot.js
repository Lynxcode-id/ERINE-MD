/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx Decode
 * 📞 WhatsApp  : +62 882-5804-1396
 * 📢 Channel   : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * ⚠️ Note      : Keep credit to respect the creator!
 * ─────────────────────────
 */

let handler = async (m, { conn }) => {
    if (!conn.isJadibot) {
        return m.reply('❌ Command ini khusus untuk session Jadibot (Sub-bot)! Untuk bot utama, gunakan command *.restart*');
    }

    await m.reply('⚙️ *JADIBOT RESTART INITIATED*\n\n_Memutuskan koneksi dan menyambungkan ulang session jadibot..._');
    
    conn.ws.close();
}

handler.help = ['restartjadibot'];
handler.tags = ['jadibot'];
handler.command = /^(resbot|restartbot|restartjadibot)$/i;
handler.owner = true;

export default handler;
