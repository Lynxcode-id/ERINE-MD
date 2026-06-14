/**
 * ╭───「 𝗙𝗘𝗔𝗧𝗨𝗥𝗘 𝗔𝗨𝗧𝗛𝗢𝗥 」───
 * │ 👤 Developer : Lynx Decode
 * │ 📞 WhatsApp  : +62 882-5804-1396
 * │ 📢 Channel   : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * │ ⚠️ Note      : Keep credit to respect the creator!
 * ╰─────────────────────────
 * 📝 Plugin      : System Info & Speed (Canvas)
 */

import os from 'os';
import fs from 'fs';
import { createCanvas } from '@napi-rs/canvas';

let handler = async (m, { conn }) => {
    let start = Date.now();
    await m.react('🚀');

    try {
        const speed = Date.now() - start;
        const uptime = toTime(process.uptime() * 1000);
        const totalMem = os.totalmem();
        const freeMem = os.freemem();
        const usedMem = totalMem - freeMem;
        const ramPercentage = Math.round((usedMem / totalMem) * 100);
        
        let tmpFiles = 0;
        try { tmpFiles = fs.readdirSync(os.tmpdir()).length; } catch (e) {}

        let cpuModel = os.cpus()[0].model.replace(/\(R\)|\(TM\)|CPU|@|[\d.]+GHz/gi, '').trim();
        // Truncate CPU biar gak offside
        if (cpuModel.length > 35) cpuModel = cpuModel.substring(0, 32) + '...';
        
        const coreCount = os.cpus().length;
        const runOn = process.env.username === 'root' ? 'VPS' : 'Hosting (Panel)';

        // ====================
        // MULAI BIKIN CANVAS
        // ====================
        const W = 1000;
        const H = 600;
        const canvas = createCanvas(W, H);
        const ctx = canvas.getContext('2d');

        // Background Dashboard
        ctx.fillStyle = '#0b0b0f';
        ctx.fillRect(0, 0, W, H);

        // Glow Effect Smooth
        const grad1 = ctx.createRadialGradient(150, 100, 50, 150, 100, 500);
        grad1.addColorStop(0, 'rgba(56, 189, 248, 0.12)'); 
        grad1.addColorStop(1, 'rgba(11, 11, 15, 0)');
        ctx.fillStyle = grad1;
        ctx.fillRect(0, 0, W, H);

        const grad2 = ctx.createRadialGradient(850, 500, 50, 850, 500, 500);
        grad2.addColorStop(0, 'rgba(168, 85, 247, 0.12)'); 
        grad2.addColorStop(1, 'rgba(11, 11, 15, 0)');
        ctx.fillStyle = grad2;
        ctx.fillRect(0, 0, W, H);

        // Fungsi Bikin Card Clean (Rounded Rectangle)
        const drawCard = (x, y, w, h) => {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.025)';
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.roundRect(x, y, w, h, 16);
            ctx.fill();
            ctx.stroke();
        };

        // Header Title
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 38px sans-serif';
        ctx.fillText('ERINE PROJECT', 50, 80);
        
        ctx.fillStyle = '#8f9ba8';
        ctx.font = '18px sans-serif';
        ctx.letterSpacing = '1.5px';
        ctx.fillText('SYSTEM MONITORING DASHBOARD', 52, 115);
        ctx.letterSpacing = '0px';

        // Card 1: SPEED & UPTIME (Top Right)
        drawCard(650, 40, 300, 95);
        
        // Ping
        ctx.fillStyle = '#8f9ba8';
        ctx.font = 'bold 14px sans-serif';
        ctx.fillText('PING SPEED', 675, 70);
        ctx.fillStyle = '#38bdf8'; // Light Blue
        ctx.font = 'bold 30px sans-serif';
        ctx.fillText(`${speed} ms`, 675, 105);
        
        // Separator
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.fillRect(800, 55, 1.5, 65);

        // Uptime
        ctx.fillStyle = '#8f9ba8';
        ctx.font = 'bold 14px sans-serif';
        ctx.fillText('UPTIME', 820, 70);
        ctx.fillStyle = '#a855f7'; // Purple
        ctx.font = 'bold 24px sans-serif';
        ctx.fillText(uptime, 820, 103);

        // Card 2: SYSTEM INFO (Left)
        drawCard(50, 170, 430, 370);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 22px sans-serif';
        ctx.fillText('💻  Server Information', 80, 220);
        
        // Separator Line Title
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.fillRect(80, 240, 370, 1);

        const sysData = [
            { label: 'Running On', value: runOn },
            { label: 'Hostname', value: os.hostname() },
            { label: 'OS Release', value: `${os.type()} ${os.release()}` },
            { label: 'Node Version', value: process.version },
            { label: 'Home Dir', value: os.homedir() },
            { label: 'Work Dir', value: process.cwd() },
            { label: 'Temp Files', value: `${tmpFiles} Files` }
        ];

        let startY = 280;
        sysData.forEach((item) => {
            ctx.fillStyle = '#8f9ba8';
            ctx.font = '17px sans-serif';
            ctx.fillText(item.label, 80, startY);
            
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 17px sans-serif';
            ctx.textAlign = 'right';
            
            // Limit Teks Biar Rapi Rata Kanan (Maks 24 Char)
            let val = item.value.length > 24 ? item.value.substring(0, 21) + '...' : item.value;
            ctx.fillText(val, 450, startY);
            ctx.textAlign = 'left';
            startY += 38; // Spacing rapi
        });

        // Card 3: HARDWARE INFO (Right)
        drawCard(520, 170, 430, 370);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 22px sans-serif';
        ctx.fillText('⚙️  Hardware Monitor', 550, 220);

        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.fillRect(550, 240, 370, 1);

        // CPU Section
        ctx.fillStyle = '#8f9ba8';
        ctx.font = '17px sans-serif';
        ctx.fillText('Processor (CPU)', 550, 285);
        
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 19px sans-serif';
        ctx.fillText(cpuModel, 550, 320);
        
        ctx.fillStyle = '#38bdf8';
        ctx.font = '16px sans-serif';
        ctx.fillText(`Cores: ${coreCount} Logical Processors`, 550, 345);

        // RAM Section
        ctx.fillStyle = '#8f9ba8';
        ctx.font = '17px sans-serif';
        ctx.fillText('Memory (RAM)', 550, 415);
        
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 17px sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(`${formatSize(usedMem)} / ${formatSize(totalMem)}`, 920, 415);
        ctx.textAlign = 'left';

        // Custom Progress Bar RAM 
        const barX = 550;
        const barY = 435;
        const barW = 370;
        const barH = 24;
        
        // Base bar
        ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.beginPath();
        ctx.roundRect(barX, barY, barW, barH, 12);
        ctx.fill();

        // Fill bar 
        let fillW = (barW * ramPercentage) / 100;
        if (fillW < 24) fillW = 24; // Min width for rounded corners
        
        const barColor = ramPercentage > 85 ? '#ef4444' : '#a855f7'; 
        ctx.fillStyle = barColor;
        ctx.beginPath();
        ctx.roundRect(barX, barY, fillW, barH, 12);
        ctx.fill();

        // Teks Dalam Bar (Center Y)
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 13px sans-serif';
        ctx.fillText(`${ramPercentage}% Used`, barX + 15, barY + 16.5);

        // Footer
        ctx.fillStyle = '#5c6773';
        ctx.font = '15px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('© Erine-MD by Lynx Decode • System Generator', W / 2, 575);
        ctx.textAlign = 'left';

        // Convert canvas ke buffer
        const bufferImage = canvas.toBuffer('image/png');

        // Caption
        const cap = `🚀 *ERINE SYSTEM MONITOR*\n\n⏱️ *Speed:* ${speed} ms\n⏳ *Uptime:* ${uptime}\n📊 *RAM:* ${ramPercentage}% Used`;

        await conn.sendMessage(m.chat, { 
            image: bufferImage, 
            caption: cap 
        }, { quoted: m });

        await m.react('✅');

    } catch (e) {
        console.error('[SPEED CANVAS ERROR]', e);
        await m.react('❌');
        m.reply(`❌ Gagal merender canvas.\n> *Detail:* ${e.message}`);
    }
};

handler.help = ['speed', 'os'];
handler.tags = ['info'];
handler.command = /^(speed|os)$/i;

export default handler;

function toTime(ms) {
    let h = Math.floor(ms / 3600000);
    let m = Math.floor(ms / 60000) % 60;
    let s = Math.floor(ms / 1000) % 60;
    return [h, m, s].map((v) => v.toString().padStart(2, '0')).join(':');
}

function formatSize(size) {
    function round(value, precision) {
        var multiplier = Math.pow(10, precision || 0);
        return Math.round(value * multiplier) / multiplier;
    }
    var KB = 1024;
    var MB = KB * 1024;
    var GB = MB * 1024;
    var TB = GB * 1024;
    if (size < KB) return size + ' B';
    if (size < MB) return round(size / KB, 1) + ' KB';
    if (size < GB) return round(size / MB, 1) + ' MB';
    if (size < TB) return round(size / GB, 1) + ' GB';
    return round(size / TB, 1) + ' TB';
}