/**
 * ╭───「 𝗙𝗘𝗔𝗧𝗨𝗥𝗘 𝗔𝗨𝗧𝗛𝗢𝗥 」───
 * │ 👤 Developer : Lynx Decode
 * ╰─────────────────────────
 * 📝 Core Engine : WA Native Sticker Pack Sender
 */

import { generateWAMessageContent, generateWAMessageFromContent } from '@whiskeysockets/baileys';
import crypto from 'crypto';

export async function sendNativeStickerPack(conn, jid, buffers, options = {}, quoted) {
    let stickers = [];
    
    for (let buf of buffers) {
        try {
            let media = await generateWAMessageContent(
                { sticker: buf },
                { upload: conn.waUploadToServer }
            );
            
            if (media.stickerMessage) {
                stickers.push(media.stickerMessage); 
            }
        } catch (e) {
            console.error('[StickerPack Upload Error]', e);
            continue;
        }
    }

    if (stickers.length === 0) throw new Error('Gagal mengupload semua stiker ke server WA.');

    let msg = generateWAMessageFromContent(jid, {
        stickerPackMessage: {
            stickerPackId: crypto.randomBytes(16).toString('hex'),
            name: options.packname || 'Erine Pack',
            publisher: options.author || 'Lynx Decode',
            stickers: stickers,
            trayIcon: stickers[0]
        }
    }, { userJid: conn.user.id, quoted: quoted });

    await conn.relayMessage(jid, msg.message, { messageId: msg.key.id });
    return true;
}
