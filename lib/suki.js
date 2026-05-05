import fetch from 'node-fetch';
import FormData from 'form-data';
import { fileTypeFromBuffer } from 'file-type';

/**
 * Upload file ke RyzenCDN
 * @param {Buffer|Buffer[]} inp 
 * @returns {Promise<Object|String[]>}
 */
const ryzenCDN = async (inp) => {
  try {
    const form = new FormData();
    const files = Array.isArray(inp) ? inp : [inp];

    for (const file of files) {
      const buffer = Buffer.isBuffer(file) ? file : (file.buffer || file);
      if (!Buffer.isBuffer(buffer)) throw new Error('Format buffer gak valid cuy!');

      const type = await fileTypeFromBuffer(buffer);
      if (!type) throw new Error('Tipe file gak didukung atau gak kebaca!');

      const originalName = (file.originalname || `erine-${Date.now()}`).split('.').shift();
      
      form.append('file', buffer, {
        filename: `${originalName}.${type.ext}`,
        contentType: type.mime
      });
    }

    const res = await fetch('https://api.ryzendesu.vip/api/uploader/ryzencdn', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        ...form.getHeaders(),
      },
      body: form,
    });

    if (!res.ok) throw new Error(`Server nolak! Status: ${res.status}`);

    const json = await res.json();
    if (Array.isArray(inp)) {
        if (!Array.isArray(json)) return [json.url || json.result?.url];
        return json.map(f => f.url || f.result?.url);
    }

    return json;
    
  } catch (error) {
    console.error('[RyzenCDN Error]:', error.message);
    throw new Error(`RyzenCDN Error: ${error.message}`);
  }
};

export { ryzenCDN };
