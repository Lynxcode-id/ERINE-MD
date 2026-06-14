import axios from "axios";
import fs from "fs";
import { GROUP_IDS, CHANNEL_IDS } from "../config.js";

const dbPath = './live_jkt48.json';

const getSentEvents = () => {
    if (!fs.existsSync(dbPath)) return [];
    try {
        const data = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
        return Array.isArray(data) ? data : [];
    } catch {
        return [];
    }
};

const saveSentEvents = (data) => {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

const debugLog = (message, data = null, isError = false) => {
    if (isError || message.includes('activated') || message.includes('deactivated') || message.includes('Watchdog')) {
        console.log(`[${isError ? 'ERROR' : 'INFO'}] ${message}`);
        if (data && isError) console.error(data);
    }
};

let isCheckingLive = true; 
let checkInterval;
let isProcessing = false;
let lastErrorTime = 0;
const ERROR_COOLDOWN = 60000;

const CHAT_IDS = [...GROUP_IDS, ...CHANNEL_IDS];

const getStreamingUrl = (live) => {
    try {
        const { type, streaming_url_list } = live;
        if (!streaming_url_list?.length) return null;
        if (type === 'showroom') {
            return streaming_url_list.sort((a, b) => (b.quality || 0) - (a.quality || 0))[0].url;
        }
        return streaming_url_list[0].url;
    } catch (error) {
        const now = Date.now();
        if (now - lastErrorTime > ERROR_COOLDOWN) {
            debugLog('Error getStreamingUrl:', error.message, true);
            lastErrorTime = now;
        }
        return null;
    }
};

const getFormattedDateTimeWIB = (dateString) => {
    const date = new Date(dateString);
    const wib = new Date(date.getTime() + (7 * 3600000));
    return {
        date: wib.toISOString().split('T')[0],
        time: wib.toISOString().split('T')[1].substring(0, 8) + " WIB"
    };
};

const formatMessage = (live, time, url) => {
    const isShowroom = live.type === "showroom";
    const platform = isShowroom ? "🟣 S H O W R O O M" : "🔴 I D N  L I V E";
    const platformIcon = isShowroom ? "🎙️" : "📱";

    return `╭─⟡ *J K T 4 8 - I N F O* ⟡─╮
│ 👤 *Member* : ${live.name}
│ ${platformIcon} *Platform* : ${platform}
│ 🗓️ *Tanggal* : ${time.date}
│ 🕒 *Waktu* : ${time.time}
╰────────────────────⟡

> Gas ramaikan livenya sekarang cuy, jangan sampai ketinggalan momen! 👊😎

🔗 *Link Streaming:*
${url}

_ɪɴғᴏʀᴍᴀᴛɪᴏɴ ʙʏ ᴇʀɪɴᴇ-ᴍᴅ_
_ᴅᴏɴᴛ ғᴏʀɢᴇᴛ ғᴏʟʟᴏᴡ ᴍʏ ᴄʜ ғᴏʀ ɴᴇᴡ ɪɴғᴏʀᴍᴀᴛɪᴏɴ_
> https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i`;
};

const checkAndSendMessage = async (conn) => {
    if (!isCheckingLive || isProcessing) return;
    
    isProcessing = true; 

    try {
        const { data } = await axios.get("https://api.crstlnz.my.id/api/now_live?group=jkt48", {
            timeout: 10000 
        });

        let sentEvents = getSentEvents(); 
        const currentLive = new Set();
        let dbChanged = false;

        for (const live of data || []) {
            if (!live.name || !live.started_at) continue;

            currentLive.add(live.name);
            
            if (sentEvents.includes(live.name)) continue;

            const url = getStreamingUrl(live);
            if (!url) continue;

            const time = getFormattedDateTimeWIB(live.started_at);
            const text = formatMessage(live, time, url);
            const message = {
                image: { url: live.img },
                caption: text,
                contextInfo: {
                    isForwarded: true, 
                    forwardingScore: 999,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363400612665352@newsletter', 
                        newsletterName: `🔴 ON AIR: ${live.name}`,
                        serverMessageId: -1
                    }
                }
            };

            for (const id of CHAT_IDS) {
                await conn.sendMessage(id, message).catch((e) => {
                    debugLog(`Gagal mengirim ke ${id}:`, e.message, true);
                });
            }

            sentEvents.push(live.name);
            dbChanged = true;
            debugLog(`Notifikasi Live terkirim: ${live.name}`);
        }

        const updatedEvents = sentEvents.filter(name => currentLive.has(name));
        if (updatedEvents.length !== sentEvents.length) {
            sentEvents = updatedEvents;
            dbChanged = true;
        }

        if (dbChanged) saveSentEvents(sentEvents);

    } catch (err) {
        debugLog("API JKT48 error:", err.message, true);
    } finally {
        isProcessing = false;
    }
};

const handler = async (m, { conn, command, isOwner }) => {
    if (!isOwner) return m.reply("Khusus owner.");

    if (command === "startlive") {
        if (global.jkt48LiveCheckerActive) return m.reply("Fitur JKT48 Live Checker sudah aktif.");

        isCheckingLive = true;
        global.jkt48LiveCheckerActive = true;
        checkInterval = setInterval(() => checkAndSendMessage(conn), 30000);

        debugLog("JKT48 Live check activated via command");
        return m.reply("Live checker aktif ✅ Notifikasi JKT48 siap mengudara.");
    }

    if (command === "stoplive") {
        if (!global.jkt48LiveCheckerActive) return m.reply("Fitur JKT48 Live Checker memang belum aktif.");

        isCheckingLive = false;
        global.jkt48LiveCheckerActive = false;
        clearInterval(checkInterval);

        debugLog("JKT48 Live check deactivated via command");
        return m.reply("Live checker dimatikan ❌");
    }
};

handler.before = async (m, { conn }) => {
    if (!global.jkt48LiveCheckerActive) {
        global.jkt48LiveCheckerActive = true;
        isCheckingLive = true;
        
        debugLog("Auto-start JKT48 Live check activated");
        checkAndSendMessage(conn);
        checkInterval = setInterval(() => checkAndSendMessage(conn), 30000);
    }

    if (!global.watchdogJkt48) {
        global.watchdogJkt48 = true;
        
        setInterval(() => {
            if (isCheckingLive) {
                clearInterval(checkInterval);
                checkInterval = setInterval(() => checkAndSendMessage(conn), 30000);
                
                debugLog("Watchdog: Live checker di-restart (Siklus 15 Menit)");
            }
        }, 900000);
    }
    
    return
};

handler.command = /^(startlive|stoplive)$/i;
handler.help = ["startlive", "stoplive"];
handler.tags = ["jkt48"];
handler.owner = true;

export default handler;
