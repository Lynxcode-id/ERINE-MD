const quotesIslami = [
    "Barangsiapa yang menempuh jalan untuk mencari ilmu, maka Allah akan mudahkan baginya jalan menuju surga. (HR. Muslim)",
    "Janganlah engkau bersedih, sesungguhnya Allah bersama kita. (QS. At-Taubah: 40)",
    "Boleh jadi kamu membenci sesuatu, padahal ia amat baik bagimu. (QS. Al-Baqarah: 216)",
    "Maka sesungguhnya bersama kesulitan ada kemudahan. (QS. Al-Insyirah: 5)",
    "Sebaik-baik manusia adalah yang paling bermanfaat bagi manusia lainnya. (HR. Ahmad)",
    "Sabar itu ilmunya tingkat tinggi, belajarnya setiap hari, latihannya setiap saat, dan ujiannya sering mendadak.",
    "Allah tidak membebani seseorang melainkan sesuai dengan kesanggupannya. (QS. Al-Baqarah: 286)",
    "Hati menjadi tenang bukan karena tidak ada masalah, tapi karena ada Allah di dalamnya.",
    "Jadikanlah sabar dan shalat sebagai penolongmu. (QS. Al-Baqarah: 45)",
    "Doa adalah senjata orang mukmin, tiang agama, dan cahaya langit dan bumi.",
    "Terkadang Allah membiarkanmu menangis, agar kamu menyadari betapa berharganya sebuah senyuman.",
    "Jangan pernah meremehkan kebaikan sekecil apapun, meski hanya dengan senyuman. (HR. Muslim)",
    "Rezeki itu sudah tertakar, tidak akan mungkin tertukar. Tetaplah berikhtiar dan bertawakal.",
    "Tidak ada kesuksesan tanpa kerja keras. Tidak ada keberhasilan tanpa doa.",
    "Orang yang kuat bukanlah yang pandai bergulat, tapi yang mampu menahan amarahnya. (HR. Bukhari)",
    "Setiap napas yang kita hembuskan adalah langkah menuju ajal, maka isilah dengan kebaikan.",
    "Syukuri apa yang kamu miliki, maka Allah akan menambah kenikmatanmu. (QS. Ibrahim: 7)",
    "Jangan menjelaskan dirimu kepada siapapun, karena yang menyukaimu tidak butuh itu, dan yang membencimu tidak percaya itu. (Ali bin Abi Thalib)",
    "Balaslah keburukan dengan kebaikan, niscaya permusuhan akan berubah menjadi persahabatan.",
    "Hidup ini sementara, akhirat itu selamanya. Jangan korbankan yang abadi demi yang fana."
]

let handler = async (m, { conn }) => {
    let randomQuote = quotesIslami[Math.floor(Math.random() * quotesIslami.length)]

    let teks = `📚 _وَعَلَيْكُمْ السَّلاَمُ وَرَحْمَةُ اللهِ وَبَرَكَاتُهُ_\n` +
               `_wa'alaikumussalam wa rahmatullahi wa barakatuh_\n\n` +
               `┌˚₊ ๑│ ɪ s ʟ ᴀ ᴍ ɪ ᴄ  ǫ ᴜ ᴏ ᴛ ᴇ s │๑˚₊ 🕌\n` +
               `┇ \n` +
               `│ 💡 "${randomQuote}"\n` +
               `┇ \n` +
               `│ 📌 _Orang yang mengucapkan salam mendapat\n` +
               `│ 30 pahala, dan yang membalasnya\n` +
               `│ mendapat ridha dari Allah SWT._\n` +
               `┇ \n` +
               `└˚₊ ๑ ────────────── ๑˚₊\n` +
               `> © ERINE-AI`

    await conn.sendMessage(m.chat, {
        react: {
            text: '🙏',
            key: m.key
        }
    })

    await conn.sendMessage(m.chat, { text: teks }, { quoted: m })
}

handler.customPrefix = /^(as{1,2}alamu?alaikum|as{1,2}alam|salam|as{1,2}alamualaikum|saml[ie]kum|likum|s-a-l-a-m|as+alamu[' ]?alaykum)/i
handler.command = new RegExp()

export default handler