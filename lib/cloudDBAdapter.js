import got from 'got';

const stringify = (obj) => JSON.stringify(obj, null, 2);

const parse = (str) => {
    try {
        return JSON.parse(str, (_, v) => {
            if (v !== null && typeof v === 'object' && 'type' in v && v.type === 'Buffer' && 'data' in v && Array.isArray(v.data)) {
                return Buffer.from(v.data);
            }
            return v;
        });
    } catch (e) {
        return str;
    }
};

class CloudDBAdapter {
    constructor(url, {
        serialize = stringify,
        deserialize = parse,
        fetchOptions = {},
    } = {}) {
        if (typeof url !== 'string' || !/^https?:\/\//.test(url)) {
            throw new Error('Invalid URL provided.');
        }

        this.url = url;
        this.serialize = serialize;
        this.deserialize = deserialize;
        this.fetchOptions = {
            timeout: { request: 10000 },
            ...fetchOptions
        };
    }

    async read() {
        try {
            const res = await got(this.url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json;q=0.9,text/plain',
                },
                ...this.fetchOptions,
                responseType: 'text' 
            });

            if (res.statusCode !== 200) throw new Error(res.statusMessage);
            return this.deserialize(res.body);
        } catch (e) {
            console.error('[CloudDB] Read Error:', e.message);
            return {}; 
        }
    }

    async write(obj) {
        try {
            const res = await got(this.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                ...this.fetchOptions,
                body: this.serialize(obj),
                responseType: 'text'
            });

            if (res.statusCode !== 200 && res.statusCode !== 201) throw new Error(res.statusMessage);
            return res.body;
        } catch (e) {
            console.error('[CloudDB] Write Error:', e.message);
            throw new Error(`Write error: ${e.message}`);
        }
    }
}

export default CloudDBAdapter;
