// File: plugins/game-tebakonepiece_ans.js
const threshold = 0.72;

export async function before(m) {
    let id = m.chat;
    if (!m.quoted || !m.quoted.fromMe || !m.quoted.isBaileys || !m.text || !/TEBAK  ONE  PIECE/i.test(m.quoted.caption)) return !0;
    
    this.tebakonepiece = this.tebakonepiece ? this.tebakonepiece : {};
    if (!(id in this.tebakonepiece)) return m.reply('Soal itu telah berakhir');
    
    if (m.quoted.id == this.tebakonepiece[id][0].key.id) {
        let json = JSON.parse(JSON.stringify(this.tebakonepiece[id][1]));
        let isSurrender = /^((me)?nyerah|surr?ender)$/i.test(m.text);
        
        if (isSurrender) {
            clearTimeout(this.tebakonepiece[id][3]);
            delete this.tebakonepiece[id];
            return m.reply('Kamu menyerah!');
        }
        
        if (m.text.toLowerCase() === json) {
            global.db.data.users[m.sender].exp += this.tebakonepiece[id][2];
            m.reply(`✅ *BENAR!*\n\n🎁 +${this.tebakonepiece[id][2]} XP`);
            clearTimeout(this.tebakonepiece[id][3]);
            delete this.tebakonepiece[id];
        } else {
            m.reply('❌ *SALAH!*');
        }
    }
    return !0;
}