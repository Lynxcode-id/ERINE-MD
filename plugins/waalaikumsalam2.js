// © INF PROJECT - Erine-MD
// Developed by INF PROJECT

import pkg from '@wishkeysocket/baileys'
const { generateWAMessageFromContent, proto } = pkg

let handler = async (m, { conn }) => {
    let info = `*ᴏʀᴀɴɢ ʏᴀɴɢ ᴍᴇɴɢᴜᴄᴀᴘᴋᴀɴ ꜱᴀʟᴀᴍ ꜱᴇᴘᴇʀᴛɪ ɪɴɪ ᴍᴀᴋᴀ ɪɑ ᴍᴇɴᴅᴀᴘᴛᴋᴀɴ 30 ᴘᴀʜᴀʟᴀ, ᴋᴇᴍᴜᴅɪᴀɴ, ᴏʀᴀɴɢ ʏᴀɴɢ ᴅɪʜᴀᴅᴀᴘᴀɴ ᴀᴛᴀᴜ ᴍᴇɴᴅᴇɴɢᴀʀɴʏᴀ ᴍᴇᴍʙᴀʟᴀꜱ ᴅᴇɴɢᴀɴ ᴋᴀʟɪᴍᴀᴛ ʏᴀɴɢ ꜱᴀᴍᴀ ʏᴀɪᴛᴜ ᴡᴀᴀʟᴀɪᴋᴜᴍᴜsꜱᴀʟᴀᴍ ᴡᴀʀᴀʜᴍᴀᴛᴜʟʟᴀʜɪ ᴡᴀʙᴀʀᴀᴋᴀᴛᴜʜ” ᴀᴛᴀᴜ ᴅɪᴛᴀᴍʙᴀʜ ᴅᴇɴɢᴀɴ ʏᴀɴɢ ʟᴀɪɴ (ᴡᴀʀɪᴅʜᴡᴀᴀɴᴀ). ᴀʀᴛɪɴʏᴀ ꜱᴇʟᴀɪɴ ᴅᴀʀɪᴘᴀᴅᴀ ᴅᴏ'ᴀ ꜱᴇʟᴀᴍᴀᴛ ᴊᴜɢᴀ ᴍᴇᴍɪɴᴛᴀ ᴘᴀᴅᴀ ᴀʟʟᴀʜ ꜱᴡᴛ*\n\nSumber: _Rumaysho.com_`

    let waalaikumsalam = `📚 _وَعَلَيْكُمْ السَّلاَمُ وَرَحْمَةُ اللهِ وَبَرَكَاتُهُ_\n_wa'alaikumussalam wa rahmatullahi wa barakatuh_\n🙏`

    await conn.sendMessage(m.chat, {
        react: {
            text: '🙏',
            key: m.key,
        }
    })

    await conn.reply(m.chat, waalaikumsalam, m)
    
    let prep = generateWAMessageFromContent(m.chat, { 
        liveLocationMessage: { 
            degreesLatitude: -6.200000,
            degreesLongitude: 106.816666,
            caption: info,
            sequenceNumber: 1656662972682001, 
            timeOffset: 8600, 
            jpegThumbnail: null
        }
    }, { quoted: m })

    return conn.relayMessage(m.chat, prep.message, { messageId: prep.key.id })
}

handler.customPrefix = /^(as{1,2}alamu?alaikum|as{1,2}alam|salam|as{1,2}alamualaikum|saml[ie]kum|likum|s-a-l-a-m|as+alamu[' ]?alaykum)/i
handler.command = new RegExp

export default handler
