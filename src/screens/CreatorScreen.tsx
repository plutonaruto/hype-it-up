import React, { useState } from 'react';
import CreatorForm from '../components/CreatorForm';
import VerificationStatus from '../components/VerificationStatus';
import type { VerificationResult } from '../types';
import { verifyFundraiser } from '../services/verify';
import { extractTextFromVideo } from '../ai/ocr';

type Props = {
  onClose: () => void;
  onVerified?: (result: VerificationResult) => void;
};

const CreatorScreen: React.FC<Props> = ({ onClose, onVerified }) => {
  const [showStatus, setShowStatus] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [ocrProgress, setOcrProgress] = useState<number | null>(null);

  async function handleSubmit(formData: any) {
    // Show the spinner UI immediately
    setShowStatus(true);
    setResult(null);
    setOcrProgress(null);

    try {
      // Try to OCR the video if no transcriptText provided
      let transcriptText: string | undefined = formData.transcriptText || undefined;

      if (!transcriptText && formData.videoFile instanceof File) {
        try {
          // Grab a frame about 1.2s in; report progress to a local state
          setOcrProgress(0);
          transcriptText = await extractTextFromVideo(
            formData.videoFile,
            1200,
            (p) => setOcrProgress(Math.max(0, Math.min(1, p)))
          );
          // Optional: append OCR text to description context for better recall
          if (transcriptText) {
            console.log('[OCR] extracted text:', transcriptText.slice(0, 160));
          }
        } catch (e) {
          console.warn('[OCR] failed, continuing without OCR:', e);
        } finally {
          setOcrProgress(null);
        }
      }

      const out = await verifyFundraiser({
        title: formData.title,
        description: formData.description,
        goals: String(formData.goal || ''),
        category: formData.cause,
        fundraiserUrl: formData.externalLink || undefined,
        transcriptText, // <- OCR/captions used by the verifier
      });

      setResult(out);
      onVerified?.(out);
    } catch (err: any) {
      const fail: VerificationResult = {
        approved: false,
        message: 'Local AI error.',
        reasons: [err?.message || String(err)],
        step: 'api',
      } as VerificationResult;
      setResult(fail);
      onVerified?.(fail);
    }
  }

  function finishFlow() {
    setShowStatus(false);
    onClose();
  }

  return (
    <div className="relative h-full w-full bg-black">
      {/* Underlay: the form */}
      <CreatorForm onSubmit={handleSubmit} onBack={onClose} />

      {/* Overlay: verification spinner/result */}
      {showStatus && (
        <div className="absolute inset-0 z-50">
          {/* Optional tiny OCR hint (only visible while OCR runs) */}
          {ocrProgress !== null && (
            <div className="absolute top-24 left-0 right-0 flex justify-center">
              <div className="px-3 py-1 rounded bg-white/10 text-white text-xs">
                Extracting on-video text… {Math.round(ocrProgress * 100)}%
              </div>
            </div>
          )}
          <VerificationStatus result={result} onBack={finishFlow} />
        </div>
      )}
    </div>
  );
};

export default CreatorScreen;
