/**
 * 85% NO ENC - 100 FREE
 * Yang jual mental miskin + moga rejekinya seret
 * Mau riview script atau rename ulang script ini?
 * Tag yt : @lynxpresetkechee | Github : Lynxcode-id
 * Script akan selalu di kembangkan, ketemu bug/error
 * Ketik .lapor penanganan fix 24j kelar!!
 * Based on Nao ESM
 * Base Script : Hlman Ryo
 * Dev - Pengembang² :  Erine MD - Lynx code
 * Ikuti saluran kami untuk info update project ini
 * https://chat.whatsapp.com/CSMhBRB2DoICQwyy61txr0
 * https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
**/

import { watchFile, unwatchFile } from 'fs'
import chalk from 'chalk'
import { fileURLToPath } from 'url'
import moment from 'moment-timezone'

// SET TIME ZONE - WAKTU

let wibh = moment.tz('Asia/Makassar').format('HH')
let wibm = moment.tz('Asia/Makassar').format('mm')
let wibs = moment.tz('Asia/Makassar').format('ss')
let wktuwib = `${wibh} H ${wibm} M ${wibs} S`
let wktugeneral = `${wibh}:${wibm}:${wibs}`

let d = new Date(new Date + 3600000)
let locale = 'id'
let weton = ['Pahing', 'Pon', 'Wage', 'Kliwon', 'Legi'][Math.floor(d / 84600000) % 5]
let week = d.toLocaleDateString(locale, { weekday: 'long' })
let date = d.toLocaleDateString(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
})
const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)

// MAIN INFO - KETERANGAN

global.owner = [['6288258041396', 'ʟʏɴx ᴅᴇᴄᴏᴅᴇ', true]] // Ganti
global.mods = [] // Bebas 
global.prems = [] // Bebas 
global.nomorbot = '6285185681661' // No Bot
global.nomorown = '6288258041396'// No Utama
global.nameown = 'ʟʏɴx ᴅᴇᴄᴏᴅᴇ' // Nama Owner
global.version = '10.0.2' // Versi Script Ini
global.autotyping = false // Default : false
global.autorecording = false // Default : false

// BOT SETTING WATERMARK

global.readMore = readMore
global.author = 'ҽɾιɳҽ ρɾσʝҽƈƚ'
global.namebot = 'ҽɾιɳҽ ɱԃ'
global.wm = 'ҽɾιɳҽ-ɱԃ x ʅყɳx ɱαɳυҽʅȥ'
global.watermark = wm
global.botdate = `❈ DATE: ${week} ${date}\n❀ 𝗧𝗶𝗺𝗲: ${wktuwib}`
global.bottime = `T I M E : ${wktuwib}`
global.stickpack = `ᴇʀɪɴᴇ ᴘʀᴏᴊᴇᴄᴛ ✦\nPowered by ${namebot}\nwa.me/${nomorbot}`
global.stickauth = `ƈ : ҽɾʝɳҽ ρɾσʝҽƈƚ`
global.week = `${week} ${date}`
global.wibb = `${wktuwib}`

// YOUR SOSMED

global.sig = 'https://www.instagram.com/lynnnx_35fps'
global.sgh = '-'
global.sgc = 'https://chat.whatsapp.com/D0i9bk7QHc67iLd3HZGNJs'
global.sgw = '_'
global.sdc = '-'
global.sfb = ''
global.snh = ''

// SETTING CPANEL

global.egg = "15"
global.nestid = "5"
global.loc = "1"
global.domain = "-"
global.apikey = "-"
global.capikey = "-"

// SETTING DONASI 

global.qris = 'https://c.termai.cc/i119/hZR1g.jpg'
global.psaweria = 'https://saweria.co/LynxPreset'

// THUMBNAIL MENU - VID ALL MENU

global.welcomeBg = 'https://c.termai.cc/i136/U9UWxB.jpg'
global.goodbyeBg = 'https://c.termai.cc/i166/lWwS.jpg'
global.menuThumb = 'https://c.termai.cc/i166/wRqFO.png'
global.videothumb = 'https://c.termai.cc/v188/CHBtAz.mp4'
global.menuAudio = [
    'https://c.termai.cc/a182/V6Q4nmh.mp3',
    'https://c.termai.cc/a190/JTA7.mp3',
    'https://c.termai.cc/a178/OJgl41.mp3',
    'https://c.termai.cc/a177/DG05K.mp3',
    'https://c.termai.cc/a175/sFlTd.mp3',
    'https://c.termai.cc/a103/gGHRuet.mp3',
    'https://c.termai.cc/a148/kJfl.mp3'
]

