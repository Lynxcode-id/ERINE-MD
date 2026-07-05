const channels = {}; 

const handler = async (m, { conn, text, command }) => {
  const user = m.sender;
  
  let wm = global.wm || "Erine System";
  let senderNumber = m.sender.split('@')[0];
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
  };

  const contextErine = {
      forwardingScore: 999,
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
          newsletterName: `「 🐣 ᴇʀɪɴᴇ-ᴍᴅ ɪɴғᴏʀᴍᴀᴛɪᴏɴ 🐣 」`,
          newsletterJid: "120363400612665352@newsletter"
      }
  };

  // Helper biar gampang ngirim respon ke user dengan style Erine
  const replyErine = async (teks) => {
      return await conn.sendMessage(m.chat, {
          text: teks,
          contextInfo: contextErine
      }, { quoted: fkontak });
  };

  if (command === "setchid") {
    if (!text) return await replyErine("Gunakan: .setchid <id channel>");
    channels[user] = [text];
    return await replyErine(`ID channel berhasil disimpan: ${text}`);
  }

  if (command === "addchid") {
    if (!text) return await replyErine("Gunakan: .addchid <id channel>");
    if (!channels[user]) channels[user] = [];
    if (!channels[user].includes(text)) {
      channels[user].push(text);
      return await replyErine(`ID channel berhasil ditambahkan: ${text}`);
    } else {
      return await replyErine("ID channel sudah ada dalam daftar.");
    }
  }

  if (command === "getchid") {
    const chidList = channels[user];
    return await replyErine(chidList ? `ID channel Anda:\n${chidList.join("\n")}` : "Belum ada ID channel yang disimpan.");
  }

  const chidList = channels[user];
  if (!chidList || chidList.length === 0) return await replyErine("Set dulu ID channel dengan .setchid atau .addchid");

  if (!text && !m.quoted) return await replyErine("Masukkan teks atau reply media dengan teks");

  let messageOptions = {};

  if (m.quoted && m.quoted.mimetype) {
    let mime = m.quoted.mimetype;

    if (/image/.test(mime)) {
      messageOptions = {
        image: await m.quoted.download(),
        caption: text || m.quoted.text || ""
      };
    } else if (/video/.test(mime)) {
      messageOptions = {
        video: await m.quoted.download(),
        caption: text || m.quoted.text || "",
        mimetype: mime
      };
    } else if (/audio/.test(mime)) {
      messageOptions = {
        audio: await m.quoted.download(),
        mimetype: "audio/mp4",
        fileName: "audio.mp3",
        ptt: true,
        contextInfo: {
          forwardingScore: 1,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: chidList[0], 
            serverMessageId: null,
            newsletterName: "ᴇʀɪɴᴇ-ᴍᴅ",
          }
        }
      };
    } else if (/sticker/.test(mime)) {
      messageOptions = {
        sticker: await m.quoted.download()
      };
    }
  } else {
    messageOptions = { text: text };
  }

  for (const chid of chidList) {
    await conn.sendMessage(chid, messageOptions);
  }

  await replyErine("✅ Pesan berhasil dikirim ke semua channel.");
};

handler.command = ["upch", "setchid", "addchid", "getchid"];
handler.tags = ["owner"];
handler.owner = true;

export default handler;
