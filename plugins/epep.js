/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Author     : Lynx Decode
 * 📞 Contact    : +62 882-5804-1396
 * 📢 Channel    : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * ⚠️ Note       : Keep credit to respect the creator!
 * ─────────────────────────
 * 📝 Plugin: Free Fire Stalker (Full Data Extraction)
 */

import axios from 'axios'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        return m.reply(`┌˚₊ ๑│ ꜰ ꜰ  ꜱ ᴛ ᴀ ʟ ᴋ ᴇ ʀ │๑˚₊ 🎮\n┇ \n│ ❌ *UID Free Fire kosong!*\n│ \n│ 📌 *Cara pakai:*\n│ ${usedPrefix + command} 3238006990\n┇ \n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`)
    }

    let uid = text.trim()
    if (!/^[0-9]+$/.test(uid)) {
        return m.reply('❌ UID tidak valid cuy! Harus berupa angka.')
    }

    await m.react('⏳')

    try {
        const apiUrl = `https://api.azbry.com/api/stalk/freefire?uid=${uid}`
        const { data } = await axios.get(apiUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'application/json'
            }
        })

        if (!data.status) {
            throw new Error(data.message || 'Gagal mengambil data dari API azbry.')
        }

        let d = data.data
        let basic = d.account_basic_info || {}
        let activity = d.account_activity || {}
        let overview = d.account_overview || {}
        let guild = d.guild_info || {}
        let pet = d.pet_details || {}
        let equip = d.equip_items || {}
        let img = d.profile_image

        let bio = basic.bio ? basic.bio.replace(/\n/g, ' ⏐ ') : '-'
        
        let characterList = equip.character ? equip.character.map(c => c.name).join(', ') : (overview.avatar_name || '-')
        let outfitList = equip.outfit ? equip.outfit.map(o => o.name).join(', ') : '-'
        let titleName = basic.title_name || overview.title_name || '-'

        let caption = `┌˚₊ ๑│ ꜰ ꜰ  ꜱ ᴛ ᴀ ʟ ᴋ ᴇ ʀ │๑˚₊ 🎮\n` +
                      `┇ \n` +
                      `│ 👤 *BASIC INFO*\n` +
                      `│ 📛 *Name:* ${basic.name || '-'}\n` +
                      `│ 🆔 *UID:* ${basic.uid || '-'}\n` +
                      `│ 📈 *Level:* ${basic.level || 0} (EXP: ${basic.exp || 0})\n` +
                      `│ ❤️ *Likes:* ${basic.likes || 0}\n` +
                      `│ 🛡️ *Honor Score:* ${basic.honor_score || 0}\n` +
                      `│ 🌍 *Region:* ${basic.region || '-'}\n` +
                      `│ 🏷️ *Title:* ${titleName}\n` +
                      `│ 🎫 *Elite Pass:* ${basic.has_elite_pass ? 'Ya' : 'Tidak'}\n` +
                      `│ 📝 *Bio:* ${bio}\n` +
                      `┇ \n` +
                      `│ ⚔️ *RANK & ACTIVITY*\n` +
                      `│ 🏆 *BR Rank Pts:* ${activity.br_rank || 0} (Max: ${activity.br_max_rank || 0})\n` +
                      `│ 🏅 *CS Rank Pts:* ${activity.cs_rank || 0} (Max: ${activity.cs_max_rank || 0})\n` +
                      `│ 🔄 *Patch/OB:* ${activity.most_recent_ob || '-'}\n` +
                      `│ 📅 *Dibuat:* ${activity.created_at || '-'}\n` +
                      `│ 🕒 *Last Login:* ${activity.last_login || '-'}\n` +
                      `┇ \n` +
                      `│ 🏰 *GUILD INFO*\n` +
                      `│ 🛡️ *Nama:* ${guild.guild_name || 'Tidak Ada'}\n` +
                      `│ 📊 *Level:* ${guild.guild_level || 0}\n` +
                      `│ 👥 *Member:* ${guild.live_members || 0}/${guild.capacity || 0}\n` +
                      `│ 👑 *Leader:* ${guild.leader ? guild.leader.leader_name : '-'}\n` +
                      `┇ \n` +
                      `│ 🐾 *PET DETAILS*\n` +
                      `│ 🦊 *Nama Pet:* ${pet.pet_name || '-'}\n` +
                      `│ 🧬 *Jenis:* ${pet.pet_item_name || '-'}\n` +
                      `│ ⭐ *Level Pet:* ${pet.pet_level || 0}\n` +
                      `│ ⚡ *Skill:* ${pet.selected_skill_name || '-'}\n` +
                      `┇ \n` +
                      `│ 👕 *EQUIPMENT*\n` +
                      `│ 🏃 *Character:* ${characterList}\n` +
                      `│ 👘 *Outfit:* ${outfitList}\n` +
                      `┇ \n` +
                      `└˚₊ ๑ ────────────── ๑˚₊\n` +
                      `> © ERINE-AI x INF PROJECT`

        if (img && img.startsWith('http')) {
            await conn.sendMessage(m.chat, { image: { url: img }, caption: caption }, { quoted: m })
        } else {
            await m.reply(caption)
        }

        await m.react('✅')

    } catch (error) {
        console.error('[FF STALK ERROR]', error)
        await m.react('❌')
        
        let errMsg = error.response?.data?.message || error.message || String(error)
        m.reply(`┌˚₊ ๑│ ꜱ ʏ ꜱ ᴛ ᴇ ᴍ  ᴇ ʀ ʀ ᴏ ʀ │๑˚₊ ❌\n┇ Terjadi kesalahan sistem.\n┇ *Detail:* ${errMsg}\n└˚₊ ๑ ────────────── ๑˚₊\n> © ERINE-AI`)
    }
}

handler.help = ['ffstalk <uid>']
handler.tags = ['tools', 'stalker']
handler.command = /^(epep|stalkff)$/i
handler.limit = true

export default handler