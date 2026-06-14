/*
wa.me/6282285357346
github: https://github.com/sadxzyq
Instagram: https://instagram.com/tulisan.ku.id
ini wm gw cok jan di hapus
*/

let handler = m => m

handler.all = async function (m) {
    // 🔥 FIX 1: Deteksi otomatis pakai DB bot utama atau DB Jadibot
    const DB = this.db || global.db
    
    let user = DB.data.users[m.sender]
    
    // 🔥 FIX 2: Kalau datanya belum kerender di database, skip dulu biar ga crash
    if (!user) return

    if ((user.money * 1) > 999999999999999999) {
        user.money = 999999999999999999
    } else if ((user.money * 1) < 0) {
        user.money = 0
    }
    if ((user.health * 1) > 100000) {
        user.health = 100000
    } else if ((user.health * 1) < 0) {
        user.health = 0
    }
    if ((user.exp * 1) > 999999999999999999999999999) {
         user.exp = 999999999999999999999999999
    } else if ((user.exp * 1) < 0) {
         user.exp = 0
    }
    if ((user.limit * 1) > 999999999999999999) {
         user.limit = 999999999999999999
    } else if ((user.limit * 1) < 0) {
         user.limit = 0
    }
    if ((user.bank * 1) > 999999999999999999) {
         user.bank = 999999999999999999
    } else if ((user.bank * 1) < 0) {
         user.bank = 0
    }
}
export default handler
