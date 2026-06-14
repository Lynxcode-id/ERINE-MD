/*
📌 Nama Fitur: Info Gempa
🏷️ Type : Plugin ESM
🔗 Sumber :  https://whatsapp.com/channel/0029Vb91Rbi2phHGLOfyPd3N
🔗 Api : https://api.siputzx.my.id/api/info/bmkg
✍️ Convert By ZenzXD & Remake by Erine-MD
*/

import fetch from 'node-fetch';

let handler = async (m, { conn }) => {
  try {
    await m.react('⏳')

    let res = await fetch('https://api.siputzx.my.id/api/info/bmkg');
    if (!res.ok) throw 'Gagal mengambil data dari API.';
    
    let json = await res.json();
    if (!json.status) throw 'Data tidak ditemukan.';

    const gempa = json.data.auto.Infogempa.gempa;

    let teks = `┌˚₊ ๑│ ᴇ ʀ ɪ ɴ ᴇ  ᴍ ᴅ │๑˚₊ 🎀
┇ 🌍 › ɪɴꜰᴏ ɢᴇᴍᴘᴀ ʙᴍᴋɢ
┇ 🌸 › sᴀꜰᴇ & ᴛʀᴜsᴛᴇᴅ ᴀssɪsᴛᴀɴᴛ
└˚₊ ๑ ᴅ ᴇ ᴛ ᴀ ɪ ʟ s ๑˚₊ 🍓

┌˚ · ๑୧ ᴅ ᴀ ᴛ ᴀ
┇ 📅 ⁞ ᴛᴀɴɢɢᴀʟ : ${gempa.Tanggal}
┇ ⏰ ⁞ ᴊᴀᴍ : ${gempa.Jam}
┇ 💥 ⁞ ᴍᴀɢɴɪᴛᴜᴅᴏ : ${gempa.Magnitude}
┇ 🌊 ⁞ ᴋᴇᴅᴀʟᴀᴍᴀɴ : ${gempa.Kedalaman}
┇ 📍 ⁞ ʟᴏᴋᴀsɪ : ${gempa.Wilayah}
┇ 🗺️ ⁞ ᴋᴏᴏʀᴅɪɴᴀᴛ : ${gempa.Lintang}, ${gempa.Bujur}
└˚₊ ๑୧

📝 ⁞ ᴘᴏᴛᴇɴsɪ :
${gempa.Potensi}

⚠️ ⁞ ᴅɪʀᴀsᴀᴋᴀɴ :
${gempa.Dirasakan || 'Tidak ada data'}

© ᴇʀɪɴᴇ ᴍᴅ x ᴊᴋᴛ𝟺𝟾 ᴠɪʙᴇ`.trim();

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

    await conn.sendMessage(m.chat, {
      image: { url: `https://data.bmkg.go.id/DataMKG/TEWS/${gempa.Shakemap}` },
      caption: teks,
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterName: `「 🐣 ᴇʀɪɴᴇ-ᴍᴅ ɪɴғᴏʀᴍᴀᴛɪᴏɴ 🐣 」`,
            newsletterJid: "120363400612665352@newsletter"
        }
      }
    }, { quoted: fkontak });

    await m.react('✅')

  } catch (e) {
    console.error(e)
    await m.react('❌')
    m.reply(`❌ *Error:* ${e.message || e}`)
  }
};

handler.command = ['infogempa'];
handler.tags = ['info'];
handler.help = ['infogempa'];
handler.limit = true;

export default handler;
