import axios from 'axios';

export const handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) {
        return m.reply(`▧ ── 「 *JEMIMA SYNTAX ERROR* 」 ── ▧\n\n[!] Parameter eksekusi tidak lengkap.\n\n» *Usage:* ${usedPrefix + command} <link_channel> <emoji1,emoji2>\n» *Example:* ${usedPrefix + command} https://whatsapp.com/channel/0029Vb785rSBlHpWSitPY61i/585 😭,🔥`);
    }

    await m.react('🕒');

    try {
        const postLink = args[0];
        // Menggabungkan sisa argumen untuk emoji (jika ada spasi)
        const reactsRaw = args.slice(1).join(' ');
        
        if (!postLink.includes('whatsapp.com/channel/')) {
            return m.reply('▧ ── 「 *SYSTEM WARNING* 」 ── ▧\n\n[!] Tautan tidak valid. Harap masukkan link WhatsApp Channel yang benar.');
        }
        if (!reactsRaw) {
            return m.reply('▧ ── 「 *SYSTEM WARNING* 」 ── ▧\n\n[!] Emoji tidak terdeteksi. Harap masukkan minimal 1 emoji.');
        }

        const emojis = reactsRaw.split(',').map(e => e.trim()).filter(Boolean);
        if (emojis.length > 4) {
            return m.reply('▧ ── 「 *SYSTEM WARNING* 」 ── ▧\n\n[!] Overload. Maksimal hanya 4 emoji yang diizinkan dalam satu eksekusi.');
        }

        // 1. Get Recaptcha Token (New Endpoint)
        const { data: captchaData } = await axios.get('https://omegatech-api.dixonomega.tech/api/tools/recaptcha-v3', {
            params: {
                sitekey: '6LemKk8sAAAAAH5PB3f1EspbMlXjtwv5C8tiMHSm',
                url: 'https://back.asitha.top/api',
                use_enterprise: 'false'
            }
        });

        if (!captchaData?.success || !captchaData?.token) {
            throw new Error('Bypass Recaptcha gagal menembus firewall.');
        }

        // Catatan: Pastikan JWT ini belum expired. Jika expired, ganti dengan yang baru.
        const userJwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5OGE2ZGI5MjVjMzUyOTcxZTIyYTdkNSIsImlhdCI6MTc3NTg1NzUyMCwiZXhwIjoxNzc2NDYyMzIwfQ.q7D6potY6cl3n-ZY8nQbetNFqPSl79aF5IIZ_QbtABc';
        const backendUrl = 'https://back.asitha.top/api';

        // 2. Get Temp API Key
        const { data: tempKeyData } = await axios.post(`${backendUrl}/user/get-temp-token`, 
            { recaptcha_token: captchaData.token },
            { headers: { Authorization: `Bearer ${userJwt}`, 'Content-Type': 'application/json' } }
        );

        if (!tempKeyData?.token) {
            throw new Error('Gagal mendapatkan Temporary API Key dari server.');
        }

        // 3. Send Reaction
        await axios.post(`${backendUrl}/channel/react-to-post?apiKey=${tempKeyData.token}`, 
            { post_link: postLink, reacts: emojis.join(',') },
            { headers: { Authorization: `Bearer ${userJwt}`, 'Content-Type': 'application/json' } }
        );

        await m.react('✅');
        m.reply('▧ ── 「 *TASK COMPLETED* 」 ── ▧\n\n[✓] Injeksi reaksi ke channel berhasil dikirim.');

    } catch (e) {
        console.error(e);
        await m.react('❌');
        m.reply(`▧ ── 「 *SYSTEM ERROR* 」 ── ▧\n\n[!] Eksekusi gagal: ${e.response?.data?.message || e.message}`);
    }
};

// Metadata Command untuk Jemima-MD
handler.help = ['reactch <link> <emoji>', 'rch <link> <emoji>'];
handler.tags = ['tools'];
handler.command = /^(rch|reactch)$/i;

export default handler;