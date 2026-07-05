let handler = m => m;

handler.before = async function (m) {
    if (m.isGroup) {
        return;
    }

    const DB = this.db || global.db;
    let user = DB.data.users[m.sender];
    if (!user) return;

    if (user.banned === true) {
        let now = Date.now();
        if (!user.lastNotified || now - user.lastNotified > 86400000) {
            user.lastNotified = now;
            let banReason = user.banReason || 'No reason provided.';
            m.reply(`Sorry, your number has been blocked from using this bot.\n\nReason: ${banReason}`);
        }
        return;
    }
}

export default handler;
