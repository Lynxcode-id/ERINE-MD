/**
 * ───「 SCRAPER QUILLBOT AI 」───✧
 * 👤 Author  : Lynx Decode
 * 📝 Note    : Simpan di folder scrape dengan nama: quillbot.js
 * ────────────────────────✧
 */

import crypto from "crypto";
import fs from "fs/promises";
import { CookieJar } from "tough-cookie";
import { wrapper } from "axios-cookiejar-support";
import axios from "axios";

const BASE = "https://quillbot.com";
const SESSION_FILE = "./quillbot-sessions.json";
const MAX_MESSAGES_PER_SESSION = 5;
const USER_AGENT = "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36";

const jar = new CookieJar();

const client = wrapper(axios.create({
    jar,
    withCredentials: true,
    decompress: true,
    validateStatus: () => true,
    timeout: 120000
}));

function uuid() {
    return crypto.randomUUID();
}

function hex(bytes) {
    return crypto.randomBytes(bytes).toString("hex");
}

async function readJson(file, fallback) {
    try {
        return JSON.parse(await fs.readFile(file, "utf8"));
    } catch {
        return fallback;
    }
}

async function writeJson(file, data) {
    await fs.writeFile(file, JSON.stringify(data, null, 2));
}

async function setCookie(name, value) {
    await jar.setCookie(`${name}=${value}; Path=/; Domain=quillbot.com; Secure; SameSite=None`, BASE);
}

async function initCookies(deviceId) {
    await setCookie("qbDeviceId", deviceId);
    await setCookie("ajs_anonymous_id", uuid());
    await setCookie("anonID", hex(8));
    await setCookie("authenticated", "false");
    await setCookie("premium", "false");
    await setCookie("acceptedPremiumModesTnc", "false");
    await setCookie("qdid", hex(16));

    if (process.env.QB_COOKIE) {
        for (const part of process.env.QB_COOKIE.split(";")) {
            const clean = part.trim();
            if (clean) await jar.setCookie(`${clean}; Path=/; Domain=quillbot.com`, BASE);
        }
    }
}

function createSession() {
    return {
        conversation_id: uuid(),
        device_id: uuid(),
        message_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    };
}

async function getSession() {
    const data = await readJson(SESSION_FILE, {
        current: null,
        sessions: []
    });

    let current = data.current;

    if (!current || current.message_count >= MAX_MESSAGES_PER_SESSION) {
        current = createSession();
        data.current = current;
        data.sessions.push(current);
        await writeJson(SESSION_FILE, data);
        return {
            data,
            session: current,
            new_session: true
        };
    }

    return {
        data,
        session: current,
        new_session: false
    };
}

async function updateSession(data, conversationId) {
    const session = data.sessions.find(v => v.conversation_id === conversationId);

    if (session) {
        session.message_count += 1;
        session.updated_at = new Date().toISOString();
        data.current = session;
    }

    await writeJson(SESSION_FILE, data);
}

function parseNdjson(text) {
    const chunks = [];

    for (const line of text.split(/\r?\n/)) {
        const clean = line.trim();
        if (!clean || !clean.startsWith("{")) continue;

        try {
            const json = JSON.parse(clean);
            if (json.type === "content" && typeof json.content === "string") chunks.push(json.content);
        } catch {}
    }

    return chunks.join("").trim();
}

export const quillbotChat = async (prompt) => {
    try {
        const { data, session, new_session } = await getSession();

        await initCookies(session.device_id);

        await client.get(`${BASE}/`, {
            headers: {
                "sec-ch-ua": `"Google Chrome";v="147", "Not.A/Brand";v="8", "Chromium";v="147"`,
                "sec-ch-ua-mobile": "?1",
                "sec-ch-ua-platform": `"Android"`,
                "upgrade-insecure-requests": "1",
                "user-agent": USER_AGENT,
                "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                "sec-fetch-site": "none",
                "sec-fetch-mode": "navigate",
                "sec-fetch-user": "?1",
                "sec-fetch-dest": "document",
                "accept-language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7"
            }
        });

        const traceId = hex(16);
        const spanId = hex(8);
        const sampleRand = Math.random();

        const body = {
            message: {
                content: `${prompt}\n\n`
            },
            context: {
                editorContext: "",
                selectionContext: "",
                userDialect: "en-us",
                apiVersion: 2
            },
            origin: {
                name: "ai-chat.chat",
                url: BASE
            }
        };

        const res = await client.post(`${BASE}/api/ai-chat/chat/conversation/${session.conversation_id}`, body, {
            responseType: "text",
            headers: {
                "cache-control": "max-age=0",
                "sec-ch-ua-platform": `"Android"`,
                "platform-type": "webapp",
                "qb-product": "AI-CHAT",
                "sec-ch-ua": `"Google Chrome";v="147", "Not.A/Brand";v="8", "Chromium";v="147"`,
                "sec-ch-ua-mobile": "?1",
                "useridtoken": "empty-token",
                "baggage": `sentry-environment=prod,sentry-release=v42.51.6,sentry-public_key=5743ef12f4887fc460c7968ebb2de54d,sentry-trace_id=${traceId},sentry-sampled=false,sentry-sample_rand=${sampleRand},sentry-sample_rate=0.01`,
                "sentry-trace": `${traceId}-${spanId}-0`,
                "user-agent": USER_AGENT,
                "accept": "text/event-stream",
                "webapp-version": "42.51.6",
                "content-type": "application/json",
                "origin": BASE,
                "sec-fetch-site": "same-origin",
                "sec-fetch-mode": "cors",
                "sec-fetch-dest": "empty",
                "referer": `${BASE}/ai-chat/c/${session.conversation_id}`,
                "accept-language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7"
            }
        });

        const raw = typeof res.data === "string" ? res.data : JSON.stringify(res.data);
        const result = parseNdjson(raw);
        const success = res.status >= 200 && res.status < 300 && !!result;

        if (success) await updateSession(data, session.conversation_id);

        if (!success) {
            throw new Error(`Error ${res.status}: ${raw}`);
        }

        return { status: true, result };
    } catch (error) {
        return { status: false, message: error.message };
    }
};