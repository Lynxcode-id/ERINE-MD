// © INF PROJECT - Erine-MD
// Developed by INF PROJECT

let handler = async (m, { conn, args, usedPrefix, command }) => {
    // Inisialisasi daftar item yang legal untuk ditransfer
    const items = {
        money: '💰 Money',
        limit: '🔋 Limit',
        bank: '🏦 Bank',
        potion: '🥤 Potion',
        trash: '🗑 Trash',
        wood: '🪵 Wood',
        rock: '🪨 Rock',
        string: '🕸️ String',
        petFood: '🔖 Pet Food',
        emerald: '❇️ Emerald',
        diamond: '💎 Diamond',
        gold: '🪙 Gold',
        iron: '⛓️ Iron',
        common: '📦 Common',
        uncommon: '📦 Uncommon',
        mythic: '🎁 Mythic',
        legendary: '🗃️ Legendary',
        pet: '🔖 Pet',
        anggur: '🍇 Anggur',
        apel: '🍎 Apel',
        jeruk: '🍊 Jeruk',
        mangga: '🥭 Mangga',
        pisang: '🍌 Pisang',
        bibitanggur: '🌱 Bibit Anggur',
        bibitapel: '☘️ Bibit Apel',
        bibitjeruk: '🌿 Bibit Jeruk',
        bibitmangga: '🍀 Bibit Mangga',
        bibitpisang: '🌴 Bibit Pisang'
    };

    // 1. Cek jika tidak ada argumen
    if (!args[0]) {
        let listItems = Object.entries(items).map(([v, k]) => `│ ◦ ${v} (${k})`).join('\n')
        return m.reply(
            `乂  *T R A N S F E R  I T E M*\n\n` +
            `*Daftar Item:*\n${listItems}\n\n` +
            `📌 *Cara Pakai:*\n` +
            `> ${usedPrefix + command} <item> <jumlah> <@tag>\n\n` +
            `*Contoh:*\n` +
            `> ${usedPrefix + command} money 1000 @user`
        );
    }

    let item = args[0].toLowerCase();
    let amount = parseInt(args[1]);
    let mentionedUser = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : (args[2] ? args[2].replace(/[@ .+-]/g, '') + '@s.whatsapp.net' : '');

    // 2. Validasi Input
    if (!items[item]) return m.reply(`❌ Item *"${item}"* tidak tersedia untuk ditransfer.`);
    if (isNaN(amount) || amount <= 0) return m.reply('❌ Jumlah transfer harus berupa angka yang valid dan lebih dari 0.');
    if (!mentionedUser) return m.reply('⚠️ Tag atau masukkan nomor tujuan transfernya, Bang.');
    if (mentionedUser === m.sender) return m.reply('🤡 Masa mau transfer ke diri sendiri?');

    await m.react('⏳');

    // 3. Akses Database (Anti-Crash)
    let users = global.db.data.users;
    if (!users[m.sender]) users[m.sender] = {};
    if (!users[mentionedUser]) users[mentionedUser] = {};

    let senderData = users[m.sender];
    let receiverData = users[mentionedUser];

    // Pastikan properti item ada di user
    senderData[item] = senderData[item] ?? 0;
    receiverData[item] = receiverData[item] ?? 0;

    // 4. Cek Saldo/Jumlah Item
    if (senderData[item] < amount) {
        return m.reply(`⚠️ Kamu tidak memiliki cukup *${items[item]}* untuk ditransfer!\nSisa asetmu: *${senderData[item]}*`);
    }

    try {
        // 5. Eksekusi Transfer
        senderData[item] -= amount;
        receiverData[item] += amount;

        let caption = `乂  *T R A N S F E R  S U C C E S S*\n\n`
        caption += `┌  ◦ *Item:* ${items[item]}\n`
        caption += `│  ◦ *Jumlah:* ${amount.toLocaleString()}\n`
        caption += `│  ◦ *Dari:* @${m.sender.split('@')[0]}\n`
        caption += `└  ◦ *Ke:* @${mentionedUser.split('@')[0]}\n\n`
        caption += `> © INF PROJECT | JEMIMA-MD`

        await m.react('✅');
        conn.reply(m.chat, caption, m, {
            mentions: [m.sender, mentionedUser]
        });

    } catch (e) {
        console.error(e);
        m.reply('❌ Terjadi kesalahan saat memproses transfer.');
    }
}

handler.help = ['transfer <item> <jumlah> <@user>'];
handler.tags = ['rpg'];
handler.command = /^(tf|transfer)$/i;

export default handler;
