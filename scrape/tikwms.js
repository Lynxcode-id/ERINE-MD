import fetch from 'node-fetch';

const BASE_URL = "https://www.tikwm.com";
const API_URL = `${BASE_URL}/api/feed/search`;

function fullUrl(url) {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;
  return BASE_URL + url;
}

const tikwmSearch = async ({ keywords, count = 12, cursor = 0, hd = 1 }) => {
  if (!keywords) {
    throw new Error("Keywords kosong");
  }

  const started = Date.now();

  const body = new URLSearchParams({
    keywords,
    count: String(count),
    cursor: String(cursor),
    web: "1",
    hd: String(hd)
  });

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      Accept: "application/json, text/javascript, */*; q=0.01",
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:152.0) Gecko/20100101 Firefox/152.0",
      "X-Requested-With": "XMLHttpRequest",
      Origin: BASE_URL,
      Referer: `${BASE_URL}/`
    },
    body
  });

  const text = await response.text();

  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = null;
  }

  if (!json) {
    return {
      Status: false,
      Code: response.status,
      Input: keywords,
      Result: [],
      Error: "Response bukan JSON",
      Preview: text.slice(0, 500),
      Time_ms: Date.now() - started
    };
  }

  const videos = Array.isArray(json?.data?.videos) ? json.data.videos : [];

  return {
    Status: response.ok && json.code === 0,
    Code: response.ok && json.code === 0 ? 200 : (json.code || response.status),
    Input: keywords,
    Total: videos.length,
    Cursor: json?.data?.cursor ?? null,
    Has_more: json?.data?.hasMore ?? false,
    Result: videos.map((item) => ({
      Id: item.video_id || item.id || null,
      Title: item.title || null,
      Author: item.author?.nickname || item.author?.unique_id || null,
      Duration: item.duration || 0,
      Play: fullUrl(item.play),
      Wmplay: fullUrl(item.wmplay),
      Music: fullUrl(item.music),
      Cover: fullUrl(item.cover),
      Stats: {
        Play: item.play_count || 0,
        Like: item.digg_count || 0,
        Comment: item.comment_count || 0,
        Share: item.share_count || 0,
        Download: item.download_count || 0
      }
    })),
    Time_ms: Date.now() - started
  };
};

export default tikwmSearch;