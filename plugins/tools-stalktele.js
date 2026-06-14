import axios from 'axios';

let handler = async (m, {
    conn,
    text,
    usedPrefix,
    command
}) => {
    if (!text) return m.reply(`> ✉️ Masukkan username Telegram yang ingin di-stalk.\n\n💡 Contoh:\n_${usedPrefix + command} ryuukaaaaaaa_`);

    const username = text.replace(/@/g, '').trim();

    if (global.loading) await global.loading(m, conn);

    try {
        const apiUrl = `https://api.ikyyxd.my.id/tools/telegram/stalk?username=${encodeURIComponent(username)}`;

        const res = await axios.get(apiUrl, {
            timeout: 30000,
            headers: {
                'User-Agent': 'Mozilla/5.0'
            }
        });

        if (!res.data || !res.data.status || !res.data.result) throw new Error('Invalid or empty response from API');

        const {
            id,
            type,
            is_bot,
            username: tgName,
            name,
            bio,
            verified,
            scam,
            fake,
            profile_media
        } = res.data.result;

        const caption = `
> 📊 *TELEGRAM USER STALK*

> 🆔 *ID:* ${id}
> 👤 *Name:* ${name || '-'}
> 🏷️ *Username:* @${tgName}
> 🗂️ *Type:* ${type}
> 🤖 *Is Bot:* ${is_bot ? '✅ Yes' : '❌ No'}
> 📝 *Bio:* ${bio || '-'}
> 🛡️ *Verified:* ${verified ? '✅ Yes' : '❌ No'}
> ⚠️ *Scam:* ${scam ? '🔴 Yes' : '🟢 No'}
> 🚫 *Fake:* ${fake ? '🔴 Yes' : '🟢 No'}
`.trim();

        const photo = profile_media?.photos?.[0];

        if (photo) {
            await conn.sendMessage(m.chat, {
                image: {
                    url: photo
                },
                caption: caption
            }, {
                quoted: m
            });
        } else {
            await m.reply(caption);
        }

        if (global.loading) await global.loading(m, conn, true);

    } catch (e) {
        if (global.loading) await global.loading(m, conn, true);
        console.error(`[${command}]`, e?.message || e);
        return m.reply(`> ❌ Gagal melakukan stalking pada user Telegram tersebut.`);
    }
};

handler.help = ['stalktele <username>'];
handler.tags = ['tools'];
handler.command = /^(stalktele)$/i;
handler.limit = true;
handler.register = true;

export default handler;