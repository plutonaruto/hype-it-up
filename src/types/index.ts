// src/types.ts
export type VerificationTier = 'NGO-Verified' | 'Community-Verified' | 'Awareness';
export type HypeTier = 'bronze' | 'silver' | 'gold' | 'platinum';

export interface VideoData {
  id: string;
  creator: { username: string; avatar: string; verified: boolean; };
  content: { title: string; description: string; videoUrl: string; thumbnail: string; };
  fundraiser?: {
    goal: number;
    raised: number;
    cause: string;
    externalLink?: string;

    // Previously "verified" + "tier"
    verified: boolean;             // gate for showing Boost / ContextCard
    hypeTier: HypeTier;            // your gamified “bronze…platinum”
    verificationTier?: VerificationTier; // NGO-Verified | Community-Verified | Awareness

    aiSummary?: string;
    hashtags?: string[];
  };
  engagement: { likes: number; comments: number; shares: number; boosts: number; };
  impact?: { reachIncrease: number; donationsToday: number; totalReach: number; communityBoosts: number; };
}

export type VerificationSuccess = {
  approved: true;
  message: string;
  aiSummary: string;
  hashtags: string[];
  verificationTier: VerificationTier;
  scores: { consistency: number; reliability: number };
  reasons?: string[]; // optional notes/warnings even on success
};

export type VerificationFailure = {
  approved: false;
  message: string;
  reasons: string[];
  step: 'consistency' | 'reliability' | 'api';
  scores?: { consistency?: number; reliability?: number };
};

export type VerificationResult = VerificationSuccess | VerificationFailure;


export interface BoostOption {
  type: 'donate' | 'community';
  title: string; description: string; icon: string; action: string;
}
