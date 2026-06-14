let handler = async (m, {
    conn,
    text,
    command,
    usedPrefix,
    args
}) => {
    // Inisialisasi database simulator jika belum ada
    if (!global.db.data.simulator) global.db.data.simulator = {};
    
    let id = m.sender;
    let data = global.db.data.simulator;
    let _db = global.db.data.users;

    let type = (args[0] || '').toLowerCase();

    const contextInfo = {
        isForwarded: true,
        forwardingScore: 9999,
        forwardedNewsletterMessageInfo: {
            newsletterJid: "120363400612665352@newsletter",
            newsletterName: "🌟 ᴇʀɪɴᴇ-ᴍᴅ ɪɴғᴏʀᴍᴀᴛɪᴏɴ",
            serverMessageId: -1
        }
    };

    // Date 
    let d = new Date(new Date + 3600000)
    let locale = 'id'
    let hari = d.toLocaleDateString(locale, { weekday: 'long' })
    let tanggal = d.toLocaleDateString(locale, {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    })

    // Harga barang
    const item = {
        rumah: 10000,
        warung: 4500,
        toko: 9000,
        makanan: 500,
        minuman: 200
    }

    // Avatar profile
    const avatar_man = ['https://telegra.ph/file/9e0ce46f45b72aa27f504.jpg', 'https://telegra.ph/file/64e7982c62dcf0d973a7d.jpg', 'https://telegra.ph/file/2bc0e23e6f56e2cb4852a.jpg'];
    const avatar_girl = ['https://telegra.ph/file/d04b6a04dbe0d4df0463a.jpg', 'https://telegra.ph/file/2d60e4afa52d62a0fb631.jpg', 'https://telegra.ph/file/dfbba9d559d4fba2ca5e9.jpg'];

    const replyMsg = async (teks) => {
        await conn.sendMessage(m.chat, { text: teks, contextInfo }, { quoted: m });
    }

    switch (type) {
        case 'login':
            if (data[id]) return replyMsg('Kamu kan sudah login😉..\nklo mau logout ketik:\n*/simulator logout*');

            if (!args[1]) return replyMsg('*kamu salah ih 😓\n\nkek gini ya:\n*/simulator login nama|cewe/cowo|umur*');
            
            let t1 = args[1].split('|')[0]
            let t2 = args[1].split('|')[1]
            let t3 = args[1].split('|')[2]

            if (!t1) return replyMsg('*Masukan nama*')
            
            if (t2 !== 'cowo' && t2 !== 'cewe') return replyMsg('*Pilih cewe/cowo*')
          
            let pp = t2 == 'cewe' ? await pickRandom(avatar_girl) : await pickRandom(avatar_man);
            
            if (!t3) return replyMsg('*Masukan umur*')
            if (isNaN(t3)) return replyMsg('*Masukan angka dengan benar*')
                        
            data[id] = {
                nama: t1,
                gender: t2,
                umur: t3,
                login: true,
                profile: pp,
                suami: '',
                istri: '',
                tgl_nikah: '',
                status_nikah: 'belum nikah',
                mas_kawin: '',
                toko_mu: 0,
                mobil_mu: 0,
                emas_mu: 0,
                perhiasan_mu: 0,
                makanan_mu: 0,
                minuman_mu: 0,
                warung_mu: 0,
                rumah_mu: 0
            };

            await conn.sendMessage(m.chat, {
                image: { url: pp },
                caption: `Horee🎉.. kamu sudah login ke dunia simulator 😉, perjalanan ini tidak pendek lho..\nkamu akan menikmati simulator yang menakjubkan dan fantastis banget😃\n\n*Biodata kamu di simulator*:\n╭ [ *INFORMATION* ]\n┃ Nama: ${t1}\n┃ Gender: ${t2}\n┃ Umur: ${t3}\n┃ Login: true\n╰❲ *S I M U L A T O R  V1.0* (beta) ❳`,
                contextInfo
            }, { quoted: m });
            break;

        case 'logout':
            if (!data[id] || !data[id].login) throw 'Kamu belum login jadi kamu ga bisa logout ❎';
        
            if (args[1] == 'yes') {
                delete data[id]
                replyMsg('*Yah kamu logout dari simulator 😢*')
            } else if (args[1] == 'no') {
                replyMsg('*Hore🎉 kamu tidak jadi logout dari simulator 😁*')
            } else {
                replyMsg('Apakah beneran mau logout kak? 🥲\n*/simulator logout yes/no*')
            }
            break

        case 'mulai':
        case 'start':
            if (!data[id]) throw 'Kamu belum login ❎'
        
            if (data[id].login == true) {
                const { key } = await conn.sendMessage(m.chat, { text: '*World creating for your life....*' }, { quoted: m });
                const kata = `Dunia yang cerah⛅, kamu menjalani kehidupan baru dengan aman, tentram, dan sejahtera. 
Welcome to simulator kamu akan menemukan kesenangan dalam simulator kali ini😉, banyak pengalaman terbaik dalam simulator saat ini, simulator yang bagaikan kehidupan sebenarnya🎉

*Kamu join sebagai*
name: *${data[id].nama}*
jenis kelamin: *${data[id].gender}*
umur: *${data[id].umur}*

*Selamat menikmati simulator Versi 1.0 (beta)* 🙏`;

                await conn.delay(1500)
                await conn.sendMessage(m.chat, { text: '*sukses membuat dunia baru*', edit: key })
                await conn.sendMessage(m.chat, {
                    image: { url: 'https://telegra.ph/file/720f729d695eef340dc0b.jpg' },
                    caption: kata,
                    contextInfo
                }, { quoted: m });
            } else {
                const pesan = await conn.sendMessage(m.chat, { text: '*World creating for your life....*' });
                await conn.delay(1500);
                await conn.sendMessage(m.chat, { text: 'Kelihatannya kamu belum login deh🙄', edit: pesan.key });
            }
            break

        case 'buat':
            if (!data[id] || !data[id].login) throw 'Kamu belum login jadi kamu ga bisa create barang ❎'
            
            let kurang;
            if (args[1] == 'rumah') {
                if (data[id].rumah_mu >= 2) return replyMsg(`*kamu sudah mempunyai ${data[id].rumah_mu} ${args[1]}* 🏠`)
                if (_db[id].money >= item.rumah) {
                    data[id].rumah_mu += 1
                    _db[id].money -= item.rumah
                    replyMsg('Kamu telah berhasil membuat 🏡 (rumah) seharga Rp10.000')
                } else {
                    kurang = kurangBerapa(_db[id].money, item.rumah)
                    replyMsg(`*yah uang kurang ${kurang}/10000, jadi kamu tidak dapat membuat sebuah ${args[1]}*`)
                }
            } else if (args[1] == 'warung') {
                if (data[id].warung_mu >= 3) return replyMsg(`*kamu sudah mempunyai ${data[id].warung_mu} ${args[1]}* 🏪`)
                if (_db[id].money >= item.warung) {
                    data[id].warung_mu += 1
                    _db[id].money -= item.warung
                    replyMsg('Kamu telah berhasil membuat 🏪 (warung) seharga Rp4.500')
                } else {
                    kurang = kurangBerapa(_db[id].money, item.warung)
                    replyMsg(`*yah uang kurang ${kurang}/${item.warung}, jadi kamu tidak dapat membuat sebuah ${args[1]}*`)
                }
            } else if (args[1] == 'toko') {
                if (data[id].toko_mu >= 3) return replyMsg(`*kamu sudah mempunyai ${data[id].toko_mu} ${args[1]}* 🏬`)
                if (_db[id].money >= item.toko) {
                    data[id].toko_mu += 1
                    _db[id].money -= item.toko
                    replyMsg('Kamu telah berhasil membuat 🏬 (toko) seharga Rp9.000')
                } else {
                    kurang = kurangBerapa(_db[id].money, item.toko)
                    replyMsg(`*yah uang kurang ${kurang}/${item.toko}, jadi kamu tidak dapat membuat sebuah ${args[1]}*`)
                }
            } else if (args[1] == 'makanan') {
                if (data[id].makanan_mu >= 35) return replyMsg(`*kamu sudah mempunyai ${data[id].makanan_mu} ${args[1]}* 🌭`)
                if (_db[id].money >= item.makanan) {
                    data[id].makanan_mu += 1
                    _db[id].money -= item.makanan
                    replyMsg('Kamu telah berhasil membuat 🌭 (makanan) seharga Rp500')
                } else {
                    kurang = kurangBerapa(_db[id].money, item.makanan)
                    replyMsg(`*yah uang kurang ${kurang}/${item.makanan}, jadi kamu tidak dapat membuat sebuah ${args[1]}*`)
                }
            } else if (args[1] == 'minuman') {
                if (data[id].minuman_mu >= 20) return replyMsg(`*kamu sudah mempunyai ${data[id].minuman_mu} ${args[1]}* 🍹`)
                if (_db[id].money >= item.minuman) {
                    data[id].minuman_mu += 1
                    _db[id].money -= item.minuman
                    replyMsg('Kamu telah berhasil membuat 🍹 (minuman) seharga Rp200')
                } else {
                    kurang = kurangBerapa(_db[id].money, item.minuman)
                    replyMsg(`*yah uang kurang ${kurang}/${item.minuman}, jadi kamu tidak dapat membuat sebuah ${args[1]}*`)
                }
            } else {
                replyMsg(`List yang dapat dibuat:\n\n❲ *Created* ❳\nrumah: Rp10.000,\nwarung: Rp4.500,\ntoko: Rp9.000,\nmakanan: Rp500,\nminuman: Rp200`)
            }
            break

        case 'cerai':
            if (!data[id] || data[id].login !== true) throw 'Kamu belum login jadi kamu ga bisa cerai ❎'
            if (data[id].status_nikah == 'belum nikah') return replyMsg(`Kamu kan belum nikah 🙄..\n\napakah kamu mau nikah?\njika mau ketik */simulator nikah*`)
            
            let pcr = _db[id].pasangan
            if (!pcr) return replyMsg('Pasangan kamu tidak ditemukan.');

            if (!data[pcr]) data[pcr] = {};

            Object.assign(data[id], {
                suami: '', istri: '', tgl_nikah: '', mas_kawin: '', status_nikah: 'belum nikah'
            });
            Object.assign(data[pcr], {
                suami: '', istri: '', tgl_nikah: '', mas_kawin: '', status_nikah: 'belum nikah'
            });

            replyMsg(`kamu telah bercerai dengan ${pcr.split(`@`)[0]} 😢`);
            break 

        case 'nikah': 
        case 'menikah':
            if (!data[id] || !data[id].login) throw 'Kamu belum login jadi kamu ga bisa nikah ❎'
            if (!_db[id].pasangan) return replyMsg('kamu tidak mempunyai pasangan yang mau diajak nikah😢\ncoba ge cari pacar dulu dengan mengetik */jadian @tag*')
            
            const psgn = _db[id].pasangan
            if (!data[psgn]) data[psgn] = {}; // safety check

            if (data[id].status_nikah == 'nikah') return replyMsg(`Kamu kan sudah nikah 🙄..\n\napakah kamu mau cerai?\njika mau ketik */simulator cerai*`)
            if (data[id].emas_mu <= 0) return replyMsg('kamu tidak mempunyai emas😅\nbeli dengan cara */pabrik beli emas*')

            data[id].emas_mu -= 1
            
            if (data[id].gender == 'cowo') {
                Object.assign(data[id], { suami: id, istri: psgn, tgl_nikah: `${hari}, ${tanggal}`, mas_kawin: 'emas', status_nikah: 'nikah' });
                Object.assign(data[psgn], { suami: id, istri: psgn, tgl_nikah: `${hari}, ${tanggal}`, mas_kawin: 'emas', status_nikah: 'nikah' });
            } else if (data[id].gender == 'cewe') {
                Object.assign(data[id], { suami: psgn, istri: id, tgl_nikah: `${hari}, ${tanggal}`, mas_kawin: 'emas', status_nikah: 'nikah' });
                Object.assign(data[psgn], { suami: psgn, istri: id, tgl_nikah: `${hari}, ${tanggal}`, mas_kawin: 'emas', status_nikah: 'nikah' });
            }

            const nikahProses = [
                '*🕐 kamu sedang mempersiapkan diri*',
                '*memulai akad pernikahan...*',
                `*kamu menyerahkan mas kawin dengan seperangkat alat sholat berupa EMAS* `,
                '*semua orang bilang sah*😊 !!!',
                `🎉 *selamat sekarang kamu sudah menikah dengan ${_db[id].pasangan.split('@')[0]}*`
            ]

            let nikahan = await conn.sendMessage(m.chat, { text: 'pada hari pernikahan💍' });
            await conn.delay(500)
            
            for (let i = 0; i < nikahProses.length; i++) {
                await conn.sendMessage(m.chat, { text: nikahProses[i], edit: nikahan.key })
                await conn.delay(900)
            }
            
            await conn.delay(2000)
            await conn.sendMessage(m.chat, {
                image: { url: 'https://telegra.ph/file/4e844402dcacd2706c2ae.jpg' },
                caption: `🎉 *Hore kamu sudah menikah pada hari ini* 😆 semoga langgeng ya😊, kehidupan ini bukan hanya untuk bersenang-senang sahaja tetapi menjalani hubungan dengan penuh kebahagiaan 😉.\n\n*Pernikahan @${id.split(`@`)[0]} & @${psgn.split(`@`)[0]}*\n\nPada hari & tanggal: ${hari}, ${tanggal}\n\n            @${id.split(`@`)[0]}\n                     💘❤️💘\n            @${psgn.split(`@`)[0]}\n\nTanggal nikah: ${hari}, ${tanggal}\nmas kawin: emas\n\n*Note*: untuk melihat status kalian berdua bisa ketik\n*/simulator status*`, 
                contextInfo: {
                    ...contextInfo,
                    mentionedJid: [id, psgn]
                }
            }, { quoted: m })
            break 

        case 'status':
            if (!data[id]) throw 'Kamu belum login jadi kamu ga bisa cek status kamu ❎'
            
            let statMsg = `*Status kamu dalam dunia simulator*\n\nNama: ${data[id].nama}\nUmur: ${data[id].umur}\nGender: ${data[id].gender}\nPasangan: ${data[id].gender == 'cowo' ? (data[id].istri ? `@${data[id].istri.split('@')[0]}` : 'kamu belum nikah') : (data[id].suami ? `@${data[id].suami.split('@')[0]}` : 'kamu belum nikah')} 💘\nStatus: ${data[id].status_nikah ? data[id].status_nikah : 'kamu jomblo'}\nTanggal nikah: ${data[id].tgl_nikah ? data[id].tgl_nikah : 'kamu belum nikah'}`;
            
            let mentionsList = [];
            if (data[id].istri) mentionsList.push(data[id].istri);
            if (data[id].suami) mentionsList.push(data[id].suami);

            await conn.sendMessage(m.chat, {
                text: statMsg,
                contextInfo: {
                    ...contextInfo,
                    mentionedJid: mentionsList
                }
            }, { quoted: m });
            break 

        case 'help': 
        case 'bantuan':
            await conn.sendMessage(m.chat, {
                image: { url: 'https://telegra.ph/file/133ec3d88bdd3aae31b9f.jpg' },
                caption: `    ❲ *SIMULATOR v1.0 (beta)* ❳\n\nPenggunaan fitur *SIMULATOR*\n*/simulator login* untuk login kedalam dunia simulator🔓\n*/simulator start* untuk memulai dunia simulator🚀\n*/simulator logout* untuk logout dari dunia simulator🚪\n*/simulator nikah* untuk menikah dengan pasangan kamu 👰\n*/simulator status* untuk melihat status kamu disimulator 🏘️\n\n*SIMULATOR V1.0 (beta)*`,
                contextInfo
            }, { quoted: m })
            break
            
        default:
            replyMsg(`❓perintah salah gunakan */simulator help* untuk bantuan`)
    }
}

handler.help = handler.command = ['simulator']
handler.tags = ['simulator']
handler.register = true
export default handler

function pickRandom(list) {
    return list[Math.floor(list.length * Math.random())]
}

function kurangBerapa(nilai1, nilai2) {
    return Math.abs(nilai1 - nilai2);
}
