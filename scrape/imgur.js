/**
 * ───「 FEATURE AUTHOR 」───
 * 👤 Developer : Lynx Decode
 * 📞 WhatsApp  : +62 882-5804-1396
 * 📢 Channel   : https://whatsapp.com/channel/0029VbAnuii6GcGCu73oep1i
 * ⚠️ Note      : Keep credit to respect the creator!
 * ─────────────────────────
 */

import fetch from 'node-fetch';
import FormData from 'form-data';
import { extname } from 'path';

const CLIENT_ID = 'd70305e7c3ac5c6';

const MIME_MAP = {
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.png': 'image/png', '.gif': 'image/gif',
  '.webp': 'image/webp', '.bmp': 'image/bmp',
  '.tiff': 'image/tiff', '.mp4': 'video/mp4',
};

function getMime(filename) {
  return MIME_MAP[extname(filename).toLowerCase()] || 'application/octet-stream';
}

const imgurUpload = async (buffer, filename = 'image.jpg') => {
  try {
    const form = new FormData();
    form.append('image', buffer, filename);
    form.append('type', 'file');
    form.append('name', filename);

    const res = await fetch(`https://api.imgur.com/3/upload?client_id=${CLIENT_ID}`, {
      method: 'POST',
      body: form,
    });
    
    const data = await res.json();
    if (!data.success) throw new Error(data.data?.error || 'Upload gagal');

    return {
      success: true,
      id: data.data.id,
      link: data.data.link,
      deletehash: data.data.deletehash,
      filename
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

export default imgurUpload;