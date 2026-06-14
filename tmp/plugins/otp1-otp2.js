import axios from 'axios';
import fs from 'fs';
import { join } from 'path';
import { generateWAMessageFromContent, prepareWAMessageMedia, proto } from '@whiskeysockets/baileys'

// SET APIKEY MAH ID SALURAN LU
const apikey = '--PUNYA LU SENDIRI--'; 
const idSaluran = '120363400612665352@newsletter'; 
const dbPath = join(process.cwd(), 'database', 'saldoOtp.json');

if (!fs.existsSync(join(process.cwd(), 'database'))) {
    fs.mkdirSync(join(process.cwd(), 'database'), { recursive: true });
}
if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify({}, null, 2));
}

const loadDB = () => JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
const saveDB = (data) => fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
const toRupiah = (v) => new Intl.NumberFormat('id-ID').format(v);

const activeOrders = global.activeOrders || {};
const activeIntervals = global.activeIntervals || {};
global.activeOrders = activeOrders;
global.activeIntervals = activeIntervals;

async function sendInteractive(conn, jid, title, text, footer, buttonText, sections, quoted) {
    let msg = generateWAMessageFromContent(jid, {
        viewOnceMessage: {
            message: {
                messageContextInfo: {
                    deviceListMetadata: {},
                    deviceListMetadataVersion: 2
                },
                interactiveMessage: proto.Message.InteractiveMessage.fromObject({
                    body: { text },
                    footer: { text: footer },
                    header: { title, hasMediaAttachment: false },
                    nativeFlowMessage: {
                        buttons: [{
                            name: "single_select",
                            buttonParamsJson: JSON.stringify({ title: buttonText, sections })
                        }]
                    }
                })
            }
        }
    }, { quoted });
    return await conn.relayMessage(jid, msg.message, { messageId: msg.key.id });
}

async function sendQuickReply(conn, jid, text, footer, buttons, quoted) {
    let msg = generateWAMessageFromContent(jid, {
        viewOnceMessage: {
            message: {
                messageContextInfo: {
                    deviceListMetadata: {},
                    deviceListMetadataVersion: 2
                },
                interactiveMessage: proto.Message.InteractiveMessage.fromObject({
                    body: { text },
                    footer: { text: footer },
                    nativeFlowMessage: {
                        buttons: buttons.map(b => ({
                            name: "quick_reply",
                            buttonParamsJson: JSON.stringify({ display_text: b.text, id: b.id })
                        }))
                    }
                })
            }
        }
    }, { quoted });
    return await conn.relayMessage(jid, msg.message, { messageId: msg.key.id });
}

