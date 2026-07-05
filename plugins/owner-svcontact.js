let handler = async (m, { conn, groupMetadata, isOwner }) => {
    if (!isOwner) return m.reply('❌ Fitur khusus Owner!');

    await m.react('⏳');

    try {
        const participants = groupMetadata.participants;
        const gcName = groupMetadata.subject || 'Group';
        const contacts = [];
        let unknownCounter = 1;

        for (let i = 0; i < participants.length; i++) {
            let jid = participants[i].id;
            if (jid.includes('@lid')) continue;
            if (jid === conn.user.jid) continue;

            let number = jid.split('@')[0];
            let name = await conn.getName(jid);

            if (!name || name === number || name.includes(number) || name === 'undefined') {
                let dbName = global.db?.data?.users?.[jid]?.name;
                if (dbName && dbName !== number && dbName !== 'undefined') {
                    name = dbName;
                } else {
                    name = `SV ${gcName} ${unknownCounter}`;
                    unknownCounter++;
                }
            }

            let vcard = `BEGIN:VCARD\nVERSION:3.0\nN:;${name};;;\nFN:${name}\nTEL;type=CELL;type=VOICE;waid=${number}:+${number}\nEND:VCARD`;
            
            contacts.push({ vcard, displayName: name });
        }

        if (contacts.length === 0) {
            return m.reply('❌ Nggak ada member normal yang bisa disedot (Mungkin ini grup yang nomornya di-hidden semua sama admin).');
        }

        await m.reply(`📦 *Memproses ${contacts.length} Kontak Asli...*\n\n_Erine nge-filter nomor siluman (LID) dan ngirim vCard murni ke PC lu cuy!_`);

        const chunkSize = 50;
        for (let i = 0; i < contacts.length; i += chunkSize) {
            let chunk = contacts.slice(i, i + chunkSize);
            
            await conn.sendMessage(m.sender, { 
                contacts: {
                    displayName: `${contacts.length} Kontak Asli`,
                    contacts: chunk
                }
            });
        }

        await m.react('✅');

    } catch (e) {
        console.error('[Get Contact Error]', e);
        await m.react('❌');
        m.reply(`❌ Gagal mengambil kontak: ${e.message}`);
    }
};

handler.help = ['getcontact', 'autosv', 'svall'];
handler.tags = ['owner', 'group'];
handler.command = /^(getcontact|autosv|getkontak|svall|sedotkontak)$/i;
handler.group = true;
handler.owner = true; 

export default handler;