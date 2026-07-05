import axios from 'axios';

class NPMSearch {
    constructor() {
        this.baseURL = 'https://registry.npmjs.org/-/v1/search';
    }

    async execute(query, size = 20) {
        try {
            const response = await axios.get(this.baseURL, {
                params: {
                    text: query,
                    size: size
                },
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36',
                    'Accept': 'application/json'
                }
            });

            const data = response.data;
            const result = data?.objects?.map((obj) => ({
                name: obj.package?.name,
                version: obj.package?.version,
                description: obj.package?.description,
                license: obj.package?.license,
                author: obj.package?.author?.name,
                date: obj.package?.date,
                links: obj.package?.links,
                keywords: obj.package?.keywords,
                searchScore: obj.score?.detail?.matchedFields?.length || obj.score?.final,
                maintainers: obj.package?.maintainers?.map((m) => m.username),
            })) || data;

            return {
                status: response.status === 200 ? "success" : "failed",
                code: response.status,
                input: query,
                total: data?.total,
                result: result,
            };
        } catch (error) {
            return {
                status: "failed",
                code: error.response?.status || 500,
                input: query,
                total: 0,
                result: error.message
            };
        }
    }
}

export default new NPMSearch();