let handler = async (m, { conn, args, command, usedPrefix, isOwner }) => {
    let db = loadDB();
    const sender = m.sender;
    const prefix = usedPrefix || '.';
    const isV1 = command === 'nokosv1';
    const baseUrl = isV1 ? 'https://api.jasaotp.id/v1' : 'https://api.jasaotp.id/v2';

    if (!db[sender]) { db[sender] = 0; saveDB(db); }

    const action = args[0]?.toLowerCase();

    if (command === 'saldo') {
        return m.reply(`💳 *SALDO LYNX STORE*\n\nUser: @${sender.split('@')[0]}\nSaldo: *Rp ${toRupiah(db[sender])}*`, null, { mentions: [sender] });
    }

    if (command === 'addsaldo' && isOwner) {
        let target = m.quoted ? m.quoted.sender : (args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : null);
        let nom = parseInt(args[1]);
        if (!target || isNaN(nom)) return m.reply(`Contoh: ${prefix}addsaldo @tag 10000`);
        db[target] = (db[target] || 0) + nom;
        saveDB(db);
        return m.reply(`✅ Saldo @${target.split('@')[0]} ditambahkan Rp ${toRupiah(nom)}`, null, { mentions: [target] });
    }

    if (!action || action === 'list') {
        try {
            let res = await axios.get(`${baseUrl}/negara.php`);
            let rows = res.data.data.slice(0, 50).map(n => ({
                title: n.nama_negara.toUpperCase(),
                id: `${prefix}${command} layanan ${n.id_negara}`
            }));
            return await sendInteractive(conn, m.chat, "🛒 LYNX NOKOS STORE", `Pilih negara tujuan.\n\n💰 *Saldo:* Rp ${toRupiah(db[sender])}`, "» ʟʏɴx sᴛᴏʀᴇ ᴍᴀɴᴀɢᴇᴍᴇɴᴛ «", "DAFTAR NEGARA", [{ title: "🌍 PILIH NEGARA", rows }], m);
        } catch (e) { return m.reply("❌ API Gangguan.") }
    }

    if (action === 'layanan') {
        let idN = args[1];
        try {
            let res = await axios.get(`${baseUrl}/layanan.php?negara=${idN}`);
            let data = res.data[idN];
            let rows = Object.keys(data).map(k => ({
                title: data[k].layanan.toUpperCase(),
                description: `Rp ${toRupiah(data[k].harga)} | Stok: ${data[k].stok}`,
                id: `${prefix}${command} order ${idN} ${k}`
            }));
            return await sendInteractive(conn, m.chat, "📦 PILIH LAYANAN", `Daftar aplikasi untuk ID Negara ${idN}`, "» ʟʏɴx sᴛᴏʀᴇ ᴍᴀɴᴀɢᴇᴍᴇɴᴛ «", "DAFTAR APLIKASI", [{ title: "📦 LAYANAN", rows }], m);
        } catch (e) { return m.reply("❌ Gagal ambil data.") }
    }

    if (action === 'order') {
        let idN = args[1], kode = args[2];
        try {
            let resL = await axios.get(`${baseUrl}/layanan.php?negara=${idN}`);
            let item = resL.data[idN]?.[kode];
            if (db[sender] < item.harga) return m.reply("❌ Saldo kurang cuy!");

            m.reply("⏳ _Memproses nomor..._");
            let resO = await axios.get(`${baseUrl}/order.php?api_key=${apikey}&negara=${idN}&layanan=${kode}&operator=any`);
            if (!resO.data.success) return m.reply(`❌ ${resO.data.message}`);

            let d = resO.data.data;
            activeOrders[d.order_id] = { sender, price: item.harga, baseUrl };
            
            let teks = `✅ *NOMOR BERHASIL DIPESAN*\n\n🆔 ID: ${d.order_id}\n📞 No: *${d.number}*\n💰 Harga: Rp ${toRupiah(item.harga)}`;
            return await sendQuickReply(conn, m.chat, teks, "» ʟʏɴx sᴛᴏʀᴇ ᴍᴀɴᴀɢᴇᴍᴇɴᴛ «", [
                { text: '📩 Cek OTP', id: `${prefix}nokos_check ${d.order_id}` },
                { text: '❌ Batal', id: `${prefix}nokos_cancel ${d.order_id} ${baseUrl}` }
            ], m);
        } catch (e) { return m.reply("❌ Order Gagal.") }
    }

    if (command === 'nokos_check') {
        let id = args[0];
        let info = activeOrders[id];
        if (!info || activeIntervals[id]) return m.reply("❌ Order tidak valid atau sedang dicek.");

        m.reply("🔄 *Auto-Check Aktif!* Sabar ya...");
        activeIntervals[id] = setInterval(async () => {
            try {
                let res = await axios.get(`${info.baseUrl}/sms.php?api_key=${apikey}&id=${id}`);
                if (res.data.success && /^\d{6}$/.test(res.data.data.otp)) {
                    clearInterval(activeIntervals[id]);
                    delete activeIntervals[id];
                    let dbNow = loadDB();
                    dbNow[sender] -= info.price;
                    saveDB(dbNow);
                    delete activeOrders[id];
                    conn.sendMessage(m.chat, { text: `🎉 *OTP MASUK:* ${res.data.data.otp}\nSaldo terpotong Rp ${toRupiah(info.price)}` });
                    conn.sendMessage(idSaluran, { text: `🔔 *TRX SUCCESS*\nID: ${id}\nUser: @${sender.split('@')[0]}\nOTP: ${res.data.data.otp.slice(0,3)}***`, mentions: [sender] });
                }
            } catch (e) {}
        }, 10000);
    }

    if (command === 'nokos_cancel') {
        let id = args[0], bUrl = args[1];
        try {
            await axios.get(`${bUrl}/cancel.php?api_key=${apikey}&id=${id}`);
            if (activeIntervals[id]) { clearInterval(activeIntervals[id]); delete activeIntervals[id]; }
            delete activeOrders[id];
            return m.reply("✅ Berhasil dicancel.");
        } catch (e) { return m.reply("❌ Gagal cancel.") }
    }
}

handler.before = async function (m, { conn }) {
    if (!m.message) return;
    let interactiveResponse = m.message.interactiveResponseMessage || m.message.viewOnceMessage?.message?.interactiveResponseMessage || m.message.viewOnceMessageV2?.message?.interactiveResponseMessage;
    if (interactiveResponse?.nativeFlowResponseMessage?.paramsJson) {
        let json = JSON.parse(interactiveResponse.nativeFlowResponseMessage.paramsJson);
        if (json.id && (json.id.includes('nokos') || json.id.includes('saldo'))) {
            let cmdText = json.id;
            let prefix = cmdText.match(/^[^\w\s]/)?.[0] || '.';
            let command = cmdText.split(' ')[0].replace(prefix, '');
            let args = cmdText.split(' ').slice(1);
            let isOwner = global.owner?.includes(m.sender.split('@')[0]);
            await handler(m, { conn: this, args, command, usedPrefix: prefix, isOwner });
            return true;
        }
    }
}

handler.help = ['nokosv1', 'nokosv2', 'saldo', 'addsaldo'];
handler.tags = ['store'];
handler.command = /^(nokosv1|nokosv2|nokos_check|nokos_cancel|saldo|addsaldo)$/i;

export default handler;
