/**
 * ───「 SCRAPER AUTHOR 」───
 * 👤 Original : nath
 * 📝 Adapted  : Lynx Decode
 * ─────────────────────────
 */

import axios from "axios"
import * as cheerio from "cheerio"

const base_url = "https://48live.my.id"
const headers = {
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "accept": "text/html,application/xhtml+xml",
    "accept-language": "id-ID,id;q=0.9,en;q=0.8",
}

function resolveNuxt(arr, idx, depth = 0) {
    if (depth > 20) return idx
    if (typeof idx !== "number" || idx >= arr.length) return idx

    const val = arr[idx]

    if (Array.isArray(val)) {
        if (val[0] === "ShallowReactive" || val[0] === "Reactive") {
            return resolveNuxt(arr, val[1], depth + 1)
        }
        return val.map((x) => resolveNuxt(arr, x, depth + 1))
    }

    if (val && typeof val === "object") {
        const out = {}
        for (const k in val) {
            out[k] = resolveNuxt(arr, val[k], depth + 1)
        }
        return out
    }

    return val
}

function findMembers(arr) {
    const results = []
    const seen = new Set()

    for (let i = 0; i < arr.length; i++) {
        const val = arr[i]
        if (
            val &&
            typeof val === "object" &&
            !Array.isArray(val) &&
            "name" in val &&
            "url" in val &&
            ("img" in val || "img_alt" in val || "showroom_id" in val)
        ) {
            if (!seen.has(i)) {
                seen.add(i)
                results.push({
                    _idx: i,
                    ...resolveNuxt(arr, i)
                })
            }
        }
    }

    return results
}

function parseNuxtData(html) {
    const $ = cheerio.load(html)
    const script = $("#__NUXT_DATA__").html()
    if (!script) return null
    return JSON.parse(script)
}

async function memberDetail(slug) {
    try {
        const { data: html } = await axios.get(`${base_url}/member/${slug.toLowerCase()}`, { headers })
        const arr = parseNuxtData(html)

        if (!arr) throw new Error("__NUXT_DATA__ tidak ditemukan di web.")

        const members = findMembers(arr)
        const member = members.find((m) => m.url === slug.toLowerCase()) ?? members[0]

        if (!member) throw new Error("Data member tidak ditemukan.")

        return { status: true, result: member }
    } catch (e) {
        return { status: false, error: e.message }
    }
}

export default memberDetail