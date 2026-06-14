/*
   *Roblox Stalk V2*
   type : plugins esm 
*/

import axios from 'axios'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`📦 Contoh:\n${usedPrefix + command} elz_gokilll`)

  await m.react('⏳')

  try {
    let res = await axios.get(`https://api.theresav.biz.id/stalk/roblox?username=${encodeURIComponent(text)}&apikey=x34J0`)
    let json = res.data

    if (!json.status || !json.result) {
      await m.react('❌')
      return m.reply('❌ Gagal mengambil data. Username mungkin tidak ditemukan.')
    }

    let { 
      id, username, displayName, description, created, isBanned, hasVerifiedBadge, 
      presence, social, avatar, groups, achievements 
    } = json.result

    let caption = `*🕹️ Roblox User Stalk (v2)*\n\n`
    caption += `👤 *Username:* ${username} (ID: ${id})\n`
    caption += `📛 *Display Name:* ${displayName}\n`
    caption += `📅 *Akun Dibuat:* ${new Date(created).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}\n`
    caption += `📜 *Deskripsi:* ${description || '-'}\n`
    caption += `✅ *Verified Badge:* ${hasVerifiedBadge ? '✅' : '❌'}\n`
    caption += `🚫 *Banned:* ${isBanned ? '✅' : '❌'}\n\n`
    
    caption += `*📡 Presence:*\n`
    caption += `📍 *Last Location:* ${presence?.lastLocation || 'Tidak tersedia'}\n\n`
    
    caption += `*📊 Stats (Social):*\n`
    caption += `👥 *Friends:* ${social?.friendsCount || 0}\n`
    caption += `👣 *Followers:* ${social?.followersCount || 0}\n`
    caption += `📌 *Following:* ${social?.followingCount || 0}\n\n`

    if (groups?.list && groups.list.length > 0) {
      caption += `*🏢 Groups (Top 5):*\n`
      groups.list.slice(0, 5).forEach((g, i) => {
        caption += `${i + 1}. ${g.name} (${g.role})\n`
      })
      caption += '\n'
    }

    if (avatar?.outfits && avatar.outfits.length > 0) {
      caption += `*👕 Outfits (Top 5):*\n`
      avatar.outfits.slice(0, 5).forEach((o, i) => {
        caption += `${i + 1}. ${o.name}\n`
      })
      caption += '\n'
    }

    if (achievements?.robloxBadges && achievements.robloxBadges.length > 0) {
      caption += `*🎖️ Roblox Badges:*\n`
      achievements.robloxBadges.forEach((b, i) => {
        caption += `${i + 1}. ${b.name}\n`
      })
    }

    let validImage = avatar?.thumbnail && avatar.thumbnail.startsWith('http') 
      ? avatar.thumbnail 
      : 'https://i.ibb.co/1s8T3sY/48f7ce63c7aa.jpg'

    await conn.sendMessage(m.chat, {
      image: { url: validImage },
      caption: caption.trim(),
      mimetype: 'image/jpeg',
      fileName: 'profile.jpg'
    }, { quoted: m })

    await m.react('✅')

  } catch (err) {
    console.error('[ROBLOX STALK V2 ERROR]', err)
    await m.react('❌')
    m.reply(`⚠️ *System Error:*\n_${err.response?.data?.message || err.message || 'Terjadi kesalahan pada server API.'}_`)
  }
}

handler.help = ['robloxstalk2 <username>', 'stalkroblox2 <username>']
handler.tags = ['stalk']
handler.command = /^(robloxstalk2|stalkroblox2)$/i
handler.limit = true

export default handler