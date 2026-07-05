/*
✦ Nama Plugin: ttchat
✦ Tipe: Plugin Esm
✦ Author: kyzz masih pemula 
✦ channel:  https://whatsapp.com/channel/0029Vb7gcbuLdQelWzrTzD3D
✦ Creator canvas  : Ditzzx, Rin
✦ Source canvas  : https://whatsapp.com/channel/0029VbCHRSDAzNboLatr0W0o/441
✦ manfaat: 
✦ Note: jangan hapus wm 
*/
import { createCanvas, loadImage, GlobalFonts } from '@napi-rs/canvas';
import { writeFile, mkdir, unlink } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import https from 'node:https';
import http from 'node:http';

const ASSETS_DIR = join(process.cwd(), 'assets', 'ttqc');
const FONTS_DIR = join(ASSETS_DIR, 'fonts');
const TEMPLATE_PATH = join(ASSETS_DIR, 'template.png');
const TEMPLATE_URL = 'https://raw.githubusercontent.com/Ditzzx-vibecoder/Assets/main/ttqc/qyzwa.png';
const TMP_DIR = join(process.cwd(), 'tmp');
const DEFAULT_AVATAR = 'https://raw.githubusercontent.com/Ditzzx-vibecoder/Assets/6b71d84a580f385bd7ee36402df5341ead4770a0/Image/artworks-gWLRE6HyPH3DgVMG-ZFFxtg-t500x500.jpg';

const FONT_ASSETS = [
  { name: 'PlusJakartaSans-Regular', file: 'PlusJakartaSans-Regular.ttf', url: 'https://raw.githubusercontent.com/Ditzzx-vibecoder/Assets/main/ttqc/PlusJakartaSans-Regular.ttf', family: 'Plus Jakarta Sans' },
  { name: 'PlusJakartaSans-Medium', file: 'PlusJakartaSans-Medium.ttf', url: 'https://raw.githubusercontent.com/Ditzzx-vibecoder/Assets/main/ttqc/PlusJakartaSans-Medium.ttf', family: 'Plus Jakarta Sans' },
  { name: 'PlusJakartaSans-Bold', file: 'PlusJakartaSans-Bold.ttf', url: 'https://raw.githubusercontent.com/Ditzzx-vibecoder/Assets/main/ttqc/PlusJakartaSans-Bold.ttf', family: 'Plus Jakarta Sans' },
  { name: 'FontAwesome-Solid', file: 'fa-solid-900.ttf', url: 'https://raw.githubusercontent.com/Ditzzx-vibecoder/Assets/main/ttqc/fa-solid-900.ttf', family: 'Font Awesome 6 Free' },
  { name: 'NotoColorEmoji', file: 'NotoColorEmoji.ttf', url: 'https://github.com/googlefonts/noto-emoji/raw/main/fonts/NotoColorEmoji.ttf', family: 'Noto Color Emoji' },
];

const MENU_ICONS = [
  { unicode: '\uf3e5', text: 'Balas', color: '#000000' },
  { unicode: '\uf064', text: 'Teruskan', color: '#000000' },
  { unicode: '\uf0c5', text: 'Salin', color: '#000000' },
  { unicode: '\uf1ab', text: 'Terjemahkan', color: '#000000' },
  { unicode: '\uf2ed', text: 'Hapus untuk saya', color: '#000000' },
  { unicode: '\uf024', text: 'Laporkan', color: '#ea4335' },
];

const config = {
  topPPX: 183, topPPY: 83, topPPRadius: 42,
  topNameX: 250, topNameY: 82, topNameSize: 34,
  chatPPX: 75, chatPPRadius: 38,
  textX: 175, textY: 962,
  bubbleWidth: 520, textSize: 30,
  bubbleBgColor: '#ffffff', textColor: '#161823',
};

