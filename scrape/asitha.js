/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Scraper Original : Daffa
 * 👤 Adapted for ESM  : Lynx Decode
 * ─────────────────────────
 * 📝 Scraper : Asitha Channel Manager
 */

import fetch from 'node-fetch';

const API_KEY = "-"; // set apikey lu
const ENDPOINT = "https://back.asitha.top/api/channel/list";

function formatExpiry(iso) {
    if (!iso) return null;
    const d = new Date(iso);
    const now = Date.now();
    const diffMs = d.getTime() - now;
    
    if (diffMs < 0) return "EXPIRED";
    
    const diffH = Math.floor(diffMs / 3600000);
    const diffM = Math.floor((diffMs % 3600000) / 60000);
    return `${d.toLocaleString('id-ID')} (in ${diffH}h ${diffM}m)`;
}

export async function listChannels() {
    if (!API_KEY || API_KEY.includes("Your API Key")) {
        throw new Error("API_KEY belum diisi atau tidak valid.");
    }

    const res = await fetch(ENDPOINT, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${API_KEY}`,
            Accept: "application/json",
        },
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`HTTP ${res.status}: ${text.slice(0, 200)}`);
    }

    const data = await res.json();
    const channels = Array.isArray(data.channels) ? data.channels : [];
    
    return channels.map(c => ({
        link: c.channelLink ?? "(no link)",
        reactions: c.reactions || null,
        expires: formatExpiry(c.expiresAt)
    }));
}