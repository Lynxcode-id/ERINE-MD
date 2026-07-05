/**
 * ╭───「 𝗙𝗘𝗔𝗧𝗨𝗥𝗘 𝗔𝗨𝗧𝗛𝗢𝗥 」───
 * │ 👤 Developer : INF Team's x Lynx Decode
 * ╰─────────────────────────
 * 📝 Plugin      : Fake Tweet Maker (Erine-MD)
 */

import { createCanvas, loadImage, GlobalFonts } from "@napi-rs/canvas";
import fs from "fs";

// Peringatan: Pastikan folder ./font dan file TTF-nya beneran ada di root direktori bot lu ya cuy!
try {
    GlobalFonts.registerFromPath("./font/Poppins-Regular.ttf", "Poppins");
    GlobalFonts.registerFromPath("./font/Poppins-SemiBold.ttf", "Poppins SemiBold");
} catch (e) {
    console.log("[FAKETWEET] Font Poppins tidak ditemukan, sistem akan menggunakan font default.");
}

// ==========================================
// CORE FUNGSI MURNI DARI LU (GAK DIUBAH)
// ==========================================
function wrapText(ctx, text, maxWidth) {
  const words = text.split(" ");
  const lines = [];

  let line = "";

  for (const word of words) {
    const testLine = line ? `${line} ${word}` : word;

    if (ctx.measureText(testLine).width > maxWidth) {
      if (line) lines.push(line);
      line = word;
    } else {
      line = testLine;
    }
  }

  if (line) lines.push(line);
  return lines;
}

function fitTweetFont(ctx, text, maxWidth, maxLines) {
  let size = 28;
  while (size >= 16) {
    ctx.font = `${size}px Poppins`;
    const lines = wrapText(
      ctx,
      text,
      maxWidth
    );

    if (lines.length <= maxLines) {
      return {
        size,
        lines
      };
    }
    size--;
  }

  ctx.font = `16px Poppins`;
  return {
    size: 16,
    lines: wrapText(
      ctx,
      text,
      maxWidth
    )
  };
}

async function faketweet(name, username, text, avatar) {
 const config = {
   ppbg: {
     x: 24,
     y: 136,
     size: 107
   },
   name: {
     x: 140,
     y: 180
   },
   username: {
     x: 140,
     y: 205
   },
   tweet: {
     x: 40,
     y: 290,
     width: 560
   }
};

  const template = "https://raw.githubusercontent.com/RIFKIror/Assest/refs/heads/main/img/fake-tweet1.jpg";
  const bg = await loadImage(template);
  const pp = await loadImage(avatar);
  const canvas = createCanvas(
    bg.width,
    bg.height
  );

  const ctx = canvas.getContext("2d");
  ctx.drawImage(bg, 0, 0);
  ctx.save();
  ctx.beginPath();
 ctx.arc(
  config.ppbg.x + config.ppbg.size / 2,
  config.ppbg.y + config.ppbg.size / 2,
  config.ppbg.size / 2,
  0,
  Math.PI * 2
);

  ctx.closePath();
  ctx.clip();
 ctx.drawImage(
  pp,
  config.ppbg.x,
  config.ppbg.y,
  config.ppbg.size,
  config.ppbg.size
);

ctx.restore();

  let nameSize = 26;
  ctx.font = `${nameSize}px Poppins SemiBold`;
  while (ctx.measureText(name).width > 380 && nameSize > 18) {
    nameSize--;

    ctx.font = `${nameSize}px Poppins SemiBold`;
  }

  ctx.fillStyle = "#000";
  ctx.fillText(
   name,
   config.name.x,
   config.name.y
 );

  ctx.font = "18px Poppins";
  ctx.fillStyle = "#657786";
  ctx.fillText(
    username.startsWith("@") ? username : `@${username}`,
    config.username.x,
    config.username.y
);

  const tweetWidth = config.tweet.width;
  const tweetFit =
    fitTweetFont(
      ctx,
      text,
      tweetWidth,
      8
    );

  ctx.font = `${tweetFit.size}px Poppins`;
  ctx.fillStyle ="#14171A";
  const lineHeight = tweetFit.size + 8;
  let y = config.tweet.y;

  for (const line of tweetFit.lines) {
    ctx.fillText(
      line,
      config.tweet.x,
      y
    );
    y += lineHeight;
  }
  return await canvas.encode("png");
}
// ==========================================

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        return m.reply(`┌˚₊ ๑│ ꜰ ᴀ ᴋ ᴇ  ᴛ ᴡ ᴇ ᴇ ᴛ │๑˚₊ 🐦\n┇ \n│ ❌ Masukkan teks untuk tweet-nya!\n│ \n│ *Contoh:*\n│ ${usedPrefix + command} Info mabar cuy!\n┇ \n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`);
    }

    await m.react('⏳');

    try {
        // Ambil nama dari pushName WA
        let name = m.pushName || "Erine User";
        // Ambil username dari nomor WA
        let username = `@${m.sender.split('@')[0]}`;
        
        // Ambil foto profil user. Kalau user ga masang PP, pake gambar default
        let avatar;
        try {
            avatar = await conn.profilePictureUrl(m.sender, 'image');
        } catch (e) {
            avatar = 'https://i.ibb.co/1s8T3sY/48f7ce63c7aa.jpg';
        }

        // Eksekusi fungsi lu
        let buffer = await faketweet(name, username, text, avatar);

        // Kirim hasilnya
        await conn.sendMessage(m.chat, {
            image: buffer,
            caption: `┌˚₊ ๑│ ꜰ ᴀ ᴋ ᴇ  ᴛ ᴡ ᴇ ᴇ ᴛ │๑˚₊ 🐦\n┇ \n│ ✅ Tweet berhasil dibuat!\n┇ \n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`
        }, { quoted: m });

        await m.react('✅');

    } catch (e) {
        console.error('[FAKETWEET ERROR]', e);
        await m.react('❌');
        m.reply(`┌˚₊ ๑│ s ʏ s ᴛ ᴇ ᴍ  ᴇ ʀ ʀ ᴏ ʀ │๑˚₊ ❌\n┇ Gagal membuat fake tweet:\n┇ ${e.message || "Internal Server Error"}\n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`);
    }
};

handler.help = ['faketweet2 <teks>'];
handler.tags = ['maker'];
handler.command = /^faketweet2$/i;
handler.limit = true;

export default handler;