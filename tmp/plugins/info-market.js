/**
 ╔══════════════════════
      ⧉  [market] — [info]
╚══════════════════════

  ✺ Type     : Plugin ESM
  ✺ Source   : https://whatsapp.com/channel/0029VbAXhS26WaKugBLx4E05
  ✺ Creator  : SXZnightmare
  ✺ API     : https://zelapioffciall.koyeb.app
  ✺ Note    : .market (buat menampilkan top 1-10) .market 11 atau 250 (buat nunjukin posisi market dengan rank 11 itu apa sampe seterusnya)
*/

let handler = async (m, { conn, text }) => {
    try {
        await m.react('⏳')

        let res = await fetch("https://zelapioffciall.koyeb.app/live/market");
        if (!res.ok) throw new Error("Fetch failed");

        let json = await res.json();
        if (!json.status || !Array.isArray(json.data)) throw new Error("Invalid response");

        let data;

        if (!text) {
            data = json.data.slice(0, 10);
        } else {
            let rank = parseInt(text);
            if (isNaN(rank) || rank < 1)
                throw new Error("Invalid rank");

            data = json.data.filter(v => v.market_cap_rank === rank);
            if (!data.length) {
                await m.react('❌')
                return m.reply(`🍂 *Market rank #${rank} tidak ditemukan.*`);
            }
        }

        let output = `┌˚₊ ๑│ ᴇ ʀ ɪ ɴ ᴇ  ᴍ ᴅ │๑˚₊ 🎀
┇ 📈 › ᴄʀʏᴘᴛᴏ ᴍᴀʀᴋᴇᴛ
┇ 🌸 › sᴀꜰᴇ & ᴛʀᴜsᴛᴇᴅ ᴀssɪsᴛᴀɴᴛ
└˚₊ ๑ ᴜ ᴘ ᴅ ᴀ ᴛ ᴇ s ๑˚₊ 🍓

🌍 *Total Market:* ${json.total}\n\n`;

        for (let c of data) {
            let trend =
                c.price_change_percentage_24h > 0 ? "🟢" :
                c.price_change_percentage_24h < 0 ? "🔴" : "⚪";

            output += `┌˚ · ๑୧ #${c.market_cap_rank} ${c.name} (${c.symbol})\n`;
            output += `┇ 💰 ⁞ ʜᴀʀɢᴀ : $${c.current_price}\n`;
            output += `┇ ${trend} ⁞ 𝟸𝟺 ᴊᴀᴍ : ${c.price_change_percentage_24h.toFixed(2)}%\n`;
            output += `┇ 🏦 ⁞ ᴍᴀʀᴋᴇᴛ ᴄᴀᴘ : $${c.market_cap.toLocaleString()}\n`;
            output += `┇ 🔄 ⁞ ᴠᴏʟᴜᴍᴇ : $${c.total_volume.toLocaleString()}\n`;
            output += `┇ 📦 ⁞ sᴜᴘᴘʟʏ : ${c.circulating_supply.toLocaleString()}\n`;
            output += `└˚₊ ๑୧\n\n`;
        }

        output += `✨ *Update terakhir:* ${new Date(json.data[0].last_updated).toLocaleString()}\n`;
        output += `© ᴇʀɪɴᴇ ᴍᴅ x ᴊᴋᴛ𝟺𝟾 ᴠɪʙᴇ`;

        let wm = global.wm || "Erine System"
        let senderNumber = m.sender.split('@')[0]
        let fkontak = {
            key: {
                fromMe: false,
                participant: `0@s.whatsapp.net`
            },
            message: {
                contactMessage: {
                    displayName: wm,
                    vcard: `BEGIN:VCARD\nVERSION:3.0\nN:XL;${wm},;;;\nFN:${wm}\nitem1.TEL;waid=${senderNumber}:${senderNumber}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
                }
            }
        }

        await conn.sendMessage(
            m.chat,
            {
                image: { url: "https://files.cloudkuimages.guru/images/9f291dfe14a8.jpg" },
                caption: output,
                contextInfo: {
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterName: `「 🐣 ᴇʀɪɴᴇ-ᴍᴅ ɪɴғᴏʀᴍᴀᴛɪᴏɴ 🐣 」`,
                        newsletterJid: "120363400612665352@newsletter"
                    }
                }
            },
            { quoted: fkontak }
        );

        await m.react('✅')

    } catch (e) {
        console.error(e)
        await m.react('❌')
        await m.reply(`🍂 *Gagal mengambil data market crypto.*`);
    }
};

handler.help = ["market"];
handler.tags = ["info"];
handler.command = /^(market)$/i;
handler.limit = true;
handler.register = false; // true kan jika ada fitur register atau daftar di bot mu.

export default handler;
