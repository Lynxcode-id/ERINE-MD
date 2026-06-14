// File: scrape/twitter.js

import axios from "axios";
import * as cheerio from "cheerio";
import qs from "qs";

async function xdl(url) {
    try {
        const verifyRes = await axios.post("https://x2twitter.com/api/userverify",
            qs.stringify({ url: url }),
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                    Accept: "*/*",
                    "X-Requested-With": "XMLHttpRequest",
                },
            }
        );

        if (!verifyRes.data?.token) {
            throw new Error("Token tidak ditemukan");
        }

        const token = verifyRes.data.token;

        const searchRes = await axios.post("https://x2twitter.com/api/ajaxSearch",
            qs.stringify({
                q: url,
                lang: "id",
                cftoken: token,
            }),
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                    Accept: "*/*",
                    "X-Requested-With": "XMLHttpRequest",
                },
            }
        );

        const html = searchRes.data.data;
        const $ = cheerio.load(html);

        const title = $(".tw-middle .content h3").text().trim();
        const duration = $(".tw-middle .content p").first().text().trim();
        const thumbnail = $(".thumbnail img").attr("src");

        const links = {
            "720p": null,
            "360p": null,
            "270p": null,
            "mp3": null,
            image: null,
        };

        $("a.tw-button-dl").each((i, el) => {
            const text = $(el).text();
            const href = $(el).attr("href");

            if (text.includes("720p")) links["720p"] = href;
            else if (text.includes("360p")) links["360p"] = href;
            else if (text.includes("270p")) links["270p"] = href;
            else if (text.includes("MP3")) links["mp3"] = href;
            else if (text.includes("Gambar")) links["image"] = href;
        });

        return {
            success: true,
            title,
            duration,
            thumbnail,
            downloads: links,
        };
    } catch (err) {
        return {
            success: false,
            message: err.message,
        };
    }
}

export default xdl;