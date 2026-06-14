/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx Decode
 * 📞 WhatsApp  : +62 882-5804-1396
 * 📢 Channel   : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * ⚠️ Note      : Keep credit to respect the creator!
 * ─────────────────────────
 * * ═══════════════════════════════════════════════════════════
 * PINTEREST SEARCH SCRAPER
 * ═══════════════════════════════════════════════════════════
 * Author    : DEFAN
 * Website   : dipastebin.web.id
 * Channel   : whatsapp.com/channel/0029Vb89qIx1XquQoXgzdd2m
 * Base     : pinterest.com
 * ═══════════════════════════════════════════════════════════
 */

import https from 'https';
import crypto from 'crypto';

function traceId() { return crypto.randomBytes(8).toString("hex"); }
function spanId()  { return crypto.randomBytes(8).toString("hex"); }
function appVer()  { return crypto.randomBytes(4).toString("hex").slice(0,7); }
function ts()      { return Date.now(); }

function get(url, headers = {}) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const req = https.get({
      hostname: u.hostname,
      path    : u.pathname + u.search,
      headers : {
        "User-Agent"              : "Mozilla/5.0 (Android 15; Mobile; rv:150.0) Gecko/150.0 Firefox/150.0",
        "Accept"                  : "application/json, text/javascript, */*; q=0.01",
        "Accept-Language"         : "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
        "Accept-Encoding"         : "identity",
        "X-Requested-With"        : "XMLHttpRequest",
        "X-Pinterest-AppState"    : "active",
        "X-Pinterest-Source-Url"  : url,
        "X-Pinterest-PWS-Handler" : "www/search/[scope].js",
        "screen-dpr"              : "2.857142857142857",
        "Referer"                 : url,
        ...headers,
      },
    }, res => {
      let body = "";
      res.on("data", c => body += c);
      res.on("end",  () => resolve({ status: res.statusCode, body, headers: res.headers }));
    });
    req.on("error", reject);
    req.setTimeout(15000, () => { req.destroy(); reject(new Error("Timeout")); });
  });
}

const searchPinterest = async (q, n = 5) => {
  const trace = traceId();
  const span  = spanId();
  const data  = encodeURIComponent(JSON.stringify({
    options: {
      query                   : q,
      scope                   : "pins",
      appliedProductFilters   : "---",
      domains                 : null,
      user                    : null,
      seoDrawerEnabled        : false,
      applied_unified_filters : null,
      auto_correction_disabled: false,
      journey_depth           : null,
      source_id               : null,
      source_module_id        : null,
      source_url              : `/search/pins/?q=${encodeURIComponent(q)}&rs=typed`,
      static_feed             : false,
      selected_one_bar_modules: null,
      query_pin_sigs          : null,
      page_size               : n,
      price_max               : null,
      price_min               : null,
      query_image_pins        : null,
      request_params          : null,
      top_pin_ids             : null,
      article                 : null,
      corpus                  : null,
      customized_rerank_type  : null,
      filters                 : null,
      rs                      : "typed",
      redux_normalize_feed    : true,
    },
    context: {},
  }));
  const url = `https://id.pinterest.com/resource/BaseSearchResource/get/?source_url=${encodeURIComponent(`/search/pins/?q=${encodeURIComponent(q)}&rs=typed`)}&data=${data}&_=${ts()}`;

  const { status, body } = await get(url, {
    "X-APP-VERSION"    : appVer(),
    "X-B3-TraceId"     : trace,
    "X-B3-SpanId"      : span,
    "X-B3-ParentSpanId": trace,
    "X-B3-Flags"       : "0",
  });

  if (status !== 200) throw new Error(`HTTP ${status}`);

  const json = JSON.parse(body);
  const pins = json?.resource_response?.data?.results || [];
  if (pins.length === 0) throw new Error("Tidak ada pin yang ditemukan");

  return pins.slice(0, n).map((p, i) => ({
    n    : i + 1,
    id   : p.id,
    title: p.title || p.grid_title || p.description?.slice(0, 80) || "(no title)",
    desc : p.description?.slice(0, 150) || "",
    url  : `https://www.pinterest.com/pin/${p.id}/`,
    image: p.images?.["736x"]?.url || p.images?.orig?.url || null,
    saves: p.save_count || p.repin_count || 0,
    board: p.board?.name || null,
    link : p.link || null,
  }));
};

export default searchPinterest;