// SET IDN - SHOWROOM 

export const GROUP_IDS = [
    "120363166736262014@g.us",
    "120363161553336082@g.us",
    "120363395548328688@g.us",
    "120363426323468560@g.us"
];
export const CHANNEL_IDS = [
    "120363251106848970@newsletter",
    "120363296632130473@newsletter",
    "120363400411310874@newsletter"
];
 
// SET CHANNEL INFORMATION

global.chId = '120363400612665352@newsletter'
global.newsletterName = '「 🐣 ᴇʀɪɴᴇ-ᴍᴅ ɪɴғᴏʀᴍᴀᴛɪᴏɴ 」'

// SET MENU DISPLAY

global.dmenut = '𖠌 ┈┈┈〈' //top
global.dmenub = '┊↬' //body
global.dmenub2 = '┊' //body for info cmd on Default menu
global.dmenuf = '┗╌╌╌╌╌╌╌┈╼' //footer
global.dashmenu = '┄┄┄⪩ *DASHBOARD* ⪨┈┈┈'
global.cmenut = '❏––––––『' //top
global.cmenuh = '』––––––' //header
global.cmenub = '┊𖤐 ' //body
global.cmenuf = '┗━━━━━━━╾\n' //footer
global.cmenua = '\n⌕ ❙❘❙❙❘❙❚❙❘❙❙❚❙❘❙❘❙❚❙❘❙❙❚❙❘❙❙❘❙❚❙❘ ⌕\n     '
global.pmenus = '𖤐'
global.htki = '––––––『' // Hiasan Titile (KIRI)
global.htka = '』––––––' // Hiasan Title  (KANAN)
global.lopr = 'Ⓟ' //LOGO PREMIUM ON MENU.JS
global.lolm = 'Ⓛ' //LOGO LIMIT/FREE ON MENU.JS
global.htjava = ''    //hiasan Doang :v
global.hsquere = ['✿', '❀', '✮']

// SET RESPON BOT

global.wait = '🫵🏻😋 ᴛᴜɴɢɢᴜ ʙᴇɴᴛᴀʀ ᴇʀɪɴᴇ ᴍᴀᴋᴀɴ...'
global.eror = '🐣 ʏᴀʜ ᴇʀʀᴏʀ ɴɪʜ ᴜʟᴀɴɢ ʟᴀɢɪ ɴᴀɴᴛɪ ʏᴀ!'

// SET YOUR API

global.APIs = {
    ryzen: 'https://api.ryzendesu.vip',
    faa: 'https://api-faa.my.id',
    lol: 'https://api.lolhuman.xyz',
    deline: 'https://api.deline.web.id'
}

// SET YOUR APIKEY

global.APIKeys = {
    'https://api.lolhuman.xyz': 'ISI_APIKEY_KAMU'
}

