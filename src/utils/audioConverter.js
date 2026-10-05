import { Mp3Encoder } from '@breezystack/lamejs';

/**
 * Extracts YouTube video ID from various URL formats
 * Supports: watch?v=, youtu.be/, shorts/, embed/
 * @param {string} url
 * @returns {string|null}
 */
export function extractYouTubeVideoId(url) {
  if (!url || typeof url !== 'string') return null;
  const cleaned = url.trim();
  const match = cleaned.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|shorts\/|watch\?v=|watch\?.+&v=))([\w-]{11})/i);
  return match ? match[1] : null;
}

/**
 * Validates whether a string is a valid YouTube URL
 * @param {string} url
 * @returns {{ valid: boolean, error?: string, videoId?: string }}
 */
export function validateYouTubeUrl(url) {
  if (!url || !url.trim()) {
    return { valid: false, error: 'Silakan masukkan URL YouTube terlebih dahulu.' };
  }
  const videoId = extractYouTubeVideoId(url);
  if (!videoId) {
    return {
      valid: false,
      error: 'Format URL YouTube tidak valid. Gunakan format seperti https://www.youtube.com/watch?v=... atau https://youtu.be/...'
    };
  }
  return { valid: true, videoId };
}

/**
 * Fetches public video metadata using YouTube's official oEmbed API
 * @param {string} videoId
 * @returns {Promise<{ videoId: string, title: string, author: string, authorUrl: string, thumbnailUrl: string }>}
 */
export async function fetchYouTubeMetadata(videoId) {
  const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;
  const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(watchUrl)}&format=json`;

  try {
    const response = await fetch(oembedUrl);
    if (!response.ok) {
      throw new Error(`HTTP Error ${response.status}`);
    }
    const data = await response.json();
    return {
      videoId,
      title: data.title || `YouTube Video (${videoId})`,
      author: data.author_name || 'YouTube Creator',
      authorUrl: data.author_url || `https://www.youtube.com/watch?v=${videoId}`,
      thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
      maxResThumbnailUrl: `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`
    };
  } catch (err) {
    // Graceful fallback with standard YouTube thumbnail
    return {
      videoId,
      title: `YouTube Video (${videoId})`,
      author: 'YouTube',
      authorUrl: `https://www.youtube.com/watch?v=${videoId}`,
      thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
      maxResThumbnailUrl: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
    };
  }
}

/**
 * Converts Float32Array PCM samples [-1.0, 1.0] to Int16Array [-32768, 32767]
 * @param {Float32Array} float32Array
 * @returns {Int16Array}
 */
export function floatToInt16(float32Array) {
  const len = float32Array.length;
  const int16 = new Int16Array(len);
  for (let i = 0; i < len; i++) {
    const s = Math.max(-1, Math.min(1, float32Array[i]));
    int16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
  }
  return int16;
}

/**
 * Encodes decoded AudioBuffer to MP3 Blob using LAME in non-blocking slices
 * @param {AudioBuffer} audioBuffer
 * @param {number} bitrateKbps - e.g. 96, 128, 192, 256, 320
 * @param {function} onProgress - ({ stage, percent, message }) => void
 * @returns {Promise<Blob>}
 */
