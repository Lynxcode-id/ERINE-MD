import axios from "axios";
import { wrapper } from "axios-cookiejar-support";
import { CookieJar } from "tough-cookie";
import crypto from "crypto";

class QuillBotImage {
  constructor() {
    this.BASE = "https://quillbot.com";
    this.UA = "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36";
  }

  uuid() {
    return crypto.randomUUID();
  }

  hex(bytes) {
    return crypto.randomBytes(bytes).toString("hex");
  }

  sentryHeaders() {
    const traceId = this.hex(16);
    const spanId = this.hex(8);
    const sampleRand = Math.random();

    return {
      "baggage": `sentry-environment=prod,sentry-release=v42.51.6,sentry-public_key=5743ef12f4887fc460c7968ebb2de54d,sentry-trace_id=${traceId},sentry-sampled=false,sentry-sample_rand=${sampleRand},sentry-sample_rate=0.01`,
      "sentry-trace": `${traceId}-${spanId}-0`
    };
  }

  async generate(prompt, category = "Auto", aspectRatio = "1:1") {
    const jar = new CookieJar();
    const client = wrapper(axios.create({
      jar,
      withCredentials: true,
      decompress: true,
      validateStatus: () => true,
      timeout: 120000
    }));

    const setCookie = async (name, value) => {
      await jar.setCookie(`${name}=${value}; Path=/; Domain=quillbot.com; Secure; SameSite=None`, this.BASE);
    };

    await setCookie("qbDeviceId", this.uuid());
    await setCookie("ajs_anonymous_id", this.uuid());
    await setCookie("anonID", this.hex(8));
    await setCookie("authenticated", "false");
    await setCookie("premium", "false");
    await setCookie("acceptedPremiumModesTnc", "false");
    await setCookie("qdid", this.hex(16));

    await client.get(this.BASE, {
      headers: {
        "sec-ch-ua": `"Google Chrome";v="147", "Not.A/Brand";v="8", "Chromium";v="147"`,
        "sec-ch-ua-mobile": "?1",
        "sec-ch-ua-platform": `"Android"`,
        "upgrade-insecure-requests": "1",
        "user-agent": this.UA,
        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "sec-fetch-site": "none",
        "sec-fetch-mode": "navigate",
        "sec-fetch-user": "?1",
        "sec-fetch-dest": "document",
        "accept-language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7"
      }
    });

    const res = await client.post(`${this.BASE}/api/raven/generate/image`, {
      prompt: prompt,
      category: category,
      aspectRatio: aspectRatio,
      promptId: "image/generate-image"
    }, {
      headers: {
        "sec-ch-ua-platform": `"Android"`,
        "platform-type": "webapp",
        "qb-product": "IMAGE-GENERATOR",
        "sec-ch-ua": `"Google Chrome";v="147", "Not.A/Brand";v="8", "Chromium";v="147"`,
        "sec-ch-ua-mobile": "?1",
        "useridtoken": "empty-token",
        "user-agent": this.UA,
        "accept": "application/json, text/plain, */*",
        "webapp-version": "42.51.6",
        "content-type": "application/json",
        "origin": this.BASE,
        "sec-fetch-site": "same-origin",
        "sec-fetch-mode": "cors",
        "sec-fetch-dest": "empty",
        "referer": `${this.BASE}/ai-image-generator/i/${this.uuid()}`,
        "accept-language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
        ...this.sentryHeaders()
      }
    });

    const urls = (res.data?.data?.images || [])
      .map(v => v.downloadUrl)
      .filter(Boolean);

    if (res.status >= 200 && res.status < 300 && urls.length > 0) {
      return { success: true, urls };
    } else {
      throw new Error(res.data?.message || `API Error ${res.status}`);
    }
  }
}

export default new QuillBotImage();