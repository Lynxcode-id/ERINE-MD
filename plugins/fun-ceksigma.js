/**
 * ╭───「 𝗙𝗘𝗔𝗧𝗨𝗥𝗘 𝗔𝗨𝗧𝗛𝗢𝗥 」───
 * │ 👤 Developer : Lynx Decode
 * ╰─────────────────────────
 * 📝 Plugin      : Cek Sigma Level (Fun)
 */

let handler = async (m, { conn, text, usedPrefix, command }) => {
    let target = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender;
    let name = await conn.getName(target);

    await m.react('🗿');

    let sigmaLevel = Math.floor(Math.random() * 101);
    let category = '';
    let quote = '';

    const quotesBeta = [
        "Sigma dari hongkong, lu mah katinggalan zaman cuy.",
        "Aura lu negatif cuy, mending cuci muka dulu pake air zamzam.",
        "Lu mah bukan sigma, tapi ligma.",
        "Kroco banget aura lu, mending push rank dulu sana.",
        "Yah elah, level segini mah mending jadi penonton aja dah.",
        "Sigma apaan, lu di-read doang sama cewek aja udah overthinking.",
        "Mending lu turu aja dah, ga bakat jadi mafia.",
        "Aura lu persis kayak botol yakult kosong, ga ada isinya.",
        "Boro-boro sigma, lu mah lebih mirip NPC tutorial.",
        "Nangis di pojokan aja mending, aura lu cupu maksimal!"
    ];

    const quotesMid = [
        "Lu mah NPC cuy, hidup lu cuma buat menuh-menuhin server bumi doang.",
        "Standar banget, nggak ada spesialnya. Ya gitu-gitu aja.",
        "Masih abu-abu cuy, kadang sok asik kadang cringe.",
        "Lumayan lah, seenggaknya lu nggak wibu-wibu amat (kayaknya).",
        "Aura sigma lu ketutup sama utang pinjol kayaknya.",
        "Masih butuh banyak asupan mewing cuy, rahang lu masih tumpul.",
        "Berusaha terlihat cool, padahal aslinya lawak.",
        "Aura lu setara dengan warga sipil biasa yang ga punya skill khusus.",
        "Masih mending lah, daripada aura beta yang di bawah lu.",
        "Agak laen emang, tapi yaudahlah lu masih dimaafkan alam semesta."
    ];

    const quotesHigh = [
        "Wih, aura sepuh mulai kerasa nih dari kejauhan.",
        "Boleh lah, gaya lu udah kayak mafia elit kelas kakap.",
        "Dikit lagi jadi sigma beneran, kurang-kurangin caper aja cuy.",
        "Gila, lu senyum aja cewek udah salting kayaknya.",
        "Rahang lu udah lumayan tajam nih hasil mewing 3 bulan non-stop.",
        "Keren cuy, pertahankan gaya misterius dan irit bicara lu itu.",
        "Aura lu udah mulai menakutkan bagi para kroco-kroco di grup ini.",
        "Mantap, lu udah bisa dianggep abang-abangan di tongkrongan.",
        "Lu jalan aja anginnya ngikutin gaya lu, respect suhu!",
        "Hampir sempurna! Tinggal beli jas hitam sama kacamata kuda."
    ];

    const quotesGod = [
        "ANJAY TOP G! Aura lu udah nembus stratosfer cuy!",
        "Ini dia sang Sigma sejati, Patrick Bateman nangis liat lu.",
        "Rizz lu udah level dewa, cewek mana yang nggak klepek-klepek liat lu.",
        "Suhu, ajarin gua cara mewing yang bener dong biar kek lu.",
        "Sigma Rizzler Skibidi Toilet Gyatt Ohio detected! Lu bossnya boss!",
        "Lu bernapas aja auranya udah bikin orang di grup ini sungkem massal.",
        "Fix lu main karakternya pake cheat coy, terlalu OP auranya!",
        "Thomas Shelby kalau ketemu lu pasti langsung nyeduhin kopi.",
        "Sempurna! Dunia ini sebenernya berpusat di lu doang cuy.",
        "Nggak ada obat! Sang penguasa bumi telah tiba, sungkem dulu 🫡"
    ];

    if (sigmaLevel <= 20) {
        category = "📉 *BETA / KROCO*";
        quote = quotesBeta[Math.floor(Math.random() * quotesBeta.length)];
    } else if (sigmaLevel <= 50) {
        category = "🗿 *NPC / MID*";
        quote = quotesMid[Math.floor(Math.random() * quotesMid.length)];
    } else if (sigmaLevel <= 80) {
        category = "😎 *SEPUH / WANNABE SIGMA*";
        quote = quotesHigh[Math.floor(Math.random() * quotesHigh.length)];
    } else {
        category = "🐺 *TRUE SIGMA / TOP G*";
        quote = quotesGod[Math.floor(Math.random() * quotesGod.length)];
    }

    let caption = `
🐺 *C E K  A U R A  S I G M A* 🐺

👤 *Target:* @${target.split('@')[0]}
📊 *Level Sigma:* ${sigmaLevel}%
🏷️ *Kategori:* ${category}

💬 *Komentar Erine:*
_"${quote}"_
`.trim();

    await conn.sendMessage(m.chat, { 
        text: caption, 
        contextInfo: { mentionedJid: [target] } 
    }, { quoted: m });
};

handler.help = ['ceksigma <@tag/reply>', 'sigma'];
handler.tags = ['fun'];
handler.command = /^(ceksigma|sigma|cekaura)$/i;
handler.group = false;

export default handler;