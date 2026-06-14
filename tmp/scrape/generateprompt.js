import https from 'https';

const baseURL = 'generatepromptai.com';
const endpoint = '/api/ai/generate-prompt';
const translateURL = 'api.nexray.eu.cc';
const translatePath = '/tools/translate';

async function translateWithNexray(text, targetLang = 'in') {
    return new Promise((resolve) => {
        const encodedText = encodeURIComponent(text);
        const path = `${translatePath}?text=${encodedText}&lang=${targetLang}`;
        
        const options = {
            hostname: translateURL,
            port: 443,
            path: path,
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36'
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    if (parsed.status && parsed.result && parsed.result.translated_text) {
                        let translated = parsed.result.translated_text.replace(/^"|"$/g, '');
                        resolve(translated);
                    } else {
                        resolve(text);
                    }
                } catch(e) {
                    resolve(text);
                }
            });
        });
        
        req.on('error', () => resolve(text));
        req.end();
    });
}

export const generatePrompt = async (prompt) => {
    const payload = JSON.stringify({
        prompt: prompt,
        feature: 'text-generate',
        language: 'en'
    });

    const requestOptions = {
        hostname: baseURL,
        port: 443,
        path: endpoint,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'text/event-stream',
            'Content-Length': Buffer.byteLength(payload)
        }
    };

    return new Promise((resolve, reject) => {
        let fullResponse = '';
        
        const req = https.request(requestOptions, (res) => {
            let buffer = '';
            
            res.on('data', (chunk) => {
                buffer += chunk.toString();
                const lines = buffer.split('\n');
                buffer = lines.pop();
                
                for (const line of lines) {
                    if (line.startsWith('data: ') && line.slice(6) !== '[DONE]') {
                        try {
                            const data = JSON.parse(line.slice(6));
                            if (data.content) fullResponse += data.content;
                        } catch(e) {}
                    }
                }
            });
            
            res.on('end', async () => {
                const englishAnswer = fullResponse.trim();
                if (!englishAnswer) return reject(new Error('Gagal mendapatkan respons dari AI.'));
                
                const indonesianAnswer = await translateWithNexray(englishAnswer, 'in');
                
                resolve({
                    english: englishAnswer,
                    indonesian: indonesianAnswer
                });
            });
        });
        
        req.on('error', (error) => reject(error));
        req.write(payload);
        req.end();
    });
};