function fetchBuffer(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return fetchBuffer(res.headers.location).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode} → ${url}`));
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    }).on('error', reject);
  });
}

let assetsReady = false;

async function ensureAssets() {
  if (assetsReady) return;
  await mkdir(FONTS_DIR, { recursive: true });

  if (!existsSync(TEMPLATE_PATH)) {
    await writeFile(TEMPLATE_PATH, await fetchBuffer(TEMPLATE_URL));
  }

  for (const font of FONT_ASSETS) {
    const dest = join(FONTS_DIR, font.file);
    if (!existsSync(dest)) {
      await writeFile(dest, await fetchBuffer(font.url));
    }
    GlobalFonts.registerFromPath(dest, font.family);
  }
  assetsReady = true;
}

async function loadImageSmart(src) {
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return loadImage(await fetchBuffer(src));
  }
  return loadImage(src);
}

function wrapText(ctx, text, maxWidth) {
  const words = text.split(/(\s+)/);
  const lines = [];
  let currentLine = '';

  for (const word of words) {
    if (!word) continue;
    if (word.trim() === '' && currentLine === '') continue;

    const testLine = currentLine + word;
    if (ctx.measureText(testLine).width > maxWidth) {
      if (currentLine !== '') {
        lines.push(currentLine.trimEnd());
        currentLine = word.trimStart();
      } else {
        lines.push(testLine);
        currentLine = '';
      }
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine.trim()) {
    lines.push(currentLine.trimEnd());
  }
  return lines;
}

function drawRoundedRect(ctx, x, y, w, h, r, fill, stroke = null, shadow = false) {
  ctx.save();
  if (shadow) {
    ctx.shadowColor = 'rgba(0,0,0,0.05)';
    ctx.shadowBlur = 40;
    ctx.shadowOffsetY = 12;
  }
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  ctx.fill();
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 1; ctx.stroke(); }
  ctx.restore();
}

function drawCircleImage(ctx, img, cx, cy, r) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();
  ctx.drawImage(img, cx - r, cy - r, r * 2, r * 2);
  ctx.restore();
}

async function render(username, chatText, avatarSrc, outputPath) {
  await ensureAssets();

  const USERNAME = username ?? 'Ditzzx';
  const CHAT_TEXT = chatText ?? 'Just friend kok cemburu 😂😂';
  const AVATAR_SRC = avatarSrc ?? DEFAULT_AVATAR;
  const OUT = outputPath ?? join(TMP_DIR, `ttqc-${Date.now()}.png`);

  const templateImage = await loadImage(TEMPLATE_PATH);
  const avatarImage = await loadImageSmart(AVATAR_SRC);

  const canvas = createCanvas(1080 * 2, 2280 * 2);
  const ctx = canvas.getContext('2d');

  ctx.scale(2, 2);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  ctx.clearRect(0, 0, 1080, 2280);
  ctx.drawImage(templateImage, 0, 0, 1080, 2280);

  drawCircleImage(ctx, avatarImage, config.topPPX, config.topPPY, config.topPPRadius);

  ctx.font = `bold ${config.topNameSize}px 'Plus Jakarta Sans', 'Noto Color Emoji'`;
  ctx.fillStyle = '#000000';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(USERNAME, config.topNameX, config.topNameY);

  ctx.font = `500 ${config.textSize}px 'Plus Jakarta Sans', 'Noto Color Emoji'`;

  const lines = wrapText(ctx, CHAT_TEXT, config.bubbleWidth - 52);
  const lineH = config.textSize * 1.45;

  let maxW = 0;
  for (const l of lines) {
    const w = ctx.measureText(l).width;
    if (w > maxW) maxW = w;
  }

  const padX = 30, padY = 24;
  const bubbleW = Math.max(maxW + padX * 2, 180);
  const bubbleH = lines.length * lineH + padY * 2;
  const bubbleX = config.textX - padX;
  const bubbleY = config.textY - padY;

  drawCircleImage(ctx, avatarImage, config.chatPPX, bubbleY + bubbleH / 2, config.chatPPRadius);
  drawRoundedRect(ctx, bubbleX, bubbleY, bubbleW, bubbleH, 35, config.bubbleBgColor);

  ctx.fillStyle = config.textColor;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';

  lines.forEach((line, i) => {
    const lineY = config.textY + i * lineH + config.textSize / 2;
    ctx.fillText(line, config.textX, lineY);
  });

  const menuX = 90, menuY = bubbleY + bubbleH + 28;
  drawRoundedRect(ctx, menuX, menuY, 565, 580, 40, '#ffffff', 'rgba(0,0,0,0.02)', true);

  const itemH = 90, iconX = menuX + 60, labelX = menuX + 130;
  MENU_ICONS.forEach((item, i) => {
    const cy = menuY + 25 + i * itemH + itemH / 2;
    ctx.fillStyle = item.color;
    ctx.font = `900 34px 'Font Awesome 6 Free'`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(item.unicode, iconX, cy);
    ctx.font = `500 34px 'Plus Jakarta Sans'`;
    ctx.textAlign = 'left';
    ctx.fillText(item.text, labelX, cy);
  });

  ctx.restore();

  const pngData = await canvas.encode('png');
  await writeFile(OUT, pngData);
  return OUT;
}

let handler = async (m, { conn, text }) => {
  let username, chatText;

  if (m.quoted) {
    chatText = m.quoted.text;
    if (!chatText) return m.reply('❌ Pesan yang di-reply tidak mengandung teks!');
    username = text.trim() || m.quoted.pushName || (m.quoted.sender || '').split('@')[0] || 'User';
  } else {
    if (!text || !text.includes('|')) {
      return m.reply('❌ Cara penggunaan:\n.ttchat Username|Teks chat\n\natau reply pesan teks lalu ketik:\n.ttchat Username (opsional)');
    }
    [username, chatText] = text.split('|').map(s => s.trim());
  }

  if (!username || !chatText) return m.reply('❌ Username dan teks chat tidak boleh kosong!');

  const targetJid = m.quoted ? m.quoted.sender : m.sender;
  let avatarUrl;
  try {
    avatarUrl = await conn.profilePictureUrl(targetJid, 'image');
  } catch {
    avatarUrl = DEFAULT_AVATAR;
  }

  await mkdir(TMP_DIR, { recursive: true });
  const outPath = join(TMP_DIR, `ttqc-${Date.now()}.png`);

  try {
    await render(username, chatText, avatarUrl, outPath);
    await conn.sendMessage(m.chat, { image: { url: outPath }, caption: `🎬 ${username}` }, { quoted: m });
  } catch (e) {
    console.error(e);
    return m.reply('❌ Gagal membuat gambar!');
  } finally {
    if (existsSync(outPath)) await unlink(outPath);
  }
};

handler.help = ['ttchat'];
handler.tags = ['maker'];
handler.command = /^(ttchat|ttqc|tiktokchat)$/i;
handler.limit = true;
handler.register = true;

export default handler;