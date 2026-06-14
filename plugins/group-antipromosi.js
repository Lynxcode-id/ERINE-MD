/**
 * ╭───「 𝗙𝗘𝗔𝗧𝗨𝗥𝗘 𝗔𝗨𝗧𝗛𝗢𝗥 」───
 * │ 👤 Developer : Lynx Decode
 * ╰─────────────────────────
 * 📝 Plugin      : Anti Promo & Anti Channel (Fixed Engine)
 */

function getMessageText(m) {
  return String(
    m.text || m.body || m.caption || m.msg?.text ||
    m.message?.conversation || m.message?.extendedTextMessage?.text ||
    m.message?.imageMessage?.caption || m.message?.videoMessage?.caption ||
    m.message?.documentMessage?.caption || ''
  ).trim()
}

function hasForwardedNewsletter(m) {
  const c = m.msg?.contextInfo || m.message?.extendedTextMessage?.contextInfo ||
    m.message?.imageMessage?.contextInfo || m.message?.videoMessage?.contextInfo ||
    m.message?.documentMessage?.contextInfo || m.message?.buttonsMessage?.contextInfo || {}

  return Boolean(
    c.forwardedNewsletterMessageInfo || c.isForwarded ||
    (typeof c.forwardingScore === 'number' && c.forwardingScore > 0)
  )
}

function detectRisk(m) {
  const text = getMessageText(m)
  const lower = text.toLowerCase()

  const channelLink = /(?:https?:\/\/)?(?:www\.)?(?:whatsapp\.com\/channel|wa\.me\/channel)\/[a-z0-9_-]+/i.test(text)
  const channelMention = /@newsletter/i.test(text)
  const groupInvite = /(?:https?:\/\/)?chat\.whatsapp\.com\/[a-z0-9]+/i.test(text)
  const forwardedChannel = hasForwardedNewsletter(m)

  const promoKeywords = [
    'promo', 'promosi', 'diskon', 'discount', 'sale', 'gratis', 'voucher', 
    'cashback', 'cash back', 'limited offer', 'order now', 'preorder', 
    'pre-order', 'join channel', 'gabung channel', 'join saluran', 
    'gabung saluran', 'follow channel', 'subscribe', 'subscribe channel', 
    'klik link', 'klik tautan', 'link saluran', 'saluran terbaru', 
    'channel baru', 'undang teman', 'invite', 'open order', 'po', 
    'ready stock', 'reseller', 'affiliate'
  ]

  const hasPromoWords = promoKeywords.some(k => lower.includes(k))

  return {
    text, channelLink, channelMention, groupInvite, forwardedChannel, hasPromoWords,
    channelLike: channelLink || channelMention || forwardedChannel,
    promoLike: hasPromoWords || channelLink || groupInvite || forwardedChannel
  }
}

const handler = async (m, { text, command, usedPrefix, isAdmin, isOwner }) => {
  const chat = global.db.data.chats[m.chat] || {}
  const action = text?.toLowerCase()?.trim() || 'status'
  const canManage = isAdmin || isOwner

  if (!canManage && action !== 'status') {
    return m.reply('❌ Perintah ini hanya untuk admin grup.')
  }

  const target = command.toLowerCase()

  if (['on', 'enable', 'aktif'].includes(action)) {
    if (target.includes('antipromo')) { chat.antiPromo = true; return m.reply('✅ AntiPromo berhasil diaktifkan.') }
    if (target.includes('antichannel')) { chat.antiChannel = true; return m.reply('✅ AntiChannel berhasil diaktifkan.') }
    if (target.includes('antiads')) { chat.antiPromo = true; chat.antiChannel = true; return m.reply('✅ AntiPromo + AntiChannel berhasil diaktifkan.') }
  }

  if (['off', 'disable', 'mati'].includes(action)) {
    if (target.includes('antipromo')) { chat.antiPromo = false; return m.reply('⛔ AntiPromo dimatikan.') }
    if (target.includes('antichannel')) { chat.antiChannel = false; return m.reply('⛔ AntiChannel dimatikan.') }
    if (target.includes('antiads')) { chat.antiPromo = false; chat.antiChannel = false; return m.reply('⛔ AntiPromo + AntiChannel dimatikan.') }
  }

  const status = `📌 *STATUS FILTER GRUP*\n\n` +
    `📢 AntiPromo   : ${chat.antiPromo ? 'ON ✅' : 'OFF ❌'}\n` +
    `🔗 AntiChannel : ${chat.antiChannel ? 'ON ✅' : 'OFF ❌'}\n\n` +
    `*Perintah:*\n` +
    `• ${usedPrefix}antipromo on/off\n` +
    `• ${usedPrefix}antichannel on/off\n` +
    `• ${usedPrefix}antiads on/off`

  return m.reply(status)
}

handler.help = ['antipromo <on/off>', 'antichannel <on/off>']
handler.tags = ['group']
handler.command = /^(antipromo|antipromosi|antichannel|antiads)$/i
handler.group = true

export async function before(m, { isBotAdmin, isAdmin, isOwner }) {
  if (m.isBaileys && m.fromMe) return !0
  if (!m.isGroup) return !0
  if (isAdmin || isOwner) return !0

  const DB = this.db || global.db
  let chat = DB?.data?.chats?.[m.chat] || {}

  const risk = detectRisk(m)
  const blockChannel = Boolean(chat.antiChannel && risk.channelLike)
  const blockPromo = Boolean(chat.antiPromo && risk.promoLike)

  if ((blockChannel || blockPromo) && isBotAdmin) {
      try {
          await this.sendMessage(m.chat, { delete: m.key })
      } catch (e) {
          console.error('[AntiPromo/Channel Error]', e)
      }
  }

  return !0
}

export default handler