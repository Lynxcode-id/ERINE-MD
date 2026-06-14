/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Scraper/Original : Zass Desuta
 * 👤 Adapted for ESM  : Lynx Decode (Erine-MD)
 * ─────────────────────────
 * 📝 Plugin : Broadcast Group System (JPM)
 */

import fs from 'fs';
import path from 'path';

const pentingPath = path.join(process.cwd(), "database", "penting.json");
if (!fs.existsSync(pentingPath)) {
    if (!fs.existsSync(path.join(process.cwd(), "database"))) fs.mkdirSync(path.join(process.cwd(), "database"));
    fs.writeFileSync(pentingPath, JSON.stringify({ blacklistJpm: [], autoJpm: { status: false, interval: 0, type: "", messages: [], _lastRun: 0 } }, null, 2));
}

let handler = async (m, { conn, text, args, usedPrefix, command }) => {
    let penting = JSON.parse(fs.readFileSync(pentingPath));
    const savePenting = () => fs.writeFileSync(pentingPath, JSON.stringify(penting, null, 2));
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
    const qmsg = m.quoted ? m.quoted : m;
    const mime = (qmsg.msg || qmsg).mimetype || "";

    if (command === 'cekidgc2' || command === 'getidgrup2') {
        if (!text) return m.reply(`❌ Link grupnya mana?\nContoh: ${usedPrefix + command} https://chat.whatsapp.com/xxxxxx`);
        let coded = text.split("https://chat.whatsapp.com/")[1];
        if (!coded) return m.reply("❌ Link Invalid");
        try {
            let res = await conn.groupGetInviteInfo(coded);
            return m.reply(res.id || "ID tidak ditemukan");
        } catch (e) {
            return m.reply("❌ Gagal mengambil ID grup, mungkin link invalid atau bot kena limit.");
        }
    }

    if (command === 'listgc2' || command === 'listgrup2') {
        await m.react('👁️‍🗨️');
        try {
            let gcall = Object.values(await conn.groupFetchAllParticipating());
            let teks = `┌˚₊ ๑│ ʟ ɪ ꜱ ᴛ  ɢ ʀ ᴜ ᴘ │๑˚₊ 📦\n┇ \n│ 📊 *Total Grup:* ${gcall.length}\n┇ \n`;
            gcall.forEach((group, index) => {
                teks += `│ *${index + 1}.* ${group.subject}\n`;
                teks += `│ 🆔 ID: ${group.id}\n`;
                teks += `│ 👥 Member: ${group.participants.length}\n`;
                teks += `│ 🔒 Status: ${group.announce ? "Tertutup" : "Terbuka"}\n┇ \n`;
            });
            teks += `└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`;
            return m.reply(teks);
        } catch (e) {
            return m.reply("❌ Gagal mengambil daftar grup.");
        }
    }
    
    if (command === 'bcgc' || command === 'bcgroup') {
        if (!text) return m.reply(`❌ Teksnya mana?\nContoh: ${usedPrefix + command} Halo semua!`);
        let getGroups = await conn.groupFetchAllParticipating();
        let groups = Object.values(getGroups).map(v => v.id);
        
        m.reply(`⏳ Mengirim Broadcast ke ${groups.length} Grup...`);
        for (let i of groups) {
            await delay(4000);
            await conn.sendMessage(i, { text: `*「 BROADCAST 」*\n\n${text}` });
        }
        return m.reply(`✅ Sukses mengirim broadcast ke ${groups.length} grup.`);
    }

    if (command === 'jpm') {
        if (!text && !m.quoted) return m.reply(`❌ Kirim teks atau reply media!\nContoh: ${usedPrefix + command} Open Sewa Bot`);
        
        let mediaPath, broadcastMsg;
        if (/image|video|audio|document/.test(mime)) mediaPath = await qmsg.download();

        const allGroups = await conn.groupFetchAllParticipating();
        const groupIDs = Object.keys(allGroups);
        let sentCount = 0;

        if (mediaPath) {
            if (/image/.test(mime)) broadcastMsg = { image: mediaPath, caption: text || "" };
            if (/video/.test(mime)) broadcastMsg = { video: mediaPath, caption: text || "" };
            if (/audio/.test(mime)) broadcastMsg = { audio: mediaPath, mimetype: "audio/mpeg", ptt: true };
            if (/document/.test(mime)) broadcastMsg = { document: mediaPath, mimetype: qmsg.mimetype, fileName: `File_Broadcast` };
        } else {
            broadcastMsg = { text };
        }

        const processMsg = await conn.sendMessage(m.chat, { text: `⏳ *Memproses JPM...*\nJumlah grup: ${groupIDs.length}\nTipe: ${mediaPath ? mime : "Text"}` }, { quoted: m });

        for (const id of groupIDs) {
            if (penting.blacklistJpm && penting.blacklistJpm.includes(id)) continue;
            try {
                await conn.sendMessage(id, broadcastMsg);
                sentCount++;
            } catch (e) {}
            await delay(4000);
        }

        return await conn.sendMessage(m.chat, { text: `✅ *JPM Selesai!*\nBerhasil terkirim ke *${sentCount}* grup.`, edit: processMsg.key });
    }

    if (command === 'jpmht') {
        if (!text && !m.quoted) return m.reply(`❌ Kirim teks atau reply media!\nContoh: ${usedPrefix + command} Open Sewa Bot`);
        
        let mediaPath, msgContent;
        if (/image|video|audio|document/.test(mime)) mediaPath = await qmsg.download();

        const allGroups = await conn.groupFetchAllParticipating();
        const groupIDs = Object.keys(allGroups);
        let sentCount = 0;

        const processMsg = await conn.sendMessage(m.chat, { text: `⏳ *Memproses JPM Hidetag...*\nJumlah grup: ${groupIDs.length}\nTipe: ${mediaPath ? mime : "Text"}` }, { quoted: m });

        for (const id of groupIDs) {
            if (penting.blacklistJpm && penting.blacklistJpm.includes(id)) continue;
            const metadata = await conn.groupMetadata(id);
            const participants = metadata.participants.map(p => p.id);

            if (mediaPath) {
                if (/image/.test(mime)) msgContent = { image: mediaPath, caption: text || "", mentions: participants };
                if (/video/.test(mime)) msgContent = { video: mediaPath, caption: text || "", mentions: participants };
                if (/audio/.test(mime)) msgContent = { audio: mediaPath, mimetype: "audio/mpeg", ptt: true, mentions: participants };
                if (/document/.test(mime)) msgContent = { document: mediaPath, mimetype: qmsg.mimetype, fileName: `File`, mentions: participants };
            } else {
                msgContent = { text: text, mentions: participants };
            }

            try {
                await conn.sendMessage(id, msgContent);
                sentCount++;
            } catch (e) {}
            await delay(4000);
        }

        return await conn.sendMessage(m.chat, { text: `✅ *JPM Hidetag Selesai!*\nBerhasil terkirim ke *${sentCount}* grup.`, edit: processMsg.key });
    }

    if (command === 'bljpm') {
        let [act] = text.split("|").map(a => a?.trim()?.toLowerCase());
        if (!m.isGroup) return m.reply("❌ Perintah ini hanya bisa dipakai di dalam grup untuk memblacklist grup tersebut.");
        
        const gid = m.chat;
        if (act === "on") {
            if (!penting.blacklistJpm.includes(gid)) {
                penting.blacklistJpm.push(gid);
                savePenting();
                return m.reply(`✅ Grup ini berhasil ditambahkan ke *Blacklist JPM*.`);
            } else return m.reply(`✖️ Grup ini sudah ada di daftar blacklist.`);
        } else if (act === "off") {
            if (penting.blacklistJpm.includes(gid)) {
                penting.blacklistJpm = penting.blacklistJpm.filter(x => x !== gid);
                savePenting();
                return m.reply(`✅ Grup ini berhasil dihapus dari *Blacklist JPM*.`);
            } else return m.reply(`✖️ Grup ini belum ada di daftar blacklist.`);
        } else return m.reply(`❌ Format salah. Gunakan:\n${usedPrefix + command} on\n${usedPrefix + command} off`);
    }

    if (command === 'autojpm') {
        let [cmd, ...argArr] = text.split(" ");
        cmd = cmd ? cmd.toLowerCase() : null;

        if (!cmd) {
            let list = penting.autoJpm.messages.map((m, i) => `${i + 1}. ${m.caption || m.text || "(Media)"}`).join("\n") || "- kosong -";
            return m.reply(`*AUTO JPM SYSTEM*\n\nStatus: ${penting.autoJpm.status ? "ON" : "OFF"}\nInterval: ${penting.autoJpm.interval} ${penting.autoJpm.type}\n\n*Pesan Tersimpan:*\n${list}\n\n*Command:*\n.autojpm on\n.autojpm off\n.autojpm add <teks>\n.autojpm del <nomor/all>\n.autojpm set <angka> menit/jam`);
        }

        if (cmd === "on") {
            if (penting.autoJpm.status) return m.reply("✖️ Auto JPM sudah aktif.");
            penting.autoJpm.status = true;
            savePenting();
            return m.reply("✅ Auto JPM diaktifkan.");
        } else if (cmd === "off") {
            penting.autoJpm.status = false;
            savePenting();
            return m.reply("✅ Auto JPM dimatikan.");
        } else if (cmd === "add") {
            let caption = argArr.join(" ");
            if (/image|video/.test(mime)) {
                let buffer = await qmsg.download();
                let tmpPath = path.join(process.cwd(), `tmp_jpm_${Date.now()}.${mime.split("/")[1]}`);
                fs.writeFileSync(tmpPath, buffer);
                penting.autoJpm.messages.push({ type: /image/.test(mime) ? "image" : "video", path: tmpPath, caption });
            } else {
                penting.autoJpm.messages.push({ type: "text", text: caption });
            }
            savePenting();
            return m.reply("✅ Pesan berhasil ditambahkan.");
        } else if (cmd === "del") {
            let idx = argArr[0];
            if (idx === "all") penting.autoJpm.messages = [];
            else {
                idx = parseInt(idx) - 1;
                penting.autoJpm.messages.splice(idx, 1);
            }
            savePenting();
            return m.reply("✅ Pesan dihapus.");
        } else if (cmd === "set") {
            let num = parseInt(argArr[0]);
            let unit = (argArr[1] || "").toLowerCase();
            penting.autoJpm.interval = num;
            penting.autoJpm.type = unit.startsWith("m") ? "minute" : "hour";
            savePenting();
            return m.reply(`✅ Interval diatur ke ${num} ${penting.autoJpm.type}.`);
        }
    }
}

handler.help = ['cekidgc', 'listgc', 'bcgc', 'jpm', 'jpmht', 'bljpm', 'autojpm'];
handler.tags = ['owner'];
handler.command = /^(cekidgc2|getidgrup|listgc2|listgrup2|bcgc2|bcgroup2|jpm|jpmht|bljpm|autojpm)$/i;

handler.owner = true;

export default handler;