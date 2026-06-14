let handler = m => m

handler.before = async function (m) {
    // 🔥 FIX 1: Deteksi otomatis pakai DB bot utama atau DB Jadibot
    const DB = this.db || global.db
    
    let user = DB.data.users[m.sender]
    
    // 🔥 FIX 2: Mencegah crash kalau user belum terdaftar di database
    if (!user) return

    if (user.role === 'Premium user' && user.premiumTime < Date.now()) {
        user.role = 'Free user'
        user.premiumTime = 0
        user.premium = false
    }
}

export default handler
