/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Scraper/Original : Zass Desuta
 * 👤 Adapted for ESM  : Lynx Decode (Erine-MD)
 * ─────────────────────────
 * 📝 Plugin : Push Kontak & Save Kontak System
 */

import fs from 'fs';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
    const makeProgressBar = (current, total, length = 15) => {
        const progress = Math.floor((current / total) * length);
        const bar = "▓".repeat(progress) + "░".repeat(length - progress);
        return `[${bar}] ${Math.floor((current / total) * 100)}%`;
    };

    if (command === 'tutor2' || command === 'tutorial2') {
        let txt = `> 📦 *TUTORIAL PUSH KONTAK ERINE*\n\n`;
        txt += `> 📡 *Grup Terbuka (Dipakai di dalam grup)*\n`;
        txt += `> 🔸 .pushkontak <teks>\n> 🔸 .pushkontak2 <teks> (Auto Save)\n> 🔸 .pushkontak3 jeda|<teks>\n\n`;
        txt += `> 📡 *Grup Tertutup (Pakai ID Grup)*\n`;
        txt += `> 🔸 .pushkontakid idgc|<teks>\n> 🔸 .pushkontakid2 idgc|<teks>\n\n`;
        txt += `> 💾 *Save Kontak*\n`;
        txt += `> 🔸 .savekontak nama (di dalam grup)\n`;
        txt += `> 🔸 .savekontak idgc|nama (di private message)`;
        return m.reply(txt);
    }

    if (command === 'pushkontak') {
        if (!m.isGroup) return m.reply("❌ Fitur ini hanya bisa dipakai di dalam grup!");
        if (!text) return m.reply(`❌ Teksnya mana?\nContoh: ${usedPrefix + command} Save nomorku ya!`);

        const metadata = await conn.groupMetadata(m.chat);
        const participants = metadata.participants;
        let success = 0, failed = 0, total = participants.length;

        const progMsg = await conn.sendMessage(m.chat, { text: `⏳ *Push Kontak Berjalan...*\nTarget: ${total} kontak\n⚠️ Jangan gunakan command lain selama proses.` });

        for (let i = 0; i < total; i++) {
            try {
                await conn.sendMessage(participants[i].id, { text });
                success++;
            } catch (e) { failed++; }
            await delay(4000);
            
            if ((i + 1) % 15 === 0 || i + 1 === total) {
                await conn.sendMessage(m.chat, { text: `*Progres Push Kontak*\n${i + 1}/${total}\n${makeProgressBar(i + 1, total)}` }, { edit: progMsg.key });
            }
        }
        return m.reply(`✅ *Push Kontak Selesai!*\nSukses: ${success} | Gagal: ${failed}`);
    }

    if (command === 'pushkontak2') {
        if (!m.isGroup) return m.reply("❌ Fitur ini hanya bisa dipakai di dalam grup!");
        if (!text) return m.reply(`❌ Teksnya mana?`);

        const metadata = await conn.groupMetadata(m.chat);
        const participants = metadata.participants;
        let success = 0, failed = 0, total = participants.length;
        let vcfList = '';

        const progMsg = await conn.sendMessage(m.chat, { text: `⏳ *Push Kontak VCF Berjalan...*\nTarget: ${total} kontak` });

        for (let i = 0; i < total; i++) {
            let member = participants[i];
            try {
                await conn.sendMessage(member.id, { text });
                success++;
                let nomor = member.id.split('@')[0];
                vcfList += `BEGIN:VCARD\nVERSION:3.0\nFN:Kontak - ${nomor}\nTEL;type=CELL;type=VOICE;waid=${nomor}:+${nomor}\nEND:VCARD\n\n`;
            } catch (e) { failed++; }
            await delay(4000);
            
            if ((i + 1) % 15 === 0 || i + 1 === total) {
                await conn.sendMessage(m.chat, { text: `*Progres Push Kontak*\n${i + 1}/${total}\n${makeProgressBar(i + 1, total)}` }, { edit: progMsg.key });
            }
        }

        fs.writeFileSync('./contacts.vcf', vcfList);
        await conn.sendMessage(m.sender, { document: fs.readFileSync('./contacts.vcf'), fileName: `${metadata.subject}.vcf`, mimetype: 'text/x-vcard', caption: `✅ Selesai!\nSukses: ${success} | Gagal: ${failed}` });
        fs.unlinkSync('./contacts.vcf');
        return;
    }

    if (command === 'pushkontakid') {
        if (!text.includes('|')) return m.reply(`❌ Format salah!\nContoh: ${usedPrefix + command} idgrup|Pesan`);
        
        let [groupId, pesan] = text.split('|').map(v => v.trim());
        try {
            const metadata = await conn.groupMetadata(groupId);
            const participants = metadata.participants;
            let success = 0, failed = 0, total = participants.length;

            const progMsg = await conn.sendMessage(m.chat, { text: `⏳ *Push Kontak ID Berjalan...*\nTarget: ${total} di grup ${metadata.subject}` });

            for (let i = 0; i < total; i++) {
                try {
                    await conn.sendMessage(participants[i].id, { text: pesan });
                    success++;
                } catch (e) { failed++; }
                await delay(4000);
                
                if ((i + 1) % 15 === 0 || i + 1 === total) {
                    await conn.sendMessage(m.chat, { text: `*Progres Push Kontak*\n${i + 1}/${total}\n${makeProgressBar(i + 1, total)}` }, { edit: progMsg.key });
                }
            }
            return m.reply(`✅ *Push Kontak ID Selesai!*\nSukses: ${success} | Gagal: ${failed}`);
        } catch (e) {
            return m.reply('❌ Gagal mengambil grup! Pastikan ID grup valid.');
        }
    }

    if (command === 'savekontak') {
        const buildVcard = (list, namePrefix) => {
            let vcard = '', no = 1;
            for (let jid of list) {
                let num = jid.split('@')[0];
                vcard += `BEGIN:VCARD\nVERSION:3.0\nFN:${namePrefix} ${no}\nTEL;type=CELL;type=VOICE;waid=${num}:+${num}\nEND:VCARD\n\n`;
                no++;
            }
            return vcard;
        };

        if (m.isGroup && !text.includes('|')) {
            if (!text) return m.reply("❌ Masukkan awalan nama kontak!");
            let metadata = await conn.groupMetadata(m.chat);
            let kontakUnik = [...new Set(metadata.participants.map(p => p.id))];

            fs.writeFileSync('./save.vcf', buildVcard(kontakUnik, text.trim()));
            await conn.sendMessage(m.sender, { document: fs.readFileSync('./save.vcf'), fileName: 'kontak-grup.vcf', mimetype: 'text/x-vcard', caption: `✅ Kontak Grup Tersimpan.` });
            fs.unlinkSync('./save.vcf');
            return m.reply("✅ File kontak dikirim ke chat pribadi.");
        } else {
            if (!text.includes('|')) return m.reply("❌ Format private: idgc|namakontak");
            let [idgc, name] = text.split('|').map(v => v.trim());
            try {
                let metadata = await conn.groupMetadata(idgc);
                let kontakUnik = [...new Set(metadata.participants.map(p => p.id))];

                fs.writeFileSync('./save.vcf', buildVcard(kontakUnik, name));
                await conn.sendMessage(m.sender, { document: fs.readFileSync('./save.vcf'), fileName: 'kontak-saved.vcf', mimetype: 'text/x-vcard', caption: `✅ Kontak Tersimpan.` });
                fs.unlinkSync('./save.vcf');
                return m.reply("✅ File kontak dikirim ke chat pribadi.");
            } catch (e) {
                return m.reply("❌ ID Grup tidak valid.");
            }
        }
    }
}

handler.help = ['tutor', 'pushkontak', 'pushkontak2', 'pushkontak3', 'pushkontakid', 'pushkontakid2', 'savekontak'];
handler.tags = ['owner'];
handler.command = /^(tutor2|tutorial2|pushkontak|pushkontak2|pushkontak3|pushkontakid|pushkontakid2|pushkontakid3|savekontak)$/i;

handler.owner = true;

export default handler;