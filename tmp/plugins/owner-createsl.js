/*
 * @project: Create Saluran WhatsApp Auto-Admin
 * @author:  RynnStecu 
 * @rework:  Lynx Decode (Erine-MD)
 * * "Respect the code, respect the creator."
 * Do not remove this credit.
 */

const QUERY_ID_CREATE = '8823471724422422'
const QUERY_ID_UPDATE_ROLE = '6661330960682136' 
const DATA_PATH_CREATE = 'xwa2_newsletter_create'

// Fungsi Create Channel
async function wmexCreate(conn, name, description) {
    const variables = {
        input: {
            name,
            description: description || null
        }
    }

    const result = await conn.query({
        tag: 'iq',
        attrs: {
            id: conn.generateMessageTag(),
            type: 'get',
            to: 's.whatsapp.net',
            xmlns: 'w:mex'
        },
        content: [{
            tag: 'query',
            attrs: {
                query_id: QUERY_ID_CREATE
            },
            content: Buffer.from(
                JSON.stringify({
                    variables
                }),
                'utf-8'
            )
        }]
    })

    const child = result?.content?.find(n => n.tag === 'result')
    if (!child?.content) throw new Error('Tidak menerima respons dari server WhatsApp.')
    
    const parsed = JSON.parse(child.content.toString())
    if (parsed.errors?.length) throw new Error(parsed.errors.map(e => e.message || 'Unknown error').join(', '))

    const raw = parsed?.data?.[DATA_PATH_CREATE]
    if (!raw) throw new Error('Server tidak mengembalikan data saluran.')

    const thread = raw.thread_metadata || {}

    return {
        id: raw.id,
        name: thread.name?.text || name,
        description: thread.description?.text || '',
        invite: thread.invite || '',
        subscribers: Number(thread.subscribers_count) || 0,
    }
}

// Fungsi Update Role / Promote to Admin Saluran
async function wmexPromoteAdmin(conn, newsletterJid, targetJid) {
    const variables = {
        newsletter_id: newsletterJid,
        updates: [
            {
                user_id: targetJid,
                role: "ADMIN"
            }
        ]
    }

    await conn.query({
        tag: 'iq',
        attrs: {
            id: conn.generateMessageTag(),
            type: 'get',
            to: 's.whatsapp.net',
            xmlns: 'w:mex'
        },
        content: [{
            tag: 'query',
            attrs: {
                query_id: QUERY_ID_UPDATE_ROLE
            },
            content: Buffer.from(
                JSON.stringify({
                    variables
                }),
                'utf-8'
            )
        }]
    })
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        return m.reply(`📢 Cara pakai:\n\n› ${usedPrefix}${command} Nama|Deskripsi|Jumlah\n\nContoh:\n› ${usedPrefix}${command} Erine Updates|Info bot terbaru|1`)
    }

    let [name, description, amount] = text.split('|').map(v => v.trim())

    if (!name || name.length < 2) return m.reply('❌ Nama saluran minimal 2 karakter.')

    let count = parseInt(amount) || 1
    if (count > 5) count = 5 // Batasin 5 aja cuy rawan banned
    if (count < 1) count = 1

    let ownerJid = '6288258041396@s.whatsapp.net'

    try {
        await m.react('⏳')
        let results = []

        for (let i = 0; i < count; i++) {
            // 1. Bikin Channel
            const res = await wmexCreate(conn, name, description)
            
            // 2. Promote Owner Jadi Admin
            await wmexPromoteAdmin(conn, res.id, ownerJid).catch(e => console.log('Gagal promote admin:', e))

            const inviteLink = res.invite ? `https://whatsapp.com/channel/${res.invite}` : res.id ? `https://whatsapp.com/channel/${res.id.replace('@newsletter', '')}` : '-'

            results.push(`*Saluran ${i + 1}*\n📛 Nama: ${res.name}\n🔗 Link: ${inviteLink}\n🛡️ Admin: @${ownerJid.split('@')[0]}`)
            
            await new Promise(r => setTimeout(r, 2000)) // Jeda aman
        }

        // Generate Waktu
        let d = new Date(new Date + 3600000)
        let locale = 'id'
        let date = d.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })
        let time = d.toLocaleTimeString(locale, { hour: 'numeric', minute: 'numeric', second: 'numeric' })

        let finalCaption = `╭─── [ *C H A N N E L - C R E A T E D* ] ───💠
│ 
│  📅 *Tanggal:* ${date}
│  ⏰ *Pukul:* ${time}
│
┣─────────[ *L I N K S* ]─────────💠
│\n${results.join('\n\n')}\n│
╰──────────────────────────💠`

        await conn.sendMessage(m.chat, { 
            text: finalCaption,
            mentions: [ownerJid]
        }, { quoted: m })

        await m.react('✅')

    } catch (err) {
        await m.react('❌')
        console.error('[buatsaluran]', err)
        return m.reply(`❌ Gagal membuat saluran\n\n› ${err.message}`)
    }
}

handler.help = ['buatsaluran nama|desk|jumlah']
handler.tags = ['owner']
handler.command = ['buatsaluran', 'createsaluran', 'createnewsletter']
handler.owner = true

export default handler