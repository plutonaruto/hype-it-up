import Tesseract from 'tesseract.js';

/**
 * Extracts text from a single frame of a video (client-side).
 * @param file      The uploaded video File.
 * @param atMs      Timestamp (ms) at which to capture a frame (default ~1.2s).
 * @param onProgress Optional callback for OCR progress (0..1).
 */
export async function extractTextFromVideo(
  file: File,
  atMs = 1200,
  onProgress?: (p: number) => void
): Promise<string> {
  const video = document.createElement('video');
  const url = URL.createObjectURL(file);
  try {
    video.src = url;
    video.muted = true;
    video.crossOrigin = 'anonymous';
    video.playsInline = true;

    // Wait for metadata to know duration & dimensions
    await new Promise<void>((resolve, reject) => {
      const onError = () => reject(new Error('Failed to load video metadata'));
      video.addEventListener('loadedmetadata', () => resolve(), { once: true });
      video.addEventListener('error', onError, { once: true });
      // Safari needs a poke sometimes
      video.load();
    });

    // Seek to target time
    const targetSec = Math.min((atMs / 1000), (isFinite(video.duration) ? video.duration : 3));
    video.currentTime = Math.max(0, targetSec);

    await new Promise<void>((resolve, reject) => {
      const onSeeked = () => resolve();
      const onError = () => reject(new Error('Failed to seek video'));
      video.addEventListener('seeked', onSeeked, { once: true });
      video.addEventListener('error', onError, { once: true });
    });

    // Draw frame to canvas
    const w = video.videoWidth || 720;
    const h = video.videoHeight || 1280;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D not supported');
    ctx.drawImage(video, 0, 0, w, h);

    // Run OCR
    const { data: { text } } = await Tesseract.recognize(canvas, 'eng', {
      logger: (m) => {
        if (m.status === 'recognizing text' && typeof m.progress === 'number') {
          onProgress?.(m.progress);
        }
      },
    });

    return (text || '').replace(/\s+/g, ' ').trim();
  } finally {
    URL.revokeObjectURL(url);
  }
}
