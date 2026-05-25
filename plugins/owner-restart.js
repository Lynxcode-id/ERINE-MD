let handler = async (m, { conn }) => {
    if (!process.send) throw '❌ Jalankan bot menggunakan node index.js, bukan node main.js!'
    
    if (global.conn.user.jid == conn.user.jid) {
        await m.reply('⚙️ *SYSTEM RESET INITIATED (SIGKILL)*\n\n_Mematikan proses lama dan menghidupkan ulang sistem..._');
        process.send('reset');
    } else {
        throw '_Hanya bot utama yang bisa direstart dari command ini cuy!_'
    }
}

handler.help = ['restart']
handler.tags = ['owner']
handler.command = /^(res(tart)?|reboot)$/i
handler.rowner = true

export default handler;
