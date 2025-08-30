// src/services/verify.ts
import type { VerificationResult } from '../types';
import { verifyClientSide } from '../ai/localVerifier';

// NOTE: This file MUST NOT import or call fetch().
// It simply adapts localVerifier's output to your app's VerificationResult type.

type Payload = {
  title: string;
  description: string;
  goals?: string;
  category: string;
  fundraiserUrl?: string;
  transcriptText?: string;
};

export async function verifyFundraiser(payload: Payload): Promise<VerificationResult> {
  console.log('[verify] Using LOCAL Xenova verifier'); // sanity log

  const local = await verifyClientSide({
    title: payload.title,
    description: payload.description,
    goals: payload.goals,
    category: payload.category,
    fundraiserUrl: payload.fundraiserUrl,
    transcriptText: payload.transcriptText,
  });

  if (local.approved) {
    return {
      approved: true,
      message: local.message,
      aiSummary: local.aiSummary,
      hashtags: local.hashtags,
      verificationTier: local.verificationTier,
      scores: local.scores,
      reasons: local.scores.reliability < 0.9
        ? ['Heads-up: reliability is good but not perfect.']
        : [],
    };
  }

  return {
    approved: false,
    message: local.message,
    reasons: local.reasons,
    step: local.step,
    scores: local.scores,
  };
}
