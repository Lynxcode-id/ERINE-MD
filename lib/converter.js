import { promises } from 'fs';
import { join } from 'path';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const tmpDir = join(__dirname, '../tmp');
if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

function ffmpeg(buffer, args = [], ext = '', ext2 = '') {
  return new Promise(async (resolve, reject) => {
    let tmp = join(tmpDir, Date.now() + '.' + ext);
    let out = tmp + '.' + ext2;
    
    try {
      await promises.writeFile(tmp, buffer);
      const ffmpegProcess = spawn('ffmpeg', [
        '-y',
        '-i', tmp,
        ...args,
        out
      ]);

      ffmpegProcess.on('error', async (err) => {
        if (fs.existsSync(tmp)) await promises.unlink(tmp).catch(() => {});
        reject(err);
      });

      ffmpegProcess.on('close', async (code) => {
        try {
          if (fs.existsSync(tmp)) await promises.unlink(tmp).catch(() => {});
          
          if (code !== 0) return reject(new Error(`FFmpeg exit with code ${code}`));

          if (!fs.existsSync(out)) return reject(new Error('Output file not found'));

          const data = await promises.readFile(out);
          
          resolve({
            data,
            filename: out,
            delete() {
              return promises.unlink(out).catch(() => {});
            }
          });
        } catch (e) {
          reject(e);
        }
      });
    } catch (e) {
      if (fs.existsSync(tmp)) await promises.unlink(tmp).catch(() => {});
      reject(e);
    }
  });
}

/**
 * Convert Audio to Playable WhatsApp Audio (PTT/VN)
 */
function toPTT(buffer, ext) {
  return ffmpeg(buffer, [
    '-vn',
    '-c:a', 'libopus',
    '-b:a', '128k',
    '-vbr', 'on',
  ], ext, 'ogg');
}

/**
 * Convert Audio to Playable WhatsApp Audio
 */
function toAudio(buffer, ext) {
  return ffmpeg(buffer, [
    '-vn',
    '-c:a', 'libopus',
    '-b:a', '128k',
    '-vbr', 'on',
    '-compression_level', '10'
  ], ext, 'opus');
}

/**
 * Convert Video to Playable WhatsApp Video
 */
function toVideo(buffer, ext) {
  return ffmpeg(buffer, [
    '-c:v', 'libx264',
    '-c:a', 'aac',
    '-ab', '128k',
    '-ar', '44100',
    '-crf', '32',
    '-preset', 'slow'
  ], ext, 'mp4');
}

export {
  toAudio,
  toPTT,
  toVideo,
  ffmpeg
};
