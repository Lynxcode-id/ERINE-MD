// © INF PROJECT - Erine-MD
// Developed by INF PROJECT

import pkg from '@wishkeysocket/baileys'
const { S_WHATSAPP_NET } = pkg
import jimp from 'jimp'
const { Jimp } = jimp

let handler = async (m, { conn, command, usedPrefix }) => {
	let q = m.quoted ? m.quoted : m
	let mime = (q.msg || q).mimetype || q.mediaType || ''
	
	if (/image/g.test(mime) && !/webp/g.test(mime)) {
		await m.react('⏳')
		try {
			let media = await q.download()
			let { img } = await generateProfilePicture(media)
			
			await conn.query({
				tag: 'iq',
				attrs: {
					target: undefined,
					to: S_WHATSAPP_NET,
					type: 'set',
					xmlns: 'w:profile:picture'
				},
				content: [
					{
						tag: 'picture',
						attrs: { type: 'image' },
						content: img
					}
				]
			})
			
			await m.react('✅')
			m.reply(`✅ *Sukses!* Foto profil bot berhasil diganti.`)
		} catch (e) {
			console.error(e)
			await m.react('❌')
			m.reply(`❌ Terjadi kesalahan saat mengganti PP Bot.`)
		}
	} else {
		m.reply(`📸 Kirim/tag gambar dengan caption *${usedPrefix + command}*`)
	}
}

handler.help = ['setbotpp']
handler.tags = ['owner']
handler.command = /^(set(botpp|ppbot))$/i
handler.owner = true

export default handler

async function generateProfilePicture(media) {
	const j = await Jimp.read(media)
	const min = j.getWidth()
	const max = j.getHeight()
	const cropped = j.crop(0, 0, min, max)
	return {
		img: await cropped.scaleToFit(720, 720).getBufferAsync("image/jpeg")
	}
}