export async function convertAudioBufferToMp3(audioBuffer, bitrateKbps = 192, onProgress = () => {}) {
  const channels = Math.min(audioBuffer.numberOfChannels, 2);
  const sampleRate = audioBuffer.sampleRate;
  const encoder = new Mp3Encoder(channels, sampleRate, bitrateKbps);

  const leftFloat = audioBuffer.getChannelData(0);
  const leftInt16 = floatToInt16(leftFloat);
  const rightInt16 = channels > 1 ? floatToInt16(audioBuffer.getChannelData(1)) : null;

  const totalSamples = leftInt16.length;
  const chunkSize = 11520; // 10 LAME MP3 frame blocks (1152 samples each)
  const mp3Data = [];

  let processed = 0;
  while (processed < totalSamples) {
    const end = Math.min(processed + chunkSize, totalSamples);
    const leftChunk = leftInt16.subarray(processed, end);
    const rightChunk = rightInt16 ? rightInt16.subarray(processed, end) : null;

    let mp3buf;
    if (channels === 1) {
      mp3buf = encoder.encodeBuffer(leftChunk);
    } else {
      mp3buf = encoder.encodeBuffer(leftChunk, rightChunk);
    }

    if (mp3buf && mp3buf.length > 0) {
      mp3Data.push(mp3buf);
    }

    processed = end;
    const progressPercent = Math.min(99, Math.round((processed / totalSamples) * 100));
    onProgress({
      stage: 'converting',
      percent: progressPercent,
      message: `Mengonversi ke MP3 (${progressPercent}%)...`
    });

    // Yield control to the browser event loop every 2 chunks so UI stays silky smooth
    if (processed % (chunkSize * 2) === 0) {
      await new Promise((resolve) => setTimeout(resolve, 0));
    }
  }

  const flushBuf = encoder.flush();
  if (flushBuf && flushBuf.length > 0) {
    mp3Data.push(flushBuf);
  }

  onProgress({
    stage: 'completed',
    percent: 100,
    message: 'Konversi Selesai!'
  });

  return new Blob(mp3Data, { type: 'audio/mp3' });
}

/**
 * Decodes local media file (video or audio) and converts to MP3 client-side
 * @param {File} file
 * @param {number} bitrateKbps
 * @param {function} onProgress
 * @returns {Promise<{ blob: Blob, duration: number, sampleRate: number, channels: number, bitrate: number }>}
 */
export async function convertMediaFileToMp3(file, bitrateKbps = 192, onProgress = () => {}) {
  onProgress({
    stage: 'preparing',
    percent: 5,
    message: 'Mempersiapkan dan membaca file media...'
  });

  const arrayBuffer = await file.arrayBuffer();

  onProgress({
    stage: 'processing',
    percent: 15,
    message: 'Mendekode trek audio dari container...'
  });

  const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtxClass) {
    throw new Error('Browser Anda tidak mendukung Web Audio API.');
  }

  const audioCtx = new AudioCtxClass();
  let audioBuffer;

  try {
    audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
  } catch (err) {
    audioCtx.close();
    throw new Error('Gagal mengekstrak audio dari file ini. Pastikan file memiliki trek audio yang valid (format: MP4, WebM, MOV, WAV, M4A, OGG, FLAC).');
  }

  try {
    const mp3Blob = await convertAudioBufferToMp3(audioBuffer, bitrateKbps, (prog) => {
      // Map 0-100% of converting step into 20% - 99% overall progress
      const mappedPercent = Math.min(99, Math.round(20 + (prog.percent * 0.79)));
      onProgress({
        ...prog,
        percent: mappedPercent,
        message: prog.stage === 'converting' ? `Mengonversi ke MP3 (${mappedPercent}%)...` : prog.message
      });
    });

    onProgress({
      stage: 'completed',
      percent: 100,
      message: 'Konversi Selesai!'
    });

    return {
      blob: mp3Blob,
      duration: audioBuffer.duration,
      sampleRate: audioBuffer.sampleRate,
      channels: audioBuffer.numberOfChannels,
      bitrate: bitrateKbps
    };
  } finally {
    audioCtx.close();
  }
}

/**
 * Formats duration in seconds to MM:SS or HH:MM:SS
 * @param {number} seconds
 * @returns {string}
 */
export function formatDuration(seconds) {
  if (!seconds || isNaN(seconds) || seconds < 0) return '00:00';
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const mStr = String(mins).padStart(2, '0');
  const sStr = String(secs).padStart(2, '0');

  if (hrs > 0) {
    return `${hrs}:${mStr}:${sStr}`;
  }
  return `${mStr}:${sStr}`;
}

/**
 * Formats bytes to readable size (KB, MB, GB)
 * @param {number} bytes
 * @returns {string}
 */
export function formatBytes(bytes) {
  if (!bytes || bytes <= 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
}