global.flaaa2 = [
    "https://flamingtext.com/net-fu/proxy_form.cgi?&imageoutput=true&script=water-logo&script=water-logo&fontsize=90&doScale=true&scaleWidth=800&scaleHeight=500&fontsize=100&fillTextColor=%23000&shadowGlowColor=%23000&backgroundColor=%23000&text=",
    "https://flamingtext.com/net-fu/proxy_form.cgi?&imageoutput=true&script=crafts-logo&fontsize=90&doScale=true&scaleWidth=800&scaleHeight=500&text=",
    "https://flamingtext.com/net-fu/proxy_form.cgi?&imageoutput=true&script=amped-logo&doScale=true&scaleWidth=800&scaleHeight=500&text=",
    "https://www6.flamingtext.com/net-fu/proxy_form.cgi?&imageoutput=true&script=sketch-name&doScale=true&scaleWidth=800&scaleHeight=500&fontsize=100&fillTextType=1&fillTextPattern=Warning!&text=",
    "https://www6.flamingtext.com/net-fu/proxy_form.cgi?&imageoutput=true&script=sketch-name&doScale=true&scaleWidth=800&scaleHeight=500&fontsize=100&fillTextType=1&fillTextPattern=Warning!&fillColor1Color=%23f2aa4c&fillColor2Color=%23f2aa4c&fillColor3Color=%23f2aa4c&fillColor4Color=%23f2aa4c&fillColor5Color=%23f2aa4c&fillColor6Color=%23f2aa4c&fillColor7Color=%23f2aa4c&fillColor8Color=%23f2aa4c&fillColor9Color=%23f2aa4c&fillColor10Color=%23f2aa4c&fillOutlineColor=%23f2aa4c&fillOutline2Color=%23f2aa4c&backgroundColor=%23101820&text="
]
global.fla = [
    "https://flamingtext.com/net-fu/proxy_form.cgi?&imageoutput=true&script=water-logo&script=water-logo&fontsize=90&doScale=true&scaleWidth=800&scaleHeight=500&fontsize=100&fillTextColor=%23000&shadowGlowColor=%23000&backgroundColor=%23000&text=",
    "https://flamingtext.com/net-fu/proxy_form.cgi?&imageoutput=true&script=crafts-logo&fontsize=90&doScale=true&scaleWidth=800&scaleHeight=500&text=",
    "https://flamingtext.com/net-fu/proxy_form.cgi?&imageoutput=true&script=amped-logo&doScale=true&scaleWidth=800&scaleHeight=500&text=",
    "https://www6.flamingtext.com/net-fu/proxy_form.cgi?&imageoutput=true&script=sketch-name&doScale=true&scaleWidth=800&scaleHeight=500&fontsize=100&fillTextType=1&fillTextPattern=Warning!&text=",
    "https://www6.flamingtext.com/net-fu/proxy_form.cgi?&imageoutput=true&script=sketch-name&doScale=true&scaleWidth=800&scaleHeight=500&fontsize=100&fillTextType=1&fillTextPattern=Warning!&fillColor1Color=%23f2aa4c&fillColor2Color=%23f2aa4c&fillColor3Color=%23f2aa4c&fillColor4Color=%23f2aa4c&fillColor5Color=%23f2aa4c&fillColor6Color=%23f2aa4c&fillColor7Color=%23f2aa4c&fillColor8Color=%23f2aa4c&fillColor9Color=%23f2aa4c&fillColor10Color=%23f2aa4c&fillOutlineColor=%23f2aa4c&fillOutline2Color=%23f2aa4c&backgroundColor=%23101820&text="
]
/*============== EMOJI ==============*/
global.rpg = {
	emoticon(string) {
		string = string.toLowerCase()
		let emot = {
			level: '🧬',
			limit: '🌌',
			health: '❤️',
			exp: '✉️',
			money: '💵',
			potion: '🥤',
			diamond: '💎',
			common: '📦',
			uncommon: '🎁',
			mythic: '🗳️',
			legendary: '🗃️',
			pet: '🎁',
			trash: '🗑',
			armor: '🥼',
			sword: '⚔️',
			pickaxe: '⛏️',
			fishingrod: '🎣',
			bow: '🏹',
			wood: '🪵',
			rock: '🪨',
			string: '🕸️',
			horse: '🐎',
			cat: '🐈',
			dog: '🐕',
			fox: '🦊',
			wolf: '🐺',
			centaur: '🐎',
			phoenix: '🦜',
			dragon: '🐉',
			petfood: '🍖',
			iron: '⛓️',
			gold: '👑',
			emerald: '💚',
			bibitmangga: '🌾',
			bibitanggur: '🌾',
			bibitjeruk: '🌾',
			bibitpisang: '🌾',
			bibitapel: '🌾',
			mangga: '🥭',
			anggur: '🍇',
			jeruk: '🍊',
			pisang: '🍌',
			apel: '🍎',
			ayam: '🐔',
			kambing: '🐐',
			sapi: '🐄',
			kerbau: '🐃',
			babi: '🐖',
			harimau: '🐅',
			banteng: '🐂',
			monyet: '🐒',
			babihutan: '🐗',
			panda: '🐼',
			gajah: '🐘',
			buaya: '🐊',
			orca: '🐋',
			paus: '🐳',
			lumba: '🐬',
			hiu: '🦈',
			ikan: '🐟',
			lele: '🐟',
			bawal: '🐡',
			nila: '🐠',
			kepiting: '🦀',
			lobster: '🦞',
			gurita: '🐙',
			cumi: '🦑',
			udang: '🦐',
			steak: '🍝',
			sate: '🍢',
			rendang: '🍜',
			kornet: '🥣',
			nugget: '🍱',
			bluefin: '🍲',
			seafood: '🍛',
			sushi: '🍣',
			moluska: '🥘',
			squidprawm: '🍤',
			rumahsakit: '🏥',
			restoran: '🏭',
			pabrik: '🏯',
			tambang: '⚒️',
			pelabuhan: '🛳️'
		}
		let results = Object.keys(emot).map(v => [v, new RegExp(v, 'gi')]).filter(v => v[1].test(string))
		if (!results.length) return ''
		else return emot[results[0][0]]
	}
}

let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
    unwatchFile(file)
    console.log(chalk.redBright("Update 'config.js'"))
    import(`${file}?update=${Date.now()}`)
})
