let handler = m => m;

handler.before = async function (m) {
    // Check if the message is sent in a group
    if (m.isGroup) {
        // Ignore messages in groups
        return;
    }

    // 🔥 FIX 1: Deteksi otomatis pakai DB bot utama atau DB Jadibot
    const DB = this.db || global.db;

    // Check if the user is banned
    let user = DB.data.users[m.sender];
    
    // 🔥 FIX 2: Mencegah crash kalau user belum terdaftar di database
    if (!user) return;

    if (user.banned === true) {
        // Get the current timestamp
        let now = Date.now();
        // Check if the user has been notified in the last 24 hours (86400000 milliseconds)
        if (!user.lastNotified || now - user.lastNotified > 86400000) {
            // Update the last notified timestamp
            user.lastNotified = now;
            let banReason = user.banReason || 'No reason provided.';
            m.reply(`Sorry, your number has been blocked from using this bot.\n\nReason: ${banReason}`);
        }
        return;
    }
}

export default handler;
