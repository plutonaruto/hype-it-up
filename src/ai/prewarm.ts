// src/ai/prewarm.ts
import { pipeline, env } from '@xenova/transformers';
env.cacheDir = 'indexeddb://transformers';

let _ready: Promise<void> | null = null;
export function prewarmModels() {
  if (_ready) return _ready;
  _ready = (async () => {
    await Promise.all([
      pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2'),
      pipeline('summarization', 'Xenova/t5-small'),
    ]);
  })();
  return _ready;
}
