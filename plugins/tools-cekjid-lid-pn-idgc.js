/**
 * ╭───「 𝗙𝗘𝗔𝗧𝗨𝗥𝗘 𝗔𝗨𝗧𝗛𝗢𝗥 」───
 * │ 👤 Developer : Lynx Decode
 * ╰─────────────────────────
 * 📝 Plugin      : Cek Info ID (With Copy Buttons)
 */

import { generateWAMessageFromContent } from '@whiskeysockets/baileys';

let handler = async (m, { conn }) => {
    let target = m.quoted ? m.quoted.sender : (m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.sender);
    let pn = target.split('@')[0];
    let idgc = m.isGroup ? m.chat : 'Bukan di dalam grup (Private Chat)';
    
    let lid = 'Tidak terdeteksi';
    if (m.sender.includes('@lid')) {
        lid = m.sender;
    } else if (m.quoted && m.quoted.sender && m.quoted.sender.includes('@lid')) {
        lid = m.quoted.sender;
    } else if (m.msg?.contextInfo?.participant?.includes('@lid')) {
        lid = m.msg.contextInfo.participant;
    } else if (m.msg?.contextInfo?.quotedMessage?.contactMessage?.vcard) {
        let match = m.msg.contextInfo.quotedMessage.contactMessage.vcard.match(/waid=([^:]+)/);
        if (match && match[1].includes('@lid')) lid = match[1];
    }

    let caption = `
🔍 *C E K  I N F O  I D* 🔍

👤 *Target Info*
» *Tag:* @${pn}
» *JID:* ${target}
» *PN (Phone):* ${pn}
» *LID:* ${lid}

💬 *Chat Info*
» *Tipe:* ${m.isGroup ? 'Group' : 'Private'}
» *IDGC:* ${idgc}
`.trim();

    let msg = generateWAMessageFromContent(m.chat, {
        viewOnceMessage: {
            message: {
                messageContextInfo: {
                    deviceListMetadata: {},
                    deviceListMetadataVersion: 2
                },
                interactiveMessage: {
                    contextInfo: {
                        mentionedJid: [target]
                    },
                    body: { 
                        text: caption 
                    },
                    footer: { 
                        text: "Erine-MD • Lynx Decode" 
                    },
                    nativeFlowMessage: {
                        buttons: [
                            {
                                name: "cta_copy",
                                buttonParamsJson: JSON.stringify({
                                    display_text: "📋 Copy JID",
                                    id: "copy_jid",
                                    copy_code: target
                                })
                            },
                            {
                                name: "cta_copy",
                                buttonParamsJson: JSON.stringify({
                                    display_text: "📋 Copy PN",
                                    id: "copy_pn",
                                    copy_code: pn
                                })
                            },
                            {
                                name: "cta_copy",
                                buttonParamsJson: JSON.stringify({
                                    display_text: "📋 Copy LID",
                                    id: "copy_lid",
                                    copy_code: lid
                                })
                            },
                            {
                                name: "cta_copy",
                                buttonParamsJson: JSON.stringify({
                                    display_text: "📋 Copy IDGC",
                                    id: "copy_idgc",
                                    copy_code: idgc
                                })
                            }
                        ]
                    }
                }
            }
        }
    }, { quoted: m });

    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
};

handler.help = ['cekid', 'id', 'jid', 'idgc'];
handler.tags = ['tools'];
handler.command = /^(cekid|id|jid|idgc|cekjid|ceklid)$/i;

export default